'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { ManagerResidentItem } from '@/store/useResidentsListStore';
import DotLoader from '@/components/general/dotLoader';
import CustomModal from '@/components/general/customModal';
import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import toast from 'react-hot-toast';

// TODO: Backend needs to add:
// GET /community-manager/residents/dependents/:residentId/:orgId/:estateId
// to allow EM to list co-residents of a specific resident
// Until then this calls the resident-side endpoint which requires resident auth → will 403

const ROLE_OPTIONS = [
    { id: 'co-owner',  label: 'Co-Owner'  },
    { id: 'spouse',    label: 'Spouse'    },
    { id: 'housemate', label: 'Housemate' },
    { id: 'dependent', label: 'Dependent' },
    { id: 'staff',     label: 'Staff'     },
    { id: 'sibling',   label: 'Sibling'   },
    { id: 'parent',    label: 'Parent'    },
    { id: 'child',     label: 'Child'     },
    { id: 'other',     label: 'Other'     },
];

type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

interface CoResident {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    status: InviteStatus;
    createdAt: string;
}

function statusStyle(status: InviteStatus) {
    switch (status) {
        case 'accepted':  return { bg: '#E8F5E9', color: '#2E7D32', label: 'Accepted'  };
        case 'expired':   return { bg: '#F5F5F5', color: '#616161', label: 'Expired'   };
        case 'cancelled': return { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' };
        default:          return { bg: '#FFF3E0', color: '#E65100', label: 'Pending'   };
    }
}

interface Props {
    residentData: ManagerResidentItem | null;
}

export default function CoResidentsTab({ residentData }: Props) {
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);

    // Prefer the resident's own associatedIds — avoids stale selectedCommunity
    // mismatch when CM has multiple estates or navigates between residents
    const orgId    = (residentData as any)?.associatedIds?.organizationId
                     || selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const estateId = (residentData as any)?.associatedIds?.estateId
                     || selectedCommunity?.estate?._id || '';
    const residentId = (residentData as any)?._id || '';

    const [coResidents, setCoResidents] = useState<CoResident[]>([]);
    const [loading, setLoading] = useState(true);
    const [backendReady, setBackendReady] = useState(true);

    // Invite modal
    const [showInvite, setShowInvite] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: '' });
    const [sending, setSending] = useState(false);

    const handleDelete = async (invitationId: string) => {
        if (!confirm('Remove this co-resident from the estate?')) return;
        try {
            await api.delete(
                `/residents/dependents-invitations/${invitationId}/organizations/${orgId}/estates/${estateId}`
            );
            toast.success('Co-resident removed');
            fetchCoResidents();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to remove co-resident';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        }
    };

    const fetchCoResidents = async () => {
        if (!orgId || !estateId || !residentId) return;
        setLoading(true);
        try {
            // TODO: Use EM endpoint once backend adds it:
            // GET /community-manager/residents/dependents/:residentId/organizations/:orgId/estates/:estateId
            const res = await api.get(
                `/community-manager/residents/${residentId}/dependents/organizations/${orgId}/estates/${estateId}`
            );
            setCoResidents(res.data?.data?.results || res.data?.data?.items || []);
            setBackendReady(true);
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 404 || status === 403) {
                // 404 means resident profile not found in DB (may have been deleted)
                // Still show empty co-residents list rather than error state
                setBackendReady(true);
                setCoResidents([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoResidents(); }, [residentId, orgId, estateId]); // eslint-disable-line

    const handleInvite = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.role) {
            toast.error('Please fill all fields');
            return;
        }
        setSending(true);
        try {
            await api.post(
                `/community-manager/residents/${residentId}/invite-dependent/organizations/${orgId}/estates/${estateId}`,
                { firstName: form.firstName, lastName: form.lastName, email: form.email, role: form.role }
            );
            toast.success('Invitation sent successfully');
            setShowInvite(false);
            setForm({ firstName: '', lastName: '', email: '', role: '' });
            fetchCoResidents();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to send invitation';
            toast.error(Array.isArray(msg) ? msg[0] : msg, { position: 'top-center' });
        } finally {
            setSending(false);
        }
    };

    if (!backendReady) {
        return (
            <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-8 flex flex-col items-center gap-3 text-center'>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#A9A9A9" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className='text-[14px] font-medium text-GrayHomz'>Co-Residents</p>
                <p className='text-[12px] text-GrayHomz2 max-w-[300px]'>
                    This feature requires a backend update. The resident can manage their co-residents from their own dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-5'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-[15px] font-semibold text-BlackHomz'>Co-Residents</h3>
                    <p className='text-[12px] text-GrayHomz mt-0.5'>People living with this resident</p>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    className='h-[38px] px-4 bg-BlueHomz text-white text-[12px] font-semibold rounded-[8px] hover:opacity-90 flex items-center gap-2'
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Invite Co-Resident
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className='flex justify-center py-8'>
                    <div className='w-6 h-6 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : coResidents.length === 0 ? (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-8 flex flex-col items-center gap-2'>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#A9A9A9" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className='text-[13px] text-GrayHomz'>No co-residents added yet</p>
                </div>
            ) : (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden'>
                    {coResidents.map((cr, i) => {
                        const s = statusStyle(cr.status);
                        return (
                            <div key={cr._id} className={`flex items-center justify-between px-5 py-4 ${i !== 0 ? 'border-t border-[#F5F5F5]' : ''}`}>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-full bg-[#EEF5FF] flex items-center justify-center flex-shrink-0'>
                                        <span className='text-[12px] font-semibold text-BlueHomz'>
                                            {cr.firstName[0]}{cr.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-[13px] font-medium text-BlackHomz'>{cr.firstName} {cr.lastName}</p>
                                        <p className='text-[11px] text-GrayHomz'>{cr.email}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-[11px] px-2.5 py-1 rounded-full bg-[#EEF5FF] text-BlueHomz capitalize font-medium'>
                                        {cr.role.replace(/-/g, ' ')}
                                    </span>
                                    <span className='text-[11px] px-2.5 py-1 rounded-full capitalize font-medium' style={{ backgroundColor: s.bg, color: s.color }}>
                                        {s.label}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(cr._id)}
                                        className='ml-1 text-GrayHomz hover:text-red-500 transition-colors'
                                        title='Remove co-resident'
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Invite modal */}
            <CustomModal isOpen={showInvite} onRequestClose={() => setShowInvite(false)}>
                <div className='w-[440px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                    <div className='flex items-start justify-between mb-5'>
                        <div>
                            <h2 className='text-[16px] font-semibold text-BlackHomz'>Invite Co-Resident</h2>
                            <p className='text-[12px] text-GrayHomz mt-0.5'>
                                Add someone living with {(residentData as any)?.firstName || 'this resident'}
                            </p>
                        </div>
                        <button onClick={() => setShowInvite(false)} className='text-GrayHomz hover:text-BlackHomz'>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 gap-3'>
                            <CustomInput label='First Name' required placeholder='e.g. Dele'
                                value={form.firstName}
                                onValueChange={(v) => setForm(f => ({ ...f, firstName: v }))}
                                className='h-[45px] pl-4' />
                            <CustomInput label='Last Name' required placeholder='e.g. Dayo'
                                value={form.lastName}
                                onValueChange={(v) => setForm(f => ({ ...f, lastName: v }))}
                                className='h-[45px] pl-4' />
                        </div>
                        <CustomInput label='Email' required placeholder='e.g. dele@gmail.com' type='email'
                            value={form.email}
                            onValueChange={(v) => setForm(f => ({ ...f, email: v }))}
                            className='h-[45px] pl-4' />
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-BlackHomz'>Role <span className='text-error'>*</span></label>
                            <Dropdown
                                options={ROLE_OPTIONS}
                                onSelect={(opt) => setForm(f => ({ ...f, role: String(opt.id) }))}
                                selectOption='Select Role'
                                showSearch={false}
                                selectedId={form.role || null}
                                height='h-[45px]'
                                borderColor='border-[#A9A9A9]'
                            />
                        </div>
                        <button
                            onClick={handleInvite}
                            disabled={sending || !form.firstName || !form.lastName || !form.email || !form.role}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center mt-2'
                        >
                            {sending ? <DotLoader /> : 'Send Invitation'}
                        </button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
}