"use client"
import React from 'react'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import useClickOutside from '@/app/utils/useClickOutside';
import PickEstate from './components/pickEstate';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const closeRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    return (

        <div className='dashboard_main relative'>
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