import { create } from 'zustand';
import api from '@/utils/api';

export interface ResidentBillItem {
    _id: string;
    billName: string;
    currency: string;
    amount?: number;
    frequency: string;
    status: string;
    // Add other fields from the API response as needed
    residencyAmounts?: {
        residencyType: string;
        amount: number;
        currency: string;
        _id: string;
    }[];
}

interface FetchBillsParams {
    estateId: string;
    organizationId: string;
    residentOrganizationsId: string;
    page?: number;
    limit?: number;
    search?: string;
    frequency?: string;
    residencyType?: string;
    date?: string;
    sortby?: number;
    silent?: boolean;
}

interface ResidentBillStore {
    bills: ResidentBillItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
    hasAnyData: boolean;

    // Filters
    search: string;
    frequency: string;

    lastParams: FetchBillsParams | null;

    setSearch: (val: string) => void;
    setFrequency: (val: string) => void;

    fetchResidentBills: (params: FetchBillsParams) => Promise<void>;
    loadMoreBills: () => Promise<void>;
    reset: () => void;
}

export const useResidentBillStore = create<ResidentBillStore>((set, get) => ({
    bills: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    hasAnyData: false,
    search: '',
    frequency: '',
    lastParams: null,

    setSearch: (val) => set({ search: val }),
    setFrequency: (val) => set({ frequency: val }),

    fetchResidentBills: async (params) => {
        const { silent = false } = params;
        set({ isLoading: !silent, error: null, lastParams: params });
        try {
            const {
                estateId,
                organizationId,
                residentOrganizationsId,
                page = 1,
                limit = 12,
                search = get().search,
                frequency = get().frequency,
                sortby = -1
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('limit', limit.toString());
            queryParams.append('sortby', sortby.toString());
            if (search) queryParams.append('search', search);
            if (frequency) queryParams.append('frequency', frequency);
            // Add other optional params if needed

            const url = `/residents/billings/organizations/${organizationId}/estates/${estateId}/organizationsResident/${residentOrganizationsId}?${queryParams.toString()}`;

            const response = await api.get(url);

            if (response.data.success) {
                const { results, totalCount, totalPages, currentPage } = response.data.data;
                set({
                    bills: page === 1 ? results : [...get().bills, ...results],
                    totalCount,
                    totalPages,
                    currentPage,
                    hasAnyData: results.length > 0
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch bills' });
        } finally {
            set({ isLoading: false });
        }
    },

    loadMoreBills: async () => {
        const { lastParams, currentPage, totalPages, isLoading } = get();
        if (!lastParams || isLoading || currentPage >= totalPages) return;

        const params = { ...lastParams, page: currentPage + 1 };
        await get().fetchResidentBills(params);
    },

    reset: () => set({ bills: [], search: '', frequency: '', currentPage: 1, lastParams: null })
}));