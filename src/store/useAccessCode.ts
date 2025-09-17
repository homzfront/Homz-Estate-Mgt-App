/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/utils/api'; // Adjust import to your API utility
import { ResidentCommunityType } from './useResidentCommunity';
import { useSelectedEsate } from './useSelectedEstate';

// interface AccessCodeResponse {
//     results: ResidentCommunityType[];
//     totalPages: number;
//     totalResults: number;
// }

// AccessCodeType.ts

export interface AccessCodeType {
    _id: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
        residentId: string;
        residentOrganizationId: string;
    };
    estateId: string;
    visitor: string;
    phoneNumber: string;
    purpose: string;
    numberOfVisitors: number;
    arrivalDate: string; // ISO date string
    expectedArrivalTime: {
        from: string; // ISO date string
        to: string;   // ISO date string
        _id: string;
    };
    accessCode: string;
    codeType: string; // e.g. "One-Time Code"
    accessStatus: string; // e.g. "expired"
    creatorRole: string;
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    resident: {
        _id: string;
        associatedIds: {
            communityManagerId: string;
            organizationId: string;
            estateId: string;
        };
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        estateName: string;
        zone: string;
        streetName: string;
        building: string;
        status: string;
        apartment: string;
        ownershipType: string;
        rentedDetails: {
            rentDurationType: string;
            rentDuration: number;
            rentStartDate: string;
            rentDueDate: string;
        };
        invitationToken: string;
        isActive: boolean;
        isDeleted: boolean;
        deleted: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

interface AccessCodeSlice {
    accessCode: AccessCodeType[] | null;
    totalPages: number;
    totalResults: number;
    isLoading: boolean;
    hasAnyData: boolean;
    getAccessCode: (
        pageNo?: number,
        pageSize?: number,
        search?: string,
        date?: string
    ) => Promise<void>;
}

export const useAccessCodeSlice = create<AccessCodeSlice>()(
    persist(
        (set) => ({
            accessCode: null,
            totalPages: 1,
            totalResults: 0,
            isLoading: false,
            hasAnyData: false,
            getAccessCode: async (pageNo = 1, pageSize = 10, search = '', date?: string | Date) => {
                console.log("Fetching access codes with params:", { pageNo, pageSize, search, date });  
                set({ isLoading: true });
                try {
                    // Use selectedEstate
                    const selectedEstate = useSelectedEsate.getState().selectedEstate as ResidentCommunityType | null;
                    console.log("Selected Estate in AccessCodeSlice:", selectedEstate);
                    if (!selectedEstate) throw new Error("No selected estate found");

                    const { organizationId, residentOrganizationId } = selectedEstate.associatedIds;
                    const { estateId } = selectedEstate;

                    let url = `/access-control/residents/all/organizations/${organizationId}/estates/${estateId}/organizationsResident/${residentOrganizationId}?page=${pageNo}&limit=${pageSize}`;
                    if (search) url += `&search=${encodeURIComponent(search)}`;
                  
                    if (date && date instanceof Date && !isNaN(date.getTime())) {
                        url += `&date=${encodeURIComponent(date.toISOString())}`;
                    }

                    const res = await api.get(url);
                    console.log('Resident Community Response:', res.data);
                    set((prev) => ({
                        accessCode: res.data.data.results,
                        totalPages: res.data.data.totalPages,
                        totalResults: res.data.data.totalResults,
                        isLoading: false,
                        hasAnyData: (search || date) ? (prev as any).hasAnyData : (res.data.data.results?.length ?? 0) > 0,
                    }));
                } catch (error: any) {
                    console.error("Error fetching access codes:", error);
                    set({ isLoading: false, accessCode: null });
                }
            },
        }),
        {
            name: "access-code",
            partialize: (state) => ({
                AccessCode: state.accessCode,
                totalPages: state.totalPages,
                totalResults: state.totalResults,
                hasAnyData: state.hasAnyData,
            }),
        }
    )
);