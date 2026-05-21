/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import SearchIcon from '@/components/icons/estateManager&Resident/desktop/searchIcon';
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useRouter as useNextRouter } from 'next/navigation';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter, usePathname } from 'next/navigation';
import { useResidentStore } from '@/store/useResidentStore';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import api from '@/utils/api';

interface SearchResult {
    type: 'resident' | 'access' | 'visitor';
    id: string;
    primary: string;
    secondary: string;
    meta?: string;
    href?: string;
}

const TYPE_LABEL: Record<SearchResult['type'], string> = {
    resident: 'Resident',
    access: 'Access Code',
    visitor: 'Visitor',
};

const TYPE_COLOR: Record<SearchResult['type'], string> = {
    resident: 'bg-[#EEF5FF] text-BlueHomz',
    access: 'bg-successBg text-Success',
    visitor: 'bg-warningBg text-warning2',
};

const Header = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const ability = useAbility();
    const router = useRouter();
    const pathname = usePathname();
    const { isResident } = useResidentStore();
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);

    // Detect if we're on the resident side
    const onResidentSide = isResident || (pathname?.startsWith('/resident') ?? false);
    const residentOrgId = selectedEstate?.associatedIds?.organizationId || residentCommunity?.[0]?.associatedIds?.organizationId;
    const residentEstateId = selectedEstate?.estateId || residentCommunity?.[0]?.estateId;
    // endpoint expects residentOrganizationId not userId
    const residentUserId = selectedEstate?.associatedIds?.residentOrganizationId || residentCommunity?.[0]?.associatedIds?.residentOrganizationId;

    const orgId = selectedCommunity?.estate?.associatedIds?.organizationId;
    const estateId = selectedCommunity?.estate?._id;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const search = useCallback(async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        const found: SearchResult[] = [];

        try {
            if (onResidentSide) {
                // Resident side: search their own access codes only
                if (!residentOrgId || !residentEstateId) { setLoading(false); return; }
                try {
                    const looksLikeCode = /^[A-Za-z0-9\-]{4,}$/.test(term.trim()) && !term.includes(' ');
                    const accessParam = looksLikeCode
                        ? `accessCode=${encodeURIComponent(term)}`
                        : `search=${encodeURIComponent(term)}`;
                    const res = await api.get(
                        `/access-control/residents/all/organizations/${residentOrgId}/estates/${residentEstateId}/organizationsResident/${residentUserId}?${accessParam}&limit=5`
                    );
                    const records = res?.data?.data?.results || [];
                    records.forEach((r: any) => {
                        found.push({
                            type: looksLikeCode ? 'access' : 'visitor',
                            id: r._id,
                            primary: looksLikeCode ? r.accessCode : r.visitor,
                            secondary: looksLikeCode ? r.visitor : (r.purpose || ''),
                            meta: r.accessStatus ? `Status: ${r.accessStatus}` : '',
                            href: '/resident/visitor-access',
                        });
                    });
                } catch { /* silent */ }
            } else {
                // EM side: search residents + access control
                if (!orgId || !estateId) { setLoading(false); return; }

                // Search residents
                if (ability.can('read', 'residents')) {
                    try {
                        const res = await api.get(
                            `/community-manager/resident/all/organizations/${orgId}/estates/${estateId}?search=${encodeURIComponent(term)}&limit=5`
                        );
                        const residents = res?.data?.data?.results || [];
                        residents.forEach((r: any) => {
                            found.push({
                                type: 'resident',
                                id: r._id,
                                primary: `${r.firstName} ${r.lastName}`,
                                secondary: r.email || '',
                                meta: r.apartment ? `${r.building} · ${r.apartment}` : '',
                                href: `/manage-resident/residents/${r._id}`,
                            });
                        });
                    } catch { /* silent */ }
                }

                // Search access control
                if (ability.can('read', 'access-control')) {
                    try {
                        const looksLikeCode = /^[A-Za-z0-9\-]{4,}$/.test(term.trim()) && !term.includes(' ');
                        const accessParam = looksLikeCode
                            ? `accessCode=${encodeURIComponent(term)}`
                            : `visitor=${encodeURIComponent(term)}`;
                        const res = await api.get(
                            `/access-control/community-manager/all/organizations/${orgId}/estates/${estateId}?${accessParam}&limit=5`
                        );
                        const records = res?.data?.data?.results || [];
                        records.forEach((r: any) => {
                            if (found.some(f => f.id === r._id)) return;
                            const isCodeSearch = looksLikeCode;
                            found.push({
                                type: isCodeSearch ? 'access' : 'visitor',
                                id: r._id,
                                primary: isCodeSearch ? r.accessCode : r.visitor,
                                secondary: isCodeSearch ? r.visitor : (r.purpose || ''),
                                meta: r.accessStatus ? `Status: ${r.accessStatus}` : '',
                                href: '/access-control',
                            });
                        });
                    } catch { /* silent */ }
                }
            }
        } finally {
            setLoading(false);
            setResults(found);
            setOpen(true);
            setActiveIndex(-1);
        }
    }, [orgId, estateId, ability, onResidentSide, residentOrgId, residentEstateId, residentUserId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!val.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }
        debounceRef.current = setTimeout(() => search(val), 400);
    };

    const handleSelect = (result: SearchResult) => {
        setOpen(false);
        setQuery('');
        if (result.href) router.push(result.href);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); setQuery(''); setActiveIndex(-1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
        if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
            handleSelect(results[activeIndex]);
        }
    };

    const notifStore = useNotificationStore();
    const nextRouter = useNextRouter();
    const [notifOpen, setNotifOpen] = React.useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Fetch notifications on mount — small delay lets the auth token settle
    // before the request fires, preventing 401 errors on initial load
    useEffect(() => {
        const t = setTimeout(() => {
            notifStore.fetchNotifications();
        }, 500);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close notif dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const notifRoute = onResidentSide ? '/resident/notifications' : '/notifications';

    return (
        <div className='header'>
            <div className='flex items-center justify-between px-8 h-[120px]'>
                <div className='relative' ref={containerRef}>
                    <input
                        className='border border-[#E0E0E0] h-[44px] pl-10 pr-10 rounded-[8px] placeholder:text-[#BDBDBD] placeholder:text-[13px] text-[13px] w-[360px] outline-none focus:border-BlueHomz bg-[#FAFAFA] focus:bg-white transition-all'
                        placeholder='Search residents, access codes, visitors...'
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => results.length > 0 && setOpen(true)}
                        autoComplete='off'
                    />
                    {query && (
                        <div className='absolute top-3 right-3 flex items-center gap-1'>
                            <kbd className='text-[10px] text-[#9E9E9E] bg-[#F0F0F0] px-1.5 py-0.5 rounded border border-[#E0E0E0]'>↵</kbd>
                        </div>
                    )}
                    <div className='absolute top-3.5 left-4'>
                        {loading ? (
                            <div className='w-4 h-4 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                        ) : (
                            <SearchIcon />
                        )}
                    </div>

                    {/* Results dropdown */}
                    {open && (
                        <div className='absolute top-[50px] left-0 w-[400px] bg-white border border-[#E8E8E8] rounded-[10px] shadow-xl z-[9999] max-h-[380px] overflow-y-auto'>
                            {results.length === 0 ? (
                                <div className='px-4 py-6 text-sm text-GrayHomz text-center'>
                                    No results for &ldquo;{query}&rdquo;
                                </div>
                            ) : (
                                <>
                                    <div className='px-4 pt-3 pb-1 text-[11px] text-GrayHomz font-medium uppercase tracking-wide'>
                                        {results.length} result{results.length !== 1 ? 's' : ''}
                                    </div>
                                    {results.map((r, idx) => (
                                        <button
                                            key={`${r.type}-${r.id}`}
                                            onClick={() => handleSelect(r)}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            className={`w-full text-left px-4 py-3 flex items-start gap-3 border-t border-[#F0F0F0] first:border-t-0 transition-colors ${activeIndex === idx ? 'bg-[#EEF5FF]' : 'hover:bg-[#F6F9FF]'}`}
                                        >
                                            <span className={`mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_COLOR[r.type]}`}>
                                                {TYPE_LABEL[r.type]}
                                            </span>
                                            <div className='flex flex-col gap-0.5 min-w-0'>
                                                <span className='text-sm font-medium text-BlackHomz truncate'>{r.primary}</span>
                                                {r.secondary && <span className='text-[11px] text-GrayHomz truncate'>{r.secondary}</span>}
                                                {r.meta && <span className='text-[11px] text-GrayHomz3 truncate'>{r.meta}</span>}
                                            </div>
                                        </button>
                                    ))}
                                </>
                            )}
                            <div className='px-4 py-2 border-t border-[#F5F5F5] flex items-center gap-3'>
                                <span className='text-[10px] text-[#BDBDBD]'>
                                    <kbd className='bg-[#F5F5F5] px-1 rounded text-[10px]'>↑↓</kbd> navigate
                                    <kbd className='bg-[#F5F5F5] px-1 rounded text-[10px] ml-1'>↵</kbd> select
                                    <kbd className='bg-[#F5F5F5] px-1 rounded text-[10px] ml-1'>Esc</kbd> close
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notification Bell */}
                <div className='relative' ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className='relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-whiteblue transition-colors'
                    >
                        <NotiIcon className={notifOpen ? '#006AFF' : '#4E4E4E'} />
                        {notifStore.unreadCount > 0 && (
                            <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                                {notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                        <div className='absolute right-0 top-12 w-[360px] bg-white border border-[#E6E6E6] rounded-[12px] shadow-xl z-[9999] overflow-hidden'>
                            <div className='flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-sm font-semibold text-BlackHomz'>Notifications</span>
                                    {notifStore.unreadCount > 0 && (
                                        <span className='bg-BlueHomz text-white text-[10px] font-medium px-2 py-0.5 rounded-full'>
                                            {notifStore.unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div className='flex items-center gap-3'>
                                    {notifStore.unreadCount > 0 && (
                                        <button
                                            onClick={() => notifStore.markAllAsRead()}
                                            className='text-[11px] text-BlueHomz font-medium hover:underline'
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setNotifOpen(false); nextRouter.push(notifRoute); }}
                                        className='text-[11px] text-GrayHomz font-medium hover:text-BlueHomz'
                                    >
                                        See all
                                    </button>
                                </div>
                            </div>

                            <div className='max-h-[320px] overflow-y-auto'>
                                {notifStore.isLoading ? (
                                    <div className='py-8 flex justify-center'>
                                        <div className='w-5 h-5 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                                    </div>
                                ) : notifStore.notifications.length === 0 ? (
                                    <div className='py-8 text-center text-sm text-GrayHomz'>
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifStore.notifications.slice(0, 6).map((n) => (
                                        <button
                                            key={n._id}
                                            onClick={() => {
                                                if (!n.isRead) notifStore.markAsRead(n._id);
                                                setNotifOpen(false);
                                                nextRouter.push(notifRoute);
                                            }}
                                            className={`w-full text-left px-4 py-3 border-t border-[#F5F5F5] hover:bg-[#F6F9FF] transition-colors flex items-start gap-3 ${!n.isRead ? 'bg-[#F0F5FF]' : ''}`}
                                        >
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-BlueHomz' : 'bg-transparent'}`} />
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-[13px] font-medium text-BlackHomz truncate'>{n.title}</p>
                                                <p className='text-[11px] text-GrayHomz mt-0.5 line-clamp-1'>{n.message}</p>
                                                <p className='text-[10px] text-GrayHomz2 mt-1'>
                                                    {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className='border-t border-[#F0F0F0] p-3'>
                                <button
                                    onClick={() => { setNotifOpen(false); nextRouter.push(notifRoute); }}
                                    className='w-full text-center text-sm font-medium text-BlueHomz hover:underline py-1'
                                >
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;