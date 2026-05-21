'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface SupportTicket {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: string;
    message?: string;
    status?: string;
    subject?: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    userRole?: string;
    estateName?: string;
    category?: string;
    priority?: string;
    adminResponse?: string;
    respondedBy?: string;
    respondedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    userInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        estate?: string;
        unit?: string;
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        open: { label: 'Open', color: '#E65100', bg: '#FFF3E0' },
        in_progress: { label: 'In Progress', color: '#1565C0', bg: '#E3F2FD' },
        resolved: { label: 'Resolved', color: '#2E7D32', bg: '#E8F5E9' },
        closed: { label: 'Closed', color: '#757575', bg: '#F5F5F5' },
    };
    const s = map[status?.toLowerCase()] || map.open;
    return (
        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold' style={{ color: s.color, background: s.bg }}>
            {s.label}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority?: string }) => {
    if (!priority) return null;
    const map: Record<string, { label: string; color: string }> = {
        low: { label: 'Low', color: '#2E7D32' },
        medium: { label: 'Medium', color: '#E65100' },
        high: { label: 'High', color: '#C62828' },
    };
    const p = map[priority?.toLowerCase()] || map.medium;
    return <span className='text-[12px] font-semibold' style={{ color: p.color }}>{p.label} Priority</span>;
};

export default function SupportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (id) fetchTicket(); }, [id]);

    const fetchTicket = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/support/${id}`);
            const d = res.data?.data || res.data;
            setTicket(d);
            setStatus(d?.status || 'open');
            setResponse(d?.adminResponse || '');
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const handleRespond = async () => {
        if (!response.trim()) return toast.error('Response is required');
        setSaving(true);
        try {
            // Backend uses separate endpoints for respond and resolve
            if (status === 'resolved') {
                await api.post(`/admin/support/${id}/respond`, { response });
                await api.patch(`/admin/support/${id}/resolve`);
            } else {
                await api.post(`/admin/support/${id}/respond`, { response });
            }
            toast.success('Response sent');
            fetchTicket();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to send response');
        } finally { setSaving(false); }
    };

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    if (!ticket) return (
        <div className='p-8'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>
            <p className='text-[13px] text-[#9E9E9E]'>Ticket not found</p>
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[860px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            {/* Header */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 mb-5'>
                <div className='flex items-start justify-between mb-2'>
                    <h1 className='text-[18px] font-bold text-[#1A1A1A]'>{ticket.message ? ticket.message.slice(0, 50) + (ticket.message.length > 50 ? '...' : '') : 'Support Request'}</h1>
                    <div className='flex items-center gap-2'>
                        
                        <StatusBadge status={ticket.status || 'open'} />
                    </div>
                </div>
                <p className='text-[12px] text-[#9E9E9E]'>Submitted {formatDate(ticket.createdAt)}</p>
            </div>

            <div className='grid grid-cols-2 gap-5 mb-5'>
                {/* User info */}
                <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-5'>
                    <h3 className='text-[13px] font-semibold text-[#1A1A1A] mb-4'>User Details</h3>
                    <div className='space-y-3'>
                        {[
                            ['Name', ticket.userInfo?.name || ticket.userName || ticket.firstName ? `${ticket.firstName || ''} ${ticket.lastName || ''}`.trim() : '—'],
                            ['Email', ticket.userInfo?.email || ticket.userEmail || ticket.email || '—'],
                            ['Phone', (ticket.userInfo?.phone && ticket.userInfo.phone !== 'N/A') ? ticket.userInfo.phone : '—'],
                            ['Role', ticket.userInfo?.role || ticket.userRole || ticket.userType || '—'],
                            ['Estate', (ticket.userInfo?.estate && ticket.userInfo.estate !== 'N/A') ? ticket.userInfo.estate : (ticket.estateName && ticket.estateName !== 'N/A') ? ticket.estateName : '—'],
                            ...(ticket.userType === 'RESIDENT' ? [['Unit', (ticket.userInfo?.unit && !ticket.userInfo.unit.includes('Unit -')) ? ticket.userInfo.unit : '—'] as [string, string]] : []),
                        ].map(([k, v]) => (
                            <div key={k}>
                                <p className='text-[11px] text-[#9E9E9E]'>{k}</p>
                                <p className='text-[13px] font-medium text-[#1A1A1A]'>{v || '—'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket info */}
                <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-5'>
                    <h3 className='text-[13px] font-semibold text-[#1A1A1A] mb-4'>Ticket Info</h3>
                    <div className='space-y-3'>
                        {[
                            ['User Type', ticket.userType || ticket.userInfo?.role || '—'],
                            ['Created', formatDate(ticket.createdAt)],
                            ['Last Updated', formatDate(ticket.updatedAt)],

                        ].map(([k, v]) => (
                            <div key={k}>
                                <p className='text-[11px] text-[#9E9E9E]'>{k}</p>
                                <p className='text-[13px] font-medium text-[#1A1A1A]'>{v || '—'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-5 mb-5'>
                <h3 className='text-[13px] font-semibold text-[#1A1A1A] mb-3'>Message</h3>
                <p className='text-[13px] text-[#3A3A3A] leading-relaxed whitespace-pre-wrap'>{ticket.message}</p>
            </div>

            {/* Previous response */}
            {ticket.adminResponse && (
                <div className='bg-[#F8FBFF] rounded-[12px] border border-[#D0E8FF] p-5 mb-5'>
                    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-3'>Previous Response</h3>
                    <p className='text-[13px] text-[#3A3A3A] leading-relaxed whitespace-pre-wrap'>{ticket.adminResponse}</p>
                </div>
            )}

            {/* Respond */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-5'>
                <h3 className='text-[13px] font-semibold text-[#1A1A1A] mb-4'>Respond</h3>
                <textarea
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    rows={5}
                    placeholder='Type your response...'
                    className='w-full border border-[#E8E8E8] rounded-[8px] px-4 py-3 text-[13px] outline-none focus:border-[#006AFF] resize-none mb-4'
                />
                <div className='flex items-center gap-3'>
                    <select value={status} onChange={e => setStatus(e.target.value)}
                        className='h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF] bg-white'>
                        <option value='open'>Open</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='resolved'>Resolved</option>
                        <option value='closed'>Closed</option>
                    </select>
                    <button onClick={handleRespond} disabled={saving}
                        className='h-[44px] px-6 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC] disabled:opacity-60 flex items-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        Send Response
                    </button>
                </div>
            </div>


            
        </div>
    );
}