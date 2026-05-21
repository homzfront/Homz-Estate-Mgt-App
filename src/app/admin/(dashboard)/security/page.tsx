'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface AccessRecord {
    _id?: string;
    residentName?: string;
    estateName?: string;
    visitorName?: string;
    visitor?: string;
    purpose?: string;
    accessCode?: string;
    codeType?: string;
    date?: string;
    arrivalDate?: string;
    createdAt?: string;
    status?: string;
    timeIn?: string;
    timeOut?: string;
}

const StatusBadge = ({ status }: { status?: string }) => {
    const s = status?.toLowerCase().replace(' ', '_');
    const map: Record<string, { label: string; color: string }> = {
        signed_in:  { label: 'Signed In',  color: 'text-[#2E7D32]' },
        pending:    { label: 'Pending',    color: 'text-[#E65100]' },
        signed_out: { label: 'Signed Out', color: 'text-[#6B6B6B]' },
        expired:    { label: 'Expired',    color: 'text-[#EF4444]' },
    };
    const cfg = map[s || ''];
    return <span className={`text-[12px] font-medium ${cfg?.color || 'text-[#9E9E9E]'}`}>{cfg?.label || status || '—'}</span>;
};

const SearchableSelect = ({ options, value, onChange, placeholder }: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
    const selected = options.find(o => o.value === value);
    return (
        <div ref={ref} className='relative'>
            <button type='button' onClick={() => { setOpen(v => !v); setQuery(''); }}
                className='h-[36px] min-w-[140px] px-3 border border-[#E8E8E8] rounded-[8px] text-[13px] bg-white flex items-center justify-between gap-2 hover:bg-[#F5F5F5]'>
                <span className={selected?.value ? 'text-[#1A1A1A]' : 'text-[#9E9E9E]'}>
                    {selected ? selected.label : placeholder || 'Select...'}
                </span>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
                    <path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='2' strokeLinecap='round'/>
                </svg>
            </button>
            {open && (
                <div className='absolute right-0 z-50 mt-1 w-[220px] bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg overflow-hidden'>
                    <div className='p-2 border-b border-[#F0F0F0]'>
                        <input autoFocus type='text' value={query} onChange={e => setQuery(e.target.value)}
                            placeholder='Search...'
                            className='w-full h-[30px] px-2.5 text-[12px] border border-[#E0E0E0] rounded-[6px] focus:outline-none focus:border-[#006AFF]' />
                    </div>
                    <div className='max-h-[200px] overflow-y-auto'>
                        {filtered.length === 0
                            ? <p className='text-[12px] text-[#9E9E9E] text-center py-3'>No results</p>
                            : filtered.map(o => (
                                <button key={o.value} type='button'
                                    onClick={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F0F4FF] ${value === o.value ? 'bg-[#EEF5FF] text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
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

export default function AdminSecurityPage() {
    const router = useRouter();
    const [records, setRecords] = useState<AccessRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [estateFilter, setEstateFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [estates, setEstates] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        api.get('/admin/estates').then(res => {
            const d = res.data?.data || res.data || {};
            setEstates(d.estates || []);
        }).catch(() => {});
    }, []);

    useEffect(() => { fetchRecords(); }, [page, statusFilter, estateFilter, dateFilter]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            // Build params before fetch
            const params: Record<string, string> = { page: String(page) };
            if (statusFilter) params.status = statusFilter;
            if (estateFilter) params.estateId = estateFilter;
            if (dateFilter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                params.startDate = today;
                params.endDate = today;
            } else if (dateFilter === '7days') {
                const d = new Date(); d.setDate(d.getDate() - 7);
                params.startDate = d.toISOString().split('T')[0];
            } else if (dateFilter === '30days') {
                const d = new Date(); d.setDate(d.getDate() - 30);
                params.startDate = d.toISOString().split('T')[0];
            }

            const [listRes, summaryRes] = await Promise.allSettled([
                api.get('/admin/access-control', { params }),
                api.get('/admin/access-control/summary'),
            ]);

            if (listRes.status === 'fulfilled') {
                const d = listRes.value.data?.data || listRes.value.data || {};
                setRecords(d.results || []);
                setTotalPages(d.totalPages || Math.ceil((d.totalCount || 0) / 20) || 1);
            }
            if (summaryRes.status === 'fulfilled') {
                const s = summaryRes.value.data?.data || summaryRes.value.data || {};
                setStats({
                    total:   s.totalGenerated  || s.total   || 0,
                    active:  s.activeVisitors  || s.active  || 0,
                    pending: s.pendingRequests || s.pending || 0,
                });
            }
        } catch { setRecords([]); }
        finally { setLoading(false); }
    };

    const statCards = [
        { label: 'Total Access Codes Generated', value: (stats.total || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#006AFF" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#EEF5FF' },
        { label: 'Active Visitors', value: (stats.active || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F0FFF4' },
        { label: 'Pending Requests', value: (stats.pending || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#E65100" strokeWidth="1.5"/><polyline points="12,6 12,12 16,14" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#FFF7ED' },
    ];

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Security & Access</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Track entry activities, visitor access across estates</p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 mb-6'>
                {statCards.map((card, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4 flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: card.bg }}>{card.icon}</div>
                        <div>
                            <p className='text-[20px] font-bold text-[#1A1A1A]'>{card.value}</p>
                            <p className='text-[12px] text-[#6B6B6B]'>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className='flex justify-end gap-2 mb-4'>
                <SearchableSelect
                    value={estateFilter}
                    onChange={val => { setEstateFilter(val); setPage(1); }}
                    placeholder='All Estates'
                    options={[{ label: 'All Estates', value: '' }, ...estates.map(e => ({ label: e.name, value: e._id }))]}
                />
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className='h-[36px] px-3 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none bg-white'>
                    <option value=''>All Status</option>
                    <option value='pending'>Pending</option>
                    <option value='signed in'>Signed In</option>
                    <option value='signed out'>Signed Out</option>
                    <option value='expired'>Expired</option>
                </select>
                <select value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                    className='h-[36px] px-3 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none bg-white'>
                    <option value=''>All Dates</option>
                    <option value='today'>Today</option>
                    <option value='7days'>Last 7 days</option>
                    <option value='30days'>Last 30 days</option>
                </select>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['Resident Name', 'Estate', 'Visitor Name', 'Purpose', 'Access Code', 'Date', 'Status', 'Actions'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className='text-center py-12'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin mx-auto' />
                            </td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={8} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No access records found</td></tr>
                        ) : records.map((r) => (
                            <tr key={r._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{r.residentName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(r.estateName && r.estateName !== 'N/A') ? r.estateName : '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{r.visitorName || r.visitor || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B] capitalize'>{r.purpose || '—'}</td>
                                <td className='px-4 py-3 text-[12px] font-mono text-[#6B6B6B]'>{r.accessCode || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {new Date(r.date || r.arrivalDate || r.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </td>
                                <td className='px-4 py-3'><StatusBadge status={r.status} /></td>
                                <td className='px-4 py-3'>
                                    <button onClick={() => router.push(`/admin/security/${r._id}`)}
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