/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import ArrowDown from '@/components/icons/arrowDown';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import ManageUserIcon from '@/components/icons/estateManager&Resident/desktop/manageUserIcon';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import VisitorShield from '@/components/icons/estateManager&Resident/desktop/visitorShield';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import Profile16Icon from '@/components/icons/estateManager&Resident/desktop/profile16Icon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import LogoutConfirmationModal from '@/components/general/LogoutConfirmationModal';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import api from '@/utils/api';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useAuthSlice } from '@/store/authStore';
import InitialsAvatar from '@/components/general/InitialsAvatar';
import { useSidebarStore } from '@/store/useSidebarStore';
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon';
import MaintenanceIcon from '@/components/icons/maintenanceIcon';
import { useNotificationStore } from '@/store/useNotificationStore';

function NavLink({ href, label, icon, iconActive, active, isCollapsed, badge }: {
    href: string; label: string; icon: React.ReactNode; iconActive: React.ReactNode;
    active: boolean; isCollapsed: boolean; badge?: number;
}) {
    return (
        <Link href={href} title={isCollapsed ? label : ''} className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] transition-colors ${active ? 'bg-BlueHomz text-white' : 'text-GrayHomz hover:bg-whiteblue'}`}>
            {active ? iconActive : icon}
            {!isCollapsed && (
                <div className='flex items-center justify-between flex-1'>
                    <span>{label}</span>
                    {badge && badge > 0 ? <span className='bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>{badge > 9 ? '9+' : badge}</span> : null}
                </div>
            )}
        </Link>
    );
}

const Sidebar = () => {
    const pathname = usePathname();
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const { userData, getResidentProfile, logOutUser } = useAuthSlice();
    const userID = userData?._id;
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
    const { residentCommunity, setResidentCommunity } = useResidentCommunity();
    const { isCollapsed, toggleCollapsed } = useSidebarStore();
    const { unreadCount } = useNotificationStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const fetchResidentEstate = async () => {
        try {
            const response: any = await api.get(`estates/resident/all-estates/users/${userID}`, {
                params: { limit: 100 }
            });
            const allEstates = response?.data?.data?.estates?.results || [];

            // Deduplicate by estateId + role - keep most recent record per estate
            // This handles the case where duplicate records exist in the DB
            const seen = new Map<string, any>();
            for (const estate of allEstates) {
                const key = estate.estateId;
                const existing = seen.get(key);
                // Prefer the primary 'resident' role, otherwise keep newest
                if (!existing || estate.role === 'resident' ||
                    new Date(estate.createdAt) > new Date(existing.createdAt)) {
                    seen.set(key, estate);
                }
            }
            setResidentCommunity(Array.from(seen.values()));
        } catch { /* silent */ }
    };

    React.useEffect(() => { if (userData && userData._id) fetchResidentEstate(); }, [userData]);
    React.useEffect(() => {
        if (!residentCommunity || residentCommunity.length === 0) return;
        if (!selectedEstate) {
            setSelectedEstate(residentCommunity[0]);
        } else {
            const stillValid = residentCommunity.find(e => e._id === selectedEstate._id);
            if (!stillValid) setSelectedEstate(residentCommunity[0]);
        }
    }, [residentCommunity]);
    React.useEffect(() => {
        if (selectedEstate) getResidentProfile(selectedEstate?.associatedIds?.residentId);
    }, [getResidentProfile, selectedEstate]);

    const isAt = (href: string) => href !== '#' && (pathname === href || pathname.startsWith(href + '/'));

    const role = selectedEstate?.role || 'resident';
    const isFullAccess = ['resident', 'co-owner'].includes(role);
    const canInviteCoResidents = isFullAccess;

    return (
        <div className={`sidebar relative border-r border-[#E6E6E6] bg-white ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`shadow-sm h-full ${openEstateList ? 'overflow-visible' : 'overflow-y-auto scrollbar-container-small'}`}>
                <div className={`w-full min-h-screen ${isCollapsed ? 'px-2' : 'px-6'} flex flex-col py-10 transition-all duration-300`}>

                    {/* Logo */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 mt-2`}>
                        {!isCollapsed && <Link href="/"><Image height={27} width={131} src="/Homz-pc-icon.png" alt='homz' /></Link>}
                        {isCollapsed && <Link href="/" className='flex items-center justify-center'><Image height={32} width={32} src="/icons/apple-icon-180.png" alt='homz' /></Link>}
                        <button onClick={toggleCollapsed} className="hidden md:flex items-center justify-center p-1.5 rounded-full hover:bg-whiteblue text-GrayHomz transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                                <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Estate switcher */}
                    <div className="relative">
                        <button onClick={() => setOpenEstateList(true)} className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}>
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0">
                                    <InitialsAvatar name={selectedEstate?.estateName || 'Estate'} size={24} />
                                </div>
                                {!isCollapsed && (
                                    <div className='flex flex-col items-start'>
                                        <p className="truncate max-w-[140px]">{selectedEstate?.estateName ?? ""}</p>
                                        {selectedEstate?.role && <span className='text-[11px] font-normal text-GrayHomz2 capitalize'>{selectedEstate.role}</span>}
                                    </div>
                                )}
                            </div>
                            {!isCollapsed && <div className='mt-1.5'><ArrowDown size={20} className='#4E4E4E' /></div>}
                        </button>
                    </div>

                    {/* Nav */}
                    <div className="flex flex-col gap-3 mt-10 mb-6">
                        <NavLink href="/resident/dashboard" label="Dashboard" icon={<DashboardIcon />} iconActive={<DashboardIcon className='#FFFFFF' />} active={isAt('/resident/dashboard')} isCollapsed={isCollapsed} />
                        <NavLink href="/resident/visitor-access" label="Visitor Access" icon={<VisitorShield />} iconActive={<VisitorShield className='#FFFFFF' />} active={isAt('/resident/visitor-access')} isCollapsed={isCollapsed} />
                        {isFullAccess && <NavLink href="/resident/bills-payments" label="Bills & Payments" icon={<DuesAndPaymentIcon />} iconActive={<DuesAndPaymentIcon className='#FFFFFF' />} active={isAt('/resident/bills-payments')} isCollapsed={isCollapsed} />}
                        {isFullAccess && <NavLink href="/resident/wallet" label="Wallet" icon={<DuesAndPaymentIcon />} iconActive={<DuesAndPaymentIcon className='#FFFFFF' />} active={isAt('/resident/wallet')} isCollapsed={isCollapsed} />}

                        <div className='border-t border-[#F0F0F0] my-1' />

                        {isFullAccess && <NavLink href="/resident/maintenance" label="Maintenance" icon={<MaintenanceIcon />} iconActive={<MaintenanceIcon className='#FFFFFF' />} active={isAt('/resident/maintenance')} isCollapsed={isCollapsed} />}
                        {isFullAccess && <NavLink href="/resident/notifications" label="Notifications" icon={<NotiIcon />} iconActive={<NotiIcon className='#FFFFFF' />} active={isAt('/resident/notifications')} isCollapsed={isCollapsed} badge={unreadCount} />}
                        {canInviteCoResidents && <NavLink href="/resident/co-residents" label="Invite & Manage" icon={<ManageUserIcon />} iconActive={<ManageUserIcon className='#FFFFFF' classNameII='#FFFFFF' />} active={isAt('/resident/co-residents')} isCollapsed={isCollapsed} />}
                        <NavLink href="/resident/settings/hub" label="Settings" icon={<SettingsIcon />} iconActive={<SettingsIcon className='#FFFFFF' />} active={isAt('/resident/settings/hub') || isAt('/resident/settings/security') || isAt('/resident/settings/about')} isCollapsed={isCollapsed} />
                        <NavLink href="/resident/profile" label="Profile" icon={<Profile16Icon />} iconActive={<Profile16Icon className='#FFFFFF' />} active={isAt('/resident/profile')} isCollapsed={isCollapsed} />

                        <div className='border-t border-[#F0F0F0] my-1' />

                        <button onClick={() => setIsLogoutModalOpen(true)} title={isCollapsed ? 'Logout' : ''} className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-error hover:bg-red-50 transition-colors w-full`}>
                            <LogoutIcon />
                            {!isCollapsed && <span className='text-[16px] font-[500]'>Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
            <LogoutConfirmationModal isOpen={isLogoutModalOpen} onRequestClose={() => setIsLogoutModalOpen(false)} onConfirm={logOutUser} />
        </div>
    );
};

export default Sidebar;