/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSelectedCommunity } from './useSelectedCommunity';
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

interface ResidentData {
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
    ownershipType: string;
    rentedDetails: RentedDetails;
    isActive: boolean;
    createdAt: string;
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
    getRequest: () => Promise<void>;
    requestResponse: ReponseData | null;
}

export const useRequestSlice = create<RequestState>()(
    persist(
        (set, get) => ({
            isLoading: true,
            requestResponse: null,

            getRequest: async () => {
                try {
                    const response = await api.get(`/resident-invitation/organizations/${useSelectedCommunity.getState().selectedCommunity?.associatedIds?.organizationId}/estates/${useSelectedCommunity.getState().selectedCommunity?._id}`);
                    const data = response.data.data;
                    console.log("Request data:", data);
                    set({ requestResponse: data });
                    set({ isLoading: false });
                } catch (error: any) {
                    // console.error("failed to fetch requests:", error);
                    set({ isLoading: false });
                    throw error;
                }
            },
        }),
        {
            name: "Request",
            partialize: (state) => ({
                requestResponse: state.requestResponse,
            }),
            // storage: createJSONStorage(() => sessionStorage),
            // storage: createJSONStorage(() => localStorage),
        }
    )
);
