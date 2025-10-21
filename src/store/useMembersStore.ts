/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';
import { useSelectedCommunity } from './useSelectedCommunity';

export interface MemberItem {
    _id: string;
    email: string;
    role: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
        estateId: string;
    };
    communityManager?: {
        _id: string;
        email: string;
        personal: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
        };
    };
    // Computed properties for easier access
    firstName?: string;
    lastName?: string;
}

interface MembersApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        totalCount: number;
        limit: number;
        currentPage: number;
        totalPages: number;
        next: string | null;
        previous: string | null;
        results: MemberItem[];
    };
}

interface MembersState {
    members: MemberItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    initialLoading: boolean;
    pageLoading: boolean;
    error: string | null;
    hasAnyData: boolean;
    roleFilter: string | null;
    lastFetch: { page: number; limit: number; role: string | null };
    lastEstateId: string | null;

    setRoleFilter: (value: string | null) => void;
    fetchMembers: (params?: { page?: number; limit?: number; role?: string | null; silent?: boolean }) => Promise<void>;
    updateMemberRole: (memberId: string, role: string, email: string) => Promise<void>;
    deleteMember: (memberId: string) => Promise<void>;
    sendInvitation: (email: string, role: string) => Promise<void>;
    reset: () => void;
}

export const useMembersStore = create<MembersState>((set, get) => ({
    members: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    initialLoading: true,
    pageLoading: false,
    error: null,
    hasAnyData: false,
    roleFilter: null,
    lastFetch: { page: 1, limit: 10, role: null },
    lastEstateId: null,

    setRoleFilter: (value) => set({ roleFilter: value }),

    reset: () => set({
        members: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        initialLoading: true,
        hasAnyData: false,
        lastEstateId: null,
    }),

    fetchMembers: async (params = {}) => {
        const state = get();
        const page = params.page ?? state.currentPage ?? 1;
        const limit = params.limit ?? state.limit ?? 10;
        const role = params.role ?? state.roleFilter ?? null;
        const silent = params.silent ?? false;

        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.associatedIds?.organizationId;
        const estateId = selectedCommunity?._id;

        if (!organizationId || !estateId) {
            set({ error: 'Missing organization or estate id', initialLoading: false, pageLoading: false });
            return;
        }

        // Check if we already have data for this estate with same params
        if (
            state.lastEstateId === estateId &&
            state.lastFetch.page === page &&
            state.lastFetch.limit === limit &&
            state.lastFetch.role === role &&
            state.members.length > 0 &&
            !silent
        ) {
            return;
        }

        // Decide which loader to show
        if (!silent) {
            if ((state.members?.length ?? 0) === 0) {
                set({ initialLoading: true, pageLoading: false });
            } else {
                set({ pageLoading: true });
            }
        }

        try {
            let url = `/estates-roles-permission-invitation/members/organizations/${organizationId}/estates/${estateId}?page=${page}&limit=${limit}`;

            if (role && role !== 'All') {
                url += `&role=${encodeURIComponent(role)}`;
            }

            const res = await api.get<MembersApiResponse>(url);
            const responseData = res.data?.data;
            const results = responseData?.results || [];

            // Map the results to include firstName and lastName from communityManager
            const mappedResults = results.map((member) => ({
                ...member,
                firstName: member.communityManager?.personal?.firstName || '',
                lastName: member.communityManager?.personal?.lastName || '',
            }));

            set({
                members: mappedResults,
                totalCount: responseData?.totalCount || 0,
                totalPages: responseData?.totalPages || 1,
                currentPage: responseData?.currentPage || page,
                limit: responseData?.limit || limit,
                initialLoading: false,
                pageLoading: false,
                error: null,
                hasAnyData: mappedResults.length > 0,
                lastFetch: { page, limit, role },
                lastEstateId: estateId,
            });
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message;
            const backendMessageTwo = err?.response?.data?.message?.[0];
            const fallbackMessage = err?.message || "Failed to fetch members";
            set({
                error: backendMessage || backendMessageTwo || fallbackMessage || '',
                members: [],
                totalCount: 0,
                totalPages: 1,
                hasAnyData: false,
                initialLoading: false,
                pageLoading: false,
            });
        }
    },

    updateMemberRole: async (memberId: string, role: string, email: string) => {
        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.associatedIds?.organizationId;
        const estateId = selectedCommunity?._id;

        if (!organizationId || !estateId) {
            throw new Error('Missing organization or estate id');
        }

        try {
            await api.patch(
                `/estates-roles-permission-invitation/members/${memberId}/role/organizations/${organizationId}/estates/${estateId}`,
                { email, role }
            );

            // Update local state
            set((state) => ({
                members: state.members.map((member) =>
                    member._id === memberId ? { ...member, role: role.toLowerCase() } : member
                ),
            }));
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "Failed to update member role";
            throw new Error(backendMessage || backendMessageTwo || fallbackMessage);
        }
    },

    deleteMember: async (memberId: string) => {
        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.associatedIds?.organizationId;
        const estateId = selectedCommunity?._id;

        if (!organizationId || !estateId) {
            throw new Error('Missing organization or estate id');
        }

        try {
            // If you have a delete endpoint, use it here
            await api.delete(`/estates-roles-permission-invitation/members/${memberId}/organizations/${organizationId}/estates/${estateId}`);

            // For now, just remove from local state
            set((state) => ({
                members: state.members.filter((member) => member._id !== memberId),
                totalCount: state.totalCount - 1,
            }));
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "Failed to delete member";
            throw new Error(backendMessage || backendMessageTwo || fallbackMessage);
        }
    },

    sendInvitation: async (email: string, role: string) => {
        const selectedCommunity = useSelectedCommunity.getState().selectedCommunity;
        const organizationId = selectedCommunity?.associatedIds?.organizationId;
        const estateId = selectedCommunity?._id;

        if (!organizationId || !estateId) {
            throw new Error('Missing organization or estate id');
        }

        try {
            await api.post(
                `/estates-roles-permission-invitation/generate-link/organizations/${organizationId}/estates/${estateId}`,
                {
                    email: email,
                    role: role,
                }
            );

            // Refresh the members list after successful invitation
            await get().fetchMembers({ silent: true });
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "Failed to send invitation";
            throw new Error(backendMessage || backendMessageTwo || fallbackMessage);
        }
    },
}));
