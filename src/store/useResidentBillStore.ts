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
    bustCache?: boolean;
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
        const { silent = false, billingId, bustCache = false } = params;
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
            if (billingId) {
                const billingIdStr = typeof billingId === 'object' ? (billingId as any)._id || String(billingId) : billingId;
                queryParams.append('billingId', billingIdStr);
            }
            // Add cache-buster to force fresh response after payment (avoids 304 stale data)
            if (bustCache) queryParams.append('_t', Date.now().toString());
            const url = `/resident/bill-payment/organizations/${organizationId}/estates/${estateId}/residents/${residentId}?${queryParams.toString()}`;

            const response = await api.get(url);

            if (response.data.success) {
                const { billing, stats } = response.data.data;
                // Filter out soft-deleted billings (billingId is a populated object after $lookup)
                const allResults = (billing?.results || []).filter((b: any) => {
                    const billingObj = b.billingId;
                    if (!billingObj) return false;
                    if (billingObj.isDeleted === true) return false;
                    if (billingObj.isActive === false) return false;
                    return true;
                });

                // For the main bills LIST: one card per billing (show lowest periodNumber = current/oldest unpaid)
                // For the DETAIL view: show all period records grouped by periodNumber
                // billingId is a populated object — extract the string id for comparison
                const getBillingIdStr = (b: any): string => {
                    const bid = b.billingId;
                    if (!bid) return b._id;
                    if (typeof bid === 'string') return bid;
                    return bid._id || String(bid);
                };

                const { totalCount, totalPages, currentPage } = billing;

                if (billingId) {
                    // Detail view: deduplicate by periodNumber, keeping the cron-generated record
                    // (paymentMode === 'offline' and created by cron = no paymentDate initially)
                    // Pick the record with the earliest createdAt per periodNumber (the original period record)
                    const byPeriod: Record<number, any> = {};
                    allResults.forEach((b: any) => {
                        const pn = b.periodNumber ?? 0;
                        if (!byPeriod[pn]) {
                            byPeriod[pn] = b;
                        } else {
                            // Keep the one created earliest (the original period, not payment records)
                            const existing = new Date(byPeriod[pn].createdAt).getTime();
                            const current = new Date(b.createdAt).getTime();
                            if (current < existing) byPeriod[pn] = b;
                        }
                    });
                    const results = Object.values(byPeriod).sort((a: any, b: any) => a.periodNumber - b.periodNumber);
                    set({
                        detailedBills: results,
                        detailedMetrics: stats?.metrics || null,
                        fullBillsHistory: allResults, // ALL records including payment history for payment-record page
                        totalCount,
                        totalPages,
                        currentPage,
                        isInitialized: true
                    });
                } else {
                    // List view: one card per unique billingId, pick the most recent period status
                    const byBilling: Record<string, any> = {};
                    allResults.forEach((b: any) => {
                        const key = getBillingIdStr(b);
                        if (!byBilling[key]) {
                            byBilling[key] = b;
                        } else {
                            // Keep highest periodNumber (most current period) for status display
                            if ((b.periodNumber ?? 0) > (byBilling[key].periodNumber ?? 0)) {
                                byBilling[key] = b;
                            }
                        }
                    });
                    const results = Object.values(byBilling);
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

    reset: () => set({ bills: [], detailedBills: [], fullBillsHistory: [], search: '', frequency: '', currentPage: 1, lastParams: null, currentBillingId: null, isInitialized: false, hasAnyData: false })
}));