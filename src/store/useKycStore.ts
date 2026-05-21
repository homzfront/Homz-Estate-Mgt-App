/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';

export type KycStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface KycRecord {
    _id: string;
    idType: string;
    jobId: string;
    status: KycStatus;
    rejectionReason?: string;
    processedAt?: string;
    document?: any;
    createdAt?: string;
}

interface KycState {
    status: KycStatus;
    record: KycRecord | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;

    fetchStatus: () => Promise<void>;
    submitKyc: (orgId: string, estateId: string, payload: {
        idType: string;
        jobId: string;
        document: any;
    }) => Promise<void>;
}

export const useKycStore = create<KycState>((set) => ({
    status: 'NONE',
    record: null,
    isLoading: false,
    isSubmitting: false,
    error: null,

    fetchStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/kyc/status?_t=${Date.now()}`);
            const data = res.data?.data;
            set({
                status: data?.status ?? 'NONE',
                record: data?.status && data.status !== 'NONE' ? data : null,
            });
        } catch {
            set({ status: 'NONE', record: null });
        } finally {
            set({ isLoading: false });
        }
    },

    submitKyc: async (orgId, estateId, payload) => {
        set({ isSubmitting: true, error: null });
        try {
            await api.post(
                `/kyc/submit/organizations/${orgId}/estates/${estateId}`,
                payload,
            );
            set({ status: 'PENDING' });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'KYC submission failed';
            set({ error: Array.isArray(msg) ? msg[0] : msg });
            throw err;
        } finally {
            set({ isSubmitting: false });
        }
    },
}));