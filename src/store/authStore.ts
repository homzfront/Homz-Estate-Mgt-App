/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api';
import { storeToken } from '@/utils/cookies';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserObject {
    email: string;
    userId?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    isVerified?: boolean;
    accounts?: any;
}

export interface AuthResponse {
    user: UserObject;
    userId: any;
    access_token: string;
    refresh_token?: string;
}

export interface AccountDetailsType {
    _id: string;
    userId: string;
    email: string;
    personal: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    },
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    organization: {
        _id: string;
        name: string;
        communityManagerId: string;
        userId: string;
        isActive: boolean;
        isDeleted: boolean;
        deleted: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }
}

export interface AuthState {
    isLoggingIN: boolean;
    isSigningUP: boolean;
    userData: UserObject | null;
    error: string | null;
    logOutUser: () => Promise<void>;
    createUser: (payload: RegisterUser) => Promise<AuthResponse>;
    clearError: () => void;
    setUserData: (data: UserObject) => void;
    userAccountDetails: AccountDetailsType | null;
    getCommunityManaProfile: () => Promise<void>;
    communityProfile: any;
    setUserAccountDetails: (data: AccountDetailsType) => void
}

export const useAuthSlice = create<AuthState>()(
    persist(
        (set, get) => ({
            userData: null,
            isLoggingIN: false,
            isSigningUP: false,
            communityProfile: null,
            error: null,
            setUserData: ((data) => set({ userData: data })),
            logOutUser: async () => {
                try {
                    set({ userData: null, isLoggingIN: false });
                    // Clear both session and local storage
                    sessionStorage.clear();
                    localStorage.clear();

                    // Call API to invalidate tokens
                    await fetch("/api/logout", {
                        method: "POST",
                        credentials: 'include' // Important for HTTP-only cookies
                    });

                    // Redirect without hooks
                    window.location.href = "/login";

                } catch (error) {
                    console.error('Logout error:', error);
                    set({ error: 'Failed to log out properly' });
                }
            },

            createUser: async (payload: RegisterUser) => {
                try {
                    set({ isSigningUP: true, error: null });

                    const response = await api.post("/auth/sign-up", {
                        email: payload?.email,
                        password: payload?.password,
                        confirmPassword: payload?.confirmPassword
                    });

                    // Axios puts your parsed data here
                    const data: AuthResponse = response.data;

                    // Update state with user data
                    set({
                        userData: {
                            email: payload?.email
                        }
                    });

                    // Store tokens if not using HTTP-only cookies
                    if (data.access_token) {
                        await storeToken({ token: data.access_token });
                    }

                    return data;

                } catch (error: any) {
                    console.error('Registration error:', error);
                    set({ error: error.message || 'Registration failed' });
                    throw error;
                } finally {
                    set({ isSigningUP: false });
                }
            },
            getCommunityManaProfile: async () => {
                try {
                    const response = await api.get("/community-manager/current-profile");

                    // Axios puts your parsed data here
                    const data = response.data.data;

                    // Update state with communityProfile
                    set({
                        communityProfile: data
                    });

                } catch (error: any) {
                    console.error('failed to fetch community manager profile:', error);
                    set({ error: error.message || 'failed' });
                    throw error;
                } 
            },

            userAccountDetails: null,
            setUserAccountDetails: ((data) => set({ userAccountDetails: data })),

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth',
            partialize: (state) => ({
                userData: state.userData
            }) // Only persist userData
        }
    )
);