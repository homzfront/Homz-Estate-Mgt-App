'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Plan {
    _id: string;
    name: string;
    description?: string;
    monthlyPrice: number;
    annualPrice?: number;
    yearlyPrice?: number;
    features: string[];
    isActive?: boolean;
    subscriberCount?: number;
    estatesUsing?: number;
}

const formatNaira = (n: number) => '₦' + (n || 0).toLocaleString('en-NG');

export default function ViewPlanPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [plan, setPlan] = useState<Plan | null>(null);
    const [estatesUsing, setEstatesUsing] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchPlan(); }, [id]);

    const fetchPlan = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/subscriptions/plans/${id}`);
            const raw = res.data?.data || res.data || {};
            // Normalize annualPrice/yearlyPrice
            setPlan({ ...raw, annualPrice: raw.annualPrice || raw.yearlyPrice || 0, features: raw.features || [] });
            // Count estates using this plan
            try {
                const subsRes = await api.get('/admin/subscriptions', { params: { page: '1' } });
                const subs = subsRes.data?.data?.results || subsRes.data?.results || [];
                setEstatesUsing(subs.filter((s: any) => s.planName === raw.name).length);
            } catch { /* silent */ }
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    if (!plan) return (
        <div className='p-8'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>
            <p className='text-[13px] text-[#9E9E9E]'>Plan not found</p>
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[900px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            {/* Header */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5 flex items-center justify-between'>
                <div>
                    <h1 className='text-[20px] font-bold text-[#1A1A1A]'>{plan.name}</h1>
                    {plan.description && <p className='text-[13px] text-[#9E9E9E] mt-0.5'>{plan.description}</p>}
                </div>
                <button onClick={() => router.push(`/admin/subscriptions/plans/${id}/edit`)}
                    className='h-[44px] px-6 border border-[#006AFF] text-[#006AFF] rounded-[8px] text-[13px] font-semibold hover:bg-[#F0F7FF]'>
                    Edit Plan
                </button>
            </div>

            {/* Plan details */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6'>
                {/* Name + price */}
                <div className='flex items-start justify-between pb-5 border-b border-[#F0F0F0] mb-5'>
                    <div>
                        <p className='text-[16px] font-bold text-[#1A1A1A]'>{plan.name}</p>
                        {plan.description && <p className='text-[13px] text-[#9E9E9E]'>{plan.description}</p>}
                    </div>
                    <div className='text-right'>
                        {plan.monthlyPrice > 0 ? (
                            <div className='flex items-center gap-6'>
                                <p className='text-[16px] font-bold text-[#1A1A1A]'>{formatNaira(plan.monthlyPrice)}/ mon</p>
                                {(plan.annualPrice || plan.yearlyPrice) ? <p className='text-[16px] font-bold text-[#1A1A1A]'>{formatNaira(plan.annualPrice || plan.yearlyPrice || 0)}/ Year</p> : null}
                            </div>
                        ) : (
                            <p className='text-[16px] font-bold text-[#1A1A1A]'>Free</p>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className='mb-5'>
                    <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>Features</p>
                    <ul className='space-y-3'>
                        {(plan.features || []).filter(Boolean).map((f, i) => (
                            <li key={i} className='flex items-start gap-3'>
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='mt-0.5 flex-shrink-0'>
                                    <path d='M20 6L9 17l-5-5' stroke='#1A1A1A' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                                <span className='text-[13px] text-[#1A1A1A]'>{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div className='border-t border-[#F0F0F0] my-5' />

                {/* Usage */}
                <div className='mb-5'>
                    <p className='text-[13px] font-semibold text-[#006AFF] underline mb-3'>Usage</p>
                    <p className='text-[13px] text-[#1A1A1A]'>
                        {estatesUsing} estates are currently using this plan
                    </p>
                </div>

                {/* Divider */}
                <div className='border-t border-[#F0F0F0] my-5' />

                {/* Status */}
                <div>
                    <p className='text-[13px] font-semibold text-[#006AFF] underline mb-3'>Status</p>
                    <p className='text-[13px] font-semibold text-[#1A1A1A]'>{plan.isActive !== false ? 'Active' : 'Inactive'}</p>
                </div>
            </div>
        </div>
    );
}