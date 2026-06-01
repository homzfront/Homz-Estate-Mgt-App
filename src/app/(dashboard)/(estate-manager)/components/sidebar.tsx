/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import EstateAddIcon from '@/components/icons/estateAddIcon';
import AccessControlIcon from '@/components/icons/estateManager&Resident/desktop/accessControlIcon';
import BillAndUtiIcon from '@/components/icons/estateManager&Resident/desktop/billAndUtiIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import FinanceIcon from '@/components/icons/estateManager&Resident/desktop/financeIcon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import ManageResidentIcon from '@/components/icons/estateManager&Resident/desktop/manageResidentIcon';
import ManageUserIcon from '@/components/icons/estateManager&Resident/desktop/manageUserIcon';
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon';
import MaintenanceIcon from '@/components/icons/maintenanceIcon';
import PaymentIcon from '@/components/icons/estateManager&Resident/desktop/paymentIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import Image from 'next/image';
import InitialsAvatar from '@/components/general/InitialsAvatar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useAuthSlice } from '@/store/authStore';
import LogoutConfirmationModal from '@/components/general/LogoutConfirmationModal';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import UserTick from '@/components/icons/userTick';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAbility } from '@/contexts/AbilityContext';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { Subjects } from '@/utils/ability';

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

function SubLink({ href, label, icon, iconActive, pathname }: { href: string; label: string; icon: React.ReactNode; iconActive: React.ReactNode; pathname: string; }) {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
        <Link href={href} className={`flex items-center gap-3 p-1 px-2 rounded-md hover:bg-whiteblue ${active ? 'text-BlueHomz' : 'text-GrayHomz'}`}>
            {active ? iconActive : icon}
            <span className='text-[13px] font-[500]'>{label}</span>
        </Link>
    );
}

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [residentsOpen, setResidentsOpen] = React.useState(false);
    const [financeOpen, setFinanceOpen] = React.useState(false);
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const { clearForm } = useEstateFormStore();
    const { logOutUser, estatesData, communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const ability = useAbility();
    const { isCollapsed, toggleCollapsed } = useSidebarStore();
    const { unreadCount } = useNotificationStore();
    const { canUse, promptUpgrade } = useSubscriptionStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const isAt = (href: string) => href !== '#' && (pathname === href || pathname.startsWith(href + '/'));
    const isGroupAt = (...hrefs: string[]) => hrefs.some(h => isAt(h));

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
                    {estatesData && estatesData?.length > 0 && selectedCommunity && (
                        <button onClick={() => setOpenEstateList(true)} className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}>
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0">
                                    {selectedCommunity?.estate?.coverPhoto
                                        ? <Image src={selectedCommunity.estate.coverPhoto.url as string} alt="estate" width={40} height={40} className="object-cover w-full h-full" />
                                        : <InitialsAvatar name={(selectedCommunity?.estate?.basicDetails?.name as string) || 'Estate'} size={24} />}
                                </div>
                                {!isCollapsed && (selectedCommunity?.estate?.basicDetails?.name ?? "")}
                            </div>
                            {!isCollapsed && <div className='mt-1.5'><ArrowDown size={20} className='#4E4E4E' /></div>}
                        </button>
                    )}
                    {communityProfile && estatesData?.length === 0 && ability.can('create', 'estate') && (
                        <button onClick={() => { clearForm(); router.push("/add-estate"); }} className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-BlueHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}>
                            <span className='flex gap-4 items-center'><EstateAddIcon />{!isCollapsed && "Add New Estate"}</span>{!isCollapsed && <AddIcon />}
                        </button>
                    )}

                    {/* Nav */}
                    <div className="flex flex-col gap-3 mt-10 mb-6">

                        {ability.can('read', 'dashboard' as Subjects) && (
                            <NavLink href="/dashboard" label="Dashboard" icon={<DashboardIcon />} iconActive={<DashboardIcon className='#FFFFFF' />} active={isAt('/dashboard')} isCollapsed={isCollapsed} />
                        )}

                        {/* Residents */}
                        {ability.can('read', 'residents' as Subjects) && (
                            <div>
                                <button onClick={() => !isCollapsed && setResidentsOpen(o => !o)} className="w-full" title={isCollapsed ? "Residents" : ""}>
                                    <span className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] ${isGroupAt('/manage-resident/residents', '/manage-resident/request') ? 'bg-BlueHomz text-white' : 'hover:bg-whiteblue text-GrayHomz'}`}>
                                        {isGroupAt('/manage-resident/residents', '/manage-resident/request') ? <ManageResidentIcon className='#FFFFFF' classNameII='#FFFFFF' /> : <ManageResidentIcon />}
                                        {!isCollapsed && <div className="flex items-center justify-between flex-1"><span>Residents</span><div className={`transition-transform ${residentsOpen ? 'rotate-180' : ''}`}><ArrowDown className={isGroupAt('/manage-resident/residents', '/manage-resident/request') ? '#FFFFFF' : '#4E4E4E'} /></div></div>}
                                    </span>
                                </button>
                                {residentsOpen && !isCollapsed && (
                                    <div className="flex items-center space-x-7 ml-[20px]">
                                        <hr style={{ width: '1.5px', height: '70px', borderWidth: 0, background: '#4E4E4E' }} />
                                        <div className="my-2 flex flex-col space-y-4 w-full">
                                            <SubLink href="/manage-resident/residents" label="Manage Residents" icon={<ManageResidentIcon h='14' w='14' />} iconActive={<ManageResidentIcon h='14' w='14' className='#006AFF' classNameII='#006AFF' />} pathname={pathname} />
                                            {ability.can('create', 'residents' as Subjects) && <SubLink href="/manage-resident/request" label="Join Requests" icon={<UserTick color='#4E4E4E' />} iconActive={<UserTick />} pathname={pathname} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {ability.can('read', 'access-control' as Subjects) && (
                            <NavLink href="/access-control" label="Access Control" icon={<AccessControlIcon />} iconActive={<AccessControlIcon className='#FFFFFF' />} active={isAt('/access-control')} isCollapsed={isCollapsed} />
                        )}

                        {/* Finance */}
                        {ability.can('read', 'finance' as Subjects) && (
                        <div>
                            <button
                                onClick={() => {
                                    if (!canUse('finance_view')) { promptUpgrade('finance'); return; }
                                    if (!isCollapsed) setFinanceOpen(o => !o);
                                }}
                                className="w-full" title={isCollapsed ? "Finance" : ""}>
                                <span className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] ${isGroupAt('/finance/bill-utility', '/finance/payment') ? 'bg-BlueHomz text-white' : 'hover:bg-whiteblue text-GrayHomz'}`}>
                                    {isGroupAt('/finance/bill-utility', '/finance/payment') ? <FinanceIcon className='#FFFFFF' /> : <FinanceIcon />}
                                    {!isCollapsed && <div className="flex items-center justify-between flex-1"><span>Finance</span><div className={`transition-transform ${financeOpen ? 'rotate-180' : ''}`}><ArrowDown className={isGroupAt('/finance/bill-utility', '/finance/payment') ? '#FFFFFF' : '#4E4E4E'} /></div></div>}
                                </span>
                            </button>
                            {financeOpen && !isCollapsed && (
                                <div className="flex items-center space-x-7 ml-[20px]">
                                    <hr style={{ width: '1.5px', height: '70px', borderWidth: 0, background: '#4E4E4E' }} />
                                    <div className="my-2 flex flex-col space-y-4 w-full">
                                        <SubLink href="/finance/bill-utility" label="Estate Billing" icon={<BillAndUtiIcon className='#4E4E4E' />} iconActive={<BillAndUtiIcon />} pathname={pathname} />
                                        <SubLink href="/finance/payment" label="Payments" icon={<PaymentIcon />} iconActive={<PaymentIcon className='#006AFF' />} pathname={pathname} />
                                    </div>
                                </div>
                            )}
                        </div>
                        )}

                        {/* Wallet — role access controlled by backend CASL (Payments_Bills)
                            Sub-users inherit the estate's subscription, bypass canUse for them */}
                        {ability.can('read', 'finance' as Subjects) && (() => {
                            const isSubUser = !['owner', 'admin'].includes(selectedCommunity?.role || '');
                            const walletAllowed = isSubUser || canUse('wallet');
                            if (!walletAllowed) return (
                                <button onClick={() => promptUpgrade('wallet')} title={isCollapsed ? 'Wallet (Upgrade required)' : ''} className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] text-GrayHomz hover:bg-whiteblue w-full opacity-60`}>
                                    <DuesAndPaymentIcon />
                                    {!isCollapsed && <div className='flex items-center justify-between flex-1'><span>Wallet</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" stroke="#A9A9A9" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#A9A9A9" strokeWidth="1.5"/></svg></div>}
                                </button>
                            );
                            return <NavLink href="/wallet" label="Wallet" icon={<DuesAndPaymentIcon />} iconActive={<DuesAndPaymentIcon className='#FFFFFF' />} active={isAt('/wallet')} isCollapsed={isCollapsed} />;
                        })()}

                        {/* Subscription — only owner/admin manage this */}
                        {ability.can('read', 'settings' as Subjects) && (
                            <NavLink href="/subscription" label="Subscription" icon={<DuesAndPaymentIcon />} iconActive={<DuesAndPaymentIcon className='#FFFFFF' />} active={isAt('/subscription')} isCollapsed={isCollapsed} />
                        )}

                        <div className='border-t border-[#F0F0F0] my-1' />

                        {/* Maintenance — residents/account manager relevant */}
                        {ability.can('read', 'residents' as Subjects) && (
                            <NavLink href="/maintenance" label="Maintenance" icon={<MaintenanceIcon />} iconActive={<MaintenanceIcon className='#FFFFFF' />} active={isAt('/maintenance')} isCollapsed={isCollapsed} />
                        )}
                        {/* Notifications — available to all roles that can read the dashboard */}
                        {ability.can('read', 'dashboard' as Subjects) && (
                            <NavLink href="/notifications" label="Notifications" icon={<NotiIcon />} iconActive={<NotiIcon className='#FFFFFF' />} active={isAt('/notifications')} isCollapsed={isCollapsed} badge={unreadCount} />
                        )}
                        {/* Account Settings — only for roles that manage the estate */}
                        {ability.can('read', 'dashboard' as Subjects) && !['viewer', 'account_manager'].includes(selectedCommunity?.role || '') && (
                            <NavLink href="/settings/account" label="Account Settings" icon={<SettingsIcon />} iconActive={<SettingsIcon className='#FFFFFF' />} active={isAt('/settings/account')} isCollapsed={isCollapsed} />
                        )}
                        {ability.can('read', 'settings' as Subjects) && (
                            <NavLink href="/settings" label="Team & Roles" icon={<ManageUserIcon />} iconActive={<ManageUserIcon className='#FFFFFF' classNameII='#FFFFFF' />} active={pathname === '/settings'} isCollapsed={isCollapsed} />
                        )}

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