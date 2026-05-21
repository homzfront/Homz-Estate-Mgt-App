'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Estate {
    _id: string;
    name: string;
    location?: string;
    residentsCount?: number;
    managersCount?: number;
    phoneNumber?: string;
    dateCreated?: string;
    createdAt?: string;
    status?: string;
    isActive?: boolean;
}

const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${active ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
        {active ? 'Active' : 'Suspended'}
    </span>
);

export default function AdminEstatesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [estates, setEstates] = useState<Estate[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'all' | 'active' | 'suspended'>('all');
    const [search, setSearch] = useState(searchParams?.get('search') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const urlSearch = searchParams?.get('search') || '';
        if (urlSearch !== search) setSearch(urlSearch);
        fetchEstates();
    }, [tab, page, searchParams]);

    // Re-fetch when window regains focus (returning from estate detail after suspend)
    useEffect(() => {
        const onFocus = () => fetchEstates();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [tab, page]);

    const fetchEstates = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page), limit: '15' };
            if (tab !== 'all') params.status = tab;
            if (search) params.search = search;
            const res = await api.get('/admin/estates', { params });
            const data = res.data?.data || res.data || {};
            setEstates(data?.estates || data?.results || []);
            const total = data?.total || data?.totalCount || 0;
            const lim = data?.limit || 15;
            setTotalPages(Math.ceil(total / lim) || 1);
        } catch {
            setEstates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { setPage(1); fetchEstates(); }
    };

    const filtered = estates.filter(e =>
        !search || e.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='p-6'>
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Estates</h1>
                    <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Manage and monitor all estates across the platform</p>
                </div>
                <Link href='/admin/estates/creates'
                    className='h-[40px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium flex items-center gap-2 hover:bg-[#0055CC] transition-colors'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Create Estate
                </Link>
            </div>

            {/* Tabs + search */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex gap-1 border-b border-[#F0F0F0]'>
                    {(['all', 'active', 'suspended'] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setPage(1); }}
                            className={`px-4 py-2 text-[13px] font-medium capitalize transition-colors
                                ${tab === t ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['Estate Name', 'Location', 'Residents', 'Managers', 'Phone Number', 'Date Created', 'Status', 'Actions'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className='text-center py-12 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No estates found</td></tr>
                        ) : filtered.map((estate) => (
                            <tr key={estate._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors'>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{estate.name || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{estate.location || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{(estate.residentsCount || 0).toLocaleString()}</td>
                                <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{estate.managersCount ?? 0}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{estate.phoneNumber || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {(estate.dateCreated || estate.createdAt) ? new Date(estate.dateCreated || estate.createdAt!).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
                                </td>
                                <td className='px-4 py-3'><StatusBadge active={estate.status !== 'Suspended' && estate.isActive !== false} /></td>
                                <td className='px-4 py-3'>
                                    <Link href={`/admin/estates/${estate._id}`}
                                        className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
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