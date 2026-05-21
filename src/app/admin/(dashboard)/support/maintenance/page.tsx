'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface MaintenanceItem {
    _id?: string;
    residentName?: string;
    estateName?: string;
    email?: string;
    issue?: string;
    title?: string;
    date?: string;
    createdAt?: string;
    status?: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    OPEN:        { label: 'Open',        color: '#1565C0', bg: '#E3F2FD' },
    IN_PROGRESS: { label: 'In Progress', color: '#E65100', bg: '#FFF3E0' },
    RESOLVED:    { label: 'Resolved',    color: '#2E7D32', bg: '#E8F5E9' },
    CANCELLED:   { label: 'Cancelled',   color: '#757575', bg: '#F5F5F5' },
};

const StatusBadge = ({ s }: { s: string }) => {
    const cfg = statusConfig[s?.toUpperCase()] || { label: s || 'Unknown', color: '#757575', bg: '#F5F5F5' };
    return (
        <span style={{ color: cfg.color, background: cfg.bg }}
            className='text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize'>
            {cfg.label}
        </span>
    );
};

export default function AdminMaintenanceListPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<MaintenanceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { fetchRequests(); }, [page, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            if (statusFilter) params.status = statusFilter;
            const res = await api.get('/admin/maintenance', { params });
            const d = res.data?.data || res.data || {};
            setRequests(d.results || []);
            setTotalCount(d.totalCount || d.total || 0);
            setTotalPages(d.totalPages || Math.ceil((d.totalCount || 0) / 20) || 1);
        } catch { setRequests([]); }
        finally { setLoading(false); }
    };

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Maintenance Requests</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-0.5'>{totalCount} total requests</p>
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className='h-[38px] px-3 text-[13px] border border-[#E0E0E0] rounded-[8px] text-[#1A1A1A] focus:outline-none focus:border-[#006AFF] bg-white'>
                    <option value=''>All Status</option>
                    <option value='pending'>Pending</option>
                    <option value='in_progress'>In Progress</option>
                    <option value='resolved'>Resolved</option>
                    <option value='closed'>Closed</option>
                </select>
            </div>

            <div className='bg-white rounded-[12px] border border-[#F0F0F0] overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                        <tr>
                            {['Resident', 'Estate', 'Issue', 'Date', 'Status', 'Action'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className='text-center py-12'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin mx-auto' />
                            </td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan={6} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No maintenance requests found</td></tr>
                        ) : requests.map(r => (
                            <tr key={r._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{r.residentName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(!r.estateName || r.estateName === 'N/A') ? '—' : r.estateName}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B] max-w-[200px] truncate'>{r.issue || r.title || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {(r.date || r.createdAt) ? new Date((r.date || r.createdAt)!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                </td>
                                <td className='px-4 py-3'><StatusBadge s={r.status || 'pending'} /></td>
                                <td className='px-4 py-3'>
                                    <button
                                        onClick={() => router.push(`/admin/support/maintenance/${r._id}`)}
                                        className='text-[12px] text-[#006AFF] hover:underline font-medium'>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className='flex items-center justify-between mt-4'>
                    <p className='text-[13px] text-[#6B6B6B]'>Page {page} of {totalPages}</p>
                    <div className='flex gap-2'>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className='px-3 py-1.5 text-[12px] border border-[#E0E0E0] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>
                            Previous
                        </button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className='px-3 py-1.5 text-[12px] border border-[#E0E0E0] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}