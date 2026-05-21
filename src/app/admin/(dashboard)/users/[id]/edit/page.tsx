'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] font-medium text-[#1A1A1A]'>{label}</label>
        {children}
    </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-[#1A1A1A] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#006AFF] bg-white w-full ${props.className||''}`} />
);
const Sel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className='h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#006AFF] bg-white w-full'>
        {children}
    </select>
);

export default function EditUserPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [userType, setUserType] = useState('');

    // Shared fields (all types)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Resident-specific fields
    const [streetName, setStreetName] = useState('');
    const [building, setBuilding] = useState('');
    const [apartment, setApartment] = useState('');
    const [ownershipType, setOwnershipType] = useState('OWNED');

    // CM/Admin-specific
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/admin/users/${id}`);
                const d = res.data?.data || res.data || {};
                // Backend returns { user, profile, type }
                const u = d?.user || {};
                const profile = d?.profile || {};
                const type = d?.type || '';
                setUserType(type);

                // Common
                setFirstName(profile?.firstName || profile?.personal?.firstName || '');
                setLastName(profile?.lastName  || profile?.personal?.lastName  || '');
                setEmail(u?.email || '');
                setPhone(profile?.phoneNumber || profile?.personal?.phoneNumber || '');

                if (type === 'RESIDENT') {
                    setStreetName(profile?.streetName || '');
                    setBuilding(profile?.building    || '');
                    setApartment(profile?.apartment  || '');
                    setOwnershipType(profile?.ownershipType || 'OWNED');
                }
                if (type === 'COMMUNITY_MANAGER') {
                    setBusinessName(profile?.business?.businessName || profile?.businessName || '');
                }
            } catch { toast.error('Failed to load user'); }
            finally { setFetching(false); }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const body: any = {};
            if (firstName) body.firstName = firstName;
            if (lastName) body.lastName = lastName;
            if (email) body.email = email;
            if (phone) body.phoneNumber = phone;

            // Resident extra fields
            if (userType === 'RESIDENT') {
                if (streetName) body.streetName = streetName;
                if (building) body.building = building;
                if (apartment) body.apartment = apartment;
                if (ownershipType) body.ownershipType = ownershipType;
            }

            // CM extra fields
            if (userType === 'COMMUNITY_MANAGER' && businessName) {
                body.businessName = businessName;
            }

            await api.patch(`/admin/users/${id}`, body);
            toast.success('User updated successfully');
            router.push(`/admin/users/${id}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update user';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally { setLoading(false); }
    };

    if (fetching) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    const typeLabelMap: Record<string, string> = {
        RESIDENT: 'Resident',
        COMMUNITY_MANAGER: 'Community Manager',
        ADMIN: 'Admin',
    };

    return (
        <div className='p-6 max-w-[860px]'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                Back
            </button>

            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-5 flex items-center justify-between'>
                <div>
                    <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Edit User</h1>
                    <p className='text-[13px] text-[#6B6B6B] mt-1'>Update profile details for this user.</p>
                </div>
                {userType && (
                    <span className='text-[12px] font-medium px-3 py-1 rounded-full bg-[#EEF5FF] text-[#006AFF]'>
                        {typeLabelMap[userType] || userType}
                    </span>
                )}
            </div>

            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 space-y-6'>

                {/* Basic info — all user types */}
                <div>
                    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4 pb-2 border-b border-[#EEF5FF]'>Basic Information</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <Field label='First Name'>
                            <Input placeholder='John' value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </Field>
                        <Field label='Last Name'>
                            <Input placeholder='Doe' value={lastName} onChange={e => setLastName(e.target.value)} />
                        </Field>
                        <Field label='Email Address'>
                            <Input type='email' placeholder='john@example.com' value={email} onChange={e => setEmail(e.target.value)} />
                        </Field>
                        <Field label='Phone Number'>
                            <Input placeholder='08012345678' value={phone} onChange={e => setPhone(e.target.value)} />
                        </Field>
                    </div>
                </div>

                {/* Resident-specific */}
                {userType === 'RESIDENT' && (
                    <div>
                        <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4 pb-2 border-b border-[#EEF5FF]'>Residence Details</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <Field label='Street Name'>
                                <Input placeholder='Emerald Drive' value={streetName} onChange={e => setStreetName(e.target.value)} />
                            </Field>
                            <Field label='Building'>
                                <Input placeholder='Block A' value={building} onChange={e => setBuilding(e.target.value)} />
                            </Field>
                            <Field label='Apartment'>
                                <Input placeholder='Apt 101' value={apartment} onChange={e => setApartment(e.target.value)} />
                            </Field>
                            <Field label='Ownership Type'>
                                <Sel value={ownershipType} onChange={e => setOwnershipType(e.target.value)}>
                                    <option value='OWNED'>Owned</option>
                                    <option value='RENTED'>Rented</option>
                                </Sel>
                            </Field>
                        </div>
                    </div>
                )}

                {/* CM-specific */}
                {userType === 'COMMUNITY_MANAGER' && (
                    <div>
                        <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4 pb-2 border-b border-[#EEF5FF]'>Business Details</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <Field label='Business Name'>
                                <Input placeholder='Estate Management Ltd' value={businessName} onChange={e => setBusinessName(e.target.value)} />
                            </Field>
                        </div>
                    </div>
                )}


            </div>

            <div className='flex justify-between mt-5'>
                <button onClick={() => router.back()} className='h-[44px] px-6 border border-[#D0D0D0] text-[#6B6B6B] rounded-[8px] text-[13px] hover:bg-[#F5F5F5]'>
                    Cancel
                </button>
                <button onClick={handleSubmit} disabled={loading}
                    className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#0055CC] disabled:opacity-60'>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}