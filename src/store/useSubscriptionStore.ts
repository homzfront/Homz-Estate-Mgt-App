/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/utils/api';

export interface SubscriptionPlan {
    _id: string;
    name: string;
    description: string;
    price?: number;
    monthlyPrice: number;
    annualPrice: number;
    interval?: string;
    features: string[];
    isActive: boolean;
}

export interface CurrentSubscription {
    _id: string;
    planId: SubscriptionPlan | string;
    status: 'active' | 'expired' | 'canceled';
    startDate: string;
    endDate: string;
    reference: string;
    interval?: 'monthly' | 'annually';
    authorizationCode?: string;
    _planName?: string;
}

export type FeatureKey =
    | 'finance'
    | 'finance_view'
    | 'wallet'
    | 'payments'
    | 'wallet_advanced'
    | 'exports'
    | 'residents_full'
    | 'residents_unlimited';

const PLAN_FEATURES: Record<string, FeatureKey[]> = {
    free: ['finance_view'],
    enterprise: ['finance_view', 'finance', 'payments', 'wallet', 'exports', 'residents_full'],
    premium: ['finance_view', 'finance', 'payments', 'wallet', 'exports', 'residents_full', 'wallet_advanced', 'residents_unlimited'],
    platinum: ['finance_view', 'finance', 'payments', 'wallet', 'exports', 'residents_full', 'wallet_advanced', 'residents_unlimited'],
};

export const FEATURE_LABELS: Record<FeatureKey, { title: string; description: string; requiredPlan: string }> = {
    finance_view: { title: 'Estate Billing (View)', description: 'View bills — upgrade to create and manage', requiredPlan: 'Enterprise' },
    finance: { title: 'Estate Billing', description: 'Create and manage bills for your residents', requiredPlan: 'Enterprise' },
    wallet: { title: 'Wallet Collections', description: 'Collect payments via resident wallets', requiredPlan: 'Enterprise' },
    payments: { title: 'Estate Payments', description: 'Manage internal estate payment flows', requiredPlan: 'Enterprise' },
    exports: { title: 'Financial Exports', description: 'Export financial summaries and statements', requiredPlan: 'Enterprise' },
    residents_full: { title: 'Extended Residents', description: 'Manage up to 200 residents per estate', requiredPlan: 'Enterprise' },
    wallet_advanced: { title: 'Advanced Wallet', description: 'External payments & automated Paystack payouts', requiredPlan: 'Premium' },
    residents_unlimited: { title: 'Unlimited Residents', description: 'Manage unlimited residents per estate', requiredPlan: 'Premium' },
};

interface SubscriptionStore {
    plans: SubscriptionPlan[];
    current: CurrentSubscription | null;
    isLoadingPlans: boolean;
    isLoadingCurrent: boolean;
    showUpgradeModal: boolean;
    upgradeFeature: FeatureKey | null;

