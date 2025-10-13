/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import PickEstate from './components/pickEstate';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import LoadingSpinner from '@/components/general/loadingSpinner';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const isSwitchingEstate = useSelectedCommunity((state) => state.isSwitchingEstate);
    const closeRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    return (

        <div className='dashboard_main relative'>
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
                    <div className="w-full h-fit mt-[170px] ml-[25px] shadow-lg">
                        <PickEstate closeRef={closeRef} />
                    </div>
                </div>
            )}
            {children}
        </div>
    )
}

export default Layout;