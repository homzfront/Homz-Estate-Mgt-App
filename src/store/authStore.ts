/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api';
import { storeToken } from '@/utils/cookies';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useResidentStore } from "@/store/useResidentStore";

export interface RegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserObject {
    email: string;
    userId?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    isVerified?: boolean;
    accounts?: any;
}

export interface AuthResponse {
    user: UserObject;
    userId: any;
    access_token: string;
    refresh_token?: string;
}

export interface AccountDetailsType {
    _id: string;
    userId: string;
    email: string;
    personal: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    organization: {
        _id: string;
        name: string;
        communityManagerId: string;
        userId: string;
        isActive: boolean;
        isDeleted: boolean;
        deleted: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

export interface Community {
    _id: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
    };
    basicDetails: {
        name: string;
        location: {
            area: string;
            state: string;
        };
    };
    coverPhoto: {
        assetId: string;
        publicId: string;
        format: string;
        size: string;
        resource_type: string;
        url: string;
        thumbnailUrl: string;
        scaledImage: string;
        originalname: string;
        height: string;
        created_at: string;
        width: string;
    },
    contactInformation: {
        managerPhone: string;
        emergencyPhone: string;
        utilityServicesPhone: string;
        securityPhone: string;
    };
    bankDetails: {
        accountNumber: string;
        accountName: string;
        bankName: string;
    };
    zones: { name: string }[];
    streets: { name: string; zone: string }[];
    buildings: { name: string; street: string; zone: string }[];
    apartments: { name: string; building: string; street: string; zone: string }[];
    isActive: boolean;
    isDeleted: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AuthState {
    isLoggingIN: boolean;
    isSigningUP: boolean;
    userData: UserObject | null;
    error: string | null;
    logOutUser: () => Promise<void>;
    createUser: (payload: RegisterUser) => Promise<AuthResponse>;
    clearError: () => void;
    setUserData: (data: UserObject) => void;
    userAccountDetails: AccountDetailsType | null;
    getCommunityManaProfile: () => Promise<void>;
    communityProfile: any;
    residentProfile: any;
    setUserAccountDetails: (data: AccountDetailsType) => void;
    estatesData: Community[] | null;
    getEstates: () => Promise<void>;
    estateLoading: boolean;
    getResidentProfile: (residentId: string) => Promise<void>;
}

export const useAuthSlice = create<AuthState>()(
    persist(
        (set, get) => ({
            userData: null,
            isLoggingIN: false,
            isSigningUP: false,
            communityProfile: null,
            error: null,
            estatesData: null,
            estateLoading: true,
            residentProfile: null,

            setUserData: (data) => set({ userData: data }),
            setUserAccountDetails: (data) => set({ userAccountDetails: data }),

            getEstates: async () => {
                try {
                    const communityProfile = get().communityProfile;

                    if (!communityProfile?._id || !communityProfile?.organization?._id) {
                        throw new Error("Missing community profile");
                    }

                    const response = await api.get(
                        `/estates/community-manager/${communityProfile._id}/all-estates/organizations/${communityProfile.organization._id}`
                    );

                    set({ estatesData: response?.data?.data?.estates });
                } catch (error) {
                    console.error("Failed to fetch estates:", error);
                } finally {
                    set({ estateLoading: false });
                }
            },

            logOutUser: async () => {
                try {
                    set({ userData: null, isLoggingIN: false });
                    sessionStorage.clear();
                    localStorage.clear();

                    await fetch("/api/logout", {
                        method: "POST",
                        credentials: "include",
                    });

                    window.location.href = "/login";
                } catch (error) {
                    console.error("Logout error:", error);
                    set({ error: "Failed to log out properly" });
                }
            },

            createUser: async (payload: RegisterUser) => {
                // const { isResident, estateId, organizationId } = useResidentStore.getState();
                try {
                    set({ isSigningUP: true, error: null });
                    let response = null
                    let data = null
                    // if (isResident && estateId && organizationId) {
                    //     response = await api.post("/auth/resident/sign-up", payload);
                    //     data = response.data;
                    // } else {
                    response = await api.post("/auth/sign-up", payload);
                    data = response.data;
                    // }
                    set({
                        userData: { email: payload.email },
                    });

                    if (data.access_token) {
                        await storeToken({ token: data.access_token });
                    }

                    return data;
                } catch (error: any) {
                    console.error("Registration error:", error);
                    set({ error: error.message || "Registration failed" });
                    throw error;
                } finally {
                    set({ isSigningUP: false });
                }
            },

            getCommunityManaProfile: async () => {
                try {
                    const response = await api.get("/community-manager/current-profile");
                    const data = response.data.data;
                    set({ communityProfile: data });
                } catch (error: any) {
                    console.error("failed to fetch community manager profile:", error);
                    set({ error: error.message || "failed" });
                    throw error;
                }
            },

            getResidentProfile: async (residentId: string ) => {
                try {
                    const response = await api.get(`/resident/profile/organizations/${useResidentStore.getState().organizationId}/estates/${useResidentStore.getState().estateId}/residents/${residentId}`);
                    const data = response.data.data;
                    set({ residentProfile: data });
                } catch (error: any) {
                    console.error("failed to fetch community manager profile:", error);
                    set({ error: error.message || "failed" });
                    throw error;
                }
            },

            userAccountDetails: null,

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth",
            partialize: (state) => ({
                userData: state.userData,
                estatesData: state.estatesData,
                communityProfile: state.communityProfile,
                residentProfile: state.residentProfile,
            }),
            // storage: createJSONStorage(() => sessionStorage),
            // storage: createJSONStorage(() => localStorage),
        }
    )
);
