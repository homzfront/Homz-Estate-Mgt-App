'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Plan {
    _id: string;
    name: string;
    tier: string;
    monthlyPrice: number;
}

interface Subscription {
    _id: string;
    communityManagerName?: string;
    communityManagerEmail?: string;
    planId?: string;
    planName?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
    amount?: number;
}

const formatDate = (d?: string) => d ? new Date(d).toISOString().split('T')[0] : '';

export default function EditSubscriptionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [sub, setSub] = useState<Subscription | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        planId: '',
        status: 'active',
        startDate: '',
        endDate: '',
        autoRenew: true,
    });

    useEffect(() => {
        if (id) {
            Promise.all([fetchSub(), fetchPlans()]).finally(() => setLoading(false));
        }
    }, [id]);

    const fetchSub = async () => {
        try {
            const res = await api.get(`/admin/subscriptions/${id}`);
            const d = res.data?.data || res.data;
            setSub(d);
            setForm({
                planId: d?.planId || '',
                status: d?.status || 'active',
                startDate: formatDate(d?.startDate),
                endDate: formatDate(d?.endDate),
                autoRenew: d?.autoRenew !== false,
            });
        } catch { /* silent */ }
    };

    const fetchPlans = async () => {
        try {
            const res = await api.get('/admin/subscriptions/plans');
            const d = res.data?.data || res.data || [];
            setPlans(Array.isArray(d) ? d : d.data || []);
        } catch { /* silent */ }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/admin/subscriptions/${id}`, form);
            toast.success('Subscription updated');
            router.push(`/admin/subscriptions/${id}`);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to update');
        } finally { setSaving(false); }
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button onClick={onChange} className={`w-11 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-[#006AFF]' : 'bg-[#E0E0E0]'}`} style={{ height: 22 }}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
    );

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[600px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            <h1 className='text-[22px] font-bold text-[#1A1A1A] mb-1'>Edit Subscription</h1>
            {sub && <p className='text-[13px] text-[#9E9E9E] mb-6'>{sub.communityManagerName} · {sub.communityManagerEmail}</p>}

            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 space-y-5'>
                {/* Plan */}
                <div>
                    <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Subscription Plan</label>
                    <select value={form.planId} onChange={e => setForm(f => ({ ...f, planId: e.target.value }))}
                        className='w-full h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF] bg-white'>
                        <option value=''>Select plan</option>
                        {plans.map(p => (
                            <option key={p._id} value={p._id}>{p.name} — ₦{(p.monthlyPrice / 100).toLocaleString()}/mo</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className='w-full h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF] bg-white'>
                        <option value='active'>Active</option>
                        <option value='expired'>Expired</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value='pending'>Pending</option>
                    </select>
                </div>

                {/* Dates */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Start Date</label>
                        <input type='date' value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                            className='w-full h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>
                    <div>
                        <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>End Date</label>
                        <input type='date' value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                            className='w-full h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>
                </div>

                {/* Auto renew */}
                <div className='flex items-center justify-between py-1'>
                    <div>
                        <p className='text-[13px] font-medium text-[#1A1A1A]'>Auto Renew</p>
                        <p className='text-[12px] text-[#9E9E9E]'>Automatically renew when subscription expires</p>
                    </div>
                    <Toggle checked={form.autoRenew} onChange={() => setForm(f => ({ ...f, autoRenew: !f.autoRenew }))} />
                </div>

                {/* Actions */}
                <div className='flex gap-3 pt-2'>
                    <button onClick={() => router.back()}
                        className='flex-1 h-[44px] border border-[#E8E8E8] rounded-[8px] text-[13px] font-medium hover:bg-[#F5F5F5]'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='flex-1 h-[44px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC] disabled:opacity-60 flex items-center justify-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}