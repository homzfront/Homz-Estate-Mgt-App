'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface KYCRecord { _id: string; name?: string; firstName?: string; lastName?: string; estateName?: string; idType?: string; submissionDate?: string; createdAt: string; status?: string; documentUrl?: string; userId?: string; }

type StatusType = 'pending' | 'approved' | 'rejected';

const StatusBadge = ({ status }: { status?: string }) => {
    const s = status?.toLowerCase();
    const styles: Record<string, string> = { pending: 'text-[#E65100]', approved: 'text-[#2E7D32]', rejected: 'text-[#EF4444]' };
    return <span className={`text-[12px] font-medium capitalize ${styles[s || ''] || 'text-[#9E9E9E]'}`}>{status || '—'}</span>;
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
                className='h-[34px] min-w-[150px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] bg-white flex items-center justify-between gap-2 hover:bg-[#F5F5F5] text-[#6B6B6B]'>
                <span className={selected?.value ? 'text-[#1A1A1A]' : ''}>{selected ? selected.label : placeholder || 'Select...'}</span>
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

function AdminKYCPageInner() {
    const router = useRouter();
    const [records, setRecords] = useState<KYCRecord[]>([]);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [estateFilter, setEstateFilter] = useState('');
    const [estates, setEstates] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        api.get('/admin/estates')
            .then(res => {
                const d = res.data?.data || res.data || {};
                setEstates(d.estates || []);
            })
            .catch(() => {});
    }, []);
    useEffect(() => { fetchRecords(); }, [page, statusFilter, estateFilter, dateFilter, searchParams]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            const urlSearch = searchParams?.get('search') || '';
            if (urlSearch) params.search = urlSearch;
            if (statusFilter) params.status = statusFilter;
            if (estateFilter) params.estateId = estateFilter;
            const res = await api.get('/admin/kyc', { params });
            const d = res.data?.data;
            const results = d.results || d.data || (Array.isArray(d) ? d : []);
            const now = Date.now();
            const dateFiltered = dateFilter === 'today'
                ? results.filter((r: any) => new Date(r.submissionDate || r.createdAt).toDateString() === new Date().toDateString())
                : dateFilter === '7days'
                ? results.filter((r: any) => now - new Date(r.submissionDate || r.createdAt).getTime() <= 7 * 86400000)
                : dateFilter === '30days'
                ? results.filter((r: any) => now - new Date(r.submissionDate || r.createdAt).getTime() <= 30 * 86400000)
                : results;
            setRecords(dateFiltered);
            setTotalPages(Math.ceil((res.data?.total || res.data?.data?.total || 0) / 15) || 1);
        } catch { setRecords([]); }
        finally { setLoading(false); }
    };

    const handleAction = async (id: string, action: StatusType) => {
        try {
            // Backend uses separate endpoints for approve/reject
            if (action === 'approved') {
                await api.patch(`/admin/kyc/${id}/approve`);
            } else {
                await api.patch(`/admin/kyc/${id}/reject`, { reason: 'Rejected by admin' });
            }
            toast.success(`KYC ${action} successfully`);
            fetchRecords();
        } catch { toast.error(`Failed to ${action} KYC`); }
    };

    const getName = (r: KYCRecord) => r.name || (r.firstName ? `${r.firstName} ${r.lastName || ''}` : '—');

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Kyc Verification</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Review and approve identity submissions from estate managers</p>
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
                    className='h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] focus:outline-none bg-white'>
                    <option value=''>All Status</option>
                    <option value='PENDING'>Pending</option>
                    <option value='APPROVED'>Approved</option>
                    <option value='REJECTED'>Rejected</option>
                </select>
                <select value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                    className='h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] focus:outline-none bg-white'>
                    <option value=''>All Dates</option>
                    <option value='today'>Today</option>
                    <option value='7days'>Last 7 days</option>
                    <option value='30days'>Last 30 days</option>
                </select>
            </div>

            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['Name', 'Estate', 'ID Type', 'Submission Date', 'Status', 'Action'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className='text-center py-12 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={6} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No KYC submissions found</td></tr>
                        ) : records.map((r) => (
                            <tr key={r._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{getName(r)}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{r.estateName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B] uppercase'>{r.idType || 'NIN'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {new Date(r.submissionDate || r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </td>
                                <td className='px-4 py-3'><StatusBadge status={r.status || 'pending'} /></td>
                                <td className='px-4 py-3'>
                                    <button onClick={() => router.push(`/admin/kyc/${r._id}`)} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
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

export default function AdminKYCPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <AdminKYCPageInner />
        </Suspense>
    );
}