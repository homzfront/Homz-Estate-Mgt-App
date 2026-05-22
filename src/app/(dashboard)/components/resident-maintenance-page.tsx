'use client';
import React, { useEffect, useState } from 'react';
import { useMaintenanceStore, MaintenanceRequest, MaintenanceStatus } from '@/store/useMaintenanceStore';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import toast from 'react-hot-toast';
import CustomModal from '@/components/general/customModal';
import ArrowRight from '@/components/icons/arrowRight';

const CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Security', 'Pest Control', 'Other'];

const STATUS_STYLE: Record<MaintenanceStatus, { label: string; bg: string; color: string }> = {
    OPEN:        { label: 'Open',        bg: '#FFF3E0', color: '#E65100' },
    IN_PROGRESS: { label: 'In-Progress', bg: '#EEF5FF', color: '#006AFF' },
    RESOLVED:    { label: 'Resolved',    bg: '#E8F5E9', color: '#2E7D32' },
    CANCELLED:   { label: 'Cancelled',   bg: '#F5F5F5', color: '#616161' },
};

// Minimum hours between reminders
const REMINDER_COOLDOWN_HOURS = 24;

function canSendReminder(lastReminderSentAt?: string): boolean {
    if (!lastReminderSentAt) return true;
    const last = new Date(lastReminderSentAt).getTime();
    const now = Date.now();
    const diffHours = (now - last) / (1000 * 60 * 60);
    return diffHours >= REMINDER_COOLDOWN_HOURS;
}

