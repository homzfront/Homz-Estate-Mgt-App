import axios from "axios";
import { getToken, deleteToken, storeToken, getRefreshToken } from "./cookies";

// Create an instance of Axios with custom configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: false,
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

// Add request interceptor for JWT token
api.interceptors.request.use(
    async (config) => {
        const jwtToken = await getToken();
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for token expiration errors
        if (
            (error.response?.data?.message === "jwt expired" ||
                error.response?.status === 401) &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                // If token is being refreshed, add request to queue
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call your refresh token endpoint
                const refreshToken = await getRefreshToken(); // or wherever you store it

                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh-token`,
                    {
                        token: refreshToken, // ✅ send as body
                    }
                );

                const { message, success, data } = refreshResponse.data;

                // Store the new tokens
                await storeToken({
                    token: data?.accessToken,
                    refresh_token: data?.refreshToken,
                });

                // Update Authorization header
                api.defaults.headers.common.Authorization = `Bearer ${data?.accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;

                // Process queued requests
                failedRequestsQueue.forEach((prom) => prom.resolve(data?.accessToken));
                failedRequestsQueue = [];

                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                await deleteToken();
                failedRequestsQueue.forEach((prom) => prom.reject(refreshError));
                failedRequestsQueue = [];

                displayTokenExpiredModal();
                if (typeof window !== "undefined") {
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 3000);
                }

                return Promise.reject(new Error("Session expired. Please login again."));
            } finally {
                isRefreshing = false;
            }
        }

        // For other errors, just reject as usual
        return Promise.reject(error);
    }
);

function displayTokenExpiredModal() {
    // Create a modal dynamically or integrate with a modal component
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';

    // Add content to the modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    modalContent.style.textAlign = 'center';
    modalContent.style.maxWidth = '400px';
    modalContent.style.width = '90%';

    const message = document.createElement('p');
    message.textContent = 'Your session has expired. You will be redirected to login...';
    message.style.fontSize = '16px';
    message.style.margin = '0 0 20px 0';
    message.style.color = '#333';

    modalContent.appendChild(message);
    modal.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Remove modal after redirect
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 3000);
}

export default api;