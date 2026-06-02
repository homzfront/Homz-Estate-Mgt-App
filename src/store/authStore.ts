/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api';
import { storeToken } from '@/utils/cookies';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSelectedEsate } from './useSelectedEstate';
import { useResidentStore } from './useResidentStore';
import { useResidentCommunity } from './useResidentCommunity';

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
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
    message?: string;
    success?: boolean;
    statusCode?: number;
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

export interface estateData {
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
    apartments: { name: string; building: string; street: string; zone: string; residencyType: string }[];
    isActive: boolean;
    isDeleted: boolean;
    residentType: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Community {
    _id: string;
    associatedIds: {
        userId: string;
        communityManagerId: string;
        organizationId: string;
    }
    estateId: string;
    role: string;
    status: string;
    estate: estateData;
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
    isCommunityManager: boolean;
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
            isCommunityManager: false,
            setUserData: (data) => set({ userData: data }),
            setUserAccountDetails: (data) => set({ userAccountDetails: data }),

            getEstates: async () => {
                try {
                    const communityProfile = get().communityProfile;

                    if (!communityProfile?._id || !communityProfile?.organization?._id) {
                        // Profile missing — set empty array so dashboard exits loader
                        set({ estatesData: [], estateLoading: false });
                        return;
                    }

                    const response = await api.get(
                        `/estates/community-manager/organizations/${communityProfile.organization._id}?limit=100&page=1`
                    );
                 
                    set({ estatesData: response?.data?.data?.estates?.results || [] });
                } catch {
                    // Set empty array on error so dashboard doesn't stay stuck on loader
                    set({ estatesData: [] });
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
                } catch {
                    set({ error: "Failed to log out properly" });
                }
            },

            createUser: async (payload: RegisterUser) => {
                try {
                    set({ isSigningUP: true, error: null });
                    let response = null
                    let data = null
                    // Check for pending co-resident invitation — use resident signup endpoint
                    const pendingInvite = typeof window !== 'undefined'
                        ? sessionStorage.getItem('homz_pending_coresident_invite')
                        : null;
                    if (pendingInvite) {
                        response = await api.post("/auth/resident/sign-up", payload);
                    } else {
                        response = await api.post("/auth/sign-up", payload);
                    }
                    data = response.data;

                    // signUp_resident returns: { data: { accessToken, refreshToken, userId } }
                    // signUp returns: { data: { accessToken, refreshToken } } or account_not_verified
                    const tokenData = data.data || data;
                    // Store token FIRST before setting userData
                    // This ensures the cookie is written before any downstream effects fire
                    if (tokenData?.accessToken) {
                        await storeToken({
                            token: tokenData.accessToken,
                            refresh_token: tokenData.refreshToken,
                        });
                        // Set Authorization header immediately for subsequent api calls
                        api.defaults.headers.common.Authorization = `Bearer ${tokenData.accessToken}`;
                        // Also store in sessionStorage as fallback for immediate client-side access
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('homz_access_token', tokenData.accessToken);
                        }
                    } else if (data.access_token) {
                        await storeToken({ token: data.access_token });
                        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('homz_access_token', data.access_token);
                        }
                    }

                    set({
                        userData: { email: payload.email },
                    });

                    // Fetch full user profile using the fresh token directly
                    // Don't use api instance here — it may still have old session token
                    try {
                        const freshToken = tokenData?.accessToken || data.access_token;
                        if (freshToken) {
                            const axios = (await import('axios')).default;
                            const profile = await axios.get(
                                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/current-user`,
                                { headers: { Authorization: `Bearer ${freshToken}` } }
                            );
                            if (profile?.data?.data) {
                                set({ userData: profile.data.data });
                            }
                        }
                    } catch { /* silent - sidebar will guard against undefined _id */ }

                    // Return flattened so AuthResponse fields are accessible
                    return { ...data, ...(data.data || {}), accessToken: tokenData?.accessToken };
                } catch (error: any) {
                    set({ error: error.message || "Registration failed" });
                    throw error;
                } finally {
                    set({ isSigningUP: false });
                }
            },

            getCommunityManaProfile: async () => {
                try {
                    set({ isCommunityManager: true, estateLoading: true });
                    const response = await api.get("/community-manager/current-profile");
                    const data = response.data.data;
                    set({ communityProfile: data });
                    
                    // Automatically fetch estates after profile loads
                    await get().getEstates();
                } catch (error: any) {
                    set({ error: error.message || "failed", estateLoading: false });
                    throw error;
                }
                finally {
                    set({ isCommunityManager: false });
                }
            },

            getResidentProfile: async (residentId: string) => {
                // residentId here is the resident DOCUMENT id (associatedIds.residentId)
                // Get org/estate from selectedEstate or residentCommunity
                const selectedEstate = useSelectedEsate.getState()?.selectedEstate;
                const residentCommunity = useResidentCommunity.getState()?.residentCommunity;

                // Always prefer fresh residentCommunity data over potentially stale selectedEstate
                // The residentCommunity is fetched fresh on every login via fetchResidentEstate
                const activeCommunity = residentCommunity?.find(
                    e => e._id === selectedEstate?._id
                ) || residentCommunity?.[0] || selectedEstate;

                const organizationId = activeCommunity?.associatedIds?.organizationId ||
                    useResidentStore.getState().organizationId;
                const estateId = activeCommunity?.estateId ||
                    useResidentStore.getState().estateId;
                // Use residentId from fresh community data, not the passed param which may be stale
                const freshResidentId = activeCommunity?.associatedIds?.residentId || residentId;

                // Guard: don't call if any param is missing
                if (!organizationId || !estateId || !freshResidentId) {
                    return;
                }
                try {
                    const response = await api.get(`/resident/profile/organizations/${organizationId}/estates/${estateId}/residents/${freshResidentId}?_t=${Date.now()}`);
                    const data = response.data.data;
                    set({ residentProfile: data });
                } catch (error: any) {
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
                // residentProfile intentionally NOT persisted — it contains time-sensitive
                // data (rentStartDate, rentDueDate) that must always be fetched fresh
            }),
            // storage: createJSONStorage(() => sessionStorage),
            // storage: createJSONStorage(() => localStorage),
        }
    )
);