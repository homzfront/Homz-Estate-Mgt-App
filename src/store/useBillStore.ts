/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/utils/api'
import { useSelectedCommunity } from './useSelectedCommunity'

export interface ResidencyAmount {
    residencyType: string
    amount: number
    currency: string
    _id?: string
}

export interface AssociatedIds {
    userId: string
    communityManagerId: string
    organizationId: string
    estateId: string
}

export interface BillItem {
    _id: string
    associatedIds: AssociatedIds
    estateId: string
    createdById: string
    currency: string
    billName: string
    amount?: number
    applyToAllResidencyTypes: boolean
    frequency: string
    billingStartDate: string
    billingEndDate?: string
    residencyAmounts?: ResidencyAmount[]
    status: string
    isActive: boolean
    isDeleted: boolean
    deleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

interface BillsApiResponse {
    statusCode: number
    success: boolean
    message: string
    data: {
        totalCount: number
        limit: number
        currentPage: number
        totalPages: number
        results: BillItem[]
    }
}

interface CreateBillPayload {
    currency: string
    billName: string
    amount?: number
    applyToAllResidencyTypes: boolean
    frequency: string
    billingStartDate: string
    billingEndDate?: string
    residencyAmounts?: ResidencyAmount[]
}

interface BillListState {
    items: BillItem[]
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
    search: string
    frequency: string
    status: string
    residencyType: string
    initialLoading: boolean
    pageLoading: boolean
    isAppending: boolean
    error: string | null
    hasAnyData: boolean
    hasEverHadData: boolean
    lastFetch: { page: number; limit: number; search: string; frequency: string; status: string; residencyType: string }
    lastEstateId: string | null
    selectedCurrency: string
    currencyConfigured: boolean

