/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import api from '@/utils/api'
import { useSelectedCommunity } from './useSelectedCommunity'

export interface ManagerResidentItem {
  _id: string
  associatedIds: {
    communityManagerId: string
    organizationId: string
    estateId: string
  }
  userId: string
  email: string
  firstName: string
  lastName: string
  estateName: string
  zone?: string
  streetName: string
  building: string
  status: string
  apartment: string
  ownershipType: 'rented' | 'owned'
  rentedDetails?: {
    rentDurationType: 'Monthly' | 'Yearly'
    rentDuration: number
    rentStartDate: string
    rentDueDate: string
  }
  ownedDetails?: {
    residencyStartDate: string
  }
  residences?: {
    zone?: string
    streetName: string
    building: string
    apartment: string
    residencyType?: string
    ownershipType: 'rented' | 'owned'
    rentedDetails?: {
        rentDurationType: 'Monthly' | 'Yearly'
        rentDuration: number
        rentStartDate: string
        rentDueDate: string
    }
    ownedDetails?: {
        residencyStartDate: string
    }
    _id: string
  }[]
  invitationToken?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  phoneNumber?: string
}

interface ResidentsListState {
  items: ManagerResidentItem[]
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  search: string
  initialLoading: boolean
  pageLoading: boolean
  isAppending: boolean
  error: string | null
  hasAnyData: boolean // true if there is any data at all (unfiltered)
  lastFetch: { page: number; limit: number; search: string }
  lastEstateId: string | null // Track which estate the data belongs to
  setSearch: (value: string) => void
  reset: () => void
  fetchResidents: (params?: {
    page?: number
    limit?: number
    search?: string
    silent?: boolean
    append?: boolean
  }) => Promise<void>
}

export const useResidentsListStore = create<ResidentsListState>((set, get) => ({
  items: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 8,
  search: '',
  initialLoading: true,
  pageLoading: false,
  isAppending: false,
  error: null,
  hasAnyData: false,
  lastFetch: { page: 1, limit: 8, search: '' },
  lastEstateId: null,
  setSearch: (value) => set({ search: value }),
  reset: () => set({ items: [], totalCount: 0, totalPages: 1, currentPage: 1 }),
  fetchResidents: async (params = {}) => {
    const state = get()
    const page = params.page ?? state.currentPage ?? 1
    const limit = params.limit ?? state.limit ?? 8
    const search = params.search ?? state.search ?? ''
    const silent = params.silent ?? false
    const append = params.append ?? false

    const selectedCommunity = useSelectedCommunity.getState().selectedCommunity
    const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId
    const estateId = selectedCommunity?.estate?._id

    if (!organizationId || !estateId) {
      set({ error: 'Missing organization or estate id', initialLoading: false, pageLoading: false })
      return
    }

    // Check if we're switching estates - if so, reset data
    if (state.lastEstateId && state.lastEstateId !== estateId) {
      set({ 
        items: [], 
        totalCount: 0, 
        initialLoading: true,
        lastEstateId: estateId 
      })
    } else if (!state.lastEstateId) {
      set({ lastEstateId: estateId })
    }

    // If we have data for this estate and same filters, skip refetch (unless forced)
    if (
      state.lastEstateId === estateId &&
      state.items.length > 0 &&
      !append &&
      state.lastFetch.page === page &&
      state.lastFetch.limit === limit &&
      state.lastFetch.search === search &&
      !silent // if silent=false, it means a fresh fetch is explicitly requested
    ) {
      // Data already loaded for this estate with same params - skip fetch
      return
    }

    if (!silent) {
      if (append) set({ isAppending: true })
      else if ((state.items?.length ?? 0) === 0) set({ initialLoading: true, pageLoading: false, isAppending: false })
      else set({ pageLoading: true, isAppending: false })
    }

    try {
      const paramsArr = [`page=${page}`, `limit=${limit}`]
      if (search) paramsArr.push(`search=${encodeURIComponent(search)}`)
      const url = `/community-manager/resident/all/organizations/${organizationId}/estates/${estateId}?${paramsArr.join('&')}`
      const res = await api.get(url)
      const data = res?.data?.data
      const results: ManagerResidentItem[] = data?.results || data?.items || []

      set((prev) => ({
        items: append
          ? Array.from(new Map([...(prev.items || []), ...results].map((it) => [it._id, it])).values())
          : results,
        totalCount: data?.totalCount ?? results.length,
        totalPages: data?.totalPages ?? 1,
        currentPage: data?.currentPage ?? page,
        limit: data?.limit ?? limit,
        error: null,
        search,
        lastFetch: { page, limit, search },
        hasAnyData: search ? prev.hasAnyData : (data?.totalCount ?? results.length) > 0,
      }))
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message
      const backendMessageTwo = err?.response?.data?.message?.[0]
      const fallbackMessage = err?.message || 'Failed to fetch residents'
      set({
        error: backendMessage || backendMessageTwo || fallbackMessage || '',
        items: [],
        totalCount: 0,
        totalPages: 1,
        hasAnyData: false,
      })
    } finally {
      set({ initialLoading: false, pageLoading: false, isAppending: false })
    }
  },
}))
