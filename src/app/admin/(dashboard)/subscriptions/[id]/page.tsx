'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Subscription {
    _id: string;
    managerName?: string;
    managerEmail?: string;
    managerPhone?: string;
    estateName?: string;
    planName?: string;
    amount?: number;
    billingCycle?: string;
    startDate?: string;
    nextBillingDate?: string;
    status?: string;
}

const formatNaira = (n?: number) => n !== undefined ? '₦' + n.toLocaleString('en-NG') : '—';
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function SubscriptionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [sub, setSub] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchSub(); }, [id]);

    const fetchSub = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/subscriptions/${id}`);
            const raw = res.data?.data || res.data || {};
            // Flatten nested managerInfo and billingInfo into top-level fields
            setSub({
                ...raw,
                status:        raw.status        || raw.billingInfo?.status,
                managerName:   raw.managerName   || raw.managerInfo?.name,
                estateName:    raw.estateName    || raw.managerInfo?.estate,
                managerPhone:  raw.managerPhone  || raw.managerInfo?.phone,
                managerEmail:  raw.managerEmail  || raw.managerInfo?.email,
                planName:      raw.planName      || raw.billingInfo?.plan,
                amount:        raw.amount        ?? raw.billingInfo?.amount,
                billingCycle:  raw.billingCycle  || raw.billingInfo?.billingCycle,
                nextBillingDate: raw.nextBillingDate || raw.billingInfo?.nextBillingDate || raw.endDate,
                startDate:     raw.startDate     || raw.billingInfo?.startDate,
            });
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const statusColor = (s?: string) => {
        if (s === 'active') return 'text-[#2E7D32]';
        if (s === 'expired') return 'text-[#E65100]';
        return 'text-[#9E9E9E]';
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    if (!sub) return (
        <div className='p-8'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>
            <p className='text-[13px] text-[#9E9E9E]'>Subscription not found</p>
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[900px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            {/* Header */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                <h1 className='text-[18px] font-bold text-[#1A1A1A]'>Subscription Details</h1>
                <p className='text-[13px] text-[#9E9E9E] mt-0.5'>({sub.estateName || 'Estate'})</p>
            </div>

            {/* Details */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                {/* Estate Manager Info */}
                <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>Estate Manager Information</p>
                <div className='grid grid-cols-3 gap-y-5 mb-6'>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Manager Name</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{sub.managerName || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Estate</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{sub.estateName || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Phone</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{sub.managerPhone || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Email</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{sub.managerEmail || '—'}</p>
                    </div>
                </div>

                <div className='border-t border-[#F0F0F0] mb-5' />

                {/* Billing Info */}
                <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>Billing Information</p>
                <div className='grid grid-cols-3 gap-y-5'>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Plan</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{sub.planName || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Amount</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{formatNaira(sub.amount)}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Billing Cycle</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A] capitalize'>{sub.billingCycle || 'Monthly'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Start Date</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{formatDate(sub.startDate)}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Next Billing Date</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{formatDate(sub.nextBillingDate)}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Status</p>
                        <p className={`text-[13px] font-semibold capitalize ${statusColor(sub.status)}`}>
                            {sub.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : 'Active'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact button */}
            <div className='flex justify-end'>
                <button
                    onClick={() => sub.managerEmail && window.open(`mailto:${sub.managerEmail}`)}
                    className='h-[48px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC]'>
                    Contact Estate Manager
                </button>
            </div>
        </div>
    );
}