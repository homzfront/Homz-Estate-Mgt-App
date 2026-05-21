'use client';
import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/general/customInput';
import CustomModal from '@/components/general/customModal';
import Dropdown from '@/components/general/dropDown';
import DotLoader from '@/components/general/dotLoader';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';

// Role enum values from backend
const ROLE_OPTIONS = [
    { id: 'co-owner',   label: 'Co-Owner'   },
    { id: 'spouse',     label: 'Spouse'     },
    { id: 'housemate',  label: 'Housemate'  },
    { id: 'dependent',  label: 'Dependent'  },
    { id: 'staff',      label: 'Staff'      },
    { id: 'sibling',    label: 'Sibling'    },
    { id: 'parent',     label: 'Parent'     },
    { id: 'child',      label: 'Child'      },
    { id: 'other',      label: 'Other'      },
];

type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

interface DependentInvite {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: InviteStatus;
    createdAt: string;
}

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
};

function statusStyle(status: InviteStatus) {
    switch (status) {
        case 'accepted':  return { bg: '#E8F5E9', color: '#2E7D32', label: 'Accepted'  };
        case 'expired':   return { bg: '#F5F5F5', color: '#616161', label: 'Expired'   };
        case 'cancelled': return { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' };
        default:          return { bg: '#FFF3E0', color: '#E65100', label: 'Pending'   };
    }
}

export default function CoResidentsPage() {
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';

    const [form, setForm] = useState<FormData>({
        firstName: '', lastName: '', email: '', phoneNumber: '', role: '',
    });
    const [sending, setSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [invites, setInvites] = useState<DependentInvite[]>([]);
    const [loadingInvites, setLoadingInvites] = useState(false);

    // Role update
    const [editInvite, setEditInvite] = useState<DependentInvite | null>(null);
    const [newRole, setNewRole] = useState('');
    const [updatingRole, setUpdatingRole] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<DependentInvite | null>(null);
    const [deleting, setDeleting] = useState(false);

    const canSubmit = Boolean(form.firstName && form.lastName && form.email && form.role && form.phoneNumber);

    const fetchInvites = async () => {
        if (!orgId || !estateId) return;
        setLoadingInvites(true);
        try {
            const res = await api.get(
                `/residents/dependents-invitations/organizations/${orgId}/estates/${estateId}`
            );
            setInvites(res.data?.data?.results || res.data?.data?.items || []);
        } catch { /* silent */ }
        finally { setLoadingInvites(false); }
    };

    useEffect(() => { fetchInvites(); }, [orgId, estateId]);

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSending(true);
        try {
            await api.post(
                `/residents/dependents-invitations/organizations/${orgId}/estates/${estateId}`,
                {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    role: form.role,
                }
            );
            setShowSuccess(true);
            setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', role: '' });
            fetchInvites();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to send invitation';
            toast.error(Array.isArray(msg) ? msg[0] : msg, { position: 'top-center' });
        } finally {
            setSending(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!editInvite || !newRole) return;
        setUpdatingRole(true);
        try {
            await api.patch(
                `/residents/dependents-invitations/${editInvite._id}/role/organizations/${orgId}/estates/${estateId}`,
                { role: newRole }
            );
            toast.success('Role updated successfully', { position: 'top-center' });
            setEditInvite(null);
            setNewRole('');
            fetchInvites();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update role';
            toast.error(Array.isArray(msg) ? msg[0] : msg, { position: 'top-center' });
        } finally {
            setUpdatingRole(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(
                `/residents/dependents-invitations/${deleteTarget._id}/organizations/${orgId}/estates/${estateId}`
            );
            toast.success('Co-resident removed', { position: 'top-center' });
            setDeleteTarget(null);
            fetchInvites();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to remove co-resident';
            toast.error(Array.isArray(msg) ? msg[0] : msg, { position: 'top-center' });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className='p-8 w-full'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Invite &amp; Manage</h1>
                <p className='text-sm text-GrayHomz mt-1'>Invite co-residents and manage their roles.</p>
            </div>

            {/* Invite form */}
            <section className='mb-8 rounded-[12px] border border-[#E6E6E6] bg-white p-6'>
                <div className='mb-5'>
                    <h2 className='text-[16px] font-medium text-BlackHomz'>Invite Co-Resident</h2>
                    <p className='text-sm text-GrayHomz mt-1'>Send an invitation to someone who lives with you.</p>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                    <CustomInput
                        label='First Name' required placeholder='e.g. Dele'
                        value={form.firstName}
                        onValueChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label='Last Name' required placeholder='e.g. Dayo'
                        value={form.lastName}
                        onValueChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label='Email' required placeholder='e.g. dele@gmail.com' type='email'
                        value={form.email}
                        onValueChange={(v) => setForm((f) => ({ ...f, email: v }))}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label='Phone Number' required placeholder='e.g. 08012345678'
                        value={form.phoneNumber}
                        onValueChange={(v) => setForm((f) => ({ ...f, phoneNumber: v }))}
                        className='h-[45px] pl-4'
                        type='number'
                    />
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-BlackHomz'>
                            Role <span className='text-error'>*</span>
                        </label>
                        <Dropdown
                            options={ROLE_OPTIONS}
                            onSelect={(opt) => setForm((f) => ({ ...f, role: String(opt.id) }))}
                            selectOption='Select Role'
                            showSearch={false}
                            selectedId={form.role || null}
                            height='h-[45px]'
                            borderColor='border-[#A9A9A9]'
                        />
                    </div>
                </div>

                <div className='mt-6 flex justify-end'>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || sending}
                        className={`h-[45px] min-w-[160px] rounded-[4px] px-6 text-sm font-normal text-white flex items-center justify-center
                            ${canSubmit ? 'bg-BlueHomz hover:opacity-90' : 'bg-[#A9A9A9] cursor-not-allowed'}
                            ${sending ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        {sending ? <DotLoader /> : 'Send Invite'}
                    </button>
                </div>
            </section>

            {/* Invited co-residents list */}
            <section>
                <h2 className='text-[16px] font-medium text-BlackHomz mb-4'>Co-Residents</h2>

                {loadingInvites ? (
                    <div className='flex justify-center py-10'>
                        <div className='w-7 h-7 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : invites.length === 0 ? (
                    <div className='rounded-[12px] border border-[#E6E6E6] bg-white p-6 flex flex-col items-center justify-center min-h-[120px] gap-2'>
                        <p className='text-sm text-GrayHomz text-center'>No co-residents invited yet.</p>
                        <p className='text-[12px] text-GrayHomz2 text-center'>
                            Invite someone using the form above.
                        </p>
                    </div>
                ) : (
                    <div className='rounded-[12px] border border-[#E6E6E6] bg-white overflow-hidden'>
                        {invites.map((inv, idx) => {
                            const s = statusStyle(inv.status);
                            return (
                                <div
                                    key={inv._id}
                                    className={`flex items-center justify-between px-5 py-4 ${idx !== 0 ? 'border-t border-[#F5F5F5]' : ''}`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='w-9 h-9 rounded-full bg-[#EEF5FF] flex items-center justify-center flex-shrink-0'>
                                            <span className='text-[13px] font-semibold text-BlueHomz'>
                                                {inv.firstName[0]}{inv.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-[13px] font-medium text-BlackHomz'>
                                                {inv.firstName} {inv.lastName}
                                            </p>
                                            <p className='text-[11px] text-GrayHomz'>{inv.email}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        {/* Role badge */}
                                        <span className='text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#EEF5FF] text-BlueHomz capitalize'>
                                            {inv.role.replace(/-/g, ' ')}
                                        </span>

                                        {/* Status badge */}
                                        <span className='text-[11px] font-medium px-2.5 py-1 rounded-full capitalize'
                                            style={{ backgroundColor: s.bg, color: s.color }}>
                                            {s.label}
                                        </span>

                                        {/* Edit role — only for pending or accepted */}
                                        {(inv.status === 'pending' || inv.status === 'accepted') && (
                                            <button
                                                onClick={() => { setEditInvite(inv); setNewRole(inv.role); }}
                                                className='text-[12px] text-BlueHomz hover:underline'
                                            >
                                                Change Role
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            onClick={() => setDeleteTarget(inv)}
                                            className='text-GrayHomz hover:text-red-500 transition-colors ml-1'
                                            title='Remove co-resident'
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Success modal */}
            <CustomModal isOpen={showSuccess} onRequestClose={() => setShowSuccess(false)}>
                <div className='w-[420px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 rounded-full border-[3px] border-[#039855] flex items-center justify-center'>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className='text-[18px] font-semibold text-BlackHomz'>Invitation Sent!</h2>
                    <p className='text-[13px] text-GrayHomz text-center'>
                        An invitation email has been sent. They can join using the link in their email.
                    </p>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90'
                    >
                        Done
                    </button>
                </div>
            </CustomModal>

            {/* Delete confirmation modal */}
            <CustomModal isOpen={!!deleteTarget} onRequestClose={() => setDeleteTarget(null)}>
                {deleteTarget && (
                    <div className='w-[380px] max-w-[95vw] bg-white rounded-[16px] p-6 flex flex-col items-center gap-4 text-center'>
                        <div className='w-14 h-14 bg-[#FFEBEE] rounded-full flex items-center justify-center'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className='text-[16px] font-semibold text-BlackHomz'>Remove Co-Resident</h2>
                            <p className='text-[13px] text-GrayHomz mt-1'>
                                Are you sure you want to remove <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong> from your estate?
                            </p>
                        </div>
                        <div className='flex gap-3 w-full'>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className='flex-1 h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[8px] text-sm hover:bg-[#F5F5F5]'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className='flex-1 h-[44px] bg-red-500 text-white rounded-[8px] text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center'
                            >
                                {deleting ? <DotLoader /> : 'Remove'}
                            </button>
                        </div>
                    </div>
                )}
            </CustomModal>

            {/* Edit role modal */}
            <CustomModal isOpen={!!editInvite} onRequestClose={() => setEditInvite(null)}>
                {editInvite && (
                    <div className='w-[400px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                        <div className='flex items-start justify-between mb-5'>
                            <div>
                                <h2 className='text-[16px] font-semibold text-BlackHomz'>Change Role</h2>
                                <p className='text-[12px] text-GrayHomz mt-0.5'>
                                    Update role for {editInvite.firstName} {editInvite.lastName}
                                </p>
                            </div>
                            <button onClick={() => setEditInvite(null)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className='flex flex-col gap-1 mb-5'>
                            <label className='text-sm font-medium text-BlackHomz'>New Role</label>
                            <Dropdown
                                options={ROLE_OPTIONS}
                                onSelect={(opt) => setNewRole(String(opt.id))}
                                selectOption='Select Role'
                                showSearch={false}
                                selectedId={newRole || null}
                                height='h-[45px]'
                                borderColor='border-[#A9A9A9]'
                            />
                        </div>

                        <button
                            onClick={handleUpdateRole}
                            disabled={updatingRole || !newRole}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center'
                        >
                            {updatingRole ? <DotLoader /> : 'Update Role'}
                        </button>
                    </div>
                )}
            </CustomModal>
        </div>
    );
}