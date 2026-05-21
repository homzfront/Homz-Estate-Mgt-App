'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Plan {
    _id: string;
    name: string;
    tier: string;
    monthlyPrice: number;
    annualPrice?: number;
    yearlyPrice?: number;
    features: string[];
    isActive?: boolean;
    subscriberCount?: number;
    estatesUsing?: number;
    updatedAt?: string;
    description?: string;
}

const formatNaira = (n: number) => '₦' + (n || 0).toLocaleString('en-NG');

function CreatePlanModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ name: '', description: '', monthlyPrice: '', yearlyPrice: '', features: ['', '', '', '', ''], isActive: true });
    const [saving, setSaving] = useState(false);

    const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ''] }));
    const updateFeature = (i: number, v: string) => setForm(f => ({ ...f, features: f.features.map((x, idx) => idx === i ? v : x) }));

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Plan name required');
        setSaving(true);
        try {
            await api.post('/admin/subscriptions/plans', {
                name: form.name,
                description: form.description,
                monthlyPrice: Number(form.monthlyPrice) || 0,
                annualPrice: form.yearlyPrice ? Number(form.yearlyPrice) : undefined,
                features: form.features.filter(f => f.trim()),
                isActive: form.isActive,
            });
            toast.success('Plan created');
            onSave();
            onClose();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to create plan');
        } finally { setSaving(false); }
    };

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-xl'>
                <div className='flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0]'>
                    <h2 className='text-[16px] font-bold text-[#1A1A1A]'>Create Plan</h2>
                    <button onClick={onClose} className='w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='#1A1A1A' strokeWidth='1.5' strokeLinecap='round' /></svg>
                    </button>
                </div>
                <div className='overflow-y-auto flex-1 px-6 py-5 space-y-4'>
                    <div>
                        <label className='block text-[12px] font-medium mb-1.5'>Plan Name</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='Enterprise Plan'
                            className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>
                    <div>
                        <label className='block text-[12px] font-medium mb-1.5'>Plan Description</label>
                        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder='Adoption & Onboarding'
                            className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>
                    <div>
                        <p className='text-[13px] font-semibold mb-3'>Pricing</p>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-[12px] font-medium mb-1.5'>Monthly</label>
                                <input type='number' value={form.monthlyPrice} onChange={e => setForm(f => ({ ...f, monthlyPrice: e.target.value }))} placeholder='Enter price monthly'
                                    className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                            </div>
                            <div>
                                <label className='block text-[12px] font-medium mb-1.5'>Yearly</label>
                                <input type='number' value={form.yearlyPrice} onChange={e => setForm(f => ({ ...f, yearlyPrice: e.target.value }))} placeholder='Enter price yearly'
                                    className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='text-[13px] font-semibold mb-3'>Enter Plan Features</p>
                        <div className='space-y-2'>
                            {form.features.map((f, i) => (
                                <input key={i} value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`}
                                    className='w-full h-[44px] border-b border-[#E8E8E8] px-0 text-[13px] outline-none focus:border-[#006AFF] bg-transparent' />
                            ))}
                        </div>
                        <button onClick={addFeature} className='mt-3 flex items-center gap-1.5 text-[13px] text-[#006AFF] font-medium hover:underline'>
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' /></svg>
                            Add Feature Input
                        </button>
                    </div>
                    <div>
                        <p className='text-[13px] font-semibold mb-3'>Plan Status</p>
                        <div className='flex items-center gap-3'>
                            <span className='text-[13px] text-[#1A1A1A]'>Active</span>
                            <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-[#006AFF]' : 'bg-[#9E9E9E]'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='px-6 py-4 border-t border-[#F0F0F0] flex justify-end'>
                    <button onClick={handleSave} disabled={saving}
                        className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 flex items-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        Update Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ManageSubscriptionsPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [estatesCounts, setEstatesCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/subscriptions/plans');
            const d = res.data?.data || res.data || [];
            const plansList = Array.isArray(d) ? d : d.data || [];
            setPlans(plansList);
            // Get estate counts per plan from subscriptions list
            try {
                const subsRes = await api.get('/admin/subscriptions', { params: { page: '1' } });
                const subs = subsRes.data?.data?.results || subsRes.data?.results || [];
                const counts: Record<string, number> = {};
                subs.forEach((s: any) => {
                    if (s.planName) counts[s.planName] = (counts[s.planName] || 0) + 1;
                });
                setEstatesCounts(counts);
            } catch { /* silent */ }
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return (
        <div className='p-8 w-full'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Subscription Plans</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-0.5'>Manage subscription plans, pricing, and availability for estate managers.</p>
                </div>
                <button onClick={() => setShowCreate(true)}
                    className='h-[44px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] flex items-center gap-2 flex-shrink-0'>
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2' strokeLinecap='round' /></svg>
                    Create Plan
                </button>
            </div>

            <div className='bg-white rounded-[12px] border border-[#E8E8E8] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#F5F7FF]'>
                            {['Plan Name', 'Price', 'Estates Using', 'Last Updated', 'Status', 'Action'].map(h => (
                                <th key={h} className='px-4 py-3.5 text-[12px] font-semibold text-[#1A1A1A] text-center first:text-left'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className='text-center py-16'>
                                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin mx-auto' />
                            </td></tr>
                        ) : plans.length === 0 ? (
                            <tr><td colSpan={6} className='text-center py-16 text-[13px] text-[#9E9E9E]'>No plans yet</td></tr>
                        ) : plans.map(p => (
                            <tr key={p._id} className='border-t border-[#F5F5F5] hover:bg-[#FAFAFA]'>
                                <td className='px-4 py-4 text-[13px] text-[#1A1A1A]'>{p.name}</td>
                                <td className='px-4 py-4 text-center'>
                                    {(!p.monthlyPrice || p.monthlyPrice === 0) ? (
                                        <span className='text-[13px] text-[#9E9E9E]'>——</span>
                                    ) : (
                                        <div>
                                            <p className='text-[13px] text-[#1A1A1A]'>{formatNaira(p.monthlyPrice)}/ mon</p>
                                            {(p.annualPrice || p.yearlyPrice) ? <p className='text-[12px] text-[#9E9E9E]'>{formatNaira(p.annualPrice || p.yearlyPrice || 0)}/ year</p> : null}
                                        </div>
                                    )}
                                </td>
                                <td className='px-4 py-4 text-[13px] text-[#1A1A1A] text-center'>{estatesCounts[p.name] || p.estatesUsing || p.subscriberCount || 0} Estates</td>
                                <td className='px-4 py-4 text-[13px] text-[#1A1A1A] text-center'>{formatDate(p.updatedAt)}</td>
                                <td className='px-4 py-4 text-center'>
                                    <span className={`text-[12px] font-semibold ${p.isActive !== false ? 'text-[#2E7D32]' : 'text-[#9E9E9E]'}`}>
                                        {p.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className='px-4 py-4 text-center'>
                                    <button onClick={() => router.push(`/admin/subscriptions/plans/${p._id}`)}
                                        className='text-[13px] font-semibold text-[#006AFF] hover:underline'>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreate && <CreatePlanModal onClose={() => setShowCreate(false)} onSave={fetchPlans} />}
        </div>
    );
}