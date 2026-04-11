/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import SearchIcon from '@/components/icons/estateManager&Resident/desktop/searchIcon';
import React, { useRef, useEffect, useState, useCallback } from 'react';
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
        if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
        }
    };

    return (
        <div className='header'>
            <div className='flex items-center justify-between px-8 h-[120px]'>
                <div className='relative' ref={containerRef}>
                    <input
                        className='border border-[#A9A9A9] h-[45px] pl-10 pr-4 rounded-[4px] placeholder:text-[#A9A9A9] placeholder:text-sm w-[355px] outline-none focus:border-BlueHomz transition-colors'
                        placeholder='Search residents, access codes, visitors...'
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => results.length > 0 && setOpen(true)}
                        autoComplete='off'
                    />
                    <div className='absolute top-3.5 left-4'>
                        {loading ? (
                            <div className='w-4 h-4 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                        ) : (
                            <SearchIcon />
                        )}
                    </div>

                    {/* Results dropdown */}
                    {open && (
                        <div className='absolute top-[50px] left-0 w-[420px] bg-white border border-[#E6E6E6] rounded-[8px] shadow-lg z-[9999] max-h-[400px] overflow-y-auto'>
                            {results.length === 0 ? (
                                <div className='px-4 py-6 text-sm text-GrayHomz text-center'>
                                    No results for &ldquo;{query}&rdquo;
                                </div>
                            ) : (
                                <>
                                    <div className='px-4 pt-3 pb-1 text-[11px] text-GrayHomz font-medium uppercase tracking-wide'>
                                        {results.length} result{results.length !== 1 ? 's' : ''}
                                    </div>
                                    {results.map((r) => (
                                        <button
                                            key={`${r.type}-${r.id}`}
                                            onClick={() => handleSelect(r)}
                                            className='w-full text-left px-4 py-3 hover:bg-[#F6F9FF] flex items-start gap-3 border-t border-[#F0F0F0] first:border-t-0 transition-colors'
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;