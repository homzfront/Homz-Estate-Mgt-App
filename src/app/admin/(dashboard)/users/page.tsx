'use client';
import React, { useEffect, useState, Suspense} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

interface User {
    _id?: string;
    email?: string;
    type?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    accounts?: any[];
    profile?: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        estateName?: string;
        estate?: string;
        role?: string;
        personal?: {
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
            email?: string;
        };
    };
}

type TabType = 'all' | 'RESIDENT' | 'COMMUNITY_MANAGER' | 'ADMIN';

const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${active ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
        {active ? 'Active' : 'Suspended'}
    </span>
);


// Profile field helpers - shape differs by user type
// ADMIN: profile.firstName/lastName/phoneNumber
// CM: profile.personal.firstName/lastName/phoneNumber
// RESIDENT: profile.firstName/lastName/estateName/email
const getFirstName = (u: User) =>
    u.profile?.firstName || u.profile?.personal?.firstName || u.email?.split('@')[0] || '—';
const getLastName = (u: User): string =>
    u.profile?.lastName || u.profile?.personal?.lastName || '';
const getPhone = (u: User) => {
    const p = u.profile as any;
    const phone = p?.phoneNumber || p?.personal?.phoneNumber;
    return (phone && phone !== 'N/A') ? phone : '—';
};
const getEstate = (u: User): string => {
    const p = u.profile as any;
    return p?.estateName || p?.estate || p?.estateName || '—';
};


const SearchableSelect = ({ options, value, onChange, placeholder }: {
    options: { label: string; value: string }[];
    value: string; onChange: (val: string) => void; placeholder?: string;
}) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
    const selected = options.find(o => o.value === value);
    return (
        <div ref={ref} className='relative'>
            <button type='button' onClick={() => { setOpen(v => !v); setQuery(''); }}
                className='h-[34px] min-w-[130px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] bg-white flex items-center justify-between gap-1.5 hover:bg-[#F5F5F5]'>
                <span className={selected?.value ? 'text-[#1A1A1A]' : 'text-[#9E9E9E]'}>{selected ? selected.label : placeholder}</span>
                <svg width='10' height='10' viewBox='0 0 24 24' fill='none' className={`flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
                    <path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='2' strokeLinecap='round'/>
                </svg>
            </button>
            {open && (
                <div className='absolute right-0 z-50 mt-1 w-[200px] bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg overflow-hidden'>
                    <div className='p-1.5 border-b border-[#F0F0F0]'>
                        <input autoFocus type='text' value={query} onChange={e => setQuery(e.target.value)} placeholder='Search...'
                            className='w-full h-[28px] px-2 text-[12px] border border-[#E0E0E0] rounded-[4px] focus:outline-none focus:border-[#006AFF]' />
                    </div>
                    <div className='max-h-[180px] overflow-y-auto'>
                        {filtered.length === 0 ? <p className='text-[12px] text-[#9E9E9E] text-center py-2'>No results</p>
                            : filtered.map(o => (
                                <button key={o.value} type='button' onClick={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                                    className={`w-full text-left px-3 py-2 text-[12px] hover:bg-[#F0F4FF] ${value === o.value ? 'bg-[#EEF5FF] text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    {o.label}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

function AdminUsersPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');
    const [estateFilter, setEstateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [estates, setEstates] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        api.get('/admin/estates').then(res => {
            const d = res.data?.data || res.data || {};
            setEstates(d.estates || []);
        }).catch(() => {});
    }, []);
    const [search, setSearch] = useState(searchParams?.get('search') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { fetchUsers(); }, [tab, page, searchParams, estateFilter, statusFilter]);

    // Re-fetch when window regains focus (returning from user detail after suspend)
    useEffect(() => {
        const onFocus = () => fetchUsers();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [tab, page, estateFilter, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            if (tab !== 'all') params.userType = tab;
            if (search) params.search = search;
            if (estateFilter) params.estateId = estateFilter;
            if (statusFilter) params.status = statusFilter;
            const res = await api.get('/admin/users', { params });
            const userData = res.data?.results || res.data?.data?.results || [];
            setUsers(userData);
            setTotalPages(Math.ceil((res.data?.totalCount || res.data?.data?.totalCount || 0) / 15) || 1);
        } catch { setUsers([]); }
        finally { setLoading(false); }
    };

    const TABS: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'RESIDENT', label: 'Residents' },
        { key: 'COMMUNITY_MANAGER', label: 'EM/CM' },
        { key: 'ADMIN', label: 'Staff/Admin' },
    ];

    const getUserType = (user: User) => {
        if (user.type) return user.type;
        if (user.accounts?.some((a: any) => a.accountType === 'COMMUNITY_MANAGER')) return 'Estate Manager';
        if (user.accounts?.some((a: any) => a.accountType === 'RESIDENT')) return 'Resident';
        return '—';
    };

    return (
        <div className='p-6'>
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Users</h1>
                    <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Manage and monitor all users across the platform</p>
                </div>
                <Link href='/admin/users/add'
                    className='h-[40px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium flex items-center gap-2 hover:bg-[#0055CC] transition-colors'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add User
                </Link>
            </div>

            {/* Tabs + filters */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex gap-1 border-b border-[#F0F0F0]'>
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
                            className={`px-4 py-2 text-[13px] font-medium transition-colors
                                ${tab === t.key ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <SearchableSelect
                        value={estateFilter}
                        onChange={val => { setEstateFilter(val); setPage(1); }}
                        placeholder='All Estates'
                        options={[{ label: 'All Estates', value: '' }, ...estates.map(e => ({ label: e.name, value: e._id }))]}
                    />
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className='h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] focus:outline-none bg-white'>
                        <option value=''>All Status</option>
                        <option value='active'>Active</option>
                        <option value='suspended'>Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['Name', 'User Type', 'Estate', 'Phone', 'Email', 'Date Joined', 'Status', 'Actions'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className='text-center py-12 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={8} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No users found</td></tr>
                        ) : users.map((user) => (
                            <tr key={user._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>
                                    {`${getFirstName(user)} ${getLastName(user)}`.trim() || user.email || '—'}
                                </td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{getUserType(user)}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{getEstate(user)}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{getPhone(user)}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B] truncate max-w-[160px]'>{user.email}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </td>
                                <td className='px-4 py-3'><StatusBadge active={user.isActive !== false} /></td>
                                <td className='px-4 py-3 flex items-center gap-2'>
                                    <Link href={`/admin/users/${user._id}`} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</Link>
                                    <button className='text-[#9E9E9E] hover:text-[#1A1A1A]'>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]'>
                        <p className='text-[12px] text-[#9E9E9E]'>Page {page} of {totalPages}</p>
                        <div className='flex gap-2'>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Prev</button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminUsersPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <AdminUsersPageInner />
        </Suspense>
    );
}