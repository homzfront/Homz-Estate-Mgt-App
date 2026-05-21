'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function SecurityDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/admin/access-control/${id}`);
                const raw = res.data?.data || res.data || {};
                // Flatten residentInfo into top level
                // Helper to safely stringify any field
                const safe = (v: any) => v && typeof v === 'object' ? JSON.stringify(v) : v;
                setRecord({
                    ...raw,
                    residentName:  raw.residentName  || raw.residentInfo?.name,
                    residentPhone: (raw.residentInfo?.phone && raw.residentInfo.phone !== 'N/A') ? raw.residentInfo.phone : (raw.residentPhone || null),
                    residentEmail: raw.residentEmail || raw.residentInfo?.email,
                    role:          raw.role          || raw.residentInfo?.role,
                    unit:          raw.unit          || raw.residentInfo?.unit,
                    estateName:    (raw.estateName && raw.estateName !== 'N/A') ? raw.estateName : (raw.residentInfo?.estate && raw.residentInfo.estate !== 'N/A') ? raw.residentInfo.estate : '—',
                    status:        raw.status        || raw.accessStatus,
                    userId:        raw.userId?.toString?.() || raw.associatedIds?.userId?.toString?.() || raw.userId,
                    visitorName:   raw.visitorName   || raw.visitor,
                    noOfVisitors:  raw.noOfVisitors  || raw.numberOfVisitors,
                });
            } catch { toast.error('Failed to load access record'); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    const r = record || {};
    const s = (r.accessStatus || r.status || '').toLowerCase();
    const statusColor = s === 'signed in' ? 'text-[#2E7D32]' : s === 'pending' ? 'text-[#E65100]' : s === 'expired' ? 'text-[#EF4444]' : 'text-[#6B6B6B]';
    const statusLabel = s === 'signed in' ? 'Signed In' : s === 'signed out' ? 'Signed Out' : s === 'pending' ? 'Pending' : s === 'expired' ? 'Expired' : r.accessStatus || r.status || '—';

    return (
        <div className='p-6 max-w-[800px]'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Back
            </button>

            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-4'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Visitor Access Record</h1>
                <p className='text-[13px] text-[#6B6B6B]'>({r.estateName || r.estate?.name || r.estate?.basicDetails?.name || 'Estate'})</p>
            </div>

            {/* Resident info */}
            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-4'>
                <h2 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Resident Information</h2>
                <div className='grid grid-cols-3 gap-6'>
                    {[
                        ['Resident Name',
                            r.residentName
                            || r.resident?.name
                            || (r.resident?.firstName ? `${r.resident.firstName} ${r.resident.lastName || ''}`.trim() : '')
                            || '—'],
                        ['Role', r.role || 'Owner'],
                        ['Estate', r.estateName || r.estate?.name || r.estate?.basicDetails?.name || '—'],
                        ['Unit', (r.unit && !r.unit.includes('Unit -')) ? r.unit : '—'],
                        ['Phone', (r.residentPhone && r.residentPhone !== 'N/A') ? r.residentPhone : '—'],
                        ['Email', (r.residentEmail && r.residentEmail !== 'N/A') ? r.residentEmail : '—'],
                    ].map(([k, v]) => (
                        <div key={k}>
                            <p className='text-[11px] text-[#9E9E9E] mb-1'>{k}</p>
                            <p className='text-[13px] font-semibold text-[#1A1A1A]'>{v}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visitor info */}
            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-6'>
                <h2 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Visitor&apos;s Information</h2>
                <div className='grid grid-cols-3 gap-6'>
                    {[
                        ['Visitors Name', r.visitorName || r.visitor || r.guestName || '—'],
                        ['Purpose', r.purpose || '—'],
                        ['No of Visitor', r.noOfVisitors || r.numberOfVisitors || '—'],
                        ['Phone', (r.phoneNumber && r.phoneNumber !== 'N/A') ? r.phoneNumber : (r.visitorPhone || '—')],
                        ['Date of Visit', (r.arrivalDate || r.createdAt) ? new Date(r.arrivalDate || r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                        ['Expected Arrival Time', r.expectedArrivalTime ? (typeof r.expectedArrivalTime === 'object' ? `${new Date(r.expectedArrivalTime.from).toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'})} - ${new Date(r.expectedArrivalTime.to).toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'})}` : String(r.expectedArrivalTime)) : '—'],
                        ['Access Code', r.accessCode || r.code || '—'],
                        ['Code Type', r.codeType || '—'],
                        ['Access Status', <span key='as' className={`font-semibold ${statusColor}`}>{statusLabel}</span>],
                        ['Time In', r.timeIn ? new Date(r.timeIn).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}) : '—'],
                        ['Time Out', r.timeOut ? new Date(r.timeOut).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}) : '—'],
                    ].map(([k, v], i) => (
                        <div key={i}>
                            <p className='text-[11px] text-[#9E9E9E] mb-1'>{k}</p>
                            <p className='text-[13px] font-semibold text-[#1A1A1A]'>{v}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-end'>
                <button onClick={() => r.userId ? router.push(`/admin/users/${r.userId}`) : undefined} disabled={!r.userId}
                    className='h-[44px] px-6 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC] flex items-center gap-2'>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
                    View Resident Profile
                </button>
            </div>
        </div>
    );
}