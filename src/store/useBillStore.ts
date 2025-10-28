/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { estateBillingData } from '@/constant/index'

export interface BillItem {
    _id: string
    billName: string
    amount: string
    frequency: string
    startDate: string
    status: string
    residenceType: string
}

interface BillListState {
    items: BillItem[]
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
    search: string
    initialLoading: boolean
    pageLoading: boolean
    isAppending: boolean
    error: string | null
    hasAnyData: boolean
    lastFetch: { page: number; limit: number; search: string }
    setSearch: (value: string) => void
    reset: () => void
    fetchBills: (params?: {
        page?: number
        limit?: number
        search?: string
        silent?: boolean
        append?: boolean
    }) => Promise<void>
}

export const useBillStore = create<BillListState>((set, get) => ({
    items: [],
    totalCount: estateBillingData.length,
    totalPages: Math.ceil(estateBillingData.length / 8),
    currentPage: 1,
    limit: 8,
    search: '',
    initialLoading: true,
    pageLoading: false,
    isAppending: false,
    error: null,
    hasAnyData: estateBillingData.length > 0,
    lastFetch: { page: 1, limit: 8, search: '' },
    setSearch: (value) => set({ search: value }),
    reset: () => set({ items: [], totalCount: estateBillingData.length, totalPages: Math.ceil(estateBillingData.length / 8), currentPage: 1 }),
    fetchBills: async (params = {}) => {
        const state = get()
        const page = params.page ?? state.currentPage ?? 1
        const limit = params.limit ?? state.limit ?? 8
        const search = params.search ?? state.search ?? ''
        const silent = params.silent ?? false
        const append = params.append ?? false

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        let filteredData = estateBillingData
        if (search) {
            filteredData = estateBillingData.filter(item =>
                item.billName.toLowerCase().includes(search.toLowerCase()) ||
                item.residenceType.toLowerCase().includes(search.toLowerCase())
            )
        }

        const totalCount = filteredData.length
        const totalPages = Math.ceil(totalCount / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const results = filteredData.slice(startIndex, endIndex)

        set((prev) => ({
            items: append
                ? [...prev.items, ...results]
                : results,
            totalCount,
            totalPages,
            currentPage: page,
            limit,
            error: null,
            search,
            lastFetch: { page, limit, search },
            hasAnyData: totalCount > 0,
            initialLoading: false,
            pageLoading: false,
            isAppending: false,
        }))
    },
}))