    setSearch: (value: string) => void
    setSelectedCurrency: (currency: string) => void
    setFrequency: (value: string) => void
    setStatus: (value: string) => void
    setResidencyType: (value: string) => void
    clearFilters: () => void
    reset: () => void
    fetchBills: (params?: {
        page?: number
        limit?: number
        search?: string
        frequency?: string
        status?: string
        residencyType?: string
        silent?: boolean
        append?: boolean
    }) => Promise<void>
    createBill: (payload: CreateBillPayload) => Promise<void>
    updateBill: (billingId: string, payload: CreateBillPayload) => Promise<void>
    updateBillStatus: (billingId: string, status: 'active' | 'inactive') => Promise<void>
    deleteBill: (billingId: string) => Promise<void>
}

export const useBillStore = create<BillListState>()(
    persist(
        (set, get) => ({
            items: [],
            totalCount: 0,
            totalPages: 1,
            currentPage: 1,
            limit: 10,
            search: '',
            frequency: '',
            status: '',
            residencyType: '',
            initialLoading: true,
            pageLoading: false,
            isAppending: false,
            error: null,
            hasAnyData: false,
            hasEverHadData: false,
            lastFetch: { page: 1, limit: 10, search: '', frequency: '', status: '', residencyType: '' },
            lastEstateId: null,
            selectedCurrency: '₦',
            currencyConfigured: false,

            setSearch: (value) => set({ search: value }),
            setSelectedCurrency: (currency) => set({ selectedCurrency: currency, currencyConfigured: true }),
            setFrequency: (value) => set({ frequency: value, currentPage: 1 }),
            setStatus: (value) => set({ status: value, currentPage: 1 }),
            setResidencyType: (value) => set({ residencyType: value, currentPage: 1 }),
            clearFilters: () => set({
                search: '',
                frequency: '',
                status: '',
                residencyType: '',
                currentPage: 1
            }),

            reset: () => set({
                items: [],
                totalCount: 0,
                totalPages: 1,
                currentPage: 1,
                initialLoading: true,
                hasAnyData: false,
                hasEverHadData: false,
                lastEstateId: null,
                currencyConfigured: false,
            }),

            fetchBills: async (params = {}) => {
                const state = get()
                const page = params.page ?? state.currentPage ?? 1
                const limit = params.limit ?? state.limit ?? 10
                const search = params.search ?? state.search ?? ''
                const frequency = params.frequency ?? state.frequency ?? ''
                const status = params.status ?? state.status ?? ''
                const residencyType = params.residencyType ?? state.residencyType ?? ''
                const silent = params.silent ?? false
                const append = params.append ?? false

                const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
                const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
                const estateId = selectedCommunity?.estate?._id

                if (!organizationId || !estateId) {
                    set({ error: 'Missing organization or estate id', initialLoading: false, pageLoading: false })
                    return
                }

                // Check if we already have cached data for this estate
                if (
                    state.lastEstateId === estateId &&
                    state.lastFetch.page === page &&
                    state.lastFetch.limit === limit &&
                    state.lastFetch.search === search &&
                    state.lastFetch.frequency === frequency &&
                    state.lastFetch.status === status &&
                    state.lastFetch.residencyType === residencyType &&
                    state.items.length > 0 &&
                    !silent
                ) {
                    return
                }

                // Decide which loader to show
                if (!silent) {
                    if (!state.hasEverHadData) {
                        set({ initialLoading: true, pageLoading: false, isAppending: false })
                    } else if (append) {
                        set({ isAppending: true })
                    } else {
                        set({ pageLoading: true })
                    }
                }

                try {
                    let url = `/community-manager/billings/organizations/${organizationId}/estates/${estateId}?page=${page}&limit=${limit}`

                    if (search) {
                        url += `&search=${encodeURIComponent(search)}`
                    }
                    if (frequency) {
                        url += `&frequency=${encodeURIComponent(frequency)}`
                    }
                    if (status) {
                        url += `&status=${encodeURIComponent(status)}`
                    }
                    if (residencyType && residencyType !== 'All Residency Type') {
                        url += `&residencyType=${encodeURIComponent(residencyType)}`
                    }

                    const res = await api.get<BillsApiResponse>(url)
                    const responseData = res.data?.data
                    const results = responseData?.results || []

                    const currentHasData = results.length > 0
                    const previousHasEverHadData = get().hasEverHadData

                    set((prev) => ({
                        items: append ? [...prev.items, ...results] : results,
                        totalCount: responseData?.totalCount || 0,
                        totalPages: responseData?.totalPages || 1,
                        currentPage: responseData?.currentPage || page,
                        limit: responseData?.limit || limit,
                        error: null,
                        search,
                        frequency,
                        status,
                        residencyType,
                        lastFetch: { page, limit, search, frequency, status, residencyType },
                        hasAnyData: currentHasData,
                        hasEverHadData: previousHasEverHadData || currentHasData,
                        initialLoading: false,
                        pageLoading: false,
                        isAppending: false,
                        lastEstateId: estateId,
                    }))
                } catch (err: any) {
                    const backendMessage = err?.response?.data?.message
                    const backendMessageTwo = err?.response?.data?.message?.[0]
                    const fallbackMessage = err?.message || 'Failed to fetch bills'

                    set({
                        error: backendMessage || backendMessageTwo || fallbackMessage || '',
                        items: [],
                        totalCount: 0,
                        totalPages: 1,
                        hasAnyData: false,
                        initialLoading: false,
                        pageLoading: false,
                        isAppending: false,
                    })
                }
            },

            createBill: async (payload: CreateBillPayload) => {
                const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
                const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
                const estateId = selectedCommunity?.estate?._id

                if (!organizationId || !estateId) {
                    throw new Error('Missing organization or estate id')
                }

                try {
                    await api.post(
                        `/community-manager/billings/organizations/${organizationId}/estates/${estateId}`,
                        payload
                    )

                    // Refresh the bills list after successful creation
                    await get().fetchBills({ silent: true })
                } catch (error: any) {
                    const initialMessage = error?.response?.data?.errors?.[0]?.message
                    const backendMessage = error?.response?.data?.message
                    const backendMessageTwo = error?.response?.data?.message?.[0]
                    const fallbackMessage = error?.message || 'Failed to create bill'
                    throw new Error(initialMessage || backendMessage || backendMessageTwo || fallbackMessage)
                }
            },

            updateBill: async (billingId: string, payload: CreateBillPayload) => {
                const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
                const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
                const estateId = selectedCommunity?.estate?._id

                if (!organizationId || !estateId) {
                    throw new Error('Missing organization or estate id')
                }

                try {
                    await api.patch(
                        `/community-manager/billings/${billingId}/organizations/${organizationId}/estates/${estateId}`,
                        payload
                    )

                    // Refresh the bills list after successful update
                    await get().fetchBills({ silent: true })
                } catch (error: any) {

                    const backendMessage = error?.response?.data?.message
                    const backendMessageTwo = error?.response?.data?.message?.[0]
                    const fallbackMessage = error?.message || 'Failed to update bill'
                    throw new Error(backendMessage || backendMessageTwo || fallbackMessage)
                }
            },

            updateBillStatus: async (billingId: string, status: 'active' | 'inactive') => {
                const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
                const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
                const estateId = selectedCommunity?.estate?._id

                if (!organizationId || !estateId) {
                    throw new Error('Missing organization or estate id')
                }

                try {
                    await api.patch(
                        `/community-manager/billings/${billingId}/status/organizations/${organizationId}/estates/${estateId}`,
                        { status }
                    )

                    // Update local state
                    set((state) => ({
                        items: state.items.map((bill) =>
                            bill._id === billingId ? { ...bill, status } : bill
                        ),
                    }))
                } catch (error: any) {
                    const initialMessage = error?.response?.data?.errors?.[0]?.message
                    const backendMessage = error?.response?.data?.message
                    const backendMessageTwo = error?.response?.data?.message?.[0]
                    const fallbackMessage = error?.message || 'Failed to update bill status'
                    throw new Error(initialMessage || backendMessage || backendMessageTwo || fallbackMessage)
                }
            },

            deleteBill: async (billingId: string) => {
                const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
                const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
                const estateId = selectedCommunity?.estate?._id

                if (!organizationId || !estateId) {
                    throw new Error('Missing organization or estate id')
                }

                try {
                    await api.delete(
                        `/community-manager/billings/${billingId}/organizations/${organizationId}/estates/${estateId}`
                    )

                    // Remove from local state
                    set((state) => ({
                        items: state.items.filter((bill) => bill._id !== billingId),
                        totalCount: state.totalCount - 1,
                    }))
                } catch (error: any) {
                    const initialMessage = error?.response?.data?.errors?.[0]?.message
                    const backendMessage = error?.response?.data?.message
                    const backendMessageTwo = error?.response?.data?.message?.[0]
                    const fallbackMessage = error?.message || 'Failed to delete bill'
                    throw new Error(initialMessage || backendMessage || backendMessageTwo || fallbackMessage)
                }
            },
        }),
        {
            name: 'bill-store',
            partialize: (state) => ({
                items: state.items,
                totalCount: state.totalCount,
                totalPages: state.totalPages,
                selectedCurrency: state.selectedCurrency,
                currencyConfigured: state.currencyConfigured,
                // Don't persist loading states or temporary data
            }),
        }
    ))