'use client';
import React, { useEffect, useState, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

type TabType = 'all' | 'resident' | 'em/cm';

interface Wallet {
    _id?: string;
    balance?: number;
    ownerType?: string;
    isActive?: boolean;
    currency?: string;
    estateName?: string;
    lastTransactionDate?: string;
    lastTransaction?: string;
    role?: string;
    userName?: string;
    ownerName?: string;
    ownerRole?: string;
}

function AdminWalletsPageInner() {
    const router = useRouter();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { fetchWallets(); }, [tab, page, searchParams]);

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            const urlSearch = searchParams?.get('search') || '';
            if (urlSearch) params.search = urlSearch;
            if (tab !== 'all') params.ownerType = tab === 'em/cm' ? 'ESTATE' : 'RESIDENT';
            const [listRes, summaryRes] = await Promise.allSettled([
                api.get('/admin/wallets', { params }),
                api.get('/admin/wallets/summary'),
            ]);
            if (listRes.status === 'fulfilled') {
                const d = listRes.value.data?.data || listRes.value.data || {};
                setWallets(d.results || []);
                setTotalPages(d.totalPages || Math.ceil((d.totalCount || d.total || 0) / 20) || 1);
            }
            if (summaryRes.status === 'fulfilled') {
                const s = summaryRes.value.data?.data || summaryRes.value.data || {};
                setStats({
                    total:    s.totalBalance  || 0,
                    active:   s.activeCount   || 0,
                    inactive: s.inactiveCount || 0,
                });
            }
        } catch { setWallets([]); }
        finally { setLoading(false); }
    };

    const TABS: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'resident', label: 'Resident' },
        { key: 'em/cm', label: 'EM/CM' },
    ];

    const statCards = [
        {
            label: 'Total Wallet balance platforms',
            value: `₦${(stats.total || 0).toLocaleString()}.00`,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#F97316" strokeWidth="1.5"/><path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill="#F97316"/><path d="M2 10h20" stroke="#F97316" strokeWidth="1.5"/></svg>,
            bg: '#FFF7ED',
        },
        {
            label: 'Active Wallet',
            value: (stats.active || 0).toLocaleString(),
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            bg: '#F0FFF4',
        },
        {
            label: 'Inactive Wallet',
            value: (stats.inactive || 0).toLocaleString(),
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9E9E9E" strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="12" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/></svg>,
            bg: '#F5F5F5',
        },
    ];

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Wallet</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Manage and monitor all user wallet</p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 mb-6'>
                {statCards.map((card, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4 flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: card.bg }}>
                            {card.icon}
                        </div>
                        <div>
                            <p className='text-[20px] font-bold text-[#1A1A1A]'>{card.value}</p>
                            <p className='text-[12px] text-[#6B6B6B]'>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className='flex gap-1 border-b border-[#F0F0F0] mb-4'>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
                        className={`px-4 py-2 text-[13px] font-medium transition-colors
                            ${tab === t.key ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className='flex justify-between items-center mb-4'>
                <div className='relative'>
                    <svg className='absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]' width='14' height='14' viewBox='0 0 24 24' fill='none'>
                        <circle cx='11' cy='11' r='8' stroke='currentColor' strokeWidth='1.5'/><path d='M21 21l-4.35-4.35' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                    </svg>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder='Search by name or estate...'
                        className='h-[36px] pl-8 pr-4 w-[260px] border border-[#E8E8E8] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className='h-[36px] px-3 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none bg-white'>
                    <option value=''>All Status</option>
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['User Name', 'Role', 'Estate', 'Wallet Balance', 'Last Transaction', 'Status', 'Actions'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className='text-center py-12 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                        ) : wallets.length === 0 ? (
                            <tr><td colSpan={7} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No wallets found</td></tr>
                        ) : wallets
                            .filter(w => {
                                const matchSearch = !search || 
                                    (w.userName || '').toLowerCase().includes(search.toLowerCase()) ||
                                    (w.estateName || '').toLowerCase().includes(search.toLowerCase());
                                const matchStatus = !statusFilter ||
                                    (statusFilter === 'active' ? w.isActive !== false : w.isActive === false);
                                return matchSearch && matchStatus;
                            })
                            .map((w) => (
                            <tr key={w._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{w.userName || w.ownerName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {w.role || (w.ownerType === 'ESTATE' ? 'Community Manager' : w.ownerType === 'RESIDENT' ? 'Resident' : '—')}
                                </td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{w.estateName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>₦{(w.balance || 0).toLocaleString()}.00</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {(w.lastTransactionDate || w.lastTransaction) ? new Date(w.lastTransactionDate! || w.lastTransaction!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                </td>
                                <td className='px-4 py-3'>
                                    <span className={`text-[11px] font-medium ${w.isActive ? 'text-[#2E7D32]' : 'text-[#9E9E9E]'}`}>
                                        {w.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className='px-4 py-3'>
                                    <button onClick={() => router.push(`/admin/wallets/${w._id}`)}
                                        className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]'>
                        <p className='text-[12px] text-[#9E9E9E]'>Page {page} of {totalPages}</p>
                        <div className='flex gap-2'>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Prev</button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminWalletsPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <AdminWalletsPageInner />
        </Suspense>
    );
}