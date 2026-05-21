'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div>
        <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>{label}</label>
        {children}
        {hint && <p className='text-[11px] text-[#9E9E9E] mt-1'>{hint}</p>}
    </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className='h-[42px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
);

export default function EditEstatePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // basicDetails
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    // contactInformation
    const [managerPhone, setManagerPhone] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [securityPhone, setSecurityPhone] = useState('');
    const [utilityPhone, setUtilityPhone] = useState('');
    // bankDetails
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');

    useEffect(() => { fetchEstate(); }, [id]);

    const fetchEstate = async () => {
        try {
            const res = await api.get(`/admin/estates/${id}`);
            const e = res.data?.data || res.data || {};
            setName(e.basicDetails?.name || '');
            setState(e.basicDetails?.location?.state || '');
            setArea(e.basicDetails?.location?.area || '');
            setAddress(e.basicDetails?.location?.address || '');
            setManagerPhone(e.contactInformation?.managerPhone || '');
            setEmergencyPhone(e.contactInformation?.emergencyPhone || '');
            setSecurityPhone(e.contactInformation?.securityPhone || '');
            setUtilityPhone(e.contactInformation?.utilityServicesPhone || '');
            setAccountName(e.bankDetails?.accountName || '');
            setAccountNumber(e.bankDetails?.accountNumber || '');
            setBankName(e.bankDetails?.bankName || '');
        } catch { toast.error('Failed to load estate'); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!name.trim()) { toast.error('Estate name is required'); return; }
        setSaving(true);
        try {
            await api.patch(`/admin/estates/${id}`, {
                basicDetails: {
                    name,
                    location: { state, area, address },
                },
                contactInformation: {
                    managerPhone,
                    emergencyPhone,
                    securityPhone,
                    utilityServicesPhone: utilityPhone,
                },
                bankDetails: {
                    accountName,
                    accountNumber,
                    bankName,
                },
            });
            toast.success('Estate updated successfully');
            router.push(`/admin/estates/${id}`);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to update estate');
        } finally { setSaving(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    return (
        <div className='p-6 max-w-[800px]'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                Back
            </button>

            <h1 className='text-[20px] font-semibold text-[#1A1A1A] mb-6'>Edit Estate</h1>

            <div className='space-y-6'>
                {/* Basic Details */}
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Basic Details</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='col-span-2'>
                            <Field label='Estate Name *'>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Accord Estate' />
                            </Field>
                        </div>
                        <Field label='State'>
                            <Input value={state} onChange={e => setState(e.target.value)} placeholder='Lagos' />
                        </Field>
                        <Field label='Area'>
                            <Input value={area} onChange={e => setArea(e.target.value)} placeholder='Lekki' />
                        </Field>
                        <div className='col-span-2'>
                            <Field label='Address'>
                                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder='12 Estate Road' />
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Contact Information</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <Field label='Manager Phone'>
                            <Input value={managerPhone} onChange={e => setManagerPhone(e.target.value)} placeholder='08012345678' />
                        </Field>
                        <Field label='Emergency Phone'>
                            <Input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder='08012345678' />
                        </Field>
                        <Field label='Security Phone'>
                            <Input value={securityPhone} onChange={e => setSecurityPhone(e.target.value)} placeholder='08012345678' />
                        </Field>
                        <Field label='Utility Services Phone'>
                            <Input value={utilityPhone} onChange={e => setUtilityPhone(e.target.value)} placeholder='08012345678' />
                        </Field>
                    </div>
                </div>

                {/* Bank Details */}
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Bank Details</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <Field label='Account Name'>
                            <Input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder='Accord Estate Trust' />
                        </Field>
                        <Field label='Account Number'>
                            <Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder='0123456789' />
                        </Field>
                        <div className='col-span-2'>
                            <Field label='Bank Name'>
                                <Input value={bankName} onChange={e => setBankName(e.target.value)} placeholder='Access Bank' />
                            </Field>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-3'>
                    <button onClick={() => router.back()}
                        className='h-[44px] px-6 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60'>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}