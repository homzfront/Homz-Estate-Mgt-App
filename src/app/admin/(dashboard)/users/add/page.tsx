'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────
type UserType = 'ADMIN' | 'COMMUNITY_MANAGER' | 'RESIDENT';
type OwnershipType = 'owned' | 'rented';

interface EstateZone { name: string; }
interface EstateStreet { name: string; zone?: string; }
interface EstateBuilding { name: string; street: string; zone?: string; }
interface EstateApartment { name: string; building: string; street?: string; }
interface Estate {
    _id: string;
    name: string;
    zones?: EstateZone[];
    streets?: EstateStreet[];
    buildings?: EstateBuilding[];
    apartments?: EstateApartment[];
    basicDetails?: { name: string };
    [key: string]: any;
}
interface Residence {
    streetName: string; building: string; apartment: string;
    residencyType: string; ownershipType: OwnershipType; zone?: string;
    ownedDetails?: { residencyStartDate: string };
    rentedDetails?: { rentDurationType: string; rentDuration: number; rentStartDate: string; rentDueDate: string; };
}

// ── UI helpers ─────────────────────────────────────────────────────
const Field = ({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) => (
    <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] font-medium text-[#1A1A1A]'>
            {label}{required && <span className='text-red-500 ml-0.5'>*</span>}
        </label>
        {children}
        {hint && <p className='text-[11px] text-[#9E9E9E]'>{hint}</p>}
    </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-[#1A1A1A] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#006AFF] bg-white w-full ${props.className || ''}`} />
);
const Sel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={`h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#006AFF] bg-white w-full ${props.className || ''}`}>
        {children}
    </select>
);

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4 pb-2 border-b border-[#EEF5FF]'>{title}</h3>
);

// ── Page ───────────────────────────────────────────────────────────

const SearchableSelect = ({ options, value, onChange, placeholder }: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
    const selected = options.find(o => o.value === value);
    return (
        <div ref={ref} className='relative w-full'>
            <button type='button' onClick={() => { setOpen(o => !o); setQuery(''); }}
                className='h-[44px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-left focus:outline-none focus:border-[#006AFF] bg-white flex items-center justify-between'>
                <span className={selected ? 'text-[#1A1A1A]' : 'text-[#BDBDBD]'}>{selected ? selected.label : placeholder || 'Select...'}</span>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}><path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='2' strokeLinecap='round'/></svg>
            </button>
            {open && (
                <div className='absolute z-50 mt-1 w-full bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg overflow-hidden'>
                    <div className='p-2 border-b border-[#F0F0F0]'>
                        <input autoFocus type='text' value={query} onChange={e => setQuery(e.target.value)} placeholder='Search...'
                            className='w-full h-[34px] px-3 text-[13px] border border-[#E0E0E0] rounded-[6px] focus:outline-none focus:border-[#006AFF]' />
                    </div>
                    <div className='max-h-[200px] overflow-y-auto'>
                        {filtered.length === 0 ? <p className='text-[12px] text-[#9E9E9E] text-center py-3'>No results</p>
                            : filtered.map(o => (
                                <button key={o.value} type='button' onClick={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F0F4FF] ${value === o.value ? 'bg-[#EEF5FF] text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    {o.label}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function AddUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [estates, setEstates] = useState<Estate[]>([]);
    const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
    const [createdUser, setCreatedUser] = useState<{ email: string; password: string; userType: string } | null>(null);

    // Basic fields
    const [userType, setUserType] = useState<UserType>('RESIDENT');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [estateId, setEstateId] = useState('');

    // Resident-specific: residences array
    const [residences, setResidences] = useState<Residence[]>([{
        streetName: '', building: '', apartment: '',
        residencyType: '2-bedroom', ownershipType: 'owned',
        ownedDetails: { residencyStartDate: '' },
    }]);

    // Load estates
    useEffect(() => {
        api.get('/admin/estates')
            .then(res => {
                const list = res.data?.data?.estates || res.data?.estates || [];
                setEstates(list);
            })
            .catch(() => {});
    }, []);

    // When estate changes, fetch full estate detail for cascading dropdowns
    useEffect(() => {
        if (!estateId) { setSelectedEstate(null); return; }
        api.get(`/admin/estates/${estateId}`)
            .then(res => {
                const d = res.data?.data || res.data || {};
                setSelectedEstate(d);
            })
            .catch(() => {
                const found = estates.find((e: any) => e._id === estateId);
                setSelectedEstate(found || null);
            });
    }, [estateId]);

    const updateResidence = (i: number, field: string, val: any) => {
        setResidences(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], [field]: val };
            // Reset ownership details when type changes
            if (field === 'ownershipType') {
                if (val === 'owned') {
                    updated[i].ownedDetails = { residencyStartDate: '' };
                    updated[i].rentedDetails = undefined;
                } else {
                    updated[i].rentedDetails = { rentDurationType: 'Monthly', rentDuration: 12, rentStartDate: '', rentDueDate: '' };
                    updated[i].ownedDetails = undefined;
                }
            }
            return updated;
        });
    };

    const updateOwnedDetails = (i: number, field: string, val: string) => {
        setResidences(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], ownedDetails: { ...updated[i].ownedDetails, [field]: val } as any };
            return updated;
        });
    };

    const updateRentedDetails = (i: number, field: string, val: any) => {
        setResidences(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], rentedDetails: { ...updated[i].rentedDetails, [field]: val } as any };
            return updated;
        });
    };

    const addResidence = () => setResidences(prev => [...prev, {
        streetName: '', building: '', apartment: '',
        residencyType: '2-bedroom', ownershipType: 'owned',
        ownedDetails: { residencyStartDate: '' },
    }]);

    const removeResidence = (i: number) => setResidences(prev => prev.filter((_, idx) => idx !== i));

    const handleSubmit = async () => {
        // Validation
        if (!firstName.trim() || !email.trim()) { toast.error('First name and email are required'); return; }
        if ((userType === 'COMMUNITY_MANAGER' || userType === 'RESIDENT') && !estateId) {
            toast.error('Estate is required for this user type'); return;
        }
        if (userType === 'RESIDENT') {
            const invalid = residences.find(r => !r.streetName || !r.building || !r.apartment || !r.residencyType);
            if (invalid) { toast.error('Street, building and apartment are required for each residence'); return; }
        }

        setLoading(true);
        try {
            const body: any = {
                userType, firstName, lastName, email,
                accessLevel: 'Owner',
                ...(phone && { phoneNumber: phone }),
                ...(estateId && { estateId }),
                ...(userType === 'RESIDENT' && {
                    residences: residences.map(r => {
                        const base = {
                            zone: r.zone || undefined,
                            streetName: r.streetName,
                            building: r.building,
                            apartment: r.apartment,
                            residencyType: r.residencyType || 'residential',
                            ownershipType: r.ownershipType,
                        };
                        if (r.ownershipType === 'owned') {
                            return { ...base, ownedDetails: r.ownedDetails };
                        } else {
                            return { ...base, rentedDetails: {
                                rentDurationType: r.rentedDetails?.rentDurationType || 'Monthly',
                                rentDuration: Number(r.rentedDetails?.rentDuration) || 1,
                                rentStartDate: r.rentedDetails?.rentStartDate || '',
                                rentDueDate: r.rentedDetails?.rentDueDate || '',
                            }};
                        }
                    }),
                }),
            };

            const res = await api.post('/admin/users', body);
            const data = res.data?.data || res.data;
            setCreatedUser(data);
            toast.success('User created successfully!');
        } catch (err: any) {
            const data = err?.response?.data;
            const msg = data?.message || 'Failed to create user';
            console.error('[AddUser] error:', JSON.stringify(data, null, 2));
            if (Array.isArray(msg)) msg.slice(0, 3).forEach((m: string) => toast.error(m));
            else toast.error(msg);
        } finally { setLoading(false); }
    };

    // ── Success screen ─────────────────────────────────────────────
    if (createdUser) {
        return (
            <div className='p-6 max-w-[500px] mx-auto'>
                <div className='bg-white border border-[#F0F0F0] rounded-[16px] p-8 text-center'>
                    <div className='w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4'>
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M20 6L9 17l-5-5' stroke='#2E7D32' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
                    </div>
                    <h2 className='text-[18px] font-bold text-[#1A1A1A] mb-1'>User Created!</h2>
                    <p className='text-[13px] text-[#6B6B6B] mb-6'>Share these credentials with the user. The password cannot be retrieved again.</p>
                    <div className='bg-[#FAFAFA] border border-[#F0F0F0] rounded-[10px] p-4 text-left space-y-3 mb-6'>
                        <div>
                            <p className='text-[11px] text-[#9E9E9E] uppercase tracking-wide'>Email</p>
                            <p className='text-[14px] font-medium text-[#1A1A1A] mt-0.5'>{createdUser.email}</p>
                        </div>
                        <div>
                            <p className='text-[11px] text-[#9E9E9E] uppercase tracking-wide'>Temporary Password</p>
                            <p className='text-[14px] font-bold text-[#006AFF] mt-0.5 font-mono'>{createdUser.password}</p>
                        </div>
                        <div>
                            <p className='text-[11px] text-[#9E9E9E] uppercase tracking-wide'>User Type</p>
                            <p className='text-[14px] font-medium text-[#1A1A1A] mt-0.5'>{createdUser.userType}</p>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigator.clipboard.writeText(`Email: ${createdUser.email}\nPassword: ${createdUser.password}`).then(() => toast.success('Copied!'))}
                            className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                            Copy Credentials
                        </button>
                        <button onClick={() => router.push('/admin/users')}
                            className='flex-1 h-[40px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC]'>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form ───────────────────────────────────────────────────────
    return (
        <div className='p-6 max-w-[860px]'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                Back
            </button>

            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-5'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Add New User</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-1'>A temporary password will be generated and shown to you after creation.</p>
            </div>

            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 space-y-6'>

                {/* ── Basic Info ── */}
                <div>
                    <SectionHeader title='Basic Information' />
                    <div className='grid grid-cols-2 gap-4'>
                        <Field label='User Type' required>
                            <Sel value={userType} onChange={e => { setUserType(e.target.value as UserType); setEstateId(''); }}>
                                <option value='RESIDENT'>Resident</option>
                                <option value='COMMUNITY_MANAGER'>Community Manager / Estate Manager</option>
                                <option value='ADMIN'>Admin / Staff</option>
                            </Sel>
                        </Field>
                        <Field label='First Name' required>
                            <Input placeholder='John' value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </Field>
                        <Field label='Last Name'>
                            <Input placeholder='Doe' value={lastName} onChange={e => setLastName(e.target.value)} />
                        </Field>
                        <Field label='Email Address' required>
                            <Input type='email' placeholder='john@example.com' value={email} onChange={e => setEmail(e.target.value)} />
                        </Field>
                        <Field label='Phone Number' hint='11 digits, starts with 0'>
                            <Input placeholder='08012345678' value={phone} onChange={e => setPhone(e.target.value)} maxLength={11} />
                        </Field>
                    </div>
                </div>

                {/* ── Estate (CM + Resident) ── */}
                {(userType === 'COMMUNITY_MANAGER' || userType === 'RESIDENT') && (
                    <div>
                        <SectionHeader title='Estate' />
                        <Field label='Select Estate' required>
                            <SearchableSelect
                                value={estateId}
                                onChange={val => setEstateId(val)}
                                placeholder='Search and select an estate'
                                options={estates.map(e => ({ label: e.name, value: e._id }))}
                            />
                        </Field>
                    </div>
                )}

                {/* ── Residences (Resident only) ── */}
                {userType === 'RESIDENT' && (
                    <div>
                        <div className='flex items-center justify-between mb-4 pb-2 border-b border-[#EEF5FF]'>
                            <h3 className='text-[13px] font-semibold text-[#006AFF]'>Residence Details <span className='text-red-500'>*</span></h3>
                            <button onClick={addResidence} className='text-[12px] text-[#006AFF] hover:underline font-medium flex items-center gap-1'>
                                <svg width='12' height='12' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='#006AFF' strokeWidth='2.5' strokeLinecap='round'/></svg>
                                Add Another Residence
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {residences.map((r, i) => (
                                <div key={i} className='border border-[#F0F0F0] rounded-[10px] p-4 bg-[#FAFAFA]'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <span className='text-[12px] font-semibold text-[#6B6B6B]'>Residence {i + 1}</span>
                                        {residences.length > 1 && (
                                            <button onClick={() => removeResidence(i)} className='w-6 h-6 rounded-full bg-[#FFF0F0] flex items-center justify-center text-[#EF4444] hover:bg-[#FFE0E0]'>
                                                <svg width='10' height='10' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'/></svg>
                                            </button>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 gap-3 mb-3'>
                                        {/* Zone */}
                                        <Field label='Zone (optional)'>
                                            {(selectedEstate?.zones?.length ?? 0) > 0 ? (
                                                <Sel value={r.zone || ''} onChange={e => {
                                                    updateResidence(i, 'zone', e.target.value);
                                                    updateResidence(i, 'streetName', '');
                                                    updateResidence(i, 'building', '');
                                                    updateResidence(i, 'apartment', '');
                                                }}>
                                                    <option value=''>Select Zone</option>
                                                    {(selectedEstate?.zones ?? []).map((z: any) => <option key={z.name} value={z.name}>{z.name}</option>)}
                                                </Sel>
                                            ) : (
                                                <Input placeholder='Zone A' value={r.zone || ''} onChange={e => updateResidence(i, 'zone', e.target.value)} />
                                            )}
                                        </Field>
                                        {/* Street */}
                                        <Field label='Street Name' required>
                                            {(selectedEstate?.streets?.length ?? 0) > 0 ? (
                                                <Sel value={r.streetName} onChange={e => {
                                                    updateResidence(i, 'streetName', e.target.value);
                                                    updateResidence(i, 'building', '');
                                                    updateResidence(i, 'apartment', '');
                                                }}>
                                                    <option value=''>Select Street</option>
                                                    {(selectedEstate?.streets ?? [])
                                                        .filter((s: any) => !r.zone || s.zone === r.zone)
                                                        .map((s: any) => <option key={s.name} value={s.name}>{s.name}</option>)
                                                    }
                                                </Sel>
                                            ) : (
                                                <Input placeholder='Emerald Drive' value={r.streetName} onChange={e => updateResidence(i, 'streetName', e.target.value)} />
                                            )}
                                        </Field>
                                        {/* Building */}
                                        <Field label='Building' required>
                                            {(selectedEstate?.buildings?.length ?? 0) > 0 ? (
                                                <Sel value={r.building} onChange={e => {
                                                    updateResidence(i, 'building', e.target.value);
                                                    updateResidence(i, 'apartment', '');
                                                }}>
                                                    <option value=''>Select Building</option>
                                                    {(selectedEstate?.buildings ?? [])
                                                        .filter((b: any) => !r.streetName || b.street === r.streetName)
                                                        .map((b: any) => <option key={b.name} value={b.name}>{b.name}</option>)
                                                    }
                                                </Sel>
                                            ) : (
                                                <Input placeholder='Block A' value={r.building} onChange={e => updateResidence(i, 'building', e.target.value)} />
                                            )}
                                        </Field>
                                        {/* Apartment */}
                                        <Field label='Apartment' required>
                                            {(selectedEstate?.apartments?.length ?? 0) > 0 ? (
                                                <Sel value={r.apartment} onChange={e => updateResidence(i, 'apartment', e.target.value)}>
                                                    <option value=''>Select Apartment</option>
                                                    {(selectedEstate?.apartments ?? [])
                                                        .filter((a: any) => !r.building || a.building === r.building)
                                                        .map((a: any) => <option key={a.name} value={a.name}>{a.name}</option>)
                                                    }
                                                </Sel>
                                            ) : (
                                                <Input placeholder='Apt 101' value={r.apartment} onChange={e => updateResidence(i, 'apartment', e.target.value)} />
                                            )}
                                        </Field>
                                        <Field label='Residency Type'>
                                            <Input placeholder='e.g. 2-bedroom, Studio' value={r.residencyType} onChange={e => updateResidence(i, 'residencyType', e.target.value)} />
                                        </Field>
                                        <Field label='Ownership Type' required>
                                            <Sel value={r.ownershipType} onChange={e => updateResidence(i, 'ownershipType', e.target.value)}>
                                                <option value='owned'>Owned</option>
                                                <option value='rented'>Rented</option>
                                            </Sel>
                                        </Field>
                                    </div>

                                    {/* Owned details */}
                                    {r.ownershipType === 'owned' && (
                                        <div className='bg-[#F0F4FF] rounded-[8px] p-3'>
                                            <p className='text-[11px] font-semibold text-[#006AFF] mb-2'>Ownership Details</p>
                                            <Field label='Residency Start Date' required>
                                                <Input type='date' value={r.ownedDetails?.residencyStartDate || ''} onChange={e => updateOwnedDetails(i, 'residencyStartDate', e.target.value)} />
                                            </Field>
                                        </div>
                                    )}

                                    {/* Rented details */}
                                    {r.ownershipType === 'rented' && (
                                        <div className='bg-[#FFF8E1] rounded-[8px] p-3'>
                                            <p className='text-[11px] font-semibold text-[#E65100] mb-2'>Rental Details</p>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <Field label='Rent Duration Type' required>
                                                    <Sel value={r.rentedDetails?.rentDurationType || 'MONTHLY'} onChange={e => updateRentedDetails(i, 'rentDurationType', e.target.value)}>
                                                        <option value='Monthly'>Monthly</option>
                                                        <option value='Yearly'>Yearly</option>
                                                    </Sel>
                                                </Field>
                                                <Field label='Duration (months/years)' required>
                                                    <Input type='number' min={1} placeholder='12' value={r.rentedDetails?.rentDuration || ''} onChange={e => updateRentedDetails(i, 'rentDuration', Number(e.target.value))} />
                                                </Field>
                                                <Field label='Rent Start Date' required>
                                                    <Input type='date' value={r.rentedDetails?.rentStartDate || ''} onChange={e => {
                                                        const startDate = e.target.value;
                                                        updateRentedDetails(i, 'rentStartDate', startDate);
                                                        // Auto-calculate due date
                                                        if (startDate && r.rentedDetails?.rentDuration) {
                                                            const d = new Date(startDate);
                                                            const duration = Number(r.rentedDetails.rentDuration);
                                                            if (r.rentedDetails.rentDurationType === 'Yearly') {
                                                                d.setFullYear(d.getFullYear() + duration);
                                                            } else {
                                                                d.setMonth(d.getMonth() + duration);
                                                            }
                                                            updateRentedDetails(i, 'rentDueDate', d.toISOString().split('T')[0]);
                                                        }
                                                    }} />
                                                </Field>
                                                <Field label='Rent Due Date' required>
                                                    <Input type='date' value={r.rentedDetails?.rentDueDate || ''} onChange={e => updateRentedDetails(i, 'rentDueDate', e.target.value)} />
                                                </Field>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className='flex justify-end mt-5'>
                <button onClick={handleSubmit} disabled={loading}
                    className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#0055CC] disabled:opacity-60 transition-colors'>
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </div>
    );
}