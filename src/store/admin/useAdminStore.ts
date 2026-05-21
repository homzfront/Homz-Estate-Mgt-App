'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/utils/api';
import { storeToken, deleteToken } from '@/utils/cookies';

interface AdminUser {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

interface AdminStore {
    admin: AdminUser | null;
    isLoading: boolean;
    setAdmin: (admin: AdminUser) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>()(
    persist(
        (set) => ({
            admin: null,
            isLoading: false,

            setAdmin: (admin) => set({ admin }),

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    // Backend uses /auth/log-in for all users (no separate admin endpoint)
                    const res = await api.post('/auth/log-in', { email, password });
                    const { success, message, data } = res.data || {};
                    if (!success) throw new Error(message || 'Login failed');

                    // Backend returns camelCase: accessToken, refreshToken
                    const accessToken  = data?.accessToken  || data?.access_token;
                    const refreshToken = data?.refreshToken || data?.refresh_token;

                    if (!accessToken) throw new Error('No token received');

                    await storeToken({ token: accessToken, refresh_token: refreshToken });

                    // Also store in sessionStorage for immediate use (same pattern as resident)
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('homz_access_token', accessToken);
                    }
                    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

                    // Fetch admin profile to verify this is an admin account
                    const profileRes = await api.get('/admin/profile');
                    set({ admin: profileRes.data?.data || { email, role: 'admin', _id: '' } });
                } catch (err) {
                    throw err;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                await deleteToken();
                set({ admin: null });
                if (typeof window !== 'undefined') window.location.href = '/admin/login';
            },

            fetchProfile: async () => {
                try {
                    const res = await api.get('/admin/profile');
                    set({ admin: res.data?.data });
                } catch { /* silent */ }
            },
        }),
        {
            name: 'homz-admin',
            partialize: (state) => ({ admin: state.admin }),
        }
    )
);