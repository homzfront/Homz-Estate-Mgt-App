/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import PickEstate from './components/pickEstate';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import LoadingSpinner from '@/components/general/loadingSpinner';
import { useAuthSlice } from '@/store/authStore';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();

    const isSwitchingEstate = useSelectedCommunity((state) => state.isSwitchingEstate);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const { estatesData, estateLoading, communityProfile, getCommunityManaProfile, getEstates } = useAuthSlice();
    const setSelectedCommunity = useSelectedCommunity((state) => state.setSelectedCommunity);

    React.useEffect(() => {
        if (!communityProfile?._id || estatesData === null) {
            // First load: fetch full profile + estates together
            getCommunityManaProfile().catch(() => {});
        } else {
            // Profile already in store: silently refresh estates on every mount.
            // This ensures a role change made by an admin is reflected on the next
            // page load without requiring the affected user to log out and back in.
            getEstates().catch(() => {});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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


    // Only block render while actively fetching AND we have no data yet
    const pathname = usePathname();
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
        </div>
    )
}

export default Layout;