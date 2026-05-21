'use client';
import React, { useEffect, useState, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

type TabType = 'support' | 'maintenance';

interface SupportMsg {
    _id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    residentName?: string;
    email?: string;
    message?: string;
    subject?: string;
    status?: string;
    userType?: string;
    estateName?: string;
    createdAt?: string;
    date?: string;
}
interface MaintenanceReq {
    _id?: string;
    residentName?: string;
    estateName?: string;
    email?: string;
    issue?: string;
    title?: string;
    description?: string;
    category?: string;
    date?: string;
    createdAt?: string;
    status?: string;
}

const StatusBadge = ({ status }: { status?: string }) => {
    const s = status?.toLowerCase();
    const styles: Record<string, string> = { pending: 'text-[#E65100]', resolved: 'text-[#2E7D32]', 'in-progress': 'text-[#006AFF]', completed: 'text-[#2E7D32]' };
    return <span className={`text-[12px] font-medium capitalize ${styles[s || ''] || 'text-[#9E9E9E]'}`}>{status || '—'}</span>;
};

function AdminSupportPageInner() {
    const router = useRouter();
    const [tab, setTab] = useState<TabType>('support');
    const [messages, setMessages] = useState<SupportMsg[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceReq[]>([]);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ totalSupport: 0, totalMaintenance: 0, inProgress: 0, resolved: 0 });

    // Fetch both on mount so all stat cards populate immediately
    useEffect(() => {
        fetchMessages();
        fetchMaintenance();
    }, []);

    // Re-fetch active tab when page changes
    useEffect(() => {
        if (tab === 'support') fetchMessages();
        else fetchMaintenance();
    }, [tab, page]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const [listRes, summaryRes] = await Promise.allSettled([
                api.get('/admin/support', { params: { page: String(page), ...(searchParams?.get('search') ? { search: searchParams.get('search') } : {}) } }),
                api.get('/admin/support/summary'),
            ]);
            if (listRes.status === 'fulfilled') {
                const sd = listRes.value.data?.data || listRes.value.data || {};
                setMessages(sd.results || []);
                setTotalPages(sd.totalPages || Math.ceil((sd.totalCount || sd.total || 0) / 20) || 1);
                setStats(s => ({ ...s, totalSupport: sd.totalCount || sd.total || 0 }));
            }
            if (summaryRes.status === 'fulfilled') {
                const ss = summaryRes.value.data?.data || summaryRes.value.data || {};
                // totalTickets, resolvedTickets, pendingTickets from /admin/support/summary
                setStats(s => ({ ...s, totalSupport: ss.totalTickets || s.totalSupport }));
            }
        } catch { setMessages([]); }
        finally { setLoading(false); }
    };

    const fetchMaintenance = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/maintenance', { params: { page: String(page), ...(searchParams?.get('search') ? { search: searchParams.get('search') } : {}) } });
            const md = res.data?.data || res.data || {};
            const results = md.results || [];
            setMaintenance(results);
            setTotalPages(md.totalPages || Math.ceil((md.totalCount || md.total || 0) / 20) || 1);
            setStats(s => ({
                ...s,
                totalMaintenance: md.totalCount || md.total || results.length || 0,
                inProgress: results.filter((m: any) => m.status === 'IN_PROGRESS').length,
                resolved:   results.filter((m: any) => m.status === 'RESOLVED').length,
            }));
        } catch { setMaintenance([]); }
        finally { setLoading(false); }
    };

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Support & Issues</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Manage user complaints, support requests and maintenance reports across estates</p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-4 gap-4 mb-6'>
                {[
                    { label: 'Total Support Messages', value: stats.totalSupport || 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#006AFF" strokeWidth="1.5"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#006AFF" strokeWidth="2" strokeLinecap="round"/></svg>, bg: '#EEF5FF' },
                    { label: 'Maintenance Requests', value: stats.totalMaintenance || 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#8B5CF6" strokeWidth="1.5"/></svg>, bg: '#F5F3FF' },
                    { label: 'In Progress (Maintenance)', value: stats.inProgress || 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#E65100" strokeWidth="1.5"/><polyline points="12,6 12,12 16,14" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#FFF7ED' },
                    { label: 'Resolved (Maintenance)', value: stats.resolved || 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F0FFF4' },
                ].map((c, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4 flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: c.bg }}>{c.icon}</div>
                        <div>
                            <p className='text-[18px] font-bold text-[#1A1A1A]'>{c.value}</p>
                            <p className='text-[11px] text-[#6B6B6B]'>{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className='flex gap-1 border-b border-[#F0F0F0] mb-4'>
                {[{ key: 'support' as TabType, label: 'Support Messages' }, { key: 'maintenance' as TabType, label: 'Maintenance Requests' }].map(t => (
                    <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
                        className={`px-4 py-2 text-[13px] font-medium transition-colors ${tab === t.key ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Support messages */}
            {tab === 'support' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['User', 'Estate', 'Email', 'Subject', 'Date', 'Status', 'Action'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className='text-center py-12 text-[#9E9E9E] text-[13px]'>Loading...</td></tr>
                            ) : messages.length === 0 ? (
                                <tr><td colSpan={7} className='text-center py-12 text-[#9E9E9E] text-[13px]'>No support messages</td></tr>
                            ) : messages.map((m) => (
                                <tr key={m._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{(m.firstName || m.lastName) ? `${m.firstName || ''} ${m.lastName || ''}`.trim() : m.email?.split('@')[0] || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(!m.estateName || m.estateName === 'N/A') ? '—' : m.estateName}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B] truncate max-w-[140px]'>{m.email || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B] truncate max-w-[160px]'>{m.message ? (m.message.length > 40 ? m.message.slice(0, 40) + '...' : m.message) : '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{new Date(m.date || m.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td className='px-4 py-3'><StatusBadge status={m.status || 'pending'} /></td>
                                    <td className='px-4 py-3'>
                                        <button onClick={() => router.push(`/admin/support/${m._id}`)} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
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
            )}

            {/* Maintenance requests */}
            {tab === 'maintenance' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Resident', 'Estate', 'Issue', 'Date', 'Status', 'Action'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className='text-center py-12 text-[#9E9E9E] text-[13px]'>Loading...</td></tr>
                            ) : maintenance.length === 0 ? (
                                <tr><td colSpan={6} className='text-center py-12 text-[#9E9E9E] text-[13px]'>No maintenance requests</td></tr>
                            ) : maintenance.map((m) => (
                                <tr key={m._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{m.residentName || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(!m.estateName || m.estateName === 'N/A') ? '—' : m.estateName}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B] truncate max-w-[180px]'>{m.issue || m.title || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{m.date || m.createdAt ? new Date((m.date || m.createdAt)!).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</td>
                                    <td className='px-4 py-3'><StatusBadge status={m.status || 'OPEN'} /></td>
                                    <td className='px-4 py-3'>
                                        <button onClick={() => router.push(`/admin/support/maintenance/${m._id}`)} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function AdminSupportPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <AdminSupportPageInner />
        </Suspense>
    );
}