'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKycStore, KycStatus } from '@/store/useKycStore';

interface KycGuardProps {
    role: 'em' | 'resident';
    children: React.ReactNode;
    // Which KYC statuses are allowed to pass through
    allowedStatuses?: KycStatus[];
}

export default function KycGuard({ role, children, allowedStatuses = ['APPROVED'] }: KycGuardProps) {
    const { status, isLoading, fetchStatus } = useKycStore();
    const router = useRouter();

    useEffect(() => {
        // Only fetch KYC status for EM — resident KYC backend endpoint not yet built
        if (role === 'em') fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    // Resident KYC backend not yet implemented — skip guard until ready
    if (role === 'resident') return <>{children}</>;

    const kycPath = '/kyc';

    if (isLoading) {
        return (
            <div className='p-8 w-full flex justify-center py-20'>
                <div className='w-8 h-8 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    const isAllowed = allowedStatuses.includes(status);

    if (!isAllowed) {
        return (
            <div className='p-8 w-full flex items-center justify-center min-h-[400px]'>
                <div className='max-w-[420px] w-full bg-white border border-[#E6E6E6] rounded-[16px] p-8 flex flex-col items-center gap-4 text-center'>
                    {/* Lock icon */}
                    <div className='w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#E65100" strokeWidth="1.5"/>
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="12" cy="16" r="1.5" fill="#E65100"/>
                        </svg>
                    </div>

                    <div>
                        <h2 className='text-[18px] font-bold text-BlackHomz'>KYC Verification Required</h2>
                        <p className='text-[13px] text-GrayHomz mt-2 leading-relaxed'>
                            {status === 'PENDING'
                                ? 'Your identity verification is under review. Wallet features will be unlocked once approved.'
                                : status === 'REJECTED'
                                    ? 'Your verification was rejected. Please re-submit your identity documents to access wallet features.'
                                    : 'You need to verify your identity before using wallet features. This keeps your account and funds secure.'}
                        </p>
                    </div>

                    {/* Status badge */}
                    {status !== 'NONE' && (
                        <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${
                            status === 'PENDING'  ? 'bg-[#FFF3E0] text-[#E65100]' :
                            status === 'REJECTED' ? 'bg-[#FFEBEE] text-[#D32F2F]' :
                            'bg-[#F5F5F5] text-[#616161]'
                        }`}>
                            {status === 'PENDING' ? 'Under Review' : status === 'REJECTED' ? 'Rejected' : status}
                        </span>
                    )}

                    <div className='flex flex-col gap-3 w-full mt-2'>
                        {status !== 'PENDING' && (
                            <button
                                onClick={() => router.push(kycPath)}
                                className='w-full h-[48px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                            >
                                {status === 'REJECTED' ? 'Re-submit Verification' : 'Verify My Identity'}
                            </button>
                        )}
                        {status === 'PENDING' && (
                            <button
                                onClick={() => fetchStatus()}
                                className='w-full h-[48px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                            >
                                Check Status
                            </button>
                        )}
                        <button
                            onClick={() => router.back()}
                            className='w-full h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[10px] text-sm hover:bg-[#F5F5F5]'
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}