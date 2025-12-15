/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import api from '@/utils/api'
import { useSelectedCommunity } from './useSelectedCommunity'

export interface AssociatedIds {
    userId: string
    communityManagerId: string
    organizationId: string
    residentId: string
    residentOrganizationId: string
}

export interface BillPaymentItem {
    _id: string
    associatedIds: AssociatedIds
    estateId: string
    apartmentId: string
    billingId: string
    paymentDate: string
    paymentMode: string
    billType: string
    frequency: string
    billingStartDate: string
    billingEndDate: string
    period: string
    periodNumber: number
    periodStatus: string
    amount: number
    amountPaid: number
    paymentType: string
    residencyDuration: number
    startDate: string
    dueDate: string
    status: string
    referenceTransaction: string
    isResidencyType: boolean
    isActive: boolean
    isDeleted: boolean
    deleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

interface BillPaymentsApiResponse {
    statusCode: number
    success: boolean
    message: string
    data: {
        billing: {
            totalCount: number
            limit: number
            currentPage: number
            totalPages: number
            next: string | null
            previous: string | null
            results: BillPaymentItem[]
        }
        stats?: {
            metrics: BillingStats
        }
    }
}

interface BillingStats {
    totalExpectedBillAmount: number
    totalExpectedForPeriods: number
    totalPaidBillAmount: number
    totalPartiallyPaidAmount: number
    totalPendingBillAmount: number
    totalOverdueBillAmount: number
}

interface BillingFilters {
    billingId?: string
    billType?: string
    frequency?: string
    status?: string
    paymentType?: string
    paymentMode?: string
    period?: string
    periodStatus?: string
    startDate?: string
    endDate?: string
    date?: string
}

interface CachedApartmentData {
    items: BillPaymentItem[]
    totalCount: number
    totalPages: number
    currentPage: number
    lastFetch: number // timestamp
    stats: BillingStats | null
}

interface BillPaymentListState {
    items: BillPaymentItem[]
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
    initialLoading: boolean
    pageLoading: boolean
    isAppending: boolean
    error: string | null
    hasAnyData: boolean
    hasEverHadData: boolean
    lastFetch: { page: number; limit: number; apartmentId?: string; filters?: BillingFilters }
    lastResidentId: string | null
    lastApartmentId: string | null
    lastFilters: BillingFilters
    apartmentCache: Record<string, CachedApartmentData>
    stats: BillingStats | null
    filters: BillingFilters
    isFilterActive: boolean
    currentFetchingApartmentId: string | null

