'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface MaintenanceRequest {
    _id?: string;
    title?: string;
    description?: string;
    status?: string;
    createdAt?: string;
    category?: string;
    priority?: string;
    updatedAt?: string;
    resolvedAt?: string;
    images?: string[];
    estateName?: string;
    userName?: string;
    userUnit?: string;
    userPhone?: string;
    userEmail?: string;
    unit?: string;
    managerName?: string;
    managerEstate?: string;
    managerPhone?: string;
    managerEmail?: string;
    message?: string;
    userInfo?: { name?: string; estate?: string; unit?: string; phone?: string; email?: string };
    managerInfo?: { name?: string; estate?: string; phone?: string; email?: string };
}

const statusColor = (s?: string) => {
    if (s === 'resolved' || s === 'closed') return 'text-[#2E7D32]';
    if (s === 'in_progress') return 'text-[#1565C0]';
    return 'text-[#006AFF]';
};

export default function MaintenanceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [req, setReq] = useState<MaintenanceRequest | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchRequest(); }, [id]);

    const fetchRequest = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/maintenance/${id}`);
            setReq(res.data?.data || res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    if (!req) return (
        <div className='p-8'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>
            <p className='text-[13px] text-[#9E9E9E]'>Request not found</p>
        </div>
    );

    return (
        <div className='p-8 w-full max-w-[900px]'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                Back
            </button>

            {/* Header */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                <h1 className='text-[18px] font-bold text-[#1A1A1A]'>Maintenance Request Details</h1>
                <p className='text-[13px] text-[#9E9E9E] mt-0.5'>({(req.userInfo?.estate && req.userInfo.estate !== 'N/A') ? req.userInfo.estate : (req.estateName && req.estateName !== 'N/A') ? req.estateName : 'Estate'})</p>
            </div>

            {/* Info sections */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                {/* User Information */}
                <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>User Information</p>
                <div className='grid grid-cols-3 gap-y-5 mb-6'>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>User Name</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.userInfo?.name || req.userName || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Estate</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{(req.userInfo?.estate && req.userInfo.estate !== 'N/A') ? req.userInfo.estate : (req.estateName && req.estateName !== 'N/A') ? req.estateName : '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Unit</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.userInfo?.unit || req.userUnit || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Phone</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.userInfo?.phone || req.userPhone || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Email</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.userInfo?.email || req.userEmail || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Status</p>
                        <p className={`text-[13px] font-semibold capitalize ${statusColor(req.status)}`}>
                            {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1).replace(/_/g, ' ') : 'Open'}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className='border-t border-[#F0F0F0] mb-5' />

                {/* Estate Manager Information */}
                <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>Estate Manager Information</p>
                <div className='grid grid-cols-3 gap-y-5'>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Manager Name</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.managerInfo?.name || req.managerName || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Estate</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.managerEstate || (req.userInfo?.estate && req.userInfo?.estate !== 'N/A' ? req.userInfo?.estate : (req.estateName && req.estateName !== 'N/A' ? req.estateName : '—'))}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Phone</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.managerInfo?.phone || req.managerPhone || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Email</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{req.managerInfo?.email || req.managerEmail || '—'}</p>
                    </div>
                </div>
            </div>

            {/* Issue */}
            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-6'>
                <p className='text-[13px] font-semibold text-[#006AFF] underline mb-4'>Issue</p>
                <div className='border border-[#E8E8E8] rounded-[8px] p-4 min-h-[120px]'>
                    <p className='text-[13px] text-[#9E9E9E]'>{req.description || req.title || '—'}</p>
                </div>
            </div>

            {/* Contact button */}
            <div className='flex justify-end'>
                <button
                    onClick={() => setShowContactModal(true)}
                    className='h-[48px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC]'>
                    Contact Estate Manager
                </button>
            </div>

            {/* Contact CM Modal */}
            {showContactModal && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[380px] p-6'>
                        <div className='w-11 h-11 rounded-full bg-[#EEF5FF] flex items-center justify-center mx-auto mb-3'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' stroke='#006AFF' strokeWidth='1.5'/>
                                <polyline points='22,6 12,13 2,6' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/>
                            </svg>
                        </div>
                        <h3 className='text-[15px] font-bold text-[#1A1A1A] text-center mb-1'>Contact Estate Manager</h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-1'>You are about to send an email to:</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A] text-center mb-1'>
                            {req?.managerInfo?.name || '—'}
                        </p>
                        <p className='text-[12px] text-[#006AFF] text-center mb-5'>
                            {(req?.managerInfo?.email && req?.managerInfo?.email !== 'N/A') ? req?.managerInfo?.email : req?.managerEmail || '—' || '—'}
                        </p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowContactModal(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={() => {
                                const email = (req?.managerInfo?.email && req?.managerInfo?.email !== 'N/A') ? req?.managerInfo?.email : req?.managerEmail || '—';
                                if (email && email !== 'N/A') {
                                    window.open(`mailto:${email}`);
                                } else {
                                    toast.error('No email address available for this manager');
                                }
                                setShowContactModal(false);
                            }} className='flex-1 h-[40px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC]'>
                                Open Email App
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}