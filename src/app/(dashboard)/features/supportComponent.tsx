/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useAuthSlice } from '@/store/authStore';
import toast from 'react-hot-toast';
import DotLoader from '@/components/general/dotLoader';
import { useRouter, usePathname } from 'next/navigation';
import ArrowLeft from '@/components/icons/arrowLeft';
import api from '@/utils/api';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';

const SupportComponent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isResident = pathname?.startsWith('/resident');
    const { userData, communityProfile } = useAuthSlice();

    // IDs for endpoints
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];

    const emOrgId = selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const emEstateId = selectedCommunity?.estate?._id || '';
    const resOrgId = active?.associatedIds?.organizationId || '';
    const resEstateId = active?.estateId || '';

    const defaultFirstName = communityProfile?.personal?.firstName || (userData as any)?.firstName || '';
    const defaultLastName = communityProfile?.personal?.lastName || (userData as any)?.lastName || '';
    const defaultEmail = communityProfile?.email || userData?.email || '';

    const [form, setForm] = useState({
        firstName: defaultFirstName,
        lastName: defaultLastName,
        email: defaultEmail,
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.message) {
            toast.error('Please fill in all fields', { position: 'top-center' });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                message: form.message,
            };

            if (isResident) {
                await api.post(
                    `/support/resident/organizations/${resOrgId}/estates/${resEstateId}`,
                    payload
                );
            } else {
                await api.post(
                    `/support/community-manager/organizations/${emOrgId}/estates/${emEstateId}`,
                    payload
                );
            }

            toast.success("Message sent! We'll get back to you shortly.", {
                position: 'top-center',
                style: { background: '#E8F5E9', color: '#2E7D32', fontWeight: 500 },
            });
            setForm((f) => ({ ...f, message: '' }));
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(msg, { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-8 w-full'>
            <button onClick={() => router.back()} className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                <ArrowLeft /> Back
            </button>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Contact Support</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Send us a message and our team at <span className='font-medium text-BlackHomz'>support@homz.ng</span> will get back to you.</p>
            </div>

            <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6 max-w-[700px]'>
                <div className='flex flex-col gap-5'>
                    {/* First + Last name */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-BlackHomz'>First Name</label>
                            <input
                                className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                                placeholder='e.g. Josiah'
                                value={form.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-BlackHomz'>Last Name</label>
                            <input
                                className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                                placeholder='e.g. Martins'
                                value={form.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[13px] font-medium text-BlackHomz'>Email</label>
                        <input
                            type='email'
                            className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                            placeholder='e.g. myemail@gmail.com'
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>

                    {/* Message */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[13px] font-medium text-BlackHomz'>Message</label>
                        <textarea
                            className='border border-[#E6E6E6] rounded-[8px] p-4 text-sm outline-none focus:border-BlueHomz transition-colors resize-none'
                            rows={5}
                            placeholder='Report issue here...'
                            value={form.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center'
                    >
                        {loading ? <DotLoader /> : 'Send Message'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportComponent;