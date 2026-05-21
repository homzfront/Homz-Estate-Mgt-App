'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import { useAuthSlice } from '@/store/authStore';

type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

interface KYCData {
    status: KYCStatus;
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    idType?: string;
    idNumber?: string;
}

const STATUS_CONFIG: Record<KYCStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    not_submitted: {
        label: 'Not Submitted',
        color: '#616161',
        bg: '#F5F5F5',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#616161" strokeWidth="1.5"/><path d="M12 8v4M12 16h.01" stroke="#616161" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    pending: {
        label: 'Under Review',
        color: '#E65100',
        bg: '#FFF3E0',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#E65100" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    approved: {
        label: 'Verified',
        color: '#2E7D32',
        bg: '#E8F5E9',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#2E7D32" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    rejected: {
        label: 'Rejected',
        color: '#C62828',
        bg: '#FFEBEE',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#C62828" strokeWidth="1.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="#C62828" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
};

const ID_TYPES = [
    { id: 'NIN', label: 'National ID (NIN)' },
    { id: 'BVN', label: 'Bank Verification Number (BVN)' },
    { id: 'DRIVERS_LICENSE', label: "Driver's License" },
    { id: 'PASSPORT', label: 'International Passport' },
    { id: 'VOTERS_CARD', label: "Voter's Card" },
];

export default function ResidentKYCPage() {
    const { userData } = useAuthSlice();
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';
    const residentId = active?.associatedIds?.residentId || '';

    const [kyc, setKyc] = useState<KYCData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        idType: '',
        idNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    });
    const [idTypeOpen, setIdTypeOpen] = useState(false);

    useEffect(() => {
        if (orgId && estateId && residentId) fetchKYCStatus();
        // Pre-fill name from user data
        if (userData) {
            setForm(f => ({
                ...f,
                firstName: (userData as any)?.profile?.firstName || '',
                lastName: (userData as any)?.profile?.lastName || '',
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId, estateId, residentId]);

    const fetchKYCStatus = async () => {
        setLoading(true);
        try {
            const res = await api.get(
                `/residents/kyc/organizations/${orgId}/estates/${estateId}/residents/${residentId}`
            );
            setKyc(res.data?.data || { status: 'not_submitted' });
        } catch {
            setKyc({ status: 'not_submitted' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.idType) { toast.error('Please select an ID type'); return; }
        if (!form.idNumber.trim()) { toast.error('Please enter your ID number'); return; }
        if (!form.firstName.trim() || !form.lastName.trim()) { toast.error('Please enter your full name'); return; }
        if (!form.dateOfBirth) { toast.error('Please enter your date of birth'); return; }

        setSubmitting(true);
        try {
            await api.post(
                `/residents/kyc/organizations/${orgId}/estates/${estateId}/residents/${residentId}`,
                {
                    idType: form.idType,
                    idNumber: form.idNumber.trim(),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    dateOfBirth: form.dateOfBirth,
                }
            );
            toast.success('KYC submitted successfully. We will review your details shortly.');
            fetchKYCStatus();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to submit KYC. Please try again.';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='w-8 h-8 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    const status = kyc?.status || 'not_submitted';
    const cfg = STATUS_CONFIG[status];

    return (
        <div className='p-8 w-full max-w-[600px]'>
            <h1 className='text-[20px] font-semibold text-BlackHomz mb-1'>Identity Verification</h1>
            <p className='text-sm text-GrayHomz mb-6'>Verify your identity to access all features of your estate account.</p>

            {/* Status banner */}
            <div className='flex items-center gap-3 p-4 rounded-[12px] border mb-6' style={{ backgroundColor: cfg.bg, borderColor: cfg.color + '40' }}>
                {cfg.icon}
                <div>
                    <p className='text-[14px] font-semibold' style={{ color: cfg.color }}>{cfg.label}</p>
                    {status === 'pending' && (
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Your documents are being reviewed. This usually takes 1–2 business days.</p>
                    )}
                    {status === 'approved' && (
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Your identity has been verified successfully.</p>
                    )}
                    {status === 'rejected' && kyc?.rejectionReason && (
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Reason: {kyc.rejectionReason}</p>
                    )}
                    {status === 'not_submitted' && (
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Please submit your identity documents to get verified.</p>
                    )}
                </div>
            </div>

            {/* Approved state */}
            {status === 'approved' && (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-5'>
                    <h3 className='text-[14px] font-semibold text-BlackHomz mb-4'>Verified Details</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-[11px] text-GrayHomz mb-0.5'>ID Type</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>{kyc?.idType || '—'}</p>
                        </div>
                        <div>
                            <p className='text-[11px] text-GrayHomz mb-0.5'>Submitted On</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>
                                {kyc?.submittedAt ? new Date(kyc.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending state */}
            {status === 'pending' && (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-5'>
                    <h3 className='text-[14px] font-semibold text-BlackHomz mb-4'>Submission Details</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-[11px] text-GrayHomz mb-0.5'>ID Type</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>{kyc?.idType || '—'}</p>
                        </div>
                        <div>
                            <p className='text-[11px] text-GrayHomz mb-0.5'>Submitted On</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>
                                {kyc?.submittedAt ? new Date(kyc.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form — show if not_submitted or rejected */}
            {(status === 'not_submitted' || status === 'rejected') && (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6'>
                    <h3 className='text-[14px] font-semibold text-BlackHomz mb-5'>
                        {status === 'rejected' ? 'Resubmit Verification' : 'Submit Verification'}
                    </h3>

                    <div className='flex flex-col gap-4'>
                        {/* ID Type */}
                        <div className='flex flex-col gap-1.5 relative'>
                            <label className='text-[13px] font-medium text-BlackHomz'>ID Type <span className='text-red-500'>*</span></label>
                            <button
                                onClick={() => setIdTypeOpen(!idTypeOpen)}
                                className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm flex items-center justify-between outline-none focus:border-BlueHomz transition-colors'
                            >
                                <span className={form.idType ? 'text-BlackHomz' : 'text-[#A9A9A9]'}>
                                    {form.idType ? ID_TYPES.find(t => t.id === form.idType)?.label : 'Select ID type'}
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`transition-transform ${idTypeOpen ? 'rotate-180' : ''}`}>
                                    <path d="M6 9l6 6 6-6" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                            {idTypeOpen && (
                                <div className='absolute top-[76px] left-0 right-0 bg-white border border-[#E6E6E6] rounded-[8px] shadow-lg z-10 overflow-hidden'>
                                    {ID_TYPES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setForm(f => ({ ...f, idType: t.id })); setIdTypeOpen(false); }}
                                            className='w-full text-left px-4 py-3 text-sm hover:bg-whiteblue border-b border-[#F5F5F5] last:border-b-0'
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ID Number */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-BlackHomz'>ID Number <span className='text-red-500'>*</span></label>
                            <input
                                value={form.idNumber}
                                onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))}
                                placeholder='Enter your ID number'
                                className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                            />
                        </div>

                        {/* Name grid */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[13px] font-medium text-BlackHomz'>First Name <span className='text-red-500'>*</span></label>
                                <input
                                    value={form.firstName}
                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                    placeholder='As on your ID'
                                    className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[13px] font-medium text-BlackHomz'>Last Name <span className='text-red-500'>*</span></label>
                                <input
                                    value={form.lastName}
                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                    placeholder='As on your ID'
                                    className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                                />
                            </div>
                        </div>

                        {/* Date of birth */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-BlackHomz'>Date of Birth <span className='text-red-500'>*</span></label>
                            <input
                                type='date'
                                value={form.dateOfBirth}
                                onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                                max={new Date().toISOString().split('T')[0]}
                                className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                            />
                        </div>

                        <p className='text-[11px] text-GrayHomz bg-[#F9FBFF] rounded-[8px] p-3'>
                            🔒 Your information is encrypted and used only for identity verification purposes. We use Smile Identity for secure, compliant KYC processing.
                        </p>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2'
                        >
                            {submitting ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Submitting...
                                </>
                            ) : (
                                status === 'rejected' ? 'Resubmit KYC' : 'Submit for Verification'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}