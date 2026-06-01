/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: 'ACCESS_CONTROL' | 'BILLING' | 'BILLINGS_PAYMENTS' | 'RESIDENT_ACTIVITY' | 'WALLET_TRANSACTIONS' | 'SYSTEM_SECURITY' | 'MAINTENANCE' | 'GENERAL'
        | 'access_control' | 'bill' | 'payment' | 'co_resident' | 'maintenance' | 'system' | 'wallet' | 'general';
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}

// ── Frontend shape (what the UI uses) ─────────────────────────────────────────
export interface NotificationSettings {
    pushNotifications: boolean;
    emailNotifications: boolean;
    billingsAndPayments: boolean;
    residentActivity: boolean;
    accessControl: boolean;
    walletAndTransactions: boolean;
    systemAndSecurity: boolean;
}

// ── Backend GET response shape ────────────────────────────────────────────────
// GET /notifications/settings returns:
// {
//   push: boolean,
//   email: boolean,
//   categories: {
//     billingsPayments: boolean,
//     residentActivity: boolean,
//     accessControl: boolean,
//     walletTransactions: boolean,
//     systemSecurity: boolean
//   }
// }
function fromApi(data: any): NotificationSettings {
    return {
        pushNotifications:    data?.push          ?? true,
        emailNotifications:   data?.email         ?? true,
        billingsAndPayments:  data?.categories?.billingsPayments  ?? true,
        residentActivity:     data?.categories?.residentActivity  ?? true,
        accessControl:        data?.categories?.accessControl     ?? true,
        walletAndTransactions:data?.categories?.walletTransactions ?? true,
        systemAndSecurity:    data?.categories?.systemSecurity    ?? false,
    };
}

// ── Frontend → Backend PATCH payload ─────────────────────────────────────────
// PATCH /notifications/settings expects UpdateNotificationSettingsDto:
// {
//   push?: boolean,
//   email?: boolean,
//   categories?: {
//     billingsPayments?: boolean,
//     residentActivity?: boolean,
//     accessControl?: boolean,
//     walletTransactions?: boolean,
//     systemSecurity?: boolean
//   }
// }
function toApi(settings: NotificationSettings): Record<string, any> {
    return {
        push:  settings.pushNotifications,
        email: settings.emailNotifications,
        categories: {
            billingsPayments:   settings.billingsAndPayments,
            residentActivity:   settings.residentActivity,
            accessControl:      settings.accessControl,
            walletTransactions: settings.walletAndTransactions,
            systemSecurity:     settings.systemAndSecurity,
        },
    };
}

interface NotificationStore {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    isLoadingSettings: boolean;
    isSavingSettings: boolean;
    settings: NotificationSettings;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    pollingInterval: ReturnType<typeof setInterval> | null;

    fetchNotifications: (page?: number, append?: boolean) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    updateSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
    startPolling: (intervalMs?: number) => void;
    stopPolling: () => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: NotificationSettings = {
    pushNotifications:     true,
    emailNotifications:    true,
    billingsAndPayments:   true,
    residentActivity:      true,
    accessControl:         true,
    walletAndTransactions: true,
    systemAndSecurity:     false,
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isLoadingSettings: false,
    isSavingSettings: false,
    settings: DEFAULT_SETTINGS,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    pollingInterval: null,

    fetchNotifications: async (page = 1, append = false) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/notifications?page=${page}&limit=20`);
            const data = res.data?.data;
            const results: NotificationItem[] = data?.results || data?.notifications || [];
            const totalPages = data?.totalPages || 1;
            const unread = append
                ? get().unreadCount + results.filter(n => !n.isRead).length
                : results.filter(n => !n.isRead).length;

            set(state => ({
                notifications: append ? [...state.notifications, ...results] : results,
                unreadCount: unread,
                currentPage: page,
                totalPages,
                hasMore: page < totalPages,
            }));
        } catch { /* silent */ } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            set(state => ({
                notifications: state.notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch { /* silent */ }
    },

    markAllAsRead: async () => {
        try {
            await api.patch('/notifications/read-all');
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0,
            }));
        } catch { /* silent */ }
    },

    fetchSettings: async () => {
        set({ isLoadingSettings: true });
        try {
            const res = await api.get('/notifications/settings');
            const data = res.data?.data || res.data;
            if (data) {
                set({ settings: fromApi(data) });
            }
        } catch { /* keep defaults */ } finally {
            set({ isLoadingSettings: false });
        }
    },

    updateSettings: async (updates: Partial<NotificationSettings>) => {
        const prev = get().settings;
        const next = { ...prev, ...updates };

        // Optimistic update
        set({ settings: next, isSavingSettings: true });

        try {
            // Send the full settings using the exact backend field names
            await api.patch('/notifications/settings', toApi(next));
        } catch (err: any) {
            // Revert on failure
            set({ settings: prev });
            const msg = err?.response?.data?.message;
            toast.error(
                Array.isArray(msg) ? msg[0] : (msg || 'Failed to save notification preferences'),
                { position: 'top-center' }
            );
        } finally {
            set({ isSavingSettings: false });
        }
    },

    startPolling: (intervalMs = 30000) => {
        const existing = get().pollingInterval;
        if (existing) clearInterval(existing);

        const interval = setInterval(() => {
            // Only poll if we already have a successful load
            if (get().notifications.length > 0 || get().unreadCount > 0) {
                get().fetchNotifications(1, false);
            }
        }, intervalMs);

        set({ pollingInterval: interval });
    },

    stopPolling: () => {
        const interval = get().pollingInterval;
        if (interval) {
            clearInterval(interval);
            set({ pollingInterval: null });
        }
    },

    reset: () => {
        get().stopPolling();
        set({
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            currentPage: 1,
            totalPages: 1,
            hasMore: false,
        });
    },
}));