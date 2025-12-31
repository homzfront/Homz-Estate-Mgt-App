/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import CustomModal from '@/components/general/customModal';
import PickEstate from './components/pickEstate';
import PendingEstateRequest from './components/pendingEstateRequest';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList, openPendingModal, setOpenPendingModal } = useOpenCommunityListStore();
    const closeRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    return (

        <div className='dashboard_main relative md:min-w-[1200px]'>
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