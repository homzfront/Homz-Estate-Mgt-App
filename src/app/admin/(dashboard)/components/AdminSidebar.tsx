'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/store/admin/useAdminStore';


const NAV_ITEMS = [
    {
        label: 'Dashboard', href: '/admin/dashboard',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Estates', href: '/admin/estates',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 22V9l9-7 9 7v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 22V16h6v6" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Users', href: '/admin/users',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Transactions', href: '/admin/transactions',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    },
    {
        label: 'Wallets', href: '/admin/wallets',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill="currentColor" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Security', href: '/admin/security',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Reports', href: '/admin/reports',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    },
    {
        label: 'Subscriptions', href: '/admin/subscriptions',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /></svg>
    },
    {
        label: 'Withdrawals',
        href: '/admin/withdrawals',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        label: 'Support / Issues', href: '/admin/support',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    },
    {
        label: 'Admin Mgt', href: '/admin/admin-mgt',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    },
    {
        label: 'KYC', href: '/admin/kyc',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" /><polyline points="9,12 11,14 15,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    },
    {
        label: 'Activity', href: '/admin/activity',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout, admin } = useAdminStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

    return (
        <React.Fragment>
            <aside className='w-[240px] min-h-screen bg-white border-r border-[#F0F0F0] flex flex-col flex-shrink-0'>
                {/* Logo */}
                <div className='px-5 py-5 border-b border-[#F0F0F0]'>
                    <div className='flex items-center gap-2'>
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="6" fill="#006AFF" />
                            <path d="M8 22V14L16 8L24 14V22H19V17H13V22H8Z" fill="white" />
                        </svg>
                        <span className='text-[18px] font-bold text-[#1A1A1A]'>Homz<span className='text-[#006AFF]'>.ng</span></span>
                    </div>
                </div>

                {/* Nav */}
                <nav className='flex-1 py-4 px-3 overflow-y-auto'>
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 h-[40px] px-3 rounded-[6px] mb-0.5 text-[14px] font-[500] transition-colors
                                ${active
                                        ? 'bg-[#006AFF] text-white'
                                        : 'text-[#6B6B6B] hover:bg-[#F0F6FF] hover:text-[#006AFF]'
                                    }`}
                            >
                                <span className={active ? 'text-white' : 'text-[#9E9E9E]'}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom user */}
                <div className='p-4 border-t border-[#F0F0F0]'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-8 h-8 rounded-full bg-[#EEF5FF] flex items-center justify-center text-[#006AFF] font-semibold text-[13px]'>
                            {admin?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-[12px] font-medium text-[#1A1A1A] truncate'>{admin?.email || 'Admin'}</p>
                            <p className='text-[11px] text-[#9E9E9E] capitalize'>{admin?.role || 'admin'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className='w-full flex items-center gap-2 text-[13px] text-[#E53E3E] hover:bg-[#FFF5F5] px-3 py-2 rounded-[6px] transition-colors'
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Logout
                    </button>
                </div>
            </aside>
            {showLogoutConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6'>
                        <div className='w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round' />
                            </svg>
                        </div>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>Log out?</h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>Are you sure you want to log out of your admin account?</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowLogoutConfirm(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={() => { setShowLogoutConfirm(false); logout(); }}
                                className='flex-1 h-[40px] bg-[#EF4444] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#DC2626]'>
                                Yes, Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}