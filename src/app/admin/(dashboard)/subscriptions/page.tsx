'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

interface Subscription {
    _id?: string;
    estateName?: string;
    managerName?: string;
    amount?: number;
    billingCycle?: string;
    nextBillingDate?: string;
    status?: string;
    planName?: string;
}

interface Stats {
    totalRevenue: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
}

const formatNaira = (n: number) => '₦' + (n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const statusConfig: Record<string, { label: string; color: string }> = {
    active:   { label: 'Active',   color: '#2E7D32' },
    expired:  { label: 'Expired',  color: '#C62828' },
    canceled: { label: 'Canceled', color: '#757575' },
    free:     { label: 'Free',     color: '#1565C0' },
};

export default function AdminSubscriptionsPage() {
    const router = useRouter();
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalSubscriptions: 0, activeSubscriptions: 0, expiredSubscriptions: 0 });
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [planFilter, setPlanFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPlanFilter, setShowPlanFilter] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);

    useEffect(() => { fetchSubs(); }, [page, planFilter, statusFilter, searchParams]);

    const fetchSubs = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            const urlSearch = searchParams?.get('search') || '';
            if (urlSearch) params.search = urlSearch;
            if (planFilter) params.planId = planFilter;  // correct param name
            if (statusFilter) params.status = statusFilter;

            const [listRes, summaryRes] = await Promise.allSettled([
                api.get('/admin/subscriptions', { params }),
                api.get('/admin/subscriptions/summary'),
            ]);

            if (listRes.status === 'fulfilled') {
                // Response: { success, message, data: { currentPage, totalCount, totalPages, limit, results } }
                const d = listRes.value.data?.data || listRes.value.data || {};
                setSubs(d.results || d.data || (Array.isArray(d) ? d : []));
                setTotalPages(d.totalPages || Math.ceil((d.totalCount || d.total || 0) / 20) || 1);
            }

            if (summaryRes.status === 'fulfilled') {
                // Summary: { totalSubscriptions, activeSubscriptions, expiredSubscriptions, totalRevenue }
                const s = summaryRes.value.data?.data || summaryRes.value.data || {};
                setStats({
                    totalRevenue:         s.totalRevenue         || 0,
                    totalSubscriptions:   s.totalSubscriptions   || 0,
                    activeSubscriptions:  s.activeSubscriptions  || 0,
                    expiredSubscriptions: s.expiredSubscriptions || 0,
                });
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const FilterBtn = ({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
        <button onClick={onClick} className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] bg-white flex items-center gap-1.5 hover:bg-[#F5F5F5]' style={{ color: active ? '#006AFF' : '#1A1A1A' }}>
            {label}
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
        </button>
    );

    return (
        <div className='p-8 w-full'>
            {/* Header */}
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Subscriptions</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-0.5'>Manage and monitor all estates subscription plans and billing activity</p>
                </div>
                <button onClick={() => router.push('/admin/subscriptions/plans')}
                    className='h-[44px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] flex-shrink-0'>
                    Manage Subscriptions
                </button>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-4 gap-4 mb-6'>
                <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-5'>
                    <div className='w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-3'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' stroke='#E65100' strokeWidth='1.5' strokeLinecap='round'/></svg>
                    </div>
                    <p className='text-[18px] font-bold text-[#1A1A1A]'>{formatNaira(stats.totalRevenue)}</p>
                    <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Total Revenue</p>
                </div>
                <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-5'>
                    <div className='w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><rect x='2' y='5' width='20' height='14' rx='2' stroke='#006AFF' strokeWidth='1.5'/><path d='M2 10h20' stroke='#006AFF' strokeWidth='1.5'/></svg>
                    </div>
                    <p className='text-[18px] font-bold text-[#1A1A1A]'>{stats.totalSubscriptions.toLocaleString()}</p>
                    <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Total Subscriptions</p>
                </div>
                <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-5'>
                    <div className='w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-3'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M22 11.08V12a10 10 0 11-5.93-9.14' stroke='#2E7D32' strokeWidth='1.5' strokeLinecap='round'/><path d='M22 4L12 14.01l-3-3' stroke='#2E7D32' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/></svg>
                    </div>
                    <p className='text-[18px] font-bold text-[#1A1A1A]'>{stats.activeSubscriptions}</p>
                    <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Active Subscriptions</p>
                </div>
                <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-5'>
                    <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mb-3'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' stroke='#C62828' strokeWidth='1.5'/><path d='M15 9l-6 6M9 9l6 6' stroke='#C62828' strokeWidth='1.5' strokeLinecap='round'/></svg>
                    </div>
                    <p className='text-[18px] font-bold text-[#1A1A1A]'>{stats.expiredSubscriptions}</p>
                    <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Expired Subscriptions</p>
                </div>
            </div>

            {/* Filters */}
            <div className='flex justify-end gap-2 mb-4'>
                <div className='relative'>
                    <FilterBtn label={planFilter || 'All Plans'} active={!!planFilter} onClick={() => { setShowPlanFilter(v => !v); setShowStatusFilter(false); setShowDateFilter(false); }} />
                    {showPlanFilter && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-10 min-w-[140px]'>
                            {['', 'Free', 'Enterprise', 'Premium', 'Platinum'].map(p => (
                                <button key={p} onClick={() => { setPlanFilter(p); setShowPlanFilter(false); }}
                                    className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] ${planFilter === p ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    {p || 'All Plans'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className='relative'>
                    <FilterBtn label={statusFilter || 'All Status'} active={!!statusFilter} onClick={() => { setShowStatusFilter(v => !v); setShowPlanFilter(false); setShowDateFilter(false); }} />
                    {showStatusFilter && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-10 min-w-[140px]'>
                            {['', 'active', 'expired', 'cancelled'].map(s => (
                                <button key={s} onClick={() => { setStatusFilter(s); setShowStatusFilter(false); }}
                                    className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] capitalize ${statusFilter === s ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    {s || 'All Status'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className='relative'>
                    <FilterBtn label='Date' onClick={() => { setShowDateFilter(v => !v); setShowPlanFilter(false); setShowStatusFilter(false); }} />
                    {showDateFilter && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-10 min-w-[140px]'>
                            {['Today', 'Last 7 days', 'Last 30 days'].map(d => (
                                <button key={d} onClick={() => setShowDateFilter(false)} className='block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] text-[#1A1A1A]'>{d}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#F5F7FF]'>
                            {['Estate', 'Manager', 'Amount', 'Billing Cycle', 'Next Billing Date', 'Status', 'Action'].map(h => (
                                <th key={h} className='px-4 py-3.5 text-[12px] font-semibold text-[#1A1A1A] text-center first:text-left'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className='text-center py-16'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin mx-auto' />
                            </td></tr>
                        ) : subs.length === 0 ? (
                            <tr><td colSpan={7} className='text-center py-16 text-[13px] text-[#9E9E9E]'>No subscriptions found</td></tr>
                        ) : subs.map(s => {
                            const cfg = (statusConfig as any)[s.status?.toLowerCase() || 'active'] || { label: s.status || 'Unknown', color: '#757575' } || statusConfig.active;
                            return (
                                <tr key={s._id} className='border-t border-[#F5F5F5] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A]'>{(!s.estateName || s.estateName === 'N/A') ? '—' : s.estateName}</td>
                                    <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{s.managerName || '—'}</td>
                                    <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{s.amount != null ? formatNaira(s.amount) : '—'}</td>
                                    <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center capitalize'>{s.billingCycle || 'Monthly'}</td>
                                    <td className='px-4 py-3.5 text-[13px] text-[#1A1A1A] text-center'>{formatDate(s.nextBillingDate)}</td>
                                    <td className='px-4 py-3.5 text-center'>
                                        <span className='text-[12px] font-semibold' style={{ color: cfg.color }}>{cfg.label}</span>
                                    </td>
                                    <td className='px-4 py-3.5 text-center'>
                                        <button onClick={() => router.push(`/admin/subscriptions/${s._id}`)}
                                            className='text-[13px] font-semibold text-[#006AFF] hover:underline'>View</button>
                                    </td>
                                </tr>
                            );
                        })}
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