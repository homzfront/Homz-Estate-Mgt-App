/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import PickEstate from './components/pickEstate';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import LoadingSpinner from '@/components/general/loadingSpinner';
import { useAuthSlice } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import UpgradeModal from '@/app/(dashboard)/components/upgrade-modal';
import FreePlanWelcomeModal from '@/app/(dashboard)/components/free-plan-welcome-modal';
import { defineAbilityFor } from '@/utils/ability';

// Map each route segment to the ability subject it requires
const ROUTE_PERMISSIONS: Record<string, { action: string; subject: string }> = {
    'dashboard': { action: 'read', subject: 'dashboard' },
    'manage-resident': { action: 'read', subject: 'residents' },
    'manage-users': { action: 'read', subject: 'settings' },
    'access-control': { action: 'read', subject: 'access-control' },
    'finance': { action: 'read', subject: 'finance' },
    'bill-utility': { action: 'read', subject: 'finance' },
    'maintenance': { action: 'read', subject: 'residents' },
    'settings': { action: 'read', subject: 'settings' },
    'subscription': { action: 'read', subject: 'settings' },
    'wallet': { action: 'read', subject: 'finance' },
    'kyc': { action: 'read', subject: 'settings' },
    'estate-info': { action: 'read', subject: 'estate' },
    'notifications': { action: 'read', subject: 'all' },
    'profile': { action: 'read', subject: 'profile' },
    'support': { action: 'read', subject: 'support' },
};

// Default landing page per role (where to redirect if access denied)
const ROLE_DEFAULT_PAGE: Record<string, string> = {
    owner: '/dashboard',
    admin: '/dashboard',
    viewer: '/dashboard',
    account_manager: '/dashboard',
    security: '/access-control',
    landlord: '/estate-info',
};

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const router = useRouter();

    const isSwitchingEstate = useSelectedCommunity((state) => state.isSwitchingEstate);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const { estatesData, estateLoading, communityProfile, getCommunityManaProfile, getEstates } = useAuthSlice();
    const setSelectedCommunity = useSelectedCommunity((state) => state.setSelectedCommunity);

    const { fetchCurrent, fetchPlans } = useSubscriptionStore();

    React.useEffect(() => {
        if (!communityProfile?._id || estatesData === null) {
            // First load: fetch full profile + estates together
            getCommunityManaProfile().catch(() => { });
        } else {
            // Profile already in store: silently refresh estates on every mount.
            // This ensures a role change made by an admin is reflected on the next
            // page load without requiring the affected user to log out and back in.
            getEstates().catch(() => { });
        }
        // Subscription fetched in separate effect once selectedCommunity is ready
        fetchPlans().catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch subscription once selectedCommunity (with estateId) is available
    React.useEffect(() => {
        const estId = selectedCommunity?.estate?._id;
        if (estId) {
            fetchCurrent(estId).catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCommunity?.estate?._id]);

    // When fresh estatesData arrives, keep selectedCommunity role in sync.
    // IMPORTANT: selectedCommunity must NOT be in the dep array — putting it there
    // causes an infinite loop because setSelectedCommunity creates a new object,
    // which changes selectedCommunity, which re-triggers this effect.
    // We use a ref to read the latest selectedCommunity without depending on it.
    const selectedCommunityRef = React.useRef(selectedCommunity);
    React.useEffect(() => {
        selectedCommunityRef.current = selectedCommunity;
    });

    React.useEffect(() => {
        if (!estatesData || estatesData.length === 0) return;

        const current = selectedCommunityRef.current;

        if (!current) {
            setSelectedCommunity(estatesData[0]);
            return;
        }

        // Find the fresh record for the currently selected estate
        const fresh = estatesData.find((e) => e._id === current._id);
        if (fresh && fresh.role !== current.role) {
            // Role was changed by an admin — update immediately so abilities recalculate
            setSelectedCommunity({ ...current, role: fresh.role });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estatesData]);

    const closeRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    // Route-level permission check — must be before any early returns (Rules of Hooks)
    const pathname = usePathname();
    const role = selectedCommunity?.role || (estatesData?.length === 0 ? 'owner' : '');
    React.useEffect(() => {
        if (!role || !pathname) return;
        const segment = pathname.split('/').filter(Boolean).find(s => ROUTE_PERMISSIONS[s]);
        if (!segment) return;
        const required = ROUTE_PERMISSIONS[segment];
        const ability = defineAbilityFor(role);
        if (!ability.can(required.action as any, required.subject as any)) {
            const redirectTo = ROLE_DEFAULT_PAGE[role] || '/dashboard';
            if (!pathname.endsWith(redirectTo)) {
                router.replace(redirectTo);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, role]);

    // Only block render while actively fetching AND we have no data yet
    // Don't block rendering on form pages that manage their own state
    const skipSpinner = pathname?.includes('/add-estate') || pathname?.includes('/estate-info');

    // Once estatesData is set (even []) let children render and handle their own state
    if (!skipSpinner && estateLoading && estatesData === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="p-6 flex flex-col items-center gap-3">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (

        <div className='dashboard_main relative md:min-w-[1200px]'>
            {/* Global estate switching loader */}
            {isSwitchingEstate && (
                <div className="fixed inset-0 z-[999999999] bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-xl">
                        <LoadingSpinner />
                        <p className="text-GrayHomz text-sm">Switching estate...</p>
                    </div>
                </div>
            )}
            {openEstateList && (
                <div className="absolute inset-0 z-[99999999] bg-black bg-opacity-50 flex justify-start">
                    <div className="w-full h-fit mt-[190px] ml-[25px] shadow-lg">
                        <PickEstate closeRef={closeRef} />
                    </div>
                </div>
            )}
            {children}
            <UpgradeModal />
            <FreePlanWelcomeModal />
        </div>
    )
}

export default Layout;