'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/utils/api';

interface Activity {
    _id: string;
    actorName?: string;
    role?: string;
    action: string;
    target?: string;
    createdAt: string;
}

interface ActivityDetail {
    _id: string;
    user?: string;
    estate?: string;
    role?: string;
    unit?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
    details?: string;
}

interface Estate {
    _id: string;
    basicDetails?: { name?: string };
    name?: string;
}

export default function AdminActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [estates, setEstates] = useState<Estate[]>([]);
    const [selectedEstate, setSelectedEstate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showEstateDropdown, setShowEstateDropdown] = useState(false);
    const [estateSearch, setEstateSearch] = useState('');
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const estateRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    // Detail modal
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<ActivityDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (estateRef.current && !estateRef.current.contains(e.target as Node)) { setShowEstateDropdown(false); setEstateSearch(''); }
            if (timeRef.current && !timeRef.current.contains(e.target as Node)) setShowTimeDropdown(false);
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDateDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch estates for filter
    useEffect(() => {
        api.get('/admin/estates', { params: { limit: 100 } })
            .then(res => {
                const results = res.data?.data?.results || res.data?.data?.estates || [];
                setEstates(results);
            })
            .catch(() => {});
    }, []);

    const fetchActivities = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page: p, limit: 20 };
            if (selectedEstate) params.estateId = selectedEstate;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const res = await api.get('/admin/activities', { params });
            const data = res.data?.data;
            setActivities(data?.results || []);
            setTotalPages(data?.totalPages || 1);
            setPage(data?.currentPage || 1);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [selectedEstate, startDate, endDate]);

    useEffect(() => { fetchActivities(1); }, [fetchActivities]);

    const openDetail = async (id: string) => {
        setSelectedId(id);
        setDetail(null);
        setDetailLoading(true);
        try {
            const res = await api.get(`/admin/activities/${id}`);
            setDetail(res.data?.data || null);
        } catch { /* silent */ }
        finally { setDetailLoading(false); }
    };

    const formatDate = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const selectedEstateName = estates.find(e => e._id === selectedEstate)
        ? (estates.find(e => e._id === selectedEstate)?.basicDetails?.name || estates.find(e => e._id === selectedEstate)?.name || 'Estate')
        : 'Estates';

    return (
        <div className='p-6 w-full'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Activity Logs</h1>
                <p className='text-[13px] text-[#9E9E9E] mt-0.5'>Track actions and system activities across users and estates</p>
            </div>

            {/* Filters */}
            <div className='flex items-center justify-end gap-3 mb-4'>
                {/* Estate filter */}
                <div className='relative' ref={estateRef}>
                    <button
                        onClick={() => setShowEstateDropdown(v => !v)}
                        className='flex items-center gap-2 h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] bg-white hover:bg-[#F5F5F5]'
                    >
                        {selectedEstateName}
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
                            <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                        </svg>
                    </button>
                    {showEstateDropdown && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-20 min-w-[220px]'>
                            {/* Search input */}
                            <div className='p-2 border-b border-[#F0F0F0]'>
                                <div className='relative'>
                                    <svg className='absolute left-2.5 top-1/2 -translate-y-1/2 text-[#BDBDBD]' width='12' height='12' viewBox='0 0 24 24' fill='none'>
                                        <circle cx='11' cy='11' r='8' stroke='currentColor' strokeWidth='1.5'/>
                                        <line x1='21' y1='21' x2='16.65' y2='16.65' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                                    </svg>
                                    <input
                                        autoFocus
                                        type='text'
                                        value={estateSearch}
                                        onChange={e => setEstateSearch(e.target.value)}
                                        placeholder='Search estates...'
                                        className='w-full h-[32px] pl-7 pr-3 border border-[#E8E8E8] rounded-[6px] text-[12px] focus:outline-none focus:border-[#006AFF]'
                                    />
                                </div>
                            </div>
                            {/* Options */}
                            <div className='max-h-[200px] overflow-y-auto'>
                                <button onClick={() => { setSelectedEstate(''); setEstateSearch(''); setShowEstateDropdown(false); }}
                                    className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] ${!selectedEstate ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    All Estates
                                </button>
                                {estates
                                    .filter(e => {
                                        const name = e.basicDetails?.name || e.name || '';
                                        return name.toLowerCase().includes(estateSearch.toLowerCase());
                                    })
                                    .map(e => (
                                        <button key={e._id} onClick={() => { setSelectedEstate(e._id); setEstateSearch(''); setShowEstateDropdown(false); }}
                                            className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] ${selectedEstate === e._id ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                            {e.basicDetails?.name || e.name || e._id}
                                        </button>
                                    ))
                                }
                                {estates.filter(e => {
                                    const name = e.basicDetails?.name || e.name || '';
                                    return name.toLowerCase().includes(estateSearch.toLowerCase());
                                }).length === 0 && estateSearch && (
                                    <p className='px-4 py-3 text-[12px] text-[#9E9E9E]'>No estates found</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Date range filter */}
                <div className='relative' ref={dateRef}>
                    <button
                        onClick={() => setShowDateDropdown(v => !v)}
                        className='flex items-center gap-2 h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] bg-white hover:bg-[#F5F5F5]'
                    >
                        {startDate ? `${startDate} – ${endDate || '...'}` : 'Date'}
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
                            <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                        </svg>
                    </button>
                    {showDateDropdown && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[10px] shadow-lg z-20 p-4 min-w-[240px]'>
                            <p className='text-[11px] text-[#9E9E9E] font-medium mb-3'>Date Range</p>
                            <div className='flex flex-col gap-2'>
                                <div>
                                    <label className='text-[11px] text-[#6B6B6B] mb-1 block'>From</label>
                                    <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)}
                                        className='w-full h-[34px] border border-[#E8E8E8] rounded-[6px] px-3 text-[12px] focus:outline-none focus:border-[#006AFF]'/>
                                </div>
                                <div>
                                    <label className='text-[11px] text-[#6B6B6B] mb-1 block'>To</label>
                                    <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)}
                                        className='w-full h-[34px] border border-[#E8E8E8] rounded-[6px] px-3 text-[12px] focus:outline-none focus:border-[#006AFF]'/>
                                </div>
                                <div className='flex gap-2 mt-1'>
                                    <button onClick={() => { setStartDate(''); setEndDate(''); setShowDateDropdown(false); }}
                                        className='flex-1 h-[32px] border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                        Clear
                                    </button>
                                    <button onClick={() => setShowDateDropdown(false)}
                                        className='flex-1 h-[32px] bg-[#006AFF] text-white rounded-[6px] text-[12px] font-medium hover:bg-[#0055CC]'>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#E8E8E8] rounded-[12px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#F5F8FF]'>
                            {['User', 'Role', 'Action', 'Target', 'Date', 'Time'].map(h => (
                                <th key={h} className='text-left px-5 py-3.5 text-[13px] font-semibold text-[#1A1A1A]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className='text-center py-16'>
                                    <div className='flex justify-center'>
                                        <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin'/>
                                    </div>
                                </td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='text-center py-16 text-[13px] text-[#9E9E9E]'>
                                    No activity logs found
                                </td>
                            </tr>
                        ) : activities.map((a, i) => (
                            <tr
                                key={a._id}
                                onClick={() => openDetail(a._id)}
                                className={`cursor-pointer hover:bg-[#F5F8FF] transition-colors ${i < activities.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}
                            >
                                <td className='px-5 py-3.5 text-[13px] text-[#1A1A1A]'>{a.actorName || '—'}</td>
                                <td className='px-5 py-3.5 text-[13px] text-[#6B6B6B]'>{a.role || '—'}</td>
                                <td className='px-5 py-3.5 text-[13px] text-[#1A1A1A]'>{a.action || '—'}</td>
                                <td className='px-5 py-3.5 text-[13px] text-[#6B6B6B]'>{a.target || '—'}</td>
                                <td className='px-5 py-3.5 text-[13px] text-[#6B6B6B]'>{formatDate(a.createdAt)}</td>
                                <td className='px-5 py-3.5 text-[13px] text-[#6B6B6B]'>{formatTime(a.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-center gap-3 mt-4'>
                    <button onClick={() => fetchActivities(page - 1)} disabled={page <= 1}
                        className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed'>
                        Previous
                    </button>
                    <span className='text-[13px] text-[#9E9E9E]'>Page {page} of {totalPages}</span>
                    <button onClick={() => fetchActivities(page + 1)} disabled={page >= totalPages}
                        className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed'>
                        Next
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedId && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[560px] p-6'>
                        {/* Modal header */}
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-[18px] font-bold text-[#1A1A1A]'>Activity Details</h2>
                            <button onClick={() => { setSelectedId(null); setDetail(null); }}
                                className='text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                    <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                                </svg>
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className='flex justify-center py-10'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin'/>
                            </div>
                        ) : !detail ? (
                            <p className='text-center text-[13px] text-[#9E9E9E] py-8'>Details not available</p>
                        ) : (
                            <div className='bg-[#F8F8F8] rounded-[12px] p-5'>
                                <div className='grid grid-cols-2 gap-x-8 gap-y-5'>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>User</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.user || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Estate</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.estate || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Role</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.role || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Unit</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.unit || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Phone</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.phone || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Email</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{detail.email || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Date</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{formatDate(detail.date || '')}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Time</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{formatTime(detail.time || '')}</p>
                                    </div>
                                </div>
                                {detail.details && (
                                    <div className='mt-5 pt-5 border-t border-[#E8E8E8]'>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1 underline'>Details</p>
                                        <p className='text-[14px] text-[#1A1A1A]'>
                                            {typeof detail.details === 'string' ? detail.details : JSON.stringify(detail.details)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}