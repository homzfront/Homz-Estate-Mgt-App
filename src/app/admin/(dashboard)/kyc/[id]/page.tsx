'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface KycDetail {
    _id?: string;
    userInfo?: {
        fullName?: string;
        estate?: string;
        idType?: string;
        submissionDate?: string;
        status?: string;
        phoneNumber?: string;
        email?: string;
    };
    document?: {
        url?: string;
        secureUrl?: string;
        format?: string;
        publicId?: string;
    };
    rejectionReason?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        pending:  { label: 'Pending',  color: '#E65100', bg: '#FFF3E0' },
        approved: { label: 'Approved', color: '#2E7D32', bg: '#E8F5E9' },
        rejected: { label: 'Rejected', color: '#C62828', bg: '#FFEBEE' },
    };
    const cfg = map[status?.toLowerCase()] || map.pending;
    return (
        <span style={{ color: cfg.color, background: cfg.bg }}
            className='text-[12px] font-semibold px-3 py-1 rounded-full capitalize'>
            {cfg.label}
        </span>
    );
};

export default function KycDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [kyc, setKyc] = useState<KycDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/admin/kyc/${id}`);
                setKyc(res.data?.data || res.data || null);
            } catch { toast.error('Failed to load KYC record'); }
            finally { setLoading(false); }
        };
        if (id) fetch();
    }, [id]);

    const approve = async () => {
        setActing(true);
        try {
            await api.patch(`/admin/kyc/${id}/approve`);
            toast.success('KYC approved');
            router.push('/admin/kyc');
        } catch { toast.error('Failed to approve'); }
        finally { setActing(false); }
    };

    const reject = async () => {
        if (!reason.trim()) { toast.error('Please provide a rejection reason'); return; }
        setActing(true);
        try {
            await api.patch(`/admin/kyc/${id}/reject`, { reason });
            toast.success('KYC rejected');
            router.push('/admin/kyc');
        } catch { toast.error('Failed to reject'); }
        finally { setActing(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    if (!kyc) return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-3'>
            <p className='text-[14px] text-[#9E9E9E]'>KYC record not found</p>
            <button onClick={() => router.push('/admin/kyc')} className='text-[13px] text-[#006AFF] hover:underline'>Back to KYC</button>
        </div>
    );

    const info = kyc.userInfo || {};
    const status = info.status || 'pending';
    const isPending = status.toLowerCase() === 'pending';

    return (
        <div className='p-6 max-w-[800px] mx-auto'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <button onClick={() => router.push('/admin/kyc')}
                    className='w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EBEBEB]'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                        <path d='M19 12H5M5 12l7-7M5 12l7 7' stroke='#1A1A1A' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                </button>
                <div>
                    <h1 className='text-[20px] font-bold text-[#1A1A1A]'>KYC Verification</h1>
                    <p className='text-[12px] text-[#9E9E9E] mt-0.5'>Review submitted identity document</p>
                </div>
            </div>

            {/* Applicant Info */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 mb-4'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-[15px] font-semibold text-[#1A1A1A]'>Applicant Details</h2>
                    <StatusBadge status={status} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    {[
                        ['Full Name',        info.fullName        || '—'],
                        ['Estate',           info.estate          || '—'],
                        ['Email',            info.email           || '—'],
                        ['Phone',            info.phoneNumber     || '—'],
                        ['ID Type',          info.idType          || '—'],
                        ['Submitted',        info.submissionDate
                            ? new Date(info.submissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <p className='text-[11px] text-[#9E9E9E] mb-1'>{label}</p>
                            <p className='text-[13px] font-medium text-[#1A1A1A]'>{value}</p>
                        </div>
                    ))}
                </div>
                {kyc.rejectionReason && (
                    <div className='mt-4 p-3 bg-[#FFEBEE] rounded-[8px]'>
                        <p className='text-[12px] text-[#C62828] font-medium'>Rejection Reason</p>
                        <p className='text-[13px] text-[#1A1A1A] mt-1'>{kyc.rejectionReason}</p>
                    </div>
                )}
            </div>

            {/* Document */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 mb-6'>
                <h2 className='text-[15px] font-semibold text-[#1A1A1A] mb-4'>Identity Document</h2>
                {(() => {
                    const docUrl = kyc.document?.secureUrl || kyc.document?.url;
                    // Detect if URL is a valid image/PDF (Cloudinary) vs a non-document URL (SmileID job page)
                    const isValidDoc = docUrl &&
                        !docUrl.includes('usesmileid.com') &&
                        !docUrl.includes('smile_id') &&
                        (docUrl.includes('cloudinary') || docUrl.includes('res.cloudinary') ||
                         /\.(jpg|jpeg|png|pdf|webp)(\?|$)/i.test(docUrl));
                    const isPdf = docUrl?.toLowerCase().includes('.pdf');

                    if (!docUrl) return <p className='text-[13px] text-[#9E9E9E]'>No document uploaded</p>;

                    if (!isValidDoc) return (
                        <div className='p-4 bg-[#FFF8E1] rounded-[8px] border border-[#FFE082]'>
                            <p className='text-[13px] text-[#795548] font-medium'>Document not directly viewable</p>
                            <p className='text-[12px] text-[#9E9E9E] mt-1'>The document was processed via SmileID. The verification result is reflected in the status above.</p>
                            {kyc.document?.publicId && (
                                <p className='text-[11px] text-[#9E9E9E] mt-2 font-mono'>Job ID: {kyc.document.publicId}</p>
                            )}
                        </div>
                    );

                    return (
                        <div className='space-y-3'>
                            {isPdf ? (
                                <div className='w-full h-[400px] rounded-[8px] border border-[#F0F0F0] overflow-hidden'>
                                    <iframe src={docUrl} className='w-full h-full' title='ID Document' />
                                </div>
                            ) : (
                                <img
                                    src={docUrl}
                                    alt='ID Document'
                                    className='w-full max-h-[400px] object-contain rounded-[8px] border border-[#F0F0F0] bg-[#FAFAFA]'
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            <a href={docUrl} target='_blank' rel='noreferrer'
                                className='inline-flex items-center gap-2 text-[12px] text-[#006AFF] hover:underline'>
                                <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                                    <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                                Open full document
                            </a>
                        </div>
                    );
                })()}
            </div>

            {/* Actions */}
            {isPending && (
                <div className='flex items-center gap-3'>
                    <button
                        onClick={approve}
                        disabled={acting}
                        className='flex-1 h-[44px] bg-[#006AFF] text-white text-[14px] font-semibold rounded-[10px] hover:bg-[#0055CC] disabled:opacity-50 transition-colors'>
                        {acting ? 'Processing...' : 'Approve KYC'}
                    </button>
                    <button
                        onClick={() => setShowReject(true)}
                        disabled={acting}
                        className='flex-1 h-[44px] bg-white text-[#EF4444] text-[14px] font-semibold rounded-[10px] border border-[#EF4444] hover:bg-[#FFF5F5] disabled:opacity-50 transition-colors'>
                        Reject KYC
                    </button>
                </div>
            )}

            {/* Reject Modal */}
            {showReject && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[420px] p-6'>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] mb-1'>Reject KYC</h3>
                        <p className='text-[13px] text-[#9E9E9E] mb-4'>Provide a reason so the applicant knows what to fix.</p>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder='Enter rejection reason...'
                            rows={4}
                            className='w-full border border-[#D0D0D0] rounded-[8px] px-3 py-2 text-[13px] text-[#1A1A1A] resize-none focus:outline-none focus:border-[#006AFF] mb-4'
                        />
                        <div className='flex gap-3'>
                            <button onClick={() => setShowReject(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={reject} disabled={acting}
                                className='flex-1 h-[40px] bg-[#EF4444] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#DC2626] disabled:opacity-50'>
                                {acting ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}