    fetchPlans: () => Promise<void>;
    fetchCurrent: (estateId?: string) => Promise<void>;
    initializePayment: (planId: string, communityManagerId: string, interval?: 'monthly' | 'annually', organizationId?: string, estateId?: string) => Promise<string>;
    subscribeWithWallet: (planId: string, interval: 'monthly' | 'annually', organizationId: string, estateId: string) => Promise<void>;
    getPlanTier: () => string;
    canUse: (feature: FeatureKey) => boolean;
    promptUpgrade: (feature: FeatureKey) => void;
    closeUpgradeModal: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
    persist(
        (set, get) => ({
            plans: [],
            current: null,
            isLoadingPlans: false,
            isLoadingCurrent: false,
            showUpgradeModal: false,
            upgradeFeature: null,

            fetchPlans: async () => {
                if (get().isLoadingPlans) return;
                set({ isLoadingPlans: true });
                try {
                    // Add cache-busting header to always get fresh plan data
                    const res = await api.get('/subscriptions/plans');
                    const data = res.data?.data;
                    if (Array.isArray(data) && data.length > 0) {
                        set({ plans: data });
                    }
                } catch { /* silent */ }
                finally { set({ isLoadingPlans: false }); }
            },

            fetchCurrent: async (estateId?: string) => {
                if (get().isLoadingCurrent) return;
                set({ isLoadingCurrent: true });
                try {
                    if (!estateId) { set({ isLoadingCurrent: false }); return; }
                    const res = await api.get(`/subscriptions/current/estates/${estateId}`);
                    const data = res.data?.data || null;
                    if (data) {
                        const planName = typeof data.planId === 'object'
                            ? data.planId?.name
                            : get().plans.find(p => p._id === data.planId)?.name;
                        set({ current: { ...data, _planName: planName?.toLowerCase() || '' } });
                    } else {
                        set({ current: null });
                    }
                } catch (err: any) {
                    // 404 = sub-user (viewer/security/account_manager) has no personal subscription
                    // Their plan is inherited from the estate OWNER
                    // The owner's subscription is stored in selectedCommunity via the EM layout
                    // We store a sentinel so canUse inherits from the estate's stored plan
                    if (err?.response?.status === 404 || err?.response?.status === 401) {
                        // Don't clear current — keep whatever was persisted (owner's plan)
                        // This allows sub-users to inherit the owner's plan from localStorage
                    } else {
                        set({ current: null });
                    }
                }
                finally { set({ isLoadingCurrent: false }); }
            },

            initializePayment: async (planId, communityManagerId, interval = 'monthly', organizationId?: string, estateId?: string) => {
                const callbackUrl = typeof window !== 'undefined'
                    ? `${window.location.origin}/subscription?ref=paystack`
                    : '';

                const payload = { interval, callbackUrl };

                const res = await api.post(
                    `/subscriptions/${planId}/initialize-payment/organizations/${organizationId}/estates/${estateId}`,
                    payload
                );
                return res.data?.data?.authorization_url || res.data?.data?.payment_url || '';
            },

            subscribeWithWallet: async (planId: string, interval: 'monthly' | 'annually', organizationId: string, estateId: string) => {
                const res = await api.post(
                    `/subscriptions/${planId}/pay-with-wallet/organizations/${organizationId}/estates/${estateId}`,
                    { interval }
                );
                const data = res.data?.data;
                if (data) {
                    const planName = typeof data.planId === 'object' ? data.planId?.name : get().plans.find(p => p._id === data.planId)?.name;
                    set({ current: { ...data, _planName: planName?.toLowerCase() || '' } });
                }
            },

            getPlanTier: () => {
                const { current, plans } = get();
                if (!current || current.status !== 'active') return 'free';
                if (current.endDate && new Date(current.endDate) < new Date()) return 'free';
                // Use cached _planName first (survives localStorage serialization)
                if ((current as any)._planName) return (current as any)._planName;
                const plan = current.planId as any;
                // planId can be a populated object {name:'Premium'} or a plain ObjectId string
                if (typeof plan === 'object' && plan !== null && plan?.name) {
                    return plan.name.toLowerCase();
                }
                // planId is a string ObjectId — look it up in plans[]
                if (typeof plan === 'string' && plans.length > 0) {
                    const found = plans.find(p => p._id === plan);
                    if (found) return found.name.toLowerCase();
                }
                return 'free';
            },

            canUse: (feature: FeatureKey) => {
                if (get().isLoadingCurrent) return true;
                const tier = get().getPlanTier();
                return (PLAN_FEATURES[tier] || PLAN_FEATURES.free).includes(feature);
            },

            promptUpgrade: (feature: FeatureKey) => set({ showUpgradeModal: true, upgradeFeature: feature }),
            closeUpgradeModal: () => set({ showUpgradeModal: false, upgradeFeature: null }),
        }),
        {
            name: 'homz-sub-v4',
            partialize: (state) => ({ current: state.current, plans: state.plans }),
        }
    )
);