"use client"
import CustomModal from '@/components/general/customModal';
import AccessControlIcon from '@/components/icons/estateManager/mobile/accessControlIcon';
import DashboardIcon from '@/components/icons/estateManager/mobile/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager/mobile/expensesIcon';
import MoreIcon from '@/components/icons/estateManager/mobile/moreIcon';
import NotiIcon from '@/components/icons/estateManager/mobile/notiIcon';
import PaymentIcon from '@/components/icons/estateManager/mobile/paymentIcon';
import ProfileIcon from '@/components/icons/estateManager/mobile/profileIcon';
import ResidentIcon from '@/components/icons/estateManager/mobile/residentIcon';
import SettingsIcon from '@/components/icons/estateManager/mobile/settingsIcon';
import SupportIcon from '@/components/icons/estateManager/mobile/supportIcon';
import UsersIcon from '@/components/icons/estateManager/mobile/usersIcon';
import MobileClose from '@/components/icons/estateManager/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

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
        link: "/dashboard",
        name: "Dashboard",
        extra: false,
    },
    {
        id: 2,
        image: <ResidentIcon />,
        image2: (
            <ResidentIcon className='#006AFF' />
        ),
        link: "/manage-resident",
        name: "Residents",
        extra: false,
    },
    {
        id: 3,
        image: <AccessControlIcon />,
        image2: (
            <AccessControlIcon className='#006AFF' />
        ),
        link: "/access-control",
        name: "Access Control",
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
    {
        id: 1,
        image: <PaymentIcon />,
        image2: (
            <PaymentIcon className='#006AFF' />
        ),
        link: "/finance/payment",
        name: "Payments"
    },
    {
        id: 2,
        image: <ExpensesIcon />,
        image2: (
            <ExpensesIcon className='#006AFF' />
        ),
        link: "/finance/expense",
        name: "Expenses"
    },
    {
        id: 3,
        image: <UsersIcon />,
        image2: (
            <UsersIcon className='#006AFF' />
        ),
        link: "/manage-users",
        name: "Users"
    },
    {
        id: 4,
        image: <SupportIcon />,
        image2: <SupportIcon className='#006AFF' />,
        link: "/support",
        name: "Support"
    },
    {
        id: 5,
        image: <NotiIcon />,
        image2: <NotiIcon className='#006AFF' />,
        link: "/notification-page",
        name: "Notifi..."
    },
    {
        id: 6,
        image: <ProfileIcon />,
        image2: <ProfileIcon className='#006AFF' />,
        link: "/profile",
        name: "Profile"
    },
    {
        id: 7,
        image: <SettingsIcon />,
        image2: <SettingsIcon className='#006AFF' />,
        link: "/settings",
        name: "Settings"
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
                        <div className='grid grid-cols-4 justify-between gap-4 items-center'>
                            {
                                PopUpData.map((data) => (
                                    <Link href={data.link} key={data.id} className={`flex justify-center items-center rounded-[8px] p-1 h-[58px] w-[66px] bg-[#F6F6F6] text-[11px] font-[400] ${pathname === data.link
                                        ? "text-BlueHomz"
                                        : "text-GrayHomz"
                                        } 
                                    `}>
                                        <span className='flex flex-col gap-1 items-center'>
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
                        <div className="flex items-center w-full truncate">
                            <span>{data.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MobileFooter