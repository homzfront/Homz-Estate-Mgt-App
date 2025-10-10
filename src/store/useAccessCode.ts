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
    accessStatus: string; // e.g. "expired", "signed out"
    creatorRole: string;
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    // Optional fields for signed in/out visitors
    timeIn?: string; // ISO date string when visitor signed in
    timeOut?: string; // ISO date string when visitor signed out
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
    isLoading: boolean; // legacy field
    // New pagination/loading helpers
    currentPage?: number;
    limit?: number;
    initialLoading?: boolean;
    pageLoading?: boolean;
    isAppending?: boolean;
    lastSearch?: string;
    lastDate?: string;
    hasAnyData: boolean;
    getAccessCode: (
        pageNo?: number,
        pageSize?: number,
        search?: string,
        date?: string | Date
    ) => Promise<void>;
}

export const useAccessCodeSlice = create<AccessCodeSlice>()(
    persist(
        (set) => ({
            accessCode: null,
            totalPages: 1,
            totalResults: 0,
            isLoading: false,
            currentPage: 1,
            limit: 10,
            initialLoading: true,
            pageLoading: false,
            isAppending: false,
            lastSearch: '',
            lastDate: '',
            hasAnyData: false,
            getAccessCode: async (pageNo = 1, pageSize = 10, search = '', date?: string | Date) => {
                // Decide loaders and clear items on page reset
                set((state) => ({
                    isLoading: state.accessCode === null,
                    initialLoading: state.accessCode === null && pageNo === 1,
                    pageLoading: state.accessCode !== null && pageNo === 1,
                    isAppending: state.accessCode !== null && pageNo > 1,
                    limit: pageSize,
                    accessCode: pageNo === 1 ? null : state.accessCode,
                }));
                try {
                    // Use selectedEstate
                    const selectedEstate = useSelectedEsate.getState().selectedEstate as ResidentCommunityType | null;
            
                    if (!selectedEstate) throw new Error("No selected estate found");

                    const { organizationId, residentOrganizationId } = selectedEstate.associatedIds;
                    const { estateId } = selectedEstate;

                    let url = `/access-control/residents/all/organizations/${organizationId}/estates/${estateId}/organizationsResident/${residentOrganizationId}?page=${pageNo}&limit=${pageSize}`;
                    if (search) url += `&search=${encodeURIComponent(search)}`;
                    if (date) {
                        if (date instanceof Date && !isNaN(date.getTime())) {
                            url += `&date=${encodeURIComponent(date.toISOString())}`;
                        } else if (typeof date === 'string' && date.trim().length > 0) {
                            const strToDate = new Date(date);
                            if (!isNaN(strToDate.getTime())) {
                                url += `&date=${encodeURIComponent(strToDate.toISOString())}`;
                            }
                        }
                    }

                    const res = await api.get(url);
                    set((prev) => {
                        const results: AccessCodeType[] = res?.data?.data?.results || [];
                        const nextItems = pageNo > 1 && prev.accessCode
                            ? Array.from(new Map([...(prev.accessCode || []), ...results].map((it) => [it._id, it])).values())
                            : results;
                        return {
                            accessCode: nextItems,
                            totalPages: res.data.data.totalPages,
                            totalResults: res.data.data.totalResults,
                            isLoading: false,
                            currentPage: pageNo,
                            limit: pageSize,
                            initialLoading: false,
                            pageLoading: false,
                            isAppending: false,
                            lastSearch: search,
                            lastDate: typeof date === 'string' ? date : (date instanceof Date ? date.toISOString() : ''),
                            hasAnyData: (search || date) ? (prev as any).hasAnyData : (results?.length ?? 0) > 0,
                        } as AccessCodeSlice;
                    });
                } catch (error: any) {
                    console.error("Error fetching access codes:", error);
                    set({ isLoading: false, initialLoading: false, pageLoading: false, isAppending: false, accessCode: null });
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