'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Plan {
    _id: string;
    name: string;
    description?: string;
    monthlyPrice: number;
    annualPrice?: number;
    yearlyPrice?: number;
    features: string[];
    isActive?: boolean;
}

export default function EditPlanPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        monthlyPrice: '',
        yearlyPrice: '',
        features: ['', '', '', '', ''],
        isActive: true,
    });

    useEffect(() => { if (id) fetchPlan(); }, [id]);

    const fetchPlan = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/subscriptions/plans/${id}`);
            const p: Plan = res.data?.data || res.data;
            setForm({
                name: p.name || '',
                description: p.description || '',
                monthlyPrice: p.monthlyPrice ? String(p.monthlyPrice) : '',
                yearlyPrice: (p.annualPrice || p.yearlyPrice) ? String(p.annualPrice || p.yearlyPrice) : '',
                features: p.features?.length ? [...p.features, ...Array(Math.max(0, 5 - p.features.length)).fill('')] : ['', '', '', '', ''],
                isActive: p.isActive !== false,
            });
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ''] }));
    const updateFeature = (i: number, v: string) => setForm(f => ({ ...f, features: f.features.map((x, idx) => idx === i ? v : x) }));

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Plan name required');
        setSaving(true);
        try {
            await api.patch(`/admin/subscriptions/plans/${id}`, {
                name: form.name,
                description: form.description,
                monthlyPrice: Number(form.monthlyPrice) || 0,
                annualPrice: form.yearlyPrice ? Number(form.yearlyPrice) : undefined,
                features: form.features.filter(f => f.trim()),
                isActive: form.isActive,
            });
            toast.success('Plan updated');
            router.push(`/admin/subscriptions/plans/${id}`);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to update plan');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/admin/subscriptions/plans/${id}`);
            toast.success('Plan deleted');
            router.push('/admin/subscriptions/plans');
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to delete plan');
        } finally { setDeleting(false); setShowDelete(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[900px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-8'>
                <h1 className='text-[20px] font-bold text-[#1A1A1A] mb-6'>Edit Plan Details</h1>

                <div className='space-y-5'>
                    {/* Plan Name */}
                    <div>
                        <label className='block text-[13px] font-medium text-[#1A1A1A] mb-2'>Plan Name</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder='Enterprise Plan'
                            className='w-full h-[50px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>

                    {/* Plan Description */}
                    <div>
                        <label className='block text-[13px] font-medium text-[#1A1A1A] mb-2'>Plan Description</label>
                        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder='Adoption & Onboarding'
                            className='w-full h-[50px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>

                    {/* Pricing */}
                    <div>
                        <p className='text-[14px] font-bold text-[#1A1A1A] border-b border-[#E8E8E8] pb-2 mb-4'>Pricing</p>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-[13px] font-medium text-[#1A1A1A] mb-2'>Monthly</label>
                                <input type='number' value={form.monthlyPrice} onChange={e => setForm(f => ({ ...f, monthlyPrice: e.target.value }))}
                                    placeholder='Enter price monthly'
                                    className='w-full h-[50px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                            </div>
                            <div>
                                <label className='block text-[13px] font-medium text-[#1A1A1A] mb-2'>Yearly</label>
                                <input type='number' value={form.yearlyPrice} onChange={e => setForm(f => ({ ...f, yearlyPrice: e.target.value }))}
                                    placeholder='Enter price yearly'
                                    className='w-full h-[50px] border border-[#E8E8E8] rounded-[8px] px-4 text-[13px] outline-none focus:border-[#006AFF]' />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <p className='text-[14px] font-bold text-[#1A1A1A] border-b border-[#E8E8E8] pb-2 mb-4'>Enter Plan Features</p>
                        <div className='space-y-3'>
                            {form.features.map((f, i) => (
                                <input key={i} value={f} onChange={e => updateFeature(i, e.target.value)}
                                    placeholder={`Feature ${i + 1}`}
                                    className='w-full h-[44px] border-b border-[#E8E8E8] px-0 text-[13px] outline-none bg-transparent focus:border-[#006AFF]' />
                            ))}
                        </div>
                        <button onClick={addFeature}
                            className='mt-4 flex items-center gap-1.5 text-[13px] text-[#006AFF] font-medium hover:underline'>
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' /></svg>
                            Add Feature Input
                        </button>
                    </div>

                    {/* Plan Status */}
                    <div>
                        <p className='text-[14px] font-bold text-[#1A1A1A] border-b border-[#E8E8E8] pb-2 mb-4'>Plan Status</p>
                        <div className='flex items-center gap-3'>
                            <span className='text-[13px] text-[#1A1A1A]'>Active</span>
                            <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-[#006AFF]' : 'bg-[#9E9E9E]'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save button */}
                <div className='flex items-center justify-between mt-8'>
                    <button onClick={() => setShowDelete(true)}
                        className='h-[50px] px-8 border border-[#EF4444] text-[#EF4444] rounded-[8px] text-[14px] font-semibold hover:bg-[#FEF2F2]'>
                        Delete Plan
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='h-[50px] px-10 bg-[#006AFF] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 flex items-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        Update Changes
                    </button>
                </div>
            </div>

            {showDelete && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[380px] p-6'>
                        <div className='w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                <path d='M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
                            </svg>
                        </div>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>Delete this plan?</h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>
                            This plan will be permanently removed. Estates currently on this plan will not be affected.
                        </p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowDelete(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                className='flex-1 h-[40px] bg-[#EF4444] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#DC2626] disabled:opacity-60'>
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}