function StatusBadge({ status }: { status: MaintenanceStatus }) {
    const s = STATUS_STYLE[status];
    return (
        <span className='text-[11px] font-medium px-3 py-1 rounded-full' style={{ backgroundColor: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

export default function ResidentMaintenancePage() {
    const { requests, isLoading, isSubmitting, fetchResidentRequests, createRequest, cancelRequest, sendReminder } = useMaintenanceStore();
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';

    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({ title: '', category: '', description: '' });
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selected, setSelected] = useState<MaintenanceRequest | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [reminding, setReminding] = useState(false);
    const [activeFilter, setActiveFilter] = useState<MaintenanceStatus | 'ALL'>('ALL');

    useEffect(() => {
        if (orgId && estateId) fetchResidentRequests(orgId, estateId, activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId, estateId, activeFilter]);

    // Backend's resident endpoint ignores status filter — apply client-side
    const filtered = activeFilter === 'ALL' ? requests : requests.filter(r => r.status === activeFilter);
    const isEmpty = filtered.length === 0 && !isLoading;

    const handleSubmit = async () => {
        if (!form.title || !form.category || !form.description) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await createRequest(orgId, estateId, form);
            setShowForm(false);
            setShowSuccess(true);
            setForm({ title: '', category: '', description: '' });
            fetchResidentRequests(orgId, estateId, activeFilter);
        } catch {
            toast.error('Failed to submit request. Please try again.');
        }
    };

    const handleCancel = async () => {
        if (!selected) return;
        setCancelling(true);
        try {
            await cancelRequest(selected._id, orgId, estateId);
            toast.success('Request cancelled');
            setSelected(null);
            fetchResidentRequests(orgId, estateId, activeFilter);
        } catch {
            toast.error('Failed to cancel request');
        } finally {
            setCancelling(false);
        }
    };

    const handleReminder = async () => {
        if (!selected) return;
        if (!canSendReminder(selected.lastReminderSentAt)) {
            toast.error(`You can only send a reminder every ${REMINDER_COOLDOWN_HOURS} hours`);
            return;
        }
        setReminding(true);
        try {
            await sendReminder(selected._id, orgId, estateId);
            toast.success('Reminder sent to estate manager');
            // Refresh to get updated reminderCount
            await fetchResidentRequests(orgId, estateId, activeFilter);
            // Update selected with new data
            const updated = useMaintenanceStore.getState().requests.find(r => r._id === selected._id);
            if (updated) setSelected(updated);
        } catch {
            toast.error('Failed to send reminder');
        } finally {
            setReminding(false);
        }
    };

    // ── Create Form ──────────────────────────────────────────────────────────
    if (showForm) {
        return (
            <div className='p-4 md:p-8 w-full'>
                <button onClick={() => setShowForm(false)} className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Back
                </button>

                <h1 className='text-[20px] font-semibold text-BlackHomz mb-6'>Create Maintenance Request</h1>

                <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6 flex flex-col gap-5'>
                    {/* Title */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[13px] font-medium text-BlackHomz'>Issue Title</label>
                        <input
                            className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                            placeholder='e.g. Leaking Kitchen sink'
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Category */}
                    <div className='flex flex-col gap-1.5 relative'>
                        <label className='text-[13px] font-medium text-BlackHomz'>Category</label>
                        <button
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className='border border-[#E6E6E6] rounded-[8px] h-[48px] px-4 text-sm flex items-center justify-between text-left outline-none focus:border-BlueHomz transition-colors'
                        >
                            <span className={form.category ? 'text-BlackHomz' : 'text-[#A9A9A9]'}>
                                {form.category || 'Select category'}
                            </span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>
                                <path d="M6 9l6 6 6-6" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {categoryOpen && (
                            <div className='absolute top-[76px] left-0 right-0 bg-white border border-[#E6E6E6] rounded-[8px] shadow-lg z-10 overflow-hidden'>
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setForm({ ...form, category: c }); setCategoryOpen(false); }}
                                        className='w-full text-left px-4 py-3 text-sm hover:bg-whiteblue border-b border-[#F5F5F5] last:border-b-0'
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[13px] font-medium text-BlackHomz'>Issue Description</label>
                        <textarea
                            className='border border-[#E6E6E6] rounded-[8px] p-4 text-sm outline-none focus:border-BlueHomz transition-colors resize-none'
                            rows={5}
                            placeholder='Describe the issue in detail...'
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2'
                    >
                        {isSubmitting ? 'Submitting...' : 'Create Request'}
                    </button>
                </div>

                <CustomModal isOpen={showSuccess} onRequestClose={() => setShowSuccess(false)}>
                    <div className='w-[400px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                        <div className='w-16 h-16 rounded-full border-[3px] border-[#039855] flex items-center justify-center'>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className='text-[18px] font-semibold text-BlackHomz text-center'>Request Submitted Successfully</h2>
                        <p className='text-sm text-GrayHomz text-center max-w-[280px]'>
                            Your maintenance request has been sent to the estate manager. You will be notified once it is updated.
                        </p>
                        <button
                            onClick={() => { setShowSuccess(false); setShowForm(false); }}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'
                        >
                            Back to Requests
                        </button>
                    </div>
                </CustomModal>
            </div>
        );
    }

    // ── List Page ────────────────────────────────────────────────────────────
    return (
        <div className='p-4 md:p-8 w-full'>
            <div className='flex items-start justify-between mb-4'>
                <div>
                    <h1 className='text-[20px] font-semibold text-BlackHomz'>Maintenance Request</h1>
                    <p className='text-sm text-GrayHomz mt-0.5'>Track and manage requests you&apos;ve reported and their current status.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className='flex items-center gap-2 bg-BlueHomz text-white text-sm font-semibold px-5 py-2.5 rounded-[8px] hover:opacity-90 transition-opacity flex-shrink-0 ml-4'
                >
                    <span className='text-lg leading-none'>+</span> New Request
                </button>
            </div>

            {/* Status filter tabs */}
            <div className='flex gap-2 mb-5'>
                {([
                    { label: 'All', value: 'ALL' },
                    { label: 'Open', value: 'OPEN' },
                    { label: 'In Progress', value: 'IN_PROGRESS' },
                    { label: 'Resolved', value: 'RESOLVED' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                ] as { label: string; value: MaintenanceStatus | 'ALL' }[]).map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveFilter(tab.value)}
                        className={`px-4 h-[34px] rounded-[4px] text-sm font-medium transition-all ${
                            activeFilter === tab.value
                                ? 'bg-BlueHomz text-white'
                                : 'bg-whiteblue text-BlueHomz'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className='flex justify-center py-20'>
                    <div className='w-8 h-8 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : isEmpty ? (
                <div className='flex flex-col items-center justify-center py-24 gap-4'>
                    <div className='w-16 h-16 bg-BlueHomz rounded-full flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className='text-base font-semibold text-BlackHomz'>No Maintenance Requests Yet</p>
                    <p className='text-sm text-GrayHomz text-center max-w-[300px]'>
                        Create a request if something in your apartment needs attention.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className='h-[48px] px-8 bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity mt-2'
                    >
                        Create Request
                    </button>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {filtered.map((req) => (
                        <div
                            key={req._id}
                            onClick={() => setSelected(req)}
                            className='bg-white rounded-[12px] border border-[#E6E6E6] px-5 py-4 flex items-center justify-between hover:border-BlueHomz transition-colors cursor-pointer'
                        >
                            <div className='flex-1 min-w-0 pr-4'>
                                <div className='flex items-center justify-between gap-3 mb-1'>
                                    <p className='text-[14px] font-semibold text-BlackHomz truncate'>{req.title}</p>
                                    <StatusBadge status={req.status} />
                                </div>
                                <p className='text-[12px] text-GrayHomz truncate'>{req.description}</p>
                                <div className='flex items-center gap-3 mt-1'>
                                    <p className='text-[11px] text-GrayHomz2'>
                                        {req.category} &bull; {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    {req.reminderCount > 0 && (
                                        <span className='text-[10px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full'>
                                            {req.reminderCount} reminder{req.reminderCount !== 1 ? 's' : ''} sent
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ArrowRight className='#4E4E4E' />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Detail Sheet ─────────────────────────────────────────────── */}
            <CustomModal isOpen={!!selected} onRequestClose={() => setSelected(null)}>
                {selected && (
                    <div className='w-[500px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                        {/* Header */}
                        <div className='flex items-start justify-between mb-5'>
                            <div>
                                <h2 className='text-[18px] font-semibold text-BlackHomz'>{selected.title}</h2>
                                <p className='text-[12px] text-GrayHomz mt-0.5'>Maintenance Request Details</p>
                            </div>
                            <button onClick={() => setSelected(null)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Status */}
                        <div className='flex items-center justify-between mb-5'>
                            <StatusBadge status={selected.status} />
                            <span className='text-[11px] text-GrayHomz2'>
                                {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Details */}
                        <div className='flex flex-col gap-4 bg-[#F9FBFF] rounded-[10px] p-4 mb-5'>
                            <div className='flex justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Category</span>
                                <span className='text-[12px] font-medium text-BlackHomz'>{selected.category}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Status</span>
                                <StatusBadge status={selected.status} />
                            </div>
                            {selected.reminderCount > 0 && (
                                <div className='flex justify-between'>
                                    <span className='text-[12px] text-GrayHomz'>Reminders Sent</span>
                                    <span className='text-[12px] font-medium text-BlackHomz'>{selected.reminderCount}</span>
                                </div>
                            )}
                            {selected.lastReminderSentAt && (
                                <div className='flex justify-between'>
                                    <span className='text-[12px] text-GrayHomz'>Last Reminder</span>
                                    <span className='text-[12px] font-medium text-BlackHomz'>
                                        {new Date(selected.lastReminderSentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className='mb-5'>
                            <p className='text-[12px] text-GrayHomz mb-1'>Description</p>
                            <p className='text-[13px] text-BlackHomz leading-relaxed'>{selected.description}</p>
                        </div>

                        {/* Actions */}
                        <div className='flex flex-col gap-3'>
                            {/* Send Reminder — only if OPEN or IN_PROGRESS */}
                            {(selected.status === 'OPEN' || selected.status === 'IN_PROGRESS') && (
                                <button
                                    onClick={handleReminder}
                                    disabled={reminding || !canSendReminder(selected.lastReminderSentAt)}
                                    className='w-full h-[44px] border border-BlueHomz text-BlueHomz rounded-[8px] text-sm font-medium hover:bg-[#EEF5FF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                >
                                    {reminding ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                                            Sending...
                                        </>
                                    ) : !canSendReminder(selected.lastReminderSentAt) ? (
                                        `Reminder sent (wait ${REMINDER_COOLDOWN_HOURS}h)`
                                    ) : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            Send Reminder
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Cancel — only if OPEN */}
                            {selected.status === 'OPEN' && (
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className='w-full h-[44px] border border-red-400 text-red-500 rounded-[8px] text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50'
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Request'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </CustomModal>
        </div>
    );
}