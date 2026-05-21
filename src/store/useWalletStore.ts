/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';

export interface WalletTransaction {
    _id: string;
    type: string;           // 'CREDIT' | 'DEBIT'
    category: string;       // 'FUNDING' | 'BILL_PAYMENT' | 'WITHDRAWAL' | 'REFUND' | 'SUBSCRIPTION'
    amount: number;         // in NAIRA (backend converts from kobo before storing)
    status: 'SUCCESS' | 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    reference: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}

export interface WalletBalance {
    balance: number; // in NAIRA
    currency: string;
}

export interface WithdrawalItem {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    bankDetails?: {
        accountNumber: string;
        accountName: string;
        bankName: string;
        bankCode?: string;
    };
}

interface WalletStore {
    // Balance
    balance: number;
    isLoadingBalance: boolean;

    // Transactions
    transactions: WalletTransaction[];
    isLoadingTx: boolean;
    totalPages: number;
    currentPage: number;
    totalCount: number;

    // Withdrawals (EM)
    withdrawals: WithdrawalItem[];
    isLoadingWithdrawals: boolean;

    // Actions
    fetchResidentBalance: (orgId: string, estateId: string) => Promise<void>;
    fetchResidentTransactions: (orgId: string, estateId: string, page?: number, status?: string) => Promise<void>;

    fetchEMBalance: (orgId: string, estateId: string) => Promise<void>;
    fetchEMTransactions: (orgId: string, estateId: string, page?: number, status?: string) => Promise<void>;
    requestWithdrawal: (orgId: string, estateId: string, amount: number) => Promise<void>;
    fetchWithdrawals: (orgId: string, estateId: string) => Promise<void>;

    reset: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
    balance: 0,
    isLoadingBalance: false,
    transactions: [],
    isLoadingTx: false,
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,
    withdrawals: [],
    isLoadingWithdrawals: false,

    fetchResidentBalance: async (orgId, estateId) => {
        set({ isLoadingBalance: true });
        try {
            const res = await api.get(`/residents/wallets/organizations/${orgId}/estates/${estateId}`);
            const data = res.data?.data;
            set({ balance: data?.balance ?? 0 });
        } catch { /* silent */ }
        finally { set({ isLoadingBalance: false }); }
    },

    fetchResidentTransactions: async (orgId, estateId, page = 1, status) => {
        set({ isLoadingTx: true });
        try {
            const q = new URLSearchParams({ page: String(page), limit: '20' });
            if (status && status !== 'ALL') q.set('status', status);
            const res = await api.get(`/residents/wallets/transactions/organizations/${orgId}/estates/${estateId}?${q}`);
            const data = res.data?.data;
            set({
                transactions: data?.results || [],
                totalPages: data?.totalPages || 1,
                currentPage: page,
                totalCount: data?.totalCount || 0,
            });
        } catch { /* silent */ }
        finally { set({ isLoadingTx: false }); }
    },

    fetchEMBalance: async (orgId, estateId) => {
        set({ isLoadingBalance: true });
        try {
            const res = await api.get(`/community-manager/wallets/organizations/${orgId}/estates/${estateId}`);
            const data = res.data?.data;
            set({ balance: data?.balance ?? 0 });
        } catch { /* silent */ }
        finally { set({ isLoadingBalance: false }); }
    },

    fetchEMTransactions: async (orgId, estateId, page = 1, status) => {
        set({ isLoadingTx: true });
        try {
            const q = new URLSearchParams({ page: String(page), limit: '20' });
            if (status && status !== 'ALL') q.set('status', status);
            const res = await api.get(`/community-manager/wallets/transactions/organizations/${orgId}/estates/${estateId}?${q}`);
            const data = res.data?.data;
            set({
                transactions: data?.results || [],
                totalPages: data?.totalPages || 1,
                currentPage: page,
                totalCount: data?.totalCount || 0,
            });
        } catch { /* silent */ }
        finally { set({ isLoadingTx: false }); }
    },

    requestWithdrawal: async (orgId, estateId, amount) => {
        await api.post(`/community-manager/wallets/withdraw/organizations/${orgId}/estates/${estateId}`, { amount });
    },

    fetchWithdrawals: async (orgId, estateId) => {
        set({ isLoadingWithdrawals: true });
        try {
            const res = await api.get(`/community-manager/wallets/withdrawals/organizations/${orgId}/estates/${estateId}`);
            const data = res.data?.data;
            // Backend returns paginated: { results: [...], totalCount, ... }
            set({ withdrawals: data?.results || data || [] });
        } catch { /* silent */ }
        finally { set({ isLoadingWithdrawals: false }); }
    },

    reset: () => set({ balance: 0, transactions: [], currentPage: 1, totalPages: 1, totalCount: 0 }),
}));