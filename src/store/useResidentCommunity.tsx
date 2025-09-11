import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Community } from './authStore';

interface AssociatedIds {
    userId: string;
    residentId: string;
    communityManagerId: string;
    organizationId: string;
    residentOrganizationId: string;
}

export interface ResidentCommunityType {
    _id: string;
    associatedIds: AssociatedIds;
    invitedBy: string;
    estateId: string;
    estateName: string;
    role: string; // You could use a union type like 'resident' | 'manager' | 'admin' if roles are limited
    status: string; // You could use a union type like 'pending' | 'accepted' | 'rejected' if statuses are limited
    respondedAt: string; // or Date if you'll convert to Date objects
    isOwner: boolean;
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    invitedAt: string; // or Date
    createdAt: string; // or Date
    updatedAt: string; // or Date
    __v: number;
}

// For the array of invitations
type InvitationsArray = ResidentCommunityType[];


interface ResidentCommunityStore {
    residentCommunity: InvitationsArray | null;
    setResidentCommunity: (data: InvitationsArray | null) => void;
}

export const useResidentCommunity = create<ResidentCommunityStore>()(
    persist(
        (set) => ({
            residentCommunity: null,
            setResidentCommunity: (data) => set({ residentCommunity: data }),
        }),
        {
            name: "resident-community", // storage key
            partialize: (state) => ({
                residentCommunity: state.residentCommunity,
            }),
        }
    )
);
