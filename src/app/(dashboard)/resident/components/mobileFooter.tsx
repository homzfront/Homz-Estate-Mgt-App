"use client"
import CustomModal from '@/components/general/customModal';
import DashboardIcon from '@/components/icons/estateManager&Resident/mobile/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager&Resident/mobile/expensesIcon';
import AccessControlIcon from '@/components/icons/estateManager&Resident/mobile/accessControlIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/mobile/settingsIcon';
import MobileClose from '@/components/icons/estateManager&Resident/mobile/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import LogoutIcon from '@/components/icons/estateManager&Resident/mobile/logout';
import { useAuthSlice } from '@/store/authStore';
import MoreIcon from '@/components/icons/estateManager&Resident/mobile/moreIcon';
import Profile16Icon from '@/components/icons/estateManager&Resident/desktop/profile16Icon';
import ManageUserIcon from '@/components/icons/estateManager&Resident/desktop/manageUserIcon';
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon';
import MaintenanceIcon from '@/components/icons/maintenanceIcon';
import { useNotificationStore } from '@/store/useNotificationStore';

const Data = [
    { id: 1, image: <DashboardIcon />, image2: <DashboardIcon className='#006AFF' />, link: "/resident/dashboard", name: "Dashboard", extra: false },
    { id: 2, image: <AccessControlIcon />, image2: <AccessControlIcon className='#006AFF' />, link: "/resident/visitor-access", name: "Visitors", extra: false },
    { id: 3, image: <ExpensesIcon />, image2: <ExpensesIcon className='#006AFF' />, link: "/resident/bills-payments", name: "Bills", extra: false },
    { id: 4, image: <MoreIcon />, image2: <MoreIcon className='#006AFF' />, link: null, name: "More", extra: true },
];

const ResidentMobileFooter = () => {
    const { logOutUser } = useAuthSlice();
    const [showLogout, setShowLogout] = React.useState(false);
    const pathname = usePathname();
    const { unreadCount } = useNotificationStore();
    const [moreOpen, setMoreOpen] = React.useState(false);

    const moreRoutes = ['/resident/maintenance', '/resident/notifications', '/resident/co-residents', '/resident/settings', '/resident/profile'];
    const isRouteActive = (link: string) => !!link && (pathname === link || pathname.startsWith(link + '/'));
    const isMoreActive = () => moreRoutes.some(r => isRouteActive(r));

    const popupItems = [
        { id: 1, image: <MaintenanceIcon />, image2: <MaintenanceIcon className='#006AFF' />, link: "/resident/maintenance", name: "Maintenance" },
        { id: 2, image: <NotiIcon />, image2: <NotiIcon className='#006AFF' />, link: "/resident/notifications", name: "Notifs", badge: unreadCount },
        { id: 3, image: <ManageUserIcon />, image2: <ManageUserIcon className='#006AFF' classNameII='#006AFF' />, link: "/resident/co-residents", name: "Invite" },
        { id: 4, image: <SettingsIcon />, image2: <SettingsIcon className='#006AFF' />, link: "/resident/settings/hub", name: "Settings" },
        { id: 5, image: <Profile16Icon />, image2: <Profile16Icon className='#006AFF' />, link: "/resident/profile", name: "Profile" },
        { id: 6, image: <LogoutIcon />, image2: <LogoutIcon />, link: "", name: "Logout" },
    ];

    return (
        <>
            {moreOpen && (
                <CustomModal onRequestClose={() => setMoreOpen(false)} isOpen={moreOpen}>
                    <div className='w-full max-w-[350px] mx-auto bg-white p-4 border border-[#E6E6E6] rounded-[12px] flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm font-normal text-BlackHomz'>More</p>
                            <button onClick={() => setMoreOpen(false)}><MobileClose /></button>
                        </div>
                        <div className='grid grid-cols-4 gap-4 items-center'>
                            {popupItems.map((data) => (
                                <Link
                                    href={data.link}
                                    key={data.id}
                                    onClick={() => { if (data.name === "Logout") { setShowLogout(true); setMoreOpen(false); } else setMoreOpen(false); }}
                                    className={`flex justify-center items-center rounded-[8px] p-1 h-[58px] w-[66px] ${data.name !== "Logout" ? "bg-[#F6F6F6]" : "bg-[#FDF2F2]"} text-[11px] font-[400]`}
                                >
                                    <span className={`relative flex flex-col gap-1 items-center truncate ${data.name === "Logout" ? "text-error" : isRouteActive(data.link) ? "text-BlueHomz" : "text-GrayHomz"}`}>
                                        {isRouteActive(data.link) ? data.image2 : data.image}
                                        {'badge' in data && (data as any).badge > 0 ? (
                                            <span className='absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
                                                {(data as any).badge > 9 ? '9+' : (data as any).badge}
                                            </span>
                                        ) : null}
                                        {data.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CustomModal>
            )}

            <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50 md:hidden'>
                {Data.map((data) => {
                    const active = data.extra ? isMoreActive() : isRouteActive(data.link ?? "/");
                    if (data.extra) {
                        return (
                            <button key={data.id} onClick={() => setMoreOpen(true)} className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${active ? "text-BlueHomz" : "text-GrayHomz"}`}>
                                {active ? data.image2 : data.image}
                                <span>{data.name}</span>
                            </button>
                        );
                    }
                    return (
                        <Link key={data.id} href={data.link ?? ""} className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${active ? "text-BlueHomz" : "text-GrayHomz"}`}>
                            {active ? data.image2 : data.image}
                            <span>{data.name}</span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default ResidentMobileFooter;