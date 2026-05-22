'use client';
import React from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api/v1';

function getCallbackUrl() {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/auth/social-callback`;
}

function initiateOAuth(provider: 'google' | 'apple') {
    const redirectUri = getCallbackUrl();
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', provider);
    const params = new URLSearchParams({
        client_id: provider,
        redirect_uri: redirectUri,
        state,
        scope: provider === 'google' ? 'openid email profile' : 'email name',
    });
    window.location.href = `${BACKEND_URL}/auth/social/authorize?${params.toString()}`;
}

interface Props {
    mode?: 'login' | 'register';
}

export default function SocialAuthButtons({ mode = 'login' }: Props) {
    const label = mode === 'register' ? 'Sign up' : 'Continue';

    return (
        <div className='w-full flex flex-col gap-3'>
            {/* Divider */}
            <div className='flex items-center gap-3 my-1'>
                <div className='flex-1 h-px bg-[#E6E6E6]' />
                <span className='text-[12px] text-GrayHomz font-medium'>OR</span>
                <div className='flex-1 h-px bg-[#E6E6E6]' />
            </div>

            {/* Google */}
            <button
                type='button'
                onClick={() => initiateOAuth('google')}
                className='w-full h-[47px] border border-[#E0E0E0] rounded-[4px] flex items-center justify-center gap-3 text-[14px] font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors'
            >
                {/* Google SVG icon */}
                <svg width='20' height='20' viewBox='0 0 48 48' fill='none'>
                    <path d='M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z' fill='#FFC107'/>
                    <path d='M6.3 14.7l7.1 5.2C15.2 15.1 19.2 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z' fill='#FF3D00'/>
                    <path d='M24 46c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.5 36.9 26.9 38 24 38c-5.7 0-10.6-3.9-11.8-9.1l-7.1 5.5C8.3 41.5 15.6 46 24 46z' fill='#4CAF50'/>
                    <path d='M44.5 20H24v8.5h11.8c-.9 2.6-2.6 4.7-4.8 6.1l6.6 5.6C41.6 36.7 45 30.8 45 24c0-1.3-.2-2.7-.5-4z' fill='#1976D2'/>
                </svg>
                {label} with Google
            </button>

            {/* Apple */}
            <button
                type='button'
                onClick={() => initiateOAuth('apple')}
                className='w-full h-[47px] bg-black rounded-[4px] flex items-center justify-center gap-3 text-[14px] font-semibold text-white hover:bg-[#222] transition-colors'
            >
                {/* Apple SVG icon */}
                <svg width='17' height='20' viewBox='0 0 17 20' fill='white' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M13.748 10.417c-.017-1.98 1.644-2.943 1.718-2.99-0.937-1.367-2.393-1.553-2.908-1.573-1.24-.126-2.424.728-3.051.728-.627 0-1.596-.712-2.626-.692-1.347.019-2.594.784-3.287 1.99-1.403 2.432-.358 6.024 1.007 7.993.668.962 1.462 2.038 2.503 2.001 1.007-.04 1.386-.647 2.603-.647 1.218 0 1.561.647 2.624.626 1.082-.018 1.763-.977 2.426-1.942.766-1.113 1.08-2.19 1.097-2.246-.024-.01-2.1-.802-2.106-3.248zM11.77 4.173c.555-.67.93-1.6.827-2.527-.8.033-1.764.532-2.337 1.203-.513.594-.963 1.544-.843 2.453.893.069 1.798-.452 2.353-1.129z'/>
                </svg>
                {label} with Apple
            </button>
        </div>
    );
}