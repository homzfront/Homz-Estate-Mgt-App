/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api';
import { create } from 'zustand';
import { useSelectedCommunity } from './useSelectedCommunity';
import { useSelectedEsate } from './useSelectedEstate';
import { useResidentCommunity } from './useResidentCommunity';

interface RentedDetails {
    rentDurationType: string;
    rentDuration: number;
    rentStartDate: string;
    rentDueDate: string;
}

interface AssociatedIds {
    communityManagerId: string;
    organizationId: string;
    estateId: string;
}

export interface ResidentData {
    _id: string;
    associatedIds: AssociatedIds;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    estateName: string;
    streetName: string;
    building: string;
    status: string;
    apartment: string;
    zone: string;
    ownershipType: string;
    rentedDetails: RentedDetails;
    isActive: boolean;
    createdAt: string;
    invitationToken: string;
    updatedAt: string;
}

interface ResponseData {
    currentPage: number;
    limit: number;
    next: number;
    previous: number;
    results: ResidentData[];
    totalCount: number;
    totalPages: number;
}

export interface RequestState {
    isLoading: boolean;
    requestResponse: ResponseData | null;
    // FIX: status and search are now separate params — not mixed up
    getRequest: (
        page?: number,
        limit?: number,
        status?: string,
        search?: string
    ) => Promise<void>;
    clearRequest: () => void;
    sendCoResidentInvitation: (
        coResidentData: {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            role: string;
            relationship?: string;
        }
    ) => Promise<{ link: string }>;
}

export const useRequestSlice = create<RequestState>()(
    (set) => ({
        isLoading: false, // FIX: start false, not true — prevents flash of loading on mount
        requestResponse: null,

        // FIX: don't wipe isLoading to false here, leave it for fetch to manage
        clearRequest: () => set({ requestResponse: null }),

        getRequest: async (
            page = 1,
            limit = 6,
            status?: string,
            search?: string
        ) => {
            set({ isLoading: true });
            try {
                const community = useSelectedCommunity.getState().selectedCommunity;
                const orgId = community?.estate?.associatedIds?.organizationId;
                const estateId = community?.estate?._id;

                if (!orgId || !estateId) {
                    set({ isLoading: false });
                    return;
                }

                const baseUrl = `/resident-invitation/organizations/${orgId}/estates/${estateId}`;
                const params = new URLSearchParams();
                params.set('limit', String(limit));
                params.set('page', String(page));

                // FIX: status goes to status param, search goes to search param
                if (status && status !== 'all') {
                    params.set('status', status);
                }
                if (search && search.trim()) {
                    params.set('search', search.trim());
                }

                const response = await api.get(`${baseUrl}?${params.toString()}`);
                const data = response.data?.data;
                set({ requestResponse: data || null });
            } catch {
                set({ requestResponse: null });
            } finally {
                set({ isLoading: false });
            }
        },

        sendCoResidentInvitation: async (coResidentData) => {
            const selectedEstate = useSelectedEsate.getState()?.selectedEstate;
            const residentCommunity = useResidentCommunity.getState()?.residentCommunity;
            const activeCommunity = selectedEstate || residentCommunity?.[0];

            const organizationId = activeCommunity?.associatedIds?.organizationId;
            const estateId = activeCommunity?.estateId;

            if (!organizationId || !estateId) {
                throw new Error('Missing organization or estate id');
            }

            try {
                const response = await api.post(
                    `/resident/invite-co-resident/organizations/${organizationId}/estates/${estateId}`,
                    { coResident: coResidentData }
                );
                return response.data.data;
            } catch (error: any) {
                const backendMessage = error?.response?.data?.message;
                const backendMessageTwo = error?.response?.data?.message?.[0];
                const fallbackMessage = error?.message || 'Failed to send co-resident invitation';
                throw new Error(backendMessage || backendMessageTwo || fallbackMessage);
            }
        },
    })
);