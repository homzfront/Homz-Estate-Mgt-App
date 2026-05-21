/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';

export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';

export interface MaintenanceResidentInfo {
    _id: string;
    firstName: string;
    lastName: string;
    apartment: string;
    building: string;
    email: string;
    phoneNumber?: string;
}

export interface MaintenanceRequest {
    _id: string;
    associatedIds: {
        estateId: string;
        organizationId: string;
        residentId: MaintenanceResidentInfo | string;
    };
    title: string;
    category: string;
    description: string;
    status: MaintenanceStatus;
    reminderCount: number;
    lastReminderSentAt?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface MaintenanceStore {
    requests: MaintenanceRequest[];
    isLoading: boolean;
    isSubmitting: boolean;
    totalPages: number;
    currentPage: number;
    totalCount: number;

    // Resident actions
    fetchResidentRequests: (orgId: string, estateId: string, status?: MaintenanceStatus | 'ALL') => Promise<void>;
    createRequest: (orgId: string, estateId: string, data: { title: string; category: string; description: string }) => Promise<void>;
    cancelRequest: (id: string, orgId: string, estateId: string) => Promise<void>;
    sendReminder: (id: string, orgId: string, estateId: string) => Promise<void>;

    // EM actions
    fetchEMRequests: (orgId: string, estateId: string, status?: MaintenanceStatus | 'ALL') => Promise<void>;
    updateStatus: (id: string, orgId: string, estateId: string, status: MaintenanceStatus) => Promise<void>;

    reset: () => void;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
    requests: [],
    isLoading: false,
    isSubmitting: false,
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,

    fetchResidentRequests: async (orgId, estateId, status) => {
        set({ isLoading: true });
        try {
            const query = status && status !== 'ALL' ? `&status=${status}` : '';
            const res = await api.get(
                `/residents/maintenance/organizations/${orgId}/estates/${estateId}?page=1&limit=20${query}`
            );
            const data = res.data?.data;
            set({
                requests: data?.results || [],
                totalPages: data?.totalPages || 1,
                totalCount: data?.totalCount || 0,
            });
        } catch { /* silent */ } finally {
            set({ isLoading: false });
        }
    },

    createRequest: async (orgId, estateId, data) => {
        set({ isSubmitting: true });
        try {
            await api.post(
                `/residents/maintenance/organizations/${orgId}/estates/${estateId}`,
                data
            );
        } finally {
            set({ isSubmitting: false });
        }
    },

    cancelRequest: async (id, orgId, estateId) => {
        try {
            await api.patch(
                `/residents/maintenance/${id}/cancel/organizations/${orgId}/estates/${estateId}`
            );
            set((s) => ({
                requests: s.requests.map((r) =>
                    r._id === id ? { ...r, status: 'CANCELLED' } : r
                ),
            }));
        } catch { /* silent */ }
    },

    sendReminder: async (id, orgId, estateId) => {
        try {
            await api.post(
                `/residents/maintenance/${id}/remind/organizations/${orgId}/estates/${estateId}`
            );
        } catch { /* silent */ }
    },

    fetchEMRequests: async (orgId, estateId, status) => {
        set({ isLoading: true });
        try {
            const query = status && status !== 'ALL' ? `&status=${status}` : '';
            const res = await api.get(
                `/community-managers/maintenance/organizations/${orgId}/estates/${estateId}?page=1&limit=20${query}`
            );
            const data = res.data?.data;
            set({
                requests: data?.results || [],
                totalPages: data?.totalPages || 1,
                totalCount: data?.totalCount || 0,
            });
        } catch { /* silent */ } finally {
            set({ isLoading: false });
        }
    },

    updateStatus: async (id, orgId, estateId, status) => {
        try {
            await api.patch(
                `/community-managers/maintenance/${id}/status/organizations/${orgId}/estates/${estateId}`,
                { status }
            );
            set((s) => ({
                requests: s.requests.map((r) =>
                    r._id === id ? { ...r, status } : r
                ),
            }));
        } catch { /* silent */ }
    },

    reset: () => set({ requests: [], isLoading: false, currentPage: 1, totalPages: 1, totalCount: 0 }),
}));