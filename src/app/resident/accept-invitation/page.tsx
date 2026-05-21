'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { useAuthSlice } from '@/store/authStore';

type State = 'loading' | 'success' | 'error' | 'prompt';

// Key used to store pending co-resident invitation across auth flow
const PENDING_KEY = 'homz_pending_coresident_invite';

export default function AcceptInvitationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { userData } = useAuthSlice();

    const token    = searchParams.get('token')    || '';
    const estateId = searchParams.get('estateId') || '';

    const [state, setState]     = useState<State>('loading');
    const [message, setMessage] = useState('');
    const hasCalledRef = React.useRef(false);

    useEffect(() => {
        if (!token || !estateId) {
            setState('error');
            setMessage('Invalid invitation link — token or estate information is missing.');
            return;
        }

        // Always persist the invitation params so they survive the auth flow
        sessionStorage.setItem(PENDING_KEY, JSON.stringify({ token, estateId }));

        if (userData) {
            // Guard against multiple calls - each call creates a new DB record
            if (hasCalledRef.current) return;
            hasCalledRef.current = true;
            setTimeout(() => acceptInvitation(), 800);
        } else {
            // Not logged in — show options: sign up or log in
            setState('prompt');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, token, estateId]);

    const acceptInvitation = async () => {
        setState('loading');
        try {
            // Get token from sessionStorage (set immediately after signup)
            // Use plain axios to bypass the api interceptor entirely
            // This avoids old session cookies/tokens interfering
            const sessionToken = typeof window !== 'undefined'
                ? sessionStorage.getItem('homz_access_token')
                : null;

            if (!sessionToken) {
                // No session token - fall back to api (existing logged-in user)
                await api.post(
                    `/residents/dependents-invitations/accept?token=${token}&estateId=${estateId}`
                );
            } else {
                // Use raw axios with the fresh token to bypass interceptor entirely
                const axios = (await import('axios')).default;
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/residents/dependents-invitations/accept?token=${token}&estateId=${estateId}`,
                    {},
                    { headers: { Authorization: `Bearer ${sessionToken}` } }
                );
            }
            sessionStorage.removeItem(PENDING_KEY);
            if (typeof window !== 'undefined') sessionStorage.removeItem('homz_access_token');
            setState('success');
        } catch (err: any) {
            // Clear session token regardless - don't let it persist
            if (typeof window !== 'undefined') sessionStorage.removeItem('homz_access_token');
            const msg = err?.response?.data?.message || 'Failed to accept invitation';
            setMessage(Array.isArray(msg) ? msg[0] : msg);
            setState('error');
        }
    };

    return (
        <div className='min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4'>
            <div className='bg-white rounded-[20px] shadow-sm border border-[#E6E6E6] w-full max-w-[420px] p-8 flex flex-col items-center gap-5 text-center'>

                {/* Logo */}
                <div className='flex items-center gap-2 mb-2'>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#006AFF"/>
                        <path d="M8 22V14L16 8L24 14V22H19V17H13V22H8Z" fill="white"/>
                    </svg>
                    <span className='text-[18px] font-bold text-[#1A1A1A]'>Homz<span className='text-[#006AFF]'>.ng</span></span>
                </div>

                {/* Loading */}
                {state === 'loading' && (
                    <>
                        <div className='w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                        </div>
                        <div>
                            <h1 className='text-[18px] font-bold text-[#1A1A1A]'>Accepting Invitation</h1>
                            <p className='text-[13px] text-[#6B6B6B] mt-1'>Please wait while we process your invitation...</p>
                        </div>
                    </>
                )}

                {/* Prompt: new user or existing */}
                {state === 'prompt' && (
                    <>
                        <div className='w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-[18px] font-bold text-[#1A1A1A]'>Estate Invitation</h1>
                            <p className='text-[13px] text-[#6B6B6B] mt-1'>
                                You&apos;ve been invited to join an estate on Homz. Create an account or log in to accept.
                            </p>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            {/* New user — go to register */}
                            <button
                                onClick={() => router.push('/register')}
                                className='w-full h-[48px] bg-[#006AFF] text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                            >
                                Create an Account
                            </button>
                            {/* Existing user — go to login */}
                            <button
                                onClick={() => router.push('/login')}
                                className='w-full h-[44px] border border-[#E6E6E6] text-[#1A1A1A] rounded-[10px] text-sm font-medium hover:bg-[#F5F5F5]'
                            >
                                I already have an account
                            </button>
                        </div>
                        <p className='text-[11px] text-[#9E9E9E]'>
                            Your invitation is saved — it will be accepted automatically after you sign in.
                        </p>
                    </>
                )}

                {/* Success */}
                {state === 'success' && (
                    <>
                        <div className='w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center'>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-[18px] font-bold text-[#1A1A1A]'>You&apos;re In!</h1>
                            <p className='text-[13px] text-[#6B6B6B] mt-1'>
                                You have successfully joined the estate. Welcome to the community.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/resident/dashboard')}
                            className='w-full h-[48px] bg-[#006AFF] text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}

                {/* Error */}
                {state === 'error' && (
                    <>
                        <div className='w-14 h-14 bg-[#FFEBEE] rounded-full flex items-center justify-center'>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 8v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-[18px] font-bold text-[#1A1A1A]'>Invitation Failed</h1>
                            <p className='text-[13px] text-[#6B6B6B] mt-1'>{message || 'This invitation link may be invalid or has expired.'}</p>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            {userData && (
                                <button
                                    onClick={acceptInvitation}
                                    className='w-full h-[48px] bg-[#006AFF] text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                                >
                                    Try Again
                                </button>
                            )}
                            <button
                                onClick={() => router.push(userData ? '/resident/dashboard' : '/login')}
                                className='w-full h-[44px] border border-[#E6E6E6] text-[#1A1A1A] rounded-[10px] text-sm hover:bg-[#F5F5F5]'
                            >
                                {userData ? 'Go to Dashboard' : 'Go to Login'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}