    setLimit: (limit: number) => void
    reset: () => void
    setFilter: (key: keyof BillingFilters, value: string) => void
    clearFilters: () => void
    clearSingleFilter: (key: keyof BillingFilters) => void
    fetchBillPayments: (params?: {
        page?: number
        limit?: number
        residentId?: string
        apartmentId?: string
        append?: boolean
        silent?: boolean
    }) => Promise<void>
}

export const useBillPaymentStore = create<BillPaymentListState>((set, get) => ({
    items: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 12,
    initialLoading: true,
    pageLoading: false,
    isAppending: false,
    error: null,
    hasAnyData: false,
    hasEverHadData: false,
    lastFetch: { page: 1, limit: 12 },
    lastResidentId: null,
    lastApartmentId: null,
    lastFilters: {},
    apartmentCache: {},
    stats: null,
    filters: {},
    isFilterActive: false,
    currentFetchingApartmentId: null,

    setLimit: (limit) => set({ limit }),

    reset: () => set({
        items: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        initialLoading: true,
        hasAnyData: false,
        hasEverHadData: false,
        lastResidentId: null,
        lastApartmentId: null,
        stats: null,
        filters: {},
        isFilterActive: false,
    }),

    setFilter: (key, value) => set((state) => {
        const newFilters = { ...state.filters, [key]: value }
        const isActive = Object.values(newFilters).some(val => val && val !== '')
        return {
            filters: newFilters,
            isFilterActive: isActive,
        }
    }),

    clearFilters: () => set({ filters: {}, isFilterActive: false }),

    clearSingleFilter: (key) => set((state) => {
        const newFilters = { ...state.filters }
        delete newFilters[key]
        return {
            filters: newFilters,
            isFilterActive: Object.values(newFilters).some(val => val && val !== ''),
        }
    }),

    fetchBillPayments: async (params = {}) => {
        const state = get()
        const page = params.page ?? state.currentPage ?? 1
        const limit = params.limit ?? state.limit ?? 12
        const residentId = params.residentId
        const apartmentId = params.apartmentId
        const silent = params.silent ?? false
        const append = params.append ?? false

        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
        const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
        const estateId = selectedCommunity?.estate?._id

        if (!organizationId || !estateId || !residentId) {
            set({ error: 'Missing organization, estate, or resident id', initialLoading: false, pageLoading: false, currentFetchingApartmentId: null })
            return
        }

        // Set the apartment being fetched
        set({ currentFetchingApartmentId: apartmentId || null })

        // If apartment has changed, immediately update state to prevent showing old data
        const apartmentChanged = apartmentId && state.lastApartmentId !== apartmentId
        const cacheKey = apartmentId || 'default'
        const cachedData = state.apartmentCache[cacheKey]

        if (apartmentChanged) {
            // Immediately clear old data and set new apartment
            set({
                items: cachedData ? cachedData.items : [],
                totalCount: cachedData ? cachedData.totalCount : 0,
                totalPages: cachedData ? cachedData.totalPages : 1,
                currentPage: cachedData ? cachedData.currentPage : 1,
                hasAnyData: cachedData ? cachedData.items.length > 0 : false,
                hasEverHadData: cachedData ? true : state.hasEverHadData,
                lastApartmentId: apartmentId || null,
                lastResidentId: residentId,
                initialLoading: !cachedData, // Only show loading if no cache
                pageLoading: false,
                isAppending: false,
                stats: cachedData ? cachedData.stats : null,
            })
        }

        // Check if we should skip this fetch (same data, not forcing)
        const filtersChanged = JSON.stringify(state.lastFilters) !== JSON.stringify(state.filters)
        if (!apartmentChanged &&
            !filtersChanged &&
            state.lastResidentId === residentId &&
            state.lastApartmentId === apartmentId &&
            state.lastFetch.page === page &&
            state.lastFetch.limit === limit &&
            state.items.length > 0 &&
            !silent
        ) {
            return
        }

        // Decide which loader to show (only if no cached data was loaded)
        const hasCachedData = apartmentChanged && cachedData
        const shouldShowInitialLoader = filtersChanged || (!state.hasEverHadData && !cachedData)
        if (!silent && !hasCachedData) {
            if (shouldShowInitialLoader) {
                set({ initialLoading: true, pageLoading: false, isAppending: false })
            } else if (append) {
                set({ isAppending: true })
            } else {
                set({ pageLoading: true })
            }
        }

        try {
            let url = `/community-manager/bill-payment/organizations/${organizationId}/estates/${estateId}/residents/${residentId}?page=${page}&limit=${limit}`

            if (apartmentId) {
                url += `&apartmentId=${apartmentId}`
            }
            // Add filter parameters
            const { filters } = state
            if (filters.billingId) url += `&billingId=${filters.billingId}`
            if (filters.frequency) url += `&frequency=${filters.frequency}`
            if (filters.status) url += `&status=${filters.status}`
            if (filters.paymentType) url += `&paymentType=${filters.paymentType}`
            if (filters.paymentMode) url += `&paymentMode=${filters.paymentMode}`
            if (filters.period) url += `&period=${filters.period}`
            if (filters.periodStatus) url += `&periodStatus=${filters.periodStatus}`
            if (filters.startDate) url += `&startDate=${filters.startDate}`
            if (filters.endDate) url += `&endDate=${filters.endDate}`
            if (filters.date) url += `&date=${filters.date}`

            const res = await api.get<BillPaymentsApiResponse>(url)
            const responseData = res.data?.data?.billing
            const stats = res.data?.data?.stats?.metrics
            const results = responseData?.results || []

            const currentHasData = results.length > 0
            const previousHasEverHadData = get().hasEverHadData

            // Update cache for this apartment
            const updatedCache = { ...get().apartmentCache }
            if (cacheKey) {
                updatedCache[cacheKey] = {
                    items: append && !apartmentChanged ? [...(cachedData?.items || []), ...results] : results,
                    totalCount: responseData?.totalCount || 0,
                    totalPages: responseData?.totalPages || 1,
                    currentPage: responseData?.currentPage || page,
                    lastFetch: Date.now(),
                    stats: stats || null,
                }
            }

            const currentState = get()
            if (currentState.currentFetchingApartmentId !== currentState.lastApartmentId) {
                // Apartment changed during fetch, don't update items to prevent showing wrong data
                set({
                    currentFetchingApartmentId: null,
                    initialLoading: false,
                    pageLoading: false,
                    isAppending: false,
                    // Still update cache for future use
                    apartmentCache: updatedCache,
                })
            } else {
                set((prev) => ({
                    items: append && !apartmentChanged ? [...prev.items, ...results] : results,
                    totalCount: responseData?.totalCount || 0,
                    totalPages: responseData?.totalPages || 1,
                    currentPage: responseData?.currentPage || page,
                    limit: responseData?.limit || limit,
                    error: null,
                    lastFetch: { page, limit, apartmentId, filters: state.filters },
                    lastFilters: { ...state.filters },
                    hasAnyData: currentHasData,
                    hasEverHadData: previousHasEverHadData || currentHasData,
                    initialLoading: false,
                    pageLoading: false,
                    isAppending: false,
                    lastResidentId: residentId,
                    lastApartmentId: apartmentId || null,
                    apartmentCache: updatedCache,
                    stats: stats || null,
                    currentFetchingApartmentId: null,
                }))
            }
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message
            const backendMessageTwo = err?.response?.data?.message?.[0]
            const fallbackMessage = err?.message || 'Failed to fetch bill payments'

            set({
                error: backendMessage || backendMessageTwo || fallbackMessage || '',
                items: [],
                totalCount: 0,
                totalPages: 1,
                hasAnyData: false,
                initialLoading: false,
                pageLoading: false,
                isAppending: false,
                currentFetchingApartmentId: null,
            })
        }
    },
}))