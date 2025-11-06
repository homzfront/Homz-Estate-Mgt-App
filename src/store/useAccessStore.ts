/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resident } from '@/app/(dashboard)/(estate-manager)/manage-resident/residents/components/resident';
import { Visitor } from '@/app/(dashboard)/components/visitors';
import { create } from 'zustand';
import api from '@/utils/api';
import { useSelectedCommunity } from './useSelectedCommunity';

export interface ManagerAccessItem {
    _id: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
        residentId?: string;
        residentOrganizationId?: string;
    };
    estateId: string;
    visitor: string;
    phoneNumber: string;
    purpose: string;
    numberOfVisitors: number;
    arrivalDate?: string;
    expectedArrivalTime?: {
        from: string;
        to: string;
        _id: string;
    };
    accessCode: string;
    codeType: string;
    accessStatus: string;
    creatorRole: string;
    timeIn?: string;
    timeOut?: string;
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    resident: null | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        apartment: string;
        estateName: string;
        zone: string;
        streetName: string;
        building: string;
        status: string;
    };
}

interface UseAccessStoreType {
    accessData: boolean;
    setAccessData: (value: boolean) => void;
    hasAnyData: boolean;
    accessForm: boolean;
    setAccessForm: (value: boolean) => void;
    residentData: Visitor | null;
    setResidentData: (data: Visitor | null) => void;
    resident: Resident | null;
    setResident: (data: Resident | null) => void;
    // Manager access list state
    items: ManagerAccessItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    accessStatusFilter: string | null;
    initialLoading: boolean; // first load loader
    pageLoading: boolean; // subsequent fetch loader (pagination/filter)
    isAppending: boolean; // infinite scroll append loader
    error: string | null;
    lastFetch: { page: number; limit: number; accessStatus: string | null; manualOnly: boolean };
    lastEstateId: string | null; // Track which estate the data belongs to
    setAccessStatusFilter: (value: string | null) => void;
    fetchManagerAccess: (params?: { page?: number; limit?: number; accessStatus?: string | null; silent?: boolean; manualOnly?: boolean; append?: boolean }) => Promise<void>;
    updateManagerAccessStatus: (accessId: string, nextStatus: 'pending' | 'signed in' | 'signed out') => Promise<void>;
}

