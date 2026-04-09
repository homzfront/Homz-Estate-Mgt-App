/* eslint-disable @typescript-eslint/no-explicit-any */
import { Visitor } from '@/app/(dashboard)/components/visitors';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/utils/api';
import { useSelectedCommunity } from './useSelectedCommunity';
import { ManagerResidentItem } from './useResidentsListStore';

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
    resident: ManagerResidentItem | null;
    setResident: (data: ManagerResidentItem | null) => void;
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
    setError: (value: string | null) => void;
    lastFetch: { page: number; limit: number; accessStatus: string | null; manualOnly: boolean };
    lastEstateId: string | null; // Track which estate the data belongs to
    setAccessStatusFilter: (value: string | null) => void;
    fetchManagerAccess: (params?: { page?: number; limit?: number; accessStatus?: string | null; silent?: boolean; manualOnly?: boolean; append?: boolean }) => Promise<void>;
    updateManagerAccessStatus: (accessId: string, nextStatus: 'pending' | 'signed in' | 'signed out') => Promise<void>;
}

export const useAccessStore = create<UseAccessStoreType>()(
    persist(
        (set, get) => ({
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
            setError: (value) => set({ error: value }),
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
                // NOTE: always refetch when manualOnly changes (tab switch between All/Manually Added)
                const manualOnlyChanged = state.lastFetch.manualOnly !== manualOnly;
                if (
                    !manualOnlyChanged &&
                    state.lastEstateId === estateId &&
                    state.items.length > 0 &&
                    !append &&
                    state.lastFetch.page === page &&
                    state.lastFetch.limit === limit &&
                    state.lastFetch.accessStatus === accessStatus &&
                    silent // only skip on truly silent background refreshes
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
                } catch (err: unknown) {
                    const error = err as any
                    const backendMessage = error?.response?.data?.message;
                    const backendMessageTwo = error?.response?.data?.message?.[0];
                    const fallbackMessage = error?.message || "Failed to fetch access records";
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
                } catch (err: unknown) {
                    const error = err as any
                    const initialMessage = error?.response?.data?.errors?.[0]?.message
                    const backendMessage = error?.response?.data?.message;
                    const backendMessageTwo = error?.response?.data?.message?.[0];
                    const fallbackMessage = error?.message || "Failed to update status";
                    set({ error: initialMessage || backendMessage || backendMessageTwo || fallbackMessage || '' });
                    // Optionally refetch to sync with server
                    // await get().fetchManagerAccess({ silent: true });

                }
            },
        }),
        { name: 'access-store' }
    ));