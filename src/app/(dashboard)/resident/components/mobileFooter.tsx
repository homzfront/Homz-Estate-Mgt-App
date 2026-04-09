"use client"
import CustomModal from '@/components/general/customModal';
import AccessControlIcon from '@/components/icons/estateManager&Resident/mobile/accessControlIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/mobile/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager&Resident/mobile/expensesIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/mobile/settingsIcon';
import MobileClose from '@/components/icons/estateManager&Resident/mobile/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import LogoutIcon from '@/components/icons/estateManager&Resident/mobile/logout';
import { useAuthSlice } from '@/store/authStore';
import MoreIcon from '@/components/icons/estateManager&Resident/mobile/moreIcon';
import UserTick from '@/components/icons/userTick';

interface DataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string | null;
    name: string;
    extra: boolean;
}

interface PopUpDataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string;
    name: string;
    coming_Soon?: boolean;
}

const Data: DataType[] = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: <DashboardIcon className='#006AFF' />,
        link: "/resident/dashboard",
        name: "Dashboard",
        extra: false,
    },
    {
        id: 2,
        image: <AccessControlIcon />,
        image2: <AccessControlIcon className='#006AFF' />,
        link: "/resident/visitor-access",
        name: "Visitors",
        extra: false,
    },
    {
        id: 3,
        image: <ExpensesIcon />,
        image2: <ExpensesIcon className='#006AFF' />,
        link: "/resident/bills-payments",
        name: "Bills",
        extra: false,
    },
    {
        id: 4,
        image: <SettingsIcon />,
        image2: <SettingsIcon className='#006AFF' />,
        link: "/resident/settings",
        name: "Settings",
        extra: false,
    },
    {
        id: 5,
        image: <MoreIcon />,
        image2: <MoreIcon className='#006AFF' />,
        link: null,
        name: "More",
        extra: true,
    }
];

const PopUpData: PopUpDataType[] = [
    {
        id: 1,
        image: <UserTick color={"#202020"} width="21" height="21" />,
        image2: <UserTick color={"#006AFF"} width="21" height="21" />,
        link: '/resident/profile',
        name: 'Profile',
        coming_Soon: false,
    },
    {
        id: 2,
        image: <LogoutIcon />,
        image2: <LogoutIcon />,
        link: "",
        name: "Logout",
    }
];

const MobileFooter = () => {
    const { logOutUser } = useAuthSlice();
    const pathname = usePathname();
    const [subOpen, setSubOpen] = React.useState<DataType | null>(null);
    const moreRoutes = ['/resident/profile'];

    const isRouteActive = (link: string) => {
        if (pathname === link) return true;
        if (link !== null && pathname.startsWith(link + '/')) return true;
        return false;
    };

    const isMoreActive = () => moreRoutes.some((r) => pathname.startsWith(r));

    return (
        <>
            {subOpen && (
                <CustomModal onRequestClose={() => setSubOpen(null)} isOpen={subOpen?.extra}>
                    <div className='w-full max-w-[350px] mx-auto bg-white p-4 border border-[#E6E6E6] rounded-[12px] flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm font-normal text-BlackHomz'>More</p>
                            <button onClick={() => setSubOpen(null)}>
                                <MobileClose />
                            </button>
                        </div>
                        <div className='grid grid-cols-4 justify-between gap-4 items-center'>
                            {PopUpData.map((data) => (
                                <Link
                                    href={data.link}
                                    key={data.id}
                                    onClick={async () => {
                                        if (data?.name === "Logout") logOutUser();
                                        setSubOpen(null);
                                    }}
                                    className={`flex justify-center items-center rounded-[8px] p-1 h-[58px] w-[66px] ${data?.name !== "Logout" ? "bg-[#F6F6F6]" : "bg-[#FDF2F2]"} text-[11px] font-[400] ${pathname === data.link ? "text-BlueHomz" : "text-GrayHomz"}`}
                                >
                                    <span className={`flex flex-col gap-1 items-center truncate ${data?.name === "Logout" ? "text-error" : ""}`}>
                                        {pathname === data.link ? data.image2 : data.image}
                                        {data.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CustomModal>
            )}

            {/* Footer fixed at bottom */}
            <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50 md:hidden'>
                {Data.map((data) => {
                    const isActive = data.extra ? isMoreActive() : isRouteActive(data.link ?? "/");
                    return (
                        <Link
                            key={data.id}
                            href={data?.link ? data.link : ""}
                            onClick={() => {
                                if (data?.extra) setSubOpen(data);
                            }}
                            className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${isActive ? "text-BlueHomz" : "text-GrayHomz"}`}
                        >
                            {isActive ? data.image2 : data.image}
                            <span>{data.name}</span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default MobileFooter;