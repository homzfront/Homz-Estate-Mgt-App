/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import CustomModal from '@/components/general/customModal';
import PickEstate from './components/pickEstate';
import PendingEstateRequest from './components/pendingEstateRequest';
import { useSelectedEsate } from '@/store/useSelectedEstate';

// Routes only accessible to primary resident + co-owner
const FULL_ACCESS_ROUTES = [
    '/resident/bills-payments',
    '/resident/wallet',
    '/resident/maintenance',
    '/resident/notifications',
    '/resident/co-residents',
];

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList, openPendingModal, setOpenPendingModal } = useOpenCommunityListStore();
    const closeRef = React.useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);

    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    // Route-level guard for resident roles
    React.useEffect(() => {
        if (!selectedEstate?.role) return;
        const role = selectedEstate.role;
        const isFullAccess = ['resident', 'co-owner'].includes(role);
        if (!isFullAccess && pathname) {
            const restricted = FULL_ACCESS_ROUTES.some(r => pathname.startsWith(r));
            if (restricted) router.replace('/resident/visitor-access');
        }
    }, [pathname, selectedEstate?.role]);

    return (

        <div className='dashboard_main relative'>
            {openEstateList && (
                <div className="absolute inset-0 z-[99999999] bg-black bg-opacity-50 flex justify-start">
                    <div className="w-full h-fit mt-[185px] ml-[25px] shadow-lg">
                        <PickEstate closeRef={closeRef} setOpenPendingModal={setOpenPendingModal} />
                    </div>
                </div>
            )}
            {openPendingModal && (
                <CustomModal onRequestClose={() => setOpenPendingModal(false)} isOpen={openPendingModal}>
                    <PendingEstateRequest setOpenPendingModal={setOpenPendingModal} />
                </CustomModal>
            )}
            {children}
        </div>
    )
}

export default Layout;