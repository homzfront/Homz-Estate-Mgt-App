'use client';
import React, { useEffect, useState } from 'react';
import { useKycStore } from '@/store/useKycStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useAuthSlice } from '@/store/authStore';
import LoadingSpinner from '@/components/general/loadingSpinner';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    NONE:     { color: '#9E9E9E', bg: '#F5F5F5', label: 'Not Started'  },
    PENDING:  { color: '#E65100', bg: '#FFF3E0', label: 'Under Review' },
    APPROVED: { color: '#039855', bg: '#E8F5E9', label: 'Verified'     },
    REJECTED: { color: '#D32F2F', bg: '#FFEBEE', label: 'Rejected'     },
};

const ID_TYPES = [
    { value: 'NIN',             label: 'National ID (NIN)'      },
    { value: 'PASSPORT',        label: 'International Passport' },
    { value: 'DRIVERS_LICENSE', label: "Driver's License"       },
    { value: 'VOTER_ID',        label: 'Voter ID'               },
];

export default function KycPage() {
    const { status, record, isLoading, fetchStatus } = useKycStore();
    const { communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);

    const orgId    = selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const estateId = selectedCommunity?.estate?._id || '';
    const userId   = communityProfile?._id || '';

    const [step, setStep]             = useState<'status' | 'select-id' | 'widget' | 'submitted'>('status');
    const [idType, setIdType]         = useState('NIN');
    const [token, setToken]           = useState<string | null>(null);
    const [jobId, setJobId]           = useState<string | null>(null);
    const [tokenLoading, setTokenLoading] = useState(false);

    useEffect(() => { fetchStatus(); }, []); // eslint-disable-line

    // Load SmileID v11 CDN script once on mount
    useEffect(() => {
        if (document.querySelector('script[data-smileid]')) return;
        const s = document.createElement('script');
        s.src = 'https://cdn.smileidentity.com/inline/v11/js/script.min.js';
        s.async = true;
        s.setAttribute('data-smileid', '1');
        document.head.appendChild(s);
    }, []);

    // When step becomes 'widget' and token is set,
    // call window.SmileIdentity() — the v11 API per official docs
    useEffect(() => {
        if (step !== 'widget' || !token) return;

        const tryInit = () => {
            const win = window as any;
            if (typeof win.SmileIdentity !== 'function') {
                // Script not ready yet — retry in 400ms
                setTimeout(tryInit, 400);
                return;
            }
            win.SmileIdentity({
                token,
                product: 'doc_verification',
                callback_url: process.env.NEXT_PUBLIC_SMILE_ID_CALLBACK_URL
                    || process.env.SMILE_ID_CALLBACK_URL
                    || 'http://localhost:4000/api/v1/webhook/kyc/smile-id',
                environment: process.env.NEXT_PUBLIC_SMILE_ID_SERVER === '1' ? 'live' : 'sandbox',
                partner_details: {
                    partner_id: process.env.NEXT_PUBLIC_SMILE_ID_PARTNER_ID
                        || process.env.SMILE_ID_PARTNER_ID
                        || '',
                    name: 'Homz',
                    logo_url: '',
                    policy_url: 'https://homz.ng/privacy',
                    theme_color: '#006AFF',
                },
                onSuccess: async (params: any) => {
                    const useJobId = params?.PartnerParams?.job_id
                        || params?.job_id
                        || params?.jobId
                        || jobId
                        || `smile-${Date.now()}`;
                    if (orgId && estateId) {
                        try {
                            // KycDocumentInfo schema requires: assetId, publicId, url, secureUrl
                            // SmileID handles images directly - use jobId as reference
                            const smileJobId = useJobId || `smile-${Date.now()}`;
                            await useKycStore.getState().submitKyc(orgId, estateId, {
                                idType,
                                jobId: smileJobId,
                                document: {
                                    assetId:   smileJobId,
                                    publicId:  smileJobId,
                                    url:       `https://smileidentity.com/jobs/${smileJobId}`,
                                    secureUrl: `https://smileidentity.com/jobs/${smileJobId}`,
                                    format:    'smile_id',
                                },
                            });
                            await fetchStatus();
                        } catch { /* webhook will update status */ }
                    }
                    setStep('submitted');
                },
                onClose: () => {
                    setStep('select-id');
                    setToken(null);
                },
                onError: () => {
                    toast.error('Verification failed. Please try again.');
                    setStep('select-id');
                    setToken(null);
                },
            });
        };

        const timer = setTimeout(tryInit, 300);
        return () => clearTimeout(timer);
    }, [step, token]); // eslint-disable-line

    const handleGetToken = async () => {
        if (!userId) { toast.error('Account not loaded. Please refresh.'); return; }
        setTokenLoading(true);
        try {
            const res = await fetch('/api/kyc/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();

            // 409 = user already verified with SmileID previously
            // Submit a pending record to our backend and show pending state
            if (res.status === 409 || data.error === 'ALREADY_ENROLLED') {
                toast('Your identity was already verified with SmileID. Submitting for review...', { icon: 'ℹ️' });
                if (orgId && estateId) {
                    try {
                        const prevJobId = `previously-verified-${Date.now()}`;
                        await useKycStore.getState().submitKyc(orgId, estateId, {
                            idType,
                            jobId: prevJobId,
                            document: {
                                assetId:   prevJobId,
                                publicId:  prevJobId,
                                url:       `https://smileidentity.com/jobs/${prevJobId}`,
                                secureUrl: `https://smileidentity.com/jobs/${prevJobId}`,
                                format:    'smile_id',
                            },
                        });
                        await fetchStatus();
                    } catch {
                        await fetchStatus();
                    }
                }
                setStep('submitted');
                return;
            }

            if (!res.ok || !data.token) throw new Error(data.error || 'No token returned');
            setToken(data.token);
            if (data.jobId) setJobId(data.jobId);
            setStep('widget');
        } catch (e: any) {
            toast.error(e.message || 'Could not start verification.');
        } finally {
            setTokenLoading(false);
        }
    };

    if (isLoading) {
        return <div className='p-8 w-full flex justify-center py-20'><LoadingSpinner size={40} /></div>;
    }

    const cfg = STATUS_CONFIG[status];

    return (
        <div className='p-8 w-full max-w-[680px]'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>KYC Verification</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Verify your identity to unlock full estate management features</p>
            </div>

            {/* Status card */}
            <div className='bg-white border border-[#E6E6E6] rounded-[14px] p-5 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: cfg.bg }}>
                            {status === 'APPROVED' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            {status === 'REJECTED' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round"/></svg>}
                            {status === 'PENDING'  && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round"/></svg>}
                            {status === 'NONE'     && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={cfg.color}/></svg>}
                        </div>
                        <div>
                            <p className='text-[14px] font-semibold text-BlackHomz'>Verification Status</p>
                            {record?.idType && <p className='text-[12px] text-GrayHomz mt-0.5'>ID: {ID_TYPES.find(t => t.value === record.idType)?.label || record.idType}</p>}
                        </div>
                    </div>
                    <span className='text-[12px] font-semibold px-3 py-1 rounded-full' style={{ color: cfg.color, backgroundColor: cfg.bg }}>{cfg.label}</span>
                </div>
                {status === 'REJECTED' && record?.rejectionReason && (
                    <div className='mt-4 p-3 bg-[#FFEBEE] rounded-[8px]'><p className='text-[12px] text-[#D32F2F] font-medium'>Reason: {record.rejectionReason}</p></div>
                )}
                {status === 'PENDING' && <div className='mt-4 p-3 bg-[#FFF3E0] rounded-[8px]'><p className='text-[12px] text-[#E65100]'>Documents under review — usually 24–48 hours.</p></div>}
                {status === 'APPROVED' && <div className='mt-4 p-3 bg-[#E8F5E9] rounded-[8px]'><p className='text-[12px] text-[#039855]'>Your identity is verified. All features are unlocked.</p></div>}
            </div>

            {/* Start / retry */}
            {(status === 'NONE' || status === 'REJECTED') && step === 'status' && (
                <>
                    <div className='bg-[#EEF5FF] border border-[#C8DEFF] rounded-[12px] p-4 mb-5'>
                        <p className='text-[13px] font-semibold text-BlueHomz mb-2'>What you&apos;ll need</p>
                        <ul className='flex flex-col gap-1.5'>
                            {["A valid government-issued ID (NIN, Passport, Driver's Licence or Voter ID)", "A clear selfie in good lighting", "Stable internet connection"].map((item, i) => (
                                <li key={i} className='flex items-start gap-2'>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className='flex-shrink-0 mt-0.5'><path d="M5 12l5 5L20 7" stroke="#006AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    <span className='text-[12px] text-BlueHomz'>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setStep('select-id')} className='w-full h-[50px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90'>
                        {status === 'REJECTED' ? 'Re-submit Verification' : 'Start Verification'}
                    </button>
                </>
            )}

            {/* ID type selection */}
            {step === 'select-id' && (
                <div className='bg-white border border-[#E6E6E6] rounded-[14px] p-5'>
                    <h2 className='text-[15px] font-semibold text-BlackHomz mb-4'>Select your ID type</h2>
                    <div className='grid grid-cols-2 gap-3 mb-6'>
                        {ID_TYPES.map(t => (
                            <button key={t.value} onClick={() => setIdType(t.value)}
                                className={`h-[52px] rounded-[8px] text-[13px] font-medium border transition-all ${idType === t.value ? 'bg-[#EEF5FF] border-BlueHomz text-BlueHomz' : 'bg-white border-[#E6E6E6] text-GrayHomz hover:border-BlueHomz'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className='flex gap-3'>
                        <button onClick={() => setStep('status')} className='flex-1 h-[48px] border border-[#E6E6E6] text-GrayHomz rounded-[10px] text-sm hover:bg-[#F5F5F5]'>Back</button>
                        <button onClick={handleGetToken} disabled={tokenLoading}
                            className='flex-1 h-[48px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'>
                            {tokenLoading ? <><div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'/> Loading...</> : 'Continue'}
                        </button>
                    </div>
                </div>
            )}

            {/* Widget loading state — SmileIdentity() renders its own overlay UI */}
            {step === 'widget' && (
                <div className='bg-white border border-[#E6E6E6] rounded-[14px] p-8 flex flex-col items-center gap-3'>
                    <div className='w-6 h-6 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin'/>
                    <p className='text-[13px] text-GrayHomz'>Loading verification widget...</p>
                    <button onClick={() => { setStep('select-id'); setToken(null); }}
                        className='mt-2 text-[12px] text-GrayHomz hover:text-BlackHomz underline'>
                        Cancel
                    </button>
                </div>
            )}

            {/* Submitted */}
            {step === 'submitted' && (
                <div className='bg-white border border-[#E6E6E6] rounded-[14px] p-8 flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <h2 className='text-[18px] font-bold text-BlackHomz'>Submitted Successfully</h2>
                    <p className='text-[13px] text-GrayHomz text-center max-w-[340px]'>Your KYC documents have been submitted. Review takes 24–48 hours.</p>
                    <button onClick={() => { fetchStatus(); setStep('status'); }} className='w-full h-[48px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90'>
                        View Status
                    </button>
                </div>
            )}
        </div>
    );
}