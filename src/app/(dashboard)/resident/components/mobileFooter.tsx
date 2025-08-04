"use client"
import CustomModal from '@/components/general/customModal';
import DashboardIcon from '@/components/icons/estateManager&Resident/mobile/dashboardIcon';
import MoreIcon from '@/components/icons/estateManager&Resident/mobile/moreIcon';
import NotiIcon from '@/components/icons/estateManager&Resident/mobile/notiIcon';
import ProfileIcon from '@/components/icons/estateManager&Resident/mobile/profileIcon';
// import SupportIcon from '@/components/icons/estateManager&Resident/mobile/supportIcon';
import MobileClose from '@/components/icons/estateManager&Resident/mobile/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import LogoutIcon from '@/components/icons/estateManager&Resident/mobile/logout';
import VisitorAccess from '@/components/icons/estateManager&Resident/mobile/visitorAccess';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';

interface DataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string;
    name: string;
    extra: boolean;
}

const Data = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: (
            <DashboardIcon className='#006AFF' />
        ),
        link: "/resident/dashboard",
        name: "Dashboard",
        extra: false,
    },
    {
        id: 2,
        image: <VisitorAccess />,
        image2: (
            <VisitorAccess className='#006AFF' />
        ),
        link: "/resident/visitor-access",
        name: "Visitor Access",
        extra: false,
    },
    {
        id: 3,
        image: <DuesAndPaymentIcon className="#202020" />,
        image2: (
            <DuesAndPaymentIcon className='#006AFF' />
        ),
        link: "/resident/dues-payments",
        name: "Dues & Payments",
        extra: false,
    },
    {
        id: 4,
        image: <MoreIcon />,
        image2: <MoreIcon className='#006AFF' />,
        link: null,
        name: "More",
        extra: true,
    }
];

const PopUpData = [
    // {
    //     id: 1,
    //     image: <SupportIcon />,
    //     image2: <SupportIcon className='#006AFF' />,
    //     link: "/resident/support",
    //     name: "Support"
    // },
    {
        id: 2,
        image: <NotiIcon />,
        image2: <NotiIcon className='#006AFF' />,
        link: "/resident/notification-page",
        name: "Notifications",
        coming_Soon: true,
    },
    {
        id: 3,
        image: <ProfileIcon />,
        image2: <ProfileIcon className='#006AFF' />,
        link: "/resident/profile",
        name: "Profile"
    },
    {
        id: 4,
        image: <LogoutIcon />,
        image2: <LogoutIcon />,
        link: "",
        name: "Logout"
    }
];

const MobileFooter = () => {
    const pathname = usePathname();
    const [subOpen, setSubOpen] = React.useState<DataType | null>(null);

    return (
        <div className='mobile-footer'>
            {
                subOpen &&
                <CustomModal onRequestClose={() => setSubOpen(null)} isOpen={subOpen?.extra}>
                    <div className='w-full max-w-[350px] mx-auto bg-white p-4 border border-[#E6E6E6] rounded-[12px] flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm font-normal text-BlackHomz'>More</p>
                            <button onClick={() => setSubOpen(null)}
                            >
                                <MobileClose />
                            </button>
                        </div>
                        <div className='grid grid-cols-3 justify-between gap-4 items-center'>
                            {
                                PopUpData.map((data) => (
                                    <Link href={data.link} key={data.id} className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} flex justify-center items-center rounded-[8px] p-1 h-[74px] w-[95px] ${data?.name !== "Logout" ? "bg-[#F6F6F6]" : "bg-[#FDF2F2]"} text-[11px] font-[400] ${pathname === data.link
                                        ? "text-BlueHomz"
                                        : "text-GrayHomz"
                                        } 
                                    `}>
                                        <span className={`flex flex-col gap-1 items-center truncate ${data?.name === "Logout" ? "text-error" : ""}`}>
                                            {pathname === data.link ? (
                                                <div>
                                                    {data.image2}
                                                </div>
                                            ) : (
                                                <div>
                                                    {data.image}
                                                </div>
                                            )}
                                            {data.name}
                                        </span>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </CustomModal>
            }
            <div className='flex justify-between items-center px-4'>
                {Data.map((data) => (
                    <Link
                        key={data.id}
                        href={data?.link ? data.link : ""}
                        onClick={() => {
                            if (data?.extra) {
                                setSubOpen(data as DataType)
                            }
                        }}
                        className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${pathname === data.link
                            ? "text-BlueHomz"
                            : "text-GrayHomz"
                            } `}
                    >
                        {pathname === data.link ? (
                            <div>
                                {data.image2}
                            </div>
                        ) : (
                            <div>
                                {data.image}
                            </div>
                        )}
                        <div className={`flex items-center w-full truncate`}>
                            <span>{data.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MobileFooter