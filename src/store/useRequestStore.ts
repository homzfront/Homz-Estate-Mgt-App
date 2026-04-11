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

interface ReponseData {
    currentPage: number
    limit: number
    next: number
    previous: number
    results: ResidentData[]
    totalCount: number
    totalPages: number
}
export interface RequestState {
    isLoading: boolean;
    getRequest: (
        page?: number,
        limit?: number,
        status?: string,
        search?: string
    ) => Promise<void>;
    requestResponse: ReponseData | null;
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
        isLoading: true,
        requestResponse: null,

        clearRequest: () => set({ requestResponse: null, isLoading: false }),

        getRequest: async (
            page = 1,
            limit = 6,
            status?: string,
            search?: string
        ) => {
            set({ isLoading: true });
            try {
                const baseUrl = `/resident-invitation/organizations/${useSelectedCommunity.getState().selectedCommunity?.estate?.associatedIds?.organizationId}/estates/${useSelectedCommunity.getState().selectedCommunity?.estate?._id}`;
                let query = `${baseUrl}?limit=${limit}&page=${page}`;

                if (status) {
                    query += `&status=${status}`;
                }

                if (search) {
                    query += `&search=${search}`;
                }

                const response = await api.get(query);
                const data = response.data.data;
                set({ requestResponse: data });
            } catch (error: any) {
                set({ isLoading: false });
                throw error;
            } finally {
                set({ isLoading: false });
            }
        },

        sendCoResidentInvitation: async (coResidentData) => {
            // On resident side: use selectedEstate or residentCommunity stores
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
                    {
                        coResident: coResidentData,
                    }
                );

                return response.data.data;
            } catch (error: any) {
                const backendMessage = error?.response?.data?.message;
                const backendMessageTwo = error?.response?.data?.message?.[0];
                const fallbackMessage = error?.message || "Failed to send co-resident invitation";
                throw new Error(backendMessage || backendMessageTwo || fallbackMessage);
            }
        },
    })
);