'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin/useAdminStore';

const PAGE_TITLES: Record<string, string> = {
    '/admin/dashboard': 'Dashboard Overview',
    '/admin/estates': 'Estates',
    '/admin/users': 'Users',
    '/admin/transactions': 'Transactions',
    '/admin/wallets': 'Wallets',
    '/admin/security': 'Security',
    '/admin/reports': 'Reports',
    '/admin/subscriptions': 'Subscriptions',
    '/admin/support': 'Support / Issues',
    '/admin/admin-mgt': 'Admin Management',
    '/admin/kyc': 'KYC',
    '/admin/activity': 'Activity',
};

const PAGE_ICONS: Record<string, React.ReactNode> = {
    '/admin/dashboard': <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
};

export default function AdminTopbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { admin, logout } = useAdminStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = React.useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState('');

    const SEARCHABLE_PAGES = ['/admin/users', '/admin/estates', '/admin/wallets', '/admin/transactions', '/admin/kyc', '/admin/support', '/admin/activity', '/admin/subscriptions'];
    const isOnSearchablePage = SEARCHABLE_PAGES.some(p => pathname.startsWith(p));

    const SEARCH_SUGGESTIONS = [
        { label: 'Search Users', desc: 'Find residents, CMs and admins', path: '/admin/users',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/><circle cx='12' cy='7' r='4' stroke='#006AFF' strokeWidth='1.5'/></svg> },
        { label: 'Search Estates', desc: 'Find estates by name', path: '/admin/estates',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/><path d='M9 22V12h6v10' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/></svg> },
        { label: 'Search Transactions', desc: 'Find by reference number', path: '/admin/transactions',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><rect x='2' y='5' width='20' height='14' rx='2' stroke='#006AFF' strokeWidth='1.5'/><path d='M2 10h20' stroke='#006AFF' strokeWidth='1.5'/></svg> },
        { label: 'Search Wallets', desc: 'Find wallets by owner name', path: '/admin/wallets',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><path d='M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z' stroke='#006AFF' strokeWidth='1.5'/><path d='M16 3l-4 4-4-4' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/><circle cx='17' cy='13' r='1' fill='#006AFF'/></svg> },
        { label: 'Search KYC', desc: 'Find KYC submissions', path: '/admin/kyc',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><rect x='3' y='3' width='18' height='18' rx='2' stroke='#006AFF' strokeWidth='1.5'/><path d='M9 9h6M9 12h6M9 15h4' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/></svg> },
        { label: 'Search Support', desc: 'Find support requests', path: '/admin/support',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/></svg> },
        { label: 'Search Activity', desc: 'Find activity logs', path: '/admin/activity',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><polyline points='22,12 18,12 15,21 9,3 6,12 2,12' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/></svg> },
        { label: 'Search Subscriptions', desc: 'Find estate subscriptions', path: '/admin/subscriptions',
          icon: <svg width='15' height='15' viewBox='0 0 24 24' fill='none'><path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' stroke='#006AFF' strokeWidth='1.5'/></svg> },
    ];

    // Click outside to close suggestions
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || !search.trim()) return;
        setShowSuggestions(false);
        const currentBase = SEARCHABLE_PAGES.find(p => pathname.startsWith(p));
        if (currentBase) {
            router.push(`${currentBase}?search=${encodeURIComponent(search.trim())}`);
        } else {
            // Not on searchable page — default to users
            router.push(`/admin/users?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (!e.target.value.trim()) {
            // Clear search - go back to page without search param
            const currentBase = SEARCHABLE_PAGES.find(p => pathname.startsWith(p));
            if (currentBase) router.push(currentBase);
        }
    };

    // Get title from pathname
    const title = Object.keys(PAGE_TITLES)
        .sort((a, b) => b.length - a.length)
        .find(key => pathname.startsWith(key));

    return (
        <React.Fragment>
        <header className='h-[60px] border-b border-[#F0F0F0] bg-white flex items-center px-6 gap-4 flex-shrink-0'>
            {/* Page title */}
            <div className='flex items-center gap-2 flex-shrink-0'>
                <span className='text-[#6B6B6B]'>{title ? PAGE_ICONS[title] : null}</span>
                <span className='text-[15px] font-semibold text-[#1A1A1A]'>
                    {title ? PAGE_TITLES[title] : 'Admin'}
                </span>
            </div>

            {/* Search */}
            <div className='flex-1 flex justify-center'>
                <div ref={searchRef} className='relative w-full max-w-[440px]'>
                    <svg className='absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]' width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearch}
                        onFocus={() => { if (!isOnSearchablePage) setShowSuggestions(true); }}
                        placeholder='Search users, estates, residents... (Enter)'
                        className='w-full h-[36px] pl-9 pr-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] placeholder:text-[#BDBDBD] bg-[#FAFAFA] focus:outline-none focus:border-[#006AFF] focus:bg-white transition-colors'
                    />
                    {showSuggestions && !isOnSearchablePage && (
                        <div className='absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-[#E8E8E8] rounded-[10px] shadow-lg z-50 overflow-hidden'>
                            <p className='text-[11px] text-[#9E9E9E] px-3 pt-2.5 pb-1.5 font-medium uppercase tracking-wide'>Search in</p>
                            {SEARCH_SUGGESTIONS.map(s => (
                                <button key={s.path} type='button'
                                    onClick={() => {
                                        setShowSuggestions(false);
                                        if (search.trim()) {
                                            router.push(`${s.path}?search=${encodeURIComponent(search.trim())}`);
                                        } else {
                                            router.push(s.path);
                                        }
                                    }}
                                    className='w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F5F7FF] transition-colors text-left'>
                                    <div className='w-7 h-7 rounded-[6px] bg-[#EEF5FF] flex items-center justify-center flex-shrink-0'>{s.icon}</div>
                                    <div>
                                        <p className='text-[12px] font-medium text-[#1A1A1A]'>{s.label}</p>
                                        <p className='text-[11px] text-[#9E9E9E]'>{s.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: notifications + profile */}
            <div className='flex items-center gap-3 flex-shrink-0'>
                {/* Notification bell */}
                <button className='w-[36px] h-[36px] rounded-full bg-[#F0F6FF] flex items-center justify-center hover:bg-[#E0EDFF] transition-colors relative'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                {/* Profile dropdown */}
                <div className='relative'>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className='flex items-center gap-2 border border-[#E8E8E8] rounded-[8px] px-3 h-[36px] hover:bg-[#FAFAFA] transition-colors'
                    >
                        <div className='w-6 h-6 rounded-full bg-[#EEF5FF] flex items-center justify-center text-[#006AFF] font-semibold text-[11px]'>
                            {admin?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className='text-left'>
                            <p className='text-[12px] font-medium text-[#1A1A1A] leading-tight'>{admin?.email || 'Admin'}</p>
                            <p className='text-[10px] text-[#9E9E9E] capitalize'>{(admin?.role || 'Admin').replace(/_/g, ' ').toLowerCase()}</p>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <polyline points="6,9 12,15 18,9" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {showDropdown && (
                        <div className='absolute right-0 top-[calc(100%+6px)] w-[180px] bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg py-1 z-50'>
                            <button
                                onClick={() => { setShowDropdown(false); router.push('/admin/profile'); }}
                                className='w-full text-left px-4 py-2 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5]'
                            >Profile</button>
                            <button
                                onClick={() => { setShowDropdown(false); router.push('/admin/settings'); }}
                                className='w-full text-left px-4 py-2 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5]'
                            >Settings</button>
                            <div className='border-t border-[#F0F0F0] my-1'/>
                            <button
                                onClick={() => { setShowDropdown(false); setShowLogoutConfirm(true); }}
                                className='w-full text-left px-4 py-2 text-[13px] text-[#E53E3E] hover:bg-[#FFF5F5]'
                            >Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
            {showLogoutConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6'>
                        <div className='w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
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