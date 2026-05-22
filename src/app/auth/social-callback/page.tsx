'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { storeToken } from '@/utils/cookies';
import { useAuthSlice } from '@/store/authStore';
import toast from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api/v1';

function SocialCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUserData } = useAuthSlice();

    useEffect(() => {
        const code = searchParams.get('code');
        const provider = searchParams.get('provider') || sessionStorage.getItem('oauth_provider') || 'google';
        const error = searchParams.get('error');

        if (error) {
            toast.error('Social login was cancelled or failed.');
            router.replace('/login');
            return;
        }

        if (!code) {
            router.replace('/login');
            return;
        }

        const handleSocialLogin = async () => {
            try {
                let res: Response;
                if (provider === 'apple') {
                    // Apple uses POST with body
                    res = await fetch(`${BACKEND_URL}/auth/social/apple`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });
                } else {
                    // Google uses GET with query param
                    res = await fetch(`${BACKEND_URL}/auth/social/${provider}?code=${encodeURIComponent(code)}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                const data = await res.json();

                if (!res.ok || !data.accessToken) {
                    throw new Error(data.message || 'Social login failed');
                }

                // Store tokens
                await storeToken({
                    token: data.accessToken,
                    refresh_token: data.refreshToken,
                });

                // Fetch user profile
                const profile = await api.get('/auth/current-user');
                setUserData(profile.data.data);

                const isNewUser = data.type === 'register';

                if (isNewUser || profile?.data?.data?.accounts?.length === 0) {
                    toast.success('Account created! Please select your profile type.');
                    router.replace('/select-profile');
                    return;
                }

                // Route based on account type
                try {
                    await api.get('/community-manager/current-profile');
                    toast.success('Login successful!');
                    router.replace('/dashboard');
                } catch (err: any) {
                    if (err?.response?.status === 403 || err?.response?.status === 401) {
                        toast.success('Login successful!');
                        const pendingInvite = sessionStorage.getItem('homz_pending_coresident_invite');
                        if (pendingInvite) {
                            try {
                                const { token, estateId } = JSON.parse(pendingInvite);
                                router.replace(`/resident/accept-invitation?token=${token}&estateId=${estateId}`);
                            } catch {
                                router.replace('/resident/dashboard');
                            }
                        } else {
                            router.replace('/resident/dashboard');
                        }
                    } else {
                        router.replace('/select-profile');
                    }
                }
            } catch (err: any) {
                console.error('Social auth error:', err);
                toast.error(err.message || 'Social login failed. Please try again.');
                router.replace('/login');
            }
        };

        handleSocialLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='h-screen w-full flex flex-col items-center justify-center gap-4'>
            <div className='w-10 h-10 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
            <p className='text-[14px] text-GrayHomz font-medium'>Completing sign in...</p>
        </div>
    );
}

export default function SocialCallbackPage() {
    return (
        <Suspense fallback={<div className='h-screen w-full flex items-center justify-center'><div className='w-10 h-10 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <SocialCallbackInner />
        </Suspense>
    );
}