export const useAccessStore = create<UseAccessStoreType>((set, get) => ({
    accessData: false,
    setAccessData: (value) => set({ accessData: value }),
    accessForm: false,
    setAccessForm: (value) => set({ accessForm: value }),
    residentData: null,
    setResidentData: (value) => set({ residentData: value }),
    resident: null,
    setResident: (value) => set({ resident: value }),
    // Manager access list defaults
    items: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8,
    accessStatusFilter: null,
    initialLoading: true,
    pageLoading: false,
    isAppending: false,
    error: null,
    hasAnyData: false,
    lastFetch: { page: 1, limit: 8, accessStatus: null, manualOnly: false },
    lastEstateId: null,
    setAccessStatusFilter: (value) => set({ accessStatusFilter: value }),
    fetchManagerAccess: async (params = {}) => {
        const state = get();
        const page = params.page ?? state.currentPage ?? 1;
        const limit = params.limit ?? state.limit ?? 10;
        const accessStatus = params.accessStatus ?? state.accessStatusFilter ?? null;
        const silent = params.silent ?? false;
        const manualOnly = params.manualOnly ?? state.lastFetch?.manualOnly ?? false;
        const append = params.append ?? false;

        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId;
        const estateId = selectedCommunity?.estate?._id;

        if (!organizationId || !estateId) {
            set({ error: 'Missing organization or estate id', initialLoading: false, pageLoading: false });
            return;
        }

        // Check if we're switching estates - if so, reset data
        if (state.lastEstateId && state.lastEstateId !== estateId) {
            set({ 
                items: [], 
                totalCount: 0, 
                initialLoading: true,
                lastEstateId: estateId 
            });
        } else if (!state.lastEstateId) {
            set({ lastEstateId: estateId });
        }

        // If we have data for this estate and same filters, skip refetch (unless forced)
        if (
            state.lastEstateId === estateId &&
            state.items.length > 0 &&
            !append &&
            state.lastFetch.page === page &&
            state.lastFetch.limit === limit &&
            state.lastFetch.accessStatus === accessStatus &&
            state.lastFetch.manualOnly === manualOnly &&
            !silent // if silent=false, it means a fresh fetch is explicitly requested
        ) {
            // Data already loaded for this estate with same params - skip fetch
            return;
        }

        // Decide which loader to show
        if (!silent) {
            if (append) {
                set({ isAppending: true });
            } else if ((state.items?.length ?? 0) === 0) {
                // No items yet: treat as initial loading to avoid table skeleton on first load
                set({ initialLoading: true, pageLoading: false, isAppending: false });
            } else {
                set({ pageLoading: true, isAppending: false });
            }
        }

        try {
            let url = `/access-control/community-manager/all/organizations/${organizationId}/estates/${estateId}?page=${page}&limit=${limit}`;
            if (manualOnly) {
                url += `&creatorRole=community_manager`;
            }
            if (accessStatus) {
                url += `&accessStatus=${encodeURIComponent(accessStatus)}`;
            }

            const res = await api.get(url);
            const data = res?.data?.data;
            const results: ManagerAccessItem[] = data?.results || [];

            set((prev) => ({
                items: append
                    ? Array.from(
                        new Map(
                            [...(prev.items || []), ...results].map((it) => [it._id, it])
                        ).values()
                    )
                    : results,
                totalCount: data?.totalCount ?? results.length,
                totalPages: data?.totalPages ?? 1,
                currentPage: data?.currentPage ?? page,
                limit: data?.limit ?? limit,
                accessStatusFilter: accessStatus,
                accessData: accessStatus ? prev.accessData : (results?.length ?? 0) > 0,
                hasAnyData: accessStatus ? prev.hasAnyData : ((results?.length ?? 0) > 0),
                error: null,
                lastFetch: { page, limit, accessStatus, manualOnly },
            }));
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message;
            const backendMessageTwo = err?.response?.data?.message?.[0];
            const fallbackMessage = err?.message || "Failed to fetch access records";
            set({
                error: backendMessage || backendMessageTwo || fallbackMessage || '',
                items: [],
                totalCount: 0,
                totalPages: 1,
                accessData: false,
                hasAnyData: false,
            });
        } finally {
            set({ initialLoading: false, pageLoading: false, isAppending: false });
        }
    },
    updateManagerAccessStatus: async (accessId, nextStatus) => {
        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.estate?.associatedIds?.organizationId;
        const estateId = selectedCommunity?.estate?._id;

        if (!organizationId || !estateId) {
            set({ error: 'Missing organization or estate id' });
            return;
        }

        try {
            // Determine endpoint for sign-in / sign-out
            const base = `/access-control/community-manager`;
            const endpoint = nextStatus === 'signed in'
                ? `${base}/sign-in-access/${accessId}/organizations/${organizationId}/estates/${estateId}`
                : nextStatus === 'signed out'
                    ? `${base}/sign-out-access/${accessId}/organizations/${organizationId}/estates/${estateId}`
                    : null;

            // Optimistically update UI while request is in flight
            set((state) => ({
                items: state.items.map((it) =>
                    it._id === accessId
                        ? {
                            ...it,
                            accessStatus: nextStatus,
                            timeIn: nextStatus === 'signed in' ? (it.timeIn || new Date().toISOString()) : it.timeIn,
                            timeOut: nextStatus === 'signed out' ? (it.timeOut || new Date().toISOString()) : it.timeOut,
                        }
                        : it
                ),
            }));

            if (endpoint) {
                const res = await api.patch(endpoint);
                const updated: Partial<ManagerAccessItem> | undefined = res?.data?.data;
                if (updated) {
                    set((state) => ({
                        items: state.items.map((it) =>
                            it._id === accessId
                                ? { ...it, ...updated }
                                : it
                        ),
                    }));
                }
            }

            // Refetch using last filters/tab to sync with server
            const { lastFetch } = get();
            await get().fetchManagerAccess({ ...lastFetch, silent: true });
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message;
            const backendMessageTwo = err?.response?.data?.message?.[0];
            const fallbackMessage = err?.message || "Failed to update status";
            set({ error: backendMessage || backendMessageTwo || fallbackMessage || '' });
            // Optionally refetch to sync with server
            // await get().fetchManagerAccess({ silent: true });
        }
    },
}));


