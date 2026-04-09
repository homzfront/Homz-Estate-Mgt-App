"use client"
import CustomModal from '@/components/general/customModal';
import AccessControlIcon from '@/components/icons/estateManager&Resident/mobile/accessControlIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/mobile/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager&Resident/mobile/expensesIcon';
import ResidentIcon from '@/components/icons/estateManager&Resident/mobile/residentIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/mobile/settingsIcon';
import MobileClose from '@/components/icons/estateManager&Resident/mobile/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import LogoutIcon from '@/components/icons/estateManager&Resident/mobile/logout';
import { useAuthSlice } from '@/store/authStore';
import MoreIcon from '@/components/icons/estateManager&Resident/mobile/moreIcon';
import UserTick from '@/components/icons/userTick';
import { useAbility } from '@/contexts/AbilityContext';
import { Subjects } from '@/utils/ability';

interface DataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string | null;
    name: string;
    extra: boolean;
    subject?: Subjects;
}

interface PopUpDataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string;
    name: string;
    coming_Soon?: boolean;
    subject?: Subjects;
}

const Data: DataType[] = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: <DashboardIcon className='#006AFF' />,
        link: "/dashboard",
        name: "Dashboard",
        extra: false,
        subject: 'dashboard',
    },
    {
        id: 2,
        image: <ResidentIcon />,
        image2: <ResidentIcon className='#006AFF' />,
        link: "/manage-resident/residents",
        name: "Residents",
        extra: false,
        subject: 'residents',
    },
    {
        id: 3,
        image: <AccessControlIcon />,
        image2: <AccessControlIcon className='#006AFF' />,
        link: "/access-control",
        name: "Access Control",
        extra: false,
        subject: 'access-control',
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

const PopUpData: PopUpDataType[] = [
    {
        id: 1,
        image: <UserTick color={"#202020"} width="21" height="21" />,
        image2: <UserTick color={"#006AFF"} width="21" height="21" />,
        link: '/manage-resident/request',
        name: 'Requests',
        coming_Soon: false,
        subject: 'residents',
    },
    {
        id: 3,
        image: <ExpensesIcon />,
        image2: <ExpensesIcon className='#006AFF' />,
        link: "/finance/bill-utility",
        name: "Billing",
        coming_Soon: false,
        subject: 'finance',
    },
    {
        id: 7,
        image: <SettingsIcon />,
        image2: <SettingsIcon className='#006AFF' />,
        link: "/settings",
        name: "Settings",
        coming_Soon: false,
        subject: 'settings',
    },
    {
        id: 8,
        image: <LogoutIcon />,
        image2: <LogoutIcon />,
        link: "",
        name: "Logout",
        subject: undefined,
    }
];

const MobileFooter = () => {
    const { logOutUser } = useAuthSlice();
    const pathname = usePathname();
    const ability = useAbility();
    const [subOpen, setSubOpen] = React.useState<DataType | null>(null);
    const moreRoutes = ['/manage-resident/request', '/finance/payment', '/finance/bill-utility', '/settings'];

    const isRouteActive = (link: string) => {
        if (pathname === link) return true;
        if (link === '/manage-resident/residents' && pathname.startsWith('/manage-resident/residents/')) {
            return true;
        }
        return false;
    };

    const isMoreActive = () => moreRoutes.includes(pathname);

    // Filter bottom nav items by permission
    const filteredData = Data.filter((item) => {
        if (item.extra) return true; // "More" visibility decided below
        if (!item.subject) return true;
        return ability.can('read', item.subject);
    });

    // Filter the "More" popup items by permission
    const filteredPopUpData = PopUpData.filter((item) => {
        if (item.name === 'Logout') return true; // always show logout
        if (!item.subject) return true;
        return ability.can('read', item.subject);
    });

    // Only show "More" if there's at least one non-Logout item inside it
    const hasMoreContent = filteredPopUpData.some((i) => i.name !== 'Logout');

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
                            {filteredPopUpData.map((data) => (
                                <Link
                                    href={data.link}
                                    key={data.id}
                                    onClick={async () => {
                                        if (data?.name === "Logout") logOutUser();
                                        setSubOpen(null);
                                    }}
                                    className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} flex justify-center items-center rounded-[8px] p-1 h-[58px] w-[66px] ${data?.name !== "Logout" ? "bg-[#F6F6F6]" : "bg-[#FDF2F2]"} text-[11px] font-[400] ${pathname === data.link ? "text-BlueHomz" : "text-GrayHomz"}`}
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
                {filteredData
                    .filter((item) => !item.extra || hasMoreContent)
                    .map((data) => {
                        const isActive = data.extra ? isMoreActive() : isRouteActive(data.link ?? "/");

                        return (
                            <Link
                                key={data.id}
                                href={data?.link ? data.link : ""}
                                onClick={() => {
                                    if (data?.extra) setSubOpen(data);
                                    else if (data?.name === "Logout") logOutUser();
                                }}
                                className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${isActive ? "text-BlueHomz" : data?.name === "Logout" ? "text-error" : "text-GrayHomz"}`}
                            >
                                {isActive ? data.image2 : data.image}
                                <div className='flex items-center w-full truncate'>
                                    <span>{data.name}</span>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </>
    );
};

export default MobileFooter;