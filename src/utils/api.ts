/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getToken, deleteToken, storeToken, getRefreshToken } from "./cookies";

const getLoginPath = () => {
    if (typeof window === 'undefined') return '/admin/login';
    return window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: false,
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];
let sessionExpiredShown = false;

const redirectToLogin = async (message = 'Your session has expired. Please log in again.') => {
    if (typeof window === 'undefined') return;
    const loginPath = getLoginPath();
    if (window.location.pathname === loginPath) return;
    if (sessionExpiredShown) return;
    sessionExpiredShown = true;

    await deleteToken();

    // Clear Zustand admin store from localStorage
    try {
        localStorage.removeItem('admin-store');
        sessionStorage.removeItem('homz_access_token');
    } catch { /* ignore */ }

    // Show styled session expired overlay
    const existing = document.getElementById('__session-expired-overlay');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.id = '__session-expired-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center;
        z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    overlay.innerHTML = `
        <div style="
            background: #fff; border-radius: 16px; padding: 32px;
            max-width: 380px; width: 90%; text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <div style="
                width: 56px; height: 56px; border-radius: 50%;
                background: #FEF2F2; display: flex; align-items: center;
                justify-content: center; margin: 0 auto 16px;
            ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M12 8v4M12 16h.01" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: #1A1A1A; margin: 0 0 8px;">Session Expired</h3>
            <p style="font-size: 13px; color: #6B6B6B; margin: 0 0 24px; line-height: 1.5;">${message}</p>
            <div style="
                width: 100%; height: 4px; background: #F0F0F0;
                border-radius: 2px; overflow: hidden; margin-bottom: 16px;
            ">
                <div id="__session-progress" style="
                    height: 100%; background: #006AFF;
                    border-radius: 2px; width: 100%;
                    transition: width 3s linear;
                "></div>
            </div>
            <p style="font-size: 12px; color: #9E9E9E;">Redirecting to login...</p>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate progress bar
    requestAnimationFrame(() => {
        const bar = document.getElementById('__session-progress');
        if (bar) bar.style.width = '0%';
    });

    setTimeout(() => {
        window.location.href = loginPath;
    }, 3000);
};

// Request interceptor — attach JWT
api.interceptors.request.use(
    async (config) => {
        let jwtToken = await getToken();
        if (!jwtToken && typeof window !== 'undefined') {
            const sessionToken = sessionStorage.getItem('homz_access_token');
            if (sessionToken) jwtToken = sessionToken;
        }
        if (jwtToken) config.headers.Authorization = `Bearer ${jwtToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

const EXPECTED_404_URLS = ['/subscriptions/current'];

// Response interceptor — handle 401 with refresh + redirect
api.interceptors.response.use(
    (response) => {
        // Reset sessionExpiredShown on successful responses
        sessionExpiredShown = false;
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Suppress expected 404s
        if (error.response?.status === 404) {
            const url: string = error.config?.url || '';
            if (EXPECTED_404_URLS.some(e => url.includes(e))) {
                return Promise.reject(error);
            }
        }

        // Don't intercept 401 on login/auth endpoints — those are credential errors
        const url: string = originalRequest?.url || '';
        const isAuthEndpoint = url.includes('/log-in') || url.includes('/login') || url.includes('/auth/') || url.includes('current-profile');
        if (isAuthEndpoint) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
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
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token');

                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh-token`,
                    { token: refreshToken }
                );

                const { success, data } = refreshResponse.data;
                if (success === true && data?.accessToken) {
                    await storeToken({
                        token: data.accessToken,
                        refresh_token: data.refreshToken,
                    });
                    api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    failedRequestsQueue.forEach((p) => p.resolve(data.accessToken));
                    failedRequestsQueue = [];
                    return api(originalRequest);
                } else {
                    throw new Error('Refresh failed');
                }
            } catch {
                failedRequestsQueue.forEach((p) => p.reject(new Error('Session expired')));
                failedRequestsQueue = [];
                await redirectToLogin();
                return Promise.reject(new Error('Session expired. Please log in again.'));
            } finally {
                isRefreshing = false;
            }
        }

        // 401 without retry (e.g. refresh endpoint itself returned 401)
        if (error.response?.status === 401) {
            failedRequestsQueue.forEach((p) => p.reject(new Error('Session expired')));
            failedRequestsQueue = [];
            await redirectToLogin();
        }

        return Promise.reject(error);
    }
);

export default api;