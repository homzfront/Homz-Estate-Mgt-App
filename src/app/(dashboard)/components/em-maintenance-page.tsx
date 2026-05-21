'use client';
import React, { useEffect, useState } from 'react';
import { useMaintenanceStore, MaintenanceRequest, MaintenanceStatus } from '@/store/useMaintenanceStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';

const STATUS_STYLE: Record<MaintenanceStatus, { label: string; bg: string; color: string }> = {
    OPEN:        { label: 'Open',        bg: '#FFF3E0', color: '#E65100' },
    IN_PROGRESS: { label: 'In-Progress', bg: '#EEF5FF', color: '#006AFF' },
    RESOLVED:    { label: 'Resolved',    bg: '#E8F5E9', color: '#2E7D32' },
    CANCELLED:   { label: 'Cancelled',   bg: '#F5F5F5', color: '#616161' },
};

const TABS: { label: string; value: 'ALL' | MaintenanceStatus }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_OPTIONS = [
    { id: 'OPEN', label: 'Open' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'CANCELLED', label: 'Cancelled' },
];

function StatusBadgeDropdown({ status, onChange }: { status: MaintenanceStatus; onChange: (s: MaintenanceStatus) => void }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const s = STATUS_STYLE[status];

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className='relative' ref={ref}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium'
                style={{ backgroundColor: s.bg, color: s.color }}
            >
                {s.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            {open && (
                <div className='absolute right-0 top-8 bg-white border border-[#E6E6E6] rounded-[8px] shadow-lg z-50 overflow-hidden min-w-[140px]'>
                    {STATUS_OPTIONS.map((opt) => {
                        const st = STATUS_STYLE[opt.id as MaintenanceStatus];
                        return (
                            <button
                                key={opt.id}
                                onClick={(e) => { e.stopPropagation(); onChange(opt.id as MaintenanceStatus); setOpen(false); }}
                                className='w-full text-left px-4 py-2.5 text-[12px] font-medium hover:bg-[#F6F9FF] flex items-center gap-2 border-b border-[#F5F5F5] last:border-b-0'
                                style={{ color: st.color }}
                            >
                                <span className='w-2 h-2 rounded-full' style={{ backgroundColor: st.color }} />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function getResident(req: MaintenanceRequest) {
    if (typeof req.associatedIds.residentId === 'object') return req.associatedIds.residentId;
    return null;
}

export default function EMMaintenancePage() {
    const { requests, isLoading, fetchEMRequests, updateStatus } = useMaintenanceStore();
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    const orgId = selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const estateId = selectedCommunity?.estate?._id || '';

    const [activeTab, setActiveTab] = useState<'ALL' | MaintenanceStatus>('ALL');
    const [selected, setSelected] = useState<MaintenanceRequest | null>(null);

    const filtered = activeTab === 'ALL' ? requests : requests.filter((r) => r.status === activeTab);

    useEffect(() => {
        if (orgId && estateId) fetchEMRequests(orgId, estateId, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId, estateId, activeTab]);

    const handleStatusChange = async (id: string, status: MaintenanceStatus) => {
        await updateStatus(id, orgId, estateId, status);
        if (selected?._id === id) setSelected((s) => s ? { ...s, status } : s);
    };

    return (
        <div className='p-8 w-full'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Maintenance Requests</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Track and manage issues within your estate</p>
            </div>

            {/* Tabs */}
            <div className='flex gap-6 border-b border-[#E6E6E6] mb-6'>
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab.value ? 'text-BlueHomz' : 'text-GrayHomz hover:text-BlackHomz'}`}
                    >
                        {tab.label}
                        {activeTab === tab.value && (
                            <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-BlueHomz rounded-full' />
                        )}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className='flex justify-center py-20'>
                    <div className='w-8 h-8 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 gap-4'>
                    <div className='w-16 h-16 bg-BlueHomz rounded-full flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className='text-base font-semibold text-BlackHomz'>No Maintenance Request Yet</p>
                    <p className='text-sm text-GrayHomz text-center max-w-[300px]'>
                        Maintenance issues reported by residents will appear here
                    </p>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {filtered.map((req) => {
                        const resident = getResident(req);
                        const s = STATUS_STYLE[req.status];
                        return (
                            <div
                                key={req._id}
                                onClick={() => setSelected(req)}
                                className='bg-white rounded-[12px] border border-[#E6E6E6] p-5 hover:border-BlueHomz transition-colors cursor-pointer'
                            >
                                <div className='flex items-start justify-between gap-3 mb-2'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 rounded-full bg-[#E6E6E6] flex-shrink-0' />
                                        <p className='text-[14px] font-semibold text-BlackHomz'>{req.title}</p>
                                    </div>
                                    <span
                                        className='text-[11px] font-medium px-3 py-1 rounded-full flex-shrink-0 flex items-center gap-1'
                                        style={{ backgroundColor: s.bg, color: s.color }}
                                    >
                                        {s.label}
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 9l6 6 6-6" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"/>
                                        </svg>
                                    </span>
                                </div>
                                {resident && (
                                    <div className='pl-11'>
                                        <p className='text-[13px] font-medium text-BlackHomz'>{resident.firstName} {resident.lastName}</p>
                                        <p className='text-[12px] text-GrayHomz mt-0.5'>{resident.apartment} (unit {resident.building})</p>
                                        <div className='flex items-center justify-between mt-1'>
                                            <p className='text-[12px] text-GrayHomz'>{req.category}</p>
                                            <p className='text-[12px] text-GrayHomz'>
                                                {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Sheet */}
            {selected && (
                <div
                    className='fixed inset-0 z-50 flex items-end md:items-center justify-center'
                    onClick={() => setSelected(null)}
                >
                    <div className='absolute inset-0 bg-black/40' />
                    <div
                        className='relative bg-white rounded-t-[20px] md:rounded-[16px] w-full md:max-w-[480px] max-h-[90vh] overflow-y-auto p-6'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sheet header */}
                        <div className='flex items-center justify-between mb-5'>
                            <h3 className='text-[16px] font-semibold text-BlackHomz'>Maintenance details</h3>
                            <button onClick={() => setSelected(null)} className='text-GrayHomz hover:text-BlackHomz'>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Issue summary */}
                        <div className='bg-[#F6F6F6] rounded-[10px] p-4 flex flex-col gap-3 mb-4'>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Issue:</span>
                                <span className='text-[13px] font-medium text-BlackHomz'>{selected.title}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Date submitted:</span>
                                <span className='text-[13px] font-medium text-BlackHomz'>
                                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Status:</span>
                                <StatusBadgeDropdown
                                    status={selected.status}
                                    onChange={(s) => handleStatusChange(selected._id, s)}
                                />
                            </div>
                        </div>

                        {/* Resident details */}
                        {getResident(selected) && (
                            <div className='mb-4'>
                                <p className='text-[13px] font-semibold text-BlueHomz mb-3'>Resident details</p>
                                <div className='bg-[#F6F6F6] rounded-[10px] p-4 flex flex-col gap-3'>
                                    {[
                                        { label: 'Resident Name', value: `${getResident(selected)!.firstName} ${getResident(selected)!.lastName}` },
                                        { label: 'Apartment / Unit', value: `${getResident(selected)!.apartment} (unit ${getResident(selected)!.building})` },
                                        { label: 'Email', value: getResident(selected)!.email },
                                        { label: 'Phone Number', value: getResident(selected)!.phoneNumber || '—' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className='flex items-center justify-between gap-4'>
                                            <span className='text-[12px] text-GrayHomz flex-shrink-0'>{label}:</span>
                                            <span className='text-[13px] font-medium text-BlackHomz text-right'>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Issue description */}
                        <div>
                            <p className='text-[13px] font-semibold text-BlueHomz mb-3'>Issue description</p>
                            <div className='bg-[#F6F6F6] rounded-[10px] p-4'>
                                <p className='text-[13px] text-GrayHomz leading-relaxed'>{selected.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}