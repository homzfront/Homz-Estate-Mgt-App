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
}

export const useRequestSlice = create<RequestState>()(
    persist(
        (set, get) => ({
            isLoading: true,
            requestResponse: null,

            getRequest: async (
                page = 1,
                limit = 6,
                status?: string,
                search?: string
            ) => {
                set({ isLoading: true });
                try {
                    const baseUrl = `/resident-invitation/organizations/${useSelectedCommunity.getState().selectedCommunity?.associatedIds?.organizationId}/estates/${useSelectedCommunity.getState().selectedCommunity?._id}`;
                    let query = `${baseUrl}?limit=${limit}&page=${page}`;

                    if (status) {
                        query += `&status=${status}`;
                    }

                    if (search) {
                        query += `&search=${search}`;
                    }

                    const response = await api.get(query);
                    const data = response.data.data;
                    console.log("Request data:", data);
                    set({ requestResponse: data });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "Request",
            partialize: (state) => ({
                requestResponse: state.requestResponse,
            }),
        }
    )
);
