/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import ArrowDown from '@/components/icons/arrowDown';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
// import SupportIcon from '@/components/icons/estateManager&Resident/desktop/supportIcon';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import VisitorShield from '@/components/icons/estateManager&Resident/desktop/visitorShield';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import Profile16Icon from '@/components/icons/estateManager&Resident/desktop/profile16Icon';
import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import api from '@/utils/api';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useAuthSlice } from '@/store/authStore';

const Data = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: (
            <DashboardIcon className='#FFFFFF' />
        ),
        link: "/resident/dashboard",
        name: "Dashboard",
        active: false,
    },
    {
        id: 2,
        image: <VisitorShield />,
        image2: (
            <VisitorShield className='#FFFFFF' />
        ),
        link: "/resident/visitor-access",
        name: "Visitor Access",
        active: false,
    },
    {
        id: 3,
        image: <DuesAndPaymentIcon />,
        image2: (
            <DuesAndPaymentIcon className='#FFFFFF' />
        ),
        link: "/resident/dues-payments",
        name: "Dues & Payments",
            active: false,
            comingSoon: true,
    },
    {
        id: 4,
        image: <Profile16Icon />,
        image2: (
            <Profile16Icon className='#FFFFFF' />
        ),
        link: "/resident/profile",
        name: "Profile",
        active: false,
    },
    {
        id: 5,
        image: <SettingsIcon w={"16"} h={"16"} className='#4E4E4E' />,
        image2: (
            <SettingsIcon w={"16"} h={"16"} className='#FFFFFF' />
        ),
        link: "/resident/settings",
        name: "Settings",
        active: false,
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const { setOpenEstateList } = useOpenCommunityListStore();
    const { userData, getResidentProfile } = useAuthSlice();
    const userID = userData?._id;
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
    const { residentCommunity, setResidentCommunity } = useResidentCommunity();

    const fetchResidentEstate = async () => {
        try {
            const response: any = await api.get(`estates/resident/all-estates/users/${userID}`);
            // console.log("Resident Estate Response:", response);
            setResidentCommunity(response?.data?.data?.estates?.results)
        } catch (error) {
            console.error("Error fetching resident estates:", error);
        }
    }

    React.useEffect(() => {
        if (userData) {
            fetchResidentEstate();
        }
    }, [userData]);

    React.useEffect(() => {
        if (selectedEstate) {
            getResidentProfile(selectedEstate?.associatedIds?.residentId);
        }
    }, [getResidentProfile, selectedEstate]);

    React.useEffect(() => {
        if (!selectedEstate && residentCommunity && residentCommunity.length > 0) {
            setSelectedEstate(residentCommunity?.[0]);
        }
    }, [selectedEstate, residentCommunity, setSelectedEstate]);

    const isActive = (data: any, pathname: string) => {
        // 1. First check if the full path matches exactly
        if (data.link === pathname) return true;

        // 2. If no exact match, check the base path (without the last segment)
        const basePath = pathname.split('/').slice(0, -1).join('/');

        if (data.link === basePath) return true;

        // 3. Check submenu items (full path first, then base path)
        if (data.submenu && data.subMenuItems) {
            return data.subMenuItems.some((item: any) =>
                item.link === pathname || item.link === basePath
            );
        }
        return false;
    };

    return (
        <div className={`sidebar relative`}>
            <div className="shadow-lg">
                <div className="w-full h-[1024px] px-6 flex flex-col py-10">
                    <Link href={"/"} className='w-full mt-2'>
                        <Image
                            height={27}
                            width={131}
                            src="/Homz-pc-icon.png"
                            alt='homz-pix'
                        />
                    </Link>

                    <button onClick={() => setOpenEstateList(true)} className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[62px] rounded-[4px]'>
                        <div className='flex gap-2 items-center'>
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                    src={"/houses.jpg"}
                                    alt={"estate-img"}
                                    width={24}
                                    height={24}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className='flex flex-col'>
                                <p>{selectedEstate ? selectedEstate?.estateName : ""}</p>
                                <span className='text-xs'>
                                    {/* [Block 6], [Apartment 1] */}
                                </span>
                            </div>
                        </div>
                        <div className='mt-1.5'>
                            <ArrowDown size={20} className='#4E4E4E' />
                        </div>
                    </button>
                    <div className='h-[70%] flex flex-col justify-between mt-10'>
                        <div className="flex flex-col gap-3">
                                {Data?.slice(0, 3).map((data) => {
                                    if (data.comingSoon) {
                                        return (
                                            <div
                                                key={data.id}
                                                className={`h-[40px] px-2 flex justify-center items-center rounded-md gap-[12px] text-GrayHomz text-[16px] font-[500] opacity-50 cursor-not-allowed relative group`}
                                            >
                                                <div>{data.image}</div>
                                                <div className="flex items-center w-full">
                                                    <span className="w-[150px] text-start">
                                                        {data.name}
                                                    </span>
                                                </div>
                                                <div className="absolute right-2 top-[10px] -translate-y-1/2 ml-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    Coming Soon
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={data.id}
                                            href={data.link}
                                            className={`h-[40px] px-2 flex justify-center items-center rounded-md gap-[12px] text-GrayHomz text-[16px] font-[500] ${isActive(data, pathname)
                                                ? "bg-BlueHomz text-white"
                                                : " hover:bg-whiteblue"
                                                } `}
                                        >
                                            {isActive(data, pathname) ? (
                                                <div className={``}>
                                                    {data.image2}
                                                </div>
                                            ) : (
                                                <div className={``}>
                                                    {data.image}
                                                </div>
                                            )}
                                            <div className="flex items-center w-full">
                                                <span className="w-[150px] text-start">
                                                    {data.name}
                                                </span>
                                                <p
                                                    className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                                        } mt-1 ml-1 h-2 w-2 rounded-full`}
                                                ></p>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                        <div className="flex flex-col gap-3">
                            {Data?.slice(3, 5).map((data) =>
                            (
                                <Link
                                    key={data.id}
                                    href={data.link}
                                    className={`h-[40px] px-2 flex justify-center items-center rounded-md gap-[12px] text-GrayHomz text-[16px] font-[500] ${isActive(data, pathname)
                                        ? "bg-BlueHomz text-white"
                                        : " hover:bg-whiteblue"
                                        } `}
                                >
                                    {isActive(data, pathname) ? (
                                        <div className={``}>
                                            {data.image2}
                                        </div>
                                    ) : (
                                        <div className={``}>
                                            {data.image}
                                        </div>
                                    )}
                                    <div className="flex items-center w-full">
                                        <span className="w-[150px] text-start">
                                            {data.name}
                                        </span>
                                        <p
                                            className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                                } mt-1 ml-1 h-2 w-2 rounded-full`}
                                        ></p>
                                    </div>
                                </Link>
                            )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar