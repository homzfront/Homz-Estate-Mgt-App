'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Estate Info', 'Streets', 'Buildings', 'Apartments'];
const NIGERIAN_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

interface Bank { name: string; code: string; }
interface Street { name: string; }
interface Building { name: string; street: string; }
interface Apartment { name: string; building: string; street: string; residencyType?: string; }

interface FormData {
    name: string; state: string; area: string;
    managerPhone: string; emergencyPhone: string;
    utilityPhone: string; securityPhone: string;
    accountNumber: string; bankName: string; bankCode: string; accountName: string;
    streets: Street[];
    buildings: Building[];
    apartments: Apartment[];
}

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] font-medium text-[#1A1A1A]'>
            {label}{required && <span className='text-red-500 ml-0.5'>*</span>}
        </label>
        {children}
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
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
    const selected = options.find(o => o.value === value);

    return (
        <div ref={ref} className='relative w-full'>
            <button
                type='button'
                onClick={() => { setOpen(o => !o); setQuery(''); }}
                className='h-[44px] w-full px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-left focus:outline-none focus:border-[#006AFF] bg-white flex items-center justify-between'>
                <span className={selected ? 'text-[#1A1A1A]' : 'text-[#BDBDBD]'}>
                    {selected ? selected.label : placeholder || 'Select...'}
                </span>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                    <path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='2' strokeLinecap='round'/>
                </svg>
            </button>
            {open && (
                <div className='absolute z-50 mt-1 w-full bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg overflow-hidden'>
                    <div className='p-2 border-b border-[#F0F0F0]'>
                        <input
                            autoFocus
                            type='text'
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder='Search...'
                            className='w-full h-[34px] px-3 text-[13px] border border-[#E0E0E0] rounded-[6px] focus:outline-none focus:border-[#006AFF]'
                        />
                    </div>
                    <div className='max-h-[200px] overflow-y-auto'>
                        {filtered.length === 0 ? (
                            <p className='text-[12px] text-[#9E9E9E] text-center py-3'>No results</p>
                        ) : filtered.map(o => (
                            <button
                                key={o.value}
                                type='button'
                                onClick={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                                className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F0F4FF] transition-colors ${value === o.value ? 'bg-[#EEF5FF] text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function CreateEstatePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [resolvingAccount, setResolvingAccount] = useState(false);

    const [managers, setManagers] = useState<{_id: string; name: string; organizationId: string; cmId: string}[]>([]);
    const [selectedManager, setSelectedManager] = useState<string>('');
    const [cmSearch, setCmSearch] = useState<string>('');
    const [showCmDropdown, setShowCmDropdown] = useState<boolean>(false);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.cm-dropdown-wrapper')) setShowCmDropdown(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        api.get('/admin/users', { params: { userType: 'COMMUNITY_MANAGER', limit: '100' } }).then(res => {
            const results = res.data?.data?.results || res.data?.results || res.data?.data || [];
            setManagers(results.map((u: any) => {
                // CM profile uses personal.firstName/lastName
                const firstName = u.profile?.personal?.firstName || u.profile?.firstName || u.firstName || '';
                const lastName = u.profile?.personal?.lastName || u.profile?.lastName || u.lastName || '';
                const name = `${firstName} ${lastName}`.trim() || u.email;
                const organizationId = u.profile?.associatedIds?.organizationId?.toString?.() || u.profile?.organizationId?.toString?.() || '';
                const cmId = u.profile?._id?.toString?.() || u._id;
                return { _id: u._id, name, organizationId, cmId };
            }));
        }).catch((e) => { console.error('[CM fetch error]', e); });
    }, []);

    const [form, setForm] = useState<FormData>({
        name: '', state: '', area: '',
        managerPhone: '', emergencyPhone: '', utilityPhone: '', securityPhone: '',
        accountNumber: '', bankName: '', bankCode: '', accountName: '',
        streets: [{ name: '' }],
        buildings: [],
        apartments: [],
    });

    const set = (field: keyof FormData, val: any) => setForm(f => ({ ...f, [field]: val }));

    // Load banks from backend
    useEffect(() => {
        api.get('/state-area/banks')
            .then(res => {
                const data = res.data?.data || res.data || [];
                setBanks(Array.isArray(data) ? data : []);
            })
            .catch(() => {});
    }, []);

    // Auto-resolve account name when account number + bank code are set
    useEffect(() => {
        if (form.accountNumber.length === 10 && form.bankCode) {
            setResolvingAccount(true);
            api.get('/state-area/bank/resolve', {
                params: { account_number: form.accountNumber, bank_code: form.bankCode }
            })
            .then(res => {
                const name = res.data?.data?.account_name || res.data?.account_name || '';
                if (name) {
                    set('accountName', name);
                    toast.success('Account name resolved');
                }
            })
            .catch(() => {})
            .finally(() => setResolvingAccount(false));
        }
    }, [form.accountNumber, form.bankCode]);

    const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = banks.find(b => b.name === e.target.value);
        setForm(f => ({ ...f, bankName: e.target.value, bankCode: selected?.code || '', accountName: '' }));
    };

    // Streets helpers
    const addStreet = () => set('streets', [...form.streets, { name: '' }]);
    const updateStreet = (i: number, name: string) => {
        const updated = [...form.streets];
        updated[i] = { name };
        set('streets', updated);
    };
    const removeStreet = (i: number) => set('streets', form.streets.filter((_, idx) => idx !== i));

    // Buildings helpers
    const addBuilding = () => set('buildings', [...form.buildings, { name: '', street: form.streets[0]?.name || '' }]);
    const updateBuilding = (i: number, field: keyof Building, val: string) => {
        const updated = [...form.buildings];
        updated[i] = { ...updated[i], [field]: val };
        set('buildings', updated);
    };
    const removeBuilding = (i: number) => set('buildings', form.buildings.filter((_, idx) => idx !== i));

    // Apartments helpers
    const addApartment = () => set('apartments', [...form.apartments, { name: '', building: form.buildings[0]?.name || '', street: form.streets[0]?.name || '' }]);
    const updateApartment = (i: number, field: keyof Apartment, val: string) => {
        const updated = [...form.apartments];
        updated[i] = { ...updated[i], [field]: val };
        set('apartments', updated);
    };
    const removeApartment = (i: number) => set('apartments', form.apartments.filter((_, idx) => idx !== i));

    const handleSubmit = async () => {
        if (!selectedManager) { toast.error('Please select a community manager'); return; }
        if (!form.name || !form.state) { toast.error('Estate name and state are required'); return; }
        const validStreets = form.streets.filter(s => s.name.trim());
        if (validStreets.length === 0) { toast.error('At least one street is required'); setStep(1); return; }
        const validBuildings = form.buildings.filter(b => b.name.trim() && b.street.trim());
        if (validBuildings.length === 0) { toast.error('At least one building is required'); setStep(2); return; }
        const validApartments = form.apartments.filter(a => a.name.trim() && a.building.trim() && a.street.trim());
        if (validApartments.length === 0) { toast.error('At least one apartment is required'); setStep(3); return; }

        setLoading(true);
        try {
            const body: any = {
                basicDetails: { name: form.name, location: { state: form.state, area: form.area } },
                contactInformation: {
                    managerPhone: form.managerPhone,
                    ...(form.emergencyPhone && { emergencyPhone: form.emergencyPhone }),
                    ...(form.utilityPhone && { utilityServicesPhone: form.utilityPhone }),
                    ...(form.securityPhone && { securityPhone: form.securityPhone }),
                },
                streets: validStreets,
                buildings: validBuildings,
                apartments: validApartments,
            };
            if (form.accountNumber && form.bankName && form.accountName) {
                body.bankDetails = {
                    accountNumber: form.accountNumber,
                    accountName: form.accountName,
                    bankName: form.bankName,
                    ...(form.bankCode && { bankCode: form.bankCode }),
                };
            }
            const mgr = managers.find(m => m._id === selectedManager);
            if (mgr) {
                body.organizationId = mgr.organizationId;
                body.userId = mgr._id;
                body.communityManagerId = mgr.cmId || mgr._id;
            }
            await api.post('/admin/estates', body);
            toast.success('Estate created successfully!');
            router.push('/admin/estates');
        } catch (err: any) {
            const data = err?.response?.data;
            const msg = data?.message || data?.error || 'Failed to create estate';
            if (Array.isArray(msg)) {
                msg.slice(0, 3).forEach((m: string) => toast.error(m));
            } else {
                toast.error(msg);
            }
        } finally { setLoading(false); }
    };

    const canProceed = [
        form.name.trim() && form.state,
        form.streets.some(s => s.name.trim()),
        form.buildings.some(b => b.name.trim()),
        true,
    ];

    return (
        <div className='p-4 sm:p-6 max-w-[900px] w-full'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                Back
            </button>

            {/* Step indicator */}
            <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 mb-5'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Create New Estate</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-1'>Fill in all steps to create and configure the estate.</p>
                <div className='flex items-center gap-2 mt-5'>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={i}>
                            <div className='flex items-center gap-2 cursor-pointer' onClick={() => i < step && setStep(i)}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-medium border
                                    ${i < step ? 'bg-[#006AFF] border-[#006AFF] text-white' : i === step ? 'bg-[#006AFF] border-[#006AFF] text-white' : 'border-[#D0D0D0] text-[#9E9E9E]'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-[12px] font-medium ${i === step ? 'text-[#006AFF]' : i < step ? 'text-[#1A1A1A]' : 'text-[#9E9E9E]'}`}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-[#006AFF]' : 'bg-[#E8E8E8]'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── STEP 1: Estate Info ── */}
            {step === 0 && (
                <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6 space-y-6'>
                    <div>
                        <h3 className='text-[14px] font-semibold text-[#006AFF] mb-4'>Estate Information</h3>
                        <div className='space-y-4'>
                            <Field label='Community Manager' required>
                                <div className='relative cm-dropdown-wrapper'>
                                    <div onClick={() => setShowCmDropdown(v => !v)}
                                        className='h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#006AFF] bg-white w-full flex items-center justify-between cursor-pointer hover:border-[#006AFF]'>
                                        <span className={selectedManager ? 'text-[#1A1A1A]' : 'text-[#BDBDBD]'}>
                                            {selectedManager ? managers.find(m => m._id === selectedManager)?.name || 'Select community manager...' : 'Select community manager...'}
                                        </span>
                                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none' className={`transition-transform ${showCmDropdown ? 'rotate-180' : ''}`}>
                                            <path d='M6 9l6 6 6-6' stroke='#9E9E9E' strokeWidth='1.5' strokeLinecap='round'/>
                                        </svg>
                                    </div>
                                    {showCmDropdown && (
                                        <div className='absolute z-50 top-[46px] left-0 right-0 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg max-h-[220px] flex flex-col'>
                                            <div className='p-2 border-b border-[#F0F0F0]'>
                                                <input autoFocus value={cmSearch} onChange={e => setCmSearch(e.target.value)}
                                                    placeholder='Search manager...'
                                                    className='w-full h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] outline-none focus:border-[#006AFF]' />
                                            </div>
                                            <div className='overflow-y-auto flex-1'>
                                                {managers.filter(m => m.name.toLowerCase().includes(cmSearch.toLowerCase())).length === 0 ? (
                                                    <p className='text-[12px] text-[#9E9E9E] text-center py-4'>No managers found</p>
                                                ) : managers.filter(m => m.name.toLowerCase().includes(cmSearch.toLowerCase())).map(m => (
                                                    <button key={m._id} type='button'
                                                        onClick={() => { setSelectedManager(m._id); setShowCmDropdown(false); setCmSearch(''); }}
                                                        className={`w-full text-left px-3 py-2.5 text-[13px] hover:bg-[#F5F5F5] transition-colors ${selectedManager === m._id ? 'text-[#006AFF] font-medium bg-[#EEF5FF]' : 'text-[#1A1A1A]'}`}>
                                                        {m.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Field>
                            <Field label='Estate Name' required>
                                <Input placeholder='Lekki Gardens Estate' value={form.name} onChange={e => set('name', e.target.value)} />
                            </Field>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <Field label='State' required>
                                    <SearchableSelect
                                        value={form.state}
                                        onChange={val => set('state', val)}
                                        placeholder='Select state'
                                        options={NIGERIAN_STATES.map(s => ({ label: s, value: s }))}
                                    />
                                </Field>
                                <Field label='Area'>
                                    <Input placeholder='e.g. Lekki Phase 1' value={form.area} onChange={e => set('area', e.target.value)} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className='border-t border-[#F0F0F0] pt-4'>
                        <h3 className='text-[14px] font-semibold text-[#006AFF] mb-4'>Contact Information</h3>
                        <div className='space-y-4'>
                            <Field label="Manager's Phone Number" required>
                                <Input placeholder='+2348012345678' value={form.managerPhone} onChange={e => set('managerPhone', e.target.value)} />
                            </Field>
                            <Field label='Emergency Phone (optional)'>
                                <Input placeholder='+2348011122233' value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} />
                            </Field>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <Field label='Utility Phone (optional)'>
                                    <Input placeholder='+2348099988777' value={form.utilityPhone} onChange={e => set('utilityPhone', e.target.value)} />
                                </Field>
                                <Field label='Security Phone (optional)'>
                                    <Input placeholder='+2348088877665' value={form.securityPhone} onChange={e => set('securityPhone', e.target.value)} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className='border-t border-[#F0F0F0] pt-4'>
                        <h3 className='text-[14px] font-semibold text-[#006AFF] mb-4'>Bank Information (Optional)</h3>
                        <div className='space-y-4'>
                            <Field label='Bank Name'>
                                <SearchableSelect
                                    value={form.bankName}
                                    onChange={val => {
                                        const selected = banks.find(b => b.name === val);
                                        setForm(f => ({ ...f, bankName: val, bankCode: selected?.code || '', accountName: '' }));
                                    }}
                                    placeholder='Select bank'
                                    options={banks.length > 0
                                        ? banks.map(b => ({ label: b.name, value: b.name }))
                                        : ['Access Bank','First Bank','GTBank','Zenith Bank','UBA','Fidelity Bank','Sterling Bank','Wema Bank'].map(b => ({ label: b, value: b }))
                                    }
                                />
                            </Field>
                            <Field label='Account Number'>
                                <Input
                                    placeholder='10-digit account number'
                                    value={form.accountNumber}
                                    maxLength={10}
                                    onChange={e => { set('accountNumber', e.target.value); set('accountName', ''); }}
                                />
                            </Field>
                            <Field label='Account Name'>
                                <div className='relative cm-dropdown-wrapper'>
                                    <Input
                                        placeholder={resolvingAccount ? 'Resolving...' : 'Auto-filled when account number is entered'}
                                        value={form.accountName}
                                        readOnly
                                        className='bg-[#FAFAFA] cursor-not-allowed'
                                    />
                                    {resolvingAccount && (
                                        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                            <div className='w-4 h-4 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                                        </div>
                                    )}
                                </div>
                            </Field>
                        </div>
                    </div>
                </div>
            )}

            {/* ── STEP 2: Streets ── */}
            {step === 1 && (
                <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-[14px] font-semibold text-[#006AFF]'>Streets <span className='text-red-500'>*</span></h3>
                        <button onClick={addStreet} className='flex items-center gap-1.5 text-[12px] text-[#006AFF] hover:underline font-medium'>
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='#006AFF' strokeWidth='2' strokeLinecap='round'/></svg>
                            Add Street
                        </button>
                    </div>
                    <div className='space-y-3'>
                        {form.streets.map((s, i) => (
                            <div key={i} className='flex gap-2 items-center'>
                                <Input
                                    placeholder={`Street ${i + 1} name (e.g. Emerald Drive)`}
                                    value={s.name}
                                    onChange={e => updateStreet(i, e.target.value)}
                                />
                                {form.streets.length > 1 && (
                                    <button onClick={() => removeStreet(i)} className='text-[#EF4444] hover:text-[#DC2626] flex-shrink-0'>
                                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round'/></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className='text-[12px] text-[#9E9E9E] mt-3'>Add all streets in this estate. Buildings will be assigned to streets.</p>
                </div>
            )}

            {/* ── STEP 3: Buildings ── */}
            {step === 2 && (
                <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6'>
                    <div className='flex items-center justify-between mb-1'>
                        <div>
                            <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Buildings <span className='text-red-500'>*</span></h3>
                            <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Each building is assigned to a street. e.g. Block A on Emerald Drive.</p>
                        </div>
                        <button onClick={addBuilding}
                            className='h-[36px] px-4 bg-[#006AFF] text-white text-[12px] font-medium rounded-[8px] hover:bg-[#0055CC] flex items-center gap-1.5'>
                            <svg width='12' height='12' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2.5' strokeLinecap='round'/></svg>
                            Add Building
                        </button>
                    </div>

                    {form.buildings.length === 0 ? (
                        <div className='border-2 border-dashed border-[#E8E8E8] rounded-[10px] py-10 text-center mt-4'>
                            <div className='w-10 h-10 rounded-full bg-[#F0F4FF] flex items-center justify-center mx-auto mb-2'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'><path d='M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21v-4a3 3 0 016 0v4' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/></svg>
                            </div>
                            <p className='text-[13px] font-medium text-[#1A1A1A]'>No buildings added yet</p>
                            <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Click "Add Building" to get started</p>
                        </div>
                    ) : (
                        <div className='mt-4 space-y-3'>
                            {form.buildings.map((b, i) => (
                                <div key={i} className='border border-[#F0F0F0] rounded-[10px] p-4 bg-[#FAFAFA]'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <span className='text-[12px] font-semibold text-[#6B6B6B]'>Building {i + 1}</span>
                                        <button onClick={() => removeBuilding(i)}
                                            className='w-6 h-6 rounded-full bg-[#FFF0F0] flex items-center justify-center text-[#EF4444] hover:bg-[#FFE0E0]'>
                                            <svg width='10' height='10' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'/></svg>
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <Field label='Building Name'>
                                            <Input
                                                placeholder='e.g. Block A, Tower 1'
                                                value={b.name}
                                                onChange={e => updateBuilding(i, 'name', e.target.value)}
                                            />
                                        </Field>
                                        <Field label='Street'>
                                            <Sel value={b.street} onChange={e => updateBuilding(i, 'street', e.target.value)}>
                                                <option value=''>Select street</option>
                                                {form.streets.filter(s => s.name).map(s => (
                                                    <option key={s.name} value={s.name}>{s.name}</option>
                                                ))}
                                            </Sel>
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── STEP 4: Apartments ── */}
            {step === 3 && (
                <div className='bg-white border border-[#F0F0F0] rounded-[12px] p-6'>
                    <div className='flex items-center justify-between mb-1'>
                        <div>
                            <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Apartments <span className='text-red-500'>*</span></h3>
                            <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Assign each apartment to a building. Street is auto-filled from the building.</p>
                        </div>
                        <button onClick={addApartment}
                            className='h-[36px] px-4 bg-[#006AFF] text-white text-[12px] font-medium rounded-[8px] hover:bg-[#0055CC] flex items-center gap-1.5'>
                            <svg width='12' height='12' viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2.5' strokeLinecap='round'/></svg>
                            Add Apartment
                        </button>
                    </div>

                    {form.apartments.length === 0 ? (
                        <div className='border-2 border-dashed border-[#E8E8E8] rounded-[10px] py-10 text-center mt-4'>
                            <div className='w-10 h-10 rounded-full bg-[#F0F4FF] flex items-center justify-center mx-auto mb-2'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'><rect x='3' y='3' width='7' height='7' rx='1' stroke='#006AFF' strokeWidth='1.5'/><rect x='14' y='3' width='7' height='7' rx='1' stroke='#006AFF' strokeWidth='1.5'/><rect x='3' y='14' width='7' height='7' rx='1' stroke='#006AFF' strokeWidth='1.5'/><rect x='14' y='14' width='7' height='7' rx='1' stroke='#006AFF' strokeWidth='1.5'/></svg>
                            </div>
                            <p className='text-[13px] font-medium text-[#1A1A1A]'>No apartments added yet</p>
                            <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Click "Add Apartment" to get started</p>
                        </div>
                    ) : (
                        <div className='mt-4 space-y-3'>
                            {form.apartments.map((a, i) => (
                                <div key={i} className='border border-[#F0F0F0] rounded-[10px] p-4 bg-[#FAFAFA]'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <span className='text-[12px] font-semibold text-[#6B6B6B]'>Apartment {i + 1}</span>
                                        <button onClick={() => removeApartment(i)}
                                            className='w-6 h-6 rounded-full bg-[#FFF0F0] flex items-center justify-center text-[#EF4444] hover:bg-[#FFE0E0]'>
                                            <svg width='10' height='10' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'/></svg>
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3 mb-3'>
                                        <Field label='Apartment Name'>
                                            <Input
                                                placeholder='e.g. Apt 101, Unit A'
                                                value={a.name}
                                                onChange={e => updateApartment(i, 'name', e.target.value)}
                                            />
                                        </Field>
                                        <Field label='Building'>
                                            <Sel value={a.building} onChange={e => {
                                                const bldg = form.buildings.find(b => b.name === e.target.value);
                                                const updated = [...form.apartments];
                                                updated[i] = { ...updated[i], building: e.target.value, street: bldg?.street || updated[i].street };
                                                set('apartments', updated);
                                            }}>
                                                <option value=''>Select building</option>
                                                {form.buildings.filter(b => b.name).map(b => (
                                                    <option key={b.name} value={b.name}>{b.name}</option>
                                                ))}
                                            </Sel>
                                        </Field>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <Field label='Street (auto-filled)'>
                                            <Input value={a.street} readOnly className='bg-[#F5F5F5] cursor-not-allowed text-[#9E9E9E]' />
                                        </Field>
                                        <Field label='Residency Type (optional)'>
                                            <Input
                                                placeholder='e.g. 2-bedroom, Studio'
                                                value={a.residencyType || ''}
                                                onChange={e => updateApartment(i, 'residencyType', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className='flex justify-between mt-5'>
                <button
                    onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
                    className='h-[44px] px-6 border border-[#D0D0D0] text-[#6B6B6B] rounded-[8px] text-[13px] hover:bg-[#F5F5F5]'>
                    {step === 0 ? 'Cancel' : 'Back'}
                </button>
                {step < STEPS.length - 1 ? (
                    <button
                        onClick={() => setStep(s => s + 1)}
                        disabled={!canProceed[step]}
                        className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#0055CC] disabled:opacity-50 transition-colors'>
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#0055CC] disabled:opacity-60 transition-colors'>
                        {loading ? 'Creating...' : 'Create Estate'}
                    </button>
                )}
            </div>
        </div>
    );
}