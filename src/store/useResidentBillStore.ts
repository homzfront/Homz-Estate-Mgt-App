import { create } from 'zustand';
import api from '@/utils/api';

export interface ResidentBillItem {
    _id: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
        residentId: string;
        residentOrganizationId?: string;
    };
    estateId: string;
    apartmentId: string;
    billingId: string;
    paymentDate: string | null;
    paymentMode: string;
    billType: string;
    frequency: string;
    billingStartDate: string;
    billingEndDate: string;
    period: string;
    periodNumber: number;
    periodStatus: string;
    amount: number;
    amountPaid: number;
    paymentType: string;
    residencyDuration: number;
    startDate: string;
    dueDate: string;
    status: string;
    referenceTransaction: string;
    isResidencyType: boolean;
    residencyTypeDetails?: {
        residentcyTypeId: string;
        residencyType: string;
    };
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface BillingMetrics {
    totalExpectedBillAmount: number;
    totalExpectedForPeriods: number;
    totalPaidBillAmount: number;
    totalPartiallyPaidAmount: number;
    totalPendingBillAmount: number;
    totalOverdueBillAmount: number;
}

interface FetchBillsParams {
    estateId: string;
    organizationId: string;
    residentId: string;
    page?: number;
    limit?: number;
    search?: string;
    frequency?: string;
    residencyType?: string;
    date?: string;
    sortby?: number;
    silent?: boolean;
    billingId?: string;
}

interface ResidentBillStore {
    bills: ResidentBillItem[];
    metrics: BillingMetrics | null;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
    hasAnyData: boolean;
    fullBillsHistory: ResidentBillItem[];
    detailedBills: ResidentBillItem[];
    detailedMetrics: BillingMetrics | null;

    // Filters
    search: string;
    frequency: string;

    lastParams: FetchBillsParams | null;
    currentBillingId: string | null;
    isInitialized: boolean;

    setSearch: (val: string) => void;
    setFrequency: (val: string) => void;

    fetchResidentBills: (params: FetchBillsParams) => Promise<void>;
    loadMoreBills: () => Promise<void>;
    reset: () => void;
}

export const useResidentBillStore = create<ResidentBillStore>((set, get) => ({
    bills: [],
    metrics: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    hasAnyData: false,
    fullBillsHistory: [],
    detailedBills: [],
    detailedMetrics: null,
    search: '',
    frequency: '',
    lastParams: null,
    currentBillingId: null,
    isInitialized: false,

    setSearch: (val) => set({ search: val }),
    setFrequency: (val) => set({ frequency: val }),

    fetchResidentBills: async (params) => {
        const { silent = false, billingId } = params;
        const state = get();

        // Rules for showing loader:
        // 1. Not silent
        // 2. Not initialized (first fetch)
        // 3. Different params for main list
        // 4. Different billingId for detailed view
        const isMainListFetch = !billingId;
        const isSameParams = JSON.stringify(state.lastParams) === JSON.stringify(params);
        const isSameBillingId = state.currentBillingId === billingId;

        let shouldShowLoader = !silent && (!state.isInitialized || !isSameParams);
        if (billingId && !isSameBillingId) {
            shouldShowLoader = true;
            // Clear detailed results when switching bills to avoid showing old data
            set({ detailedBills: [], detailedMetrics: null });
        }

        set({ isLoading: shouldShowLoader, error: null, lastParams: params, currentBillingId: billingId || null });
        try {
            const {
                estateId,
                organizationId,
                residentId,
                page = 1,
                limit = 12,
                search = get().search,
                frequency = get().frequency,
                sortby = -1,
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('limit', limit.toString());
            queryParams.append('sortby', sortby.toString());
            if (search) queryParams.append('search', search);
            if (frequency) queryParams.append('frequency', frequency);
            if (billingId) queryParams.append('billingId', billingId);

            const url = `/resident/bill-payment/organizations/${organizationId}/estates/${estateId}/residents/${residentId}?${queryParams.toString()}`;

            const response = await api.get(url);

            if (response.data.success) {
                const { billing, stats } = response.data.data;
                const { results, totalCount, totalPages, currentPage } = billing;

                if (billingId) {
                    set({
                        detailedBills: page === 1 ? results : [...get().detailedBills, ...results],
                        detailedMetrics: stats?.metrics || null,
                        fullBillsHistory: page === 1 ? results : [...get().fullBillsHistory, ...results],
                        totalCount,
                        totalPages,
                        currentPage,
                        isInitialized: true
                    });
                } else {
                    set({
                        bills: page === 1 ? results : [...get().bills, ...results],
                        metrics: stats?.metrics || null,
                        totalCount,
                        totalPages,
                        currentPage,
                        hasAnyData: results.length > 0 || get().hasAnyData,
                        isInitialized: true
                    });
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bills';
            set({ error: errorMessage });
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