'use client';
import React, { useState, Suspense} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

function SetupPasswordPageInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token') || '';
    const email = searchParams?.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    // Password strength checks
    const checks = {
        length:    password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number:    /[0-9]/.test(password),
        special:   /[^A-Za-z0-9]/.test(password),
    };
    const allValid = Object.values(checks).every(Boolean);

    const handleSubmit = async () => {
        if (!allValid) { toast.error('Password does not meet requirements'); return; }
        if (password !== confirm) { toast.error('Passwords do not match'); return; }
        if (!token) { toast.error('Invalid or missing token'); return; }

        setLoading(true);
        try {
            await api.post('/admin/complete-registration', { token, password });
            setDone(true);
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Failed to set password';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally { setLoading(false); }
    };

    if (!token) return (
        <div className='min-h-screen flex items-center justify-center bg-[#F7F8FA] p-4'>
            <div className='bg-white rounded-[16px] p-8 max-w-[420px] w-full text-center shadow-sm border border-[#F0F0F0]'>
                <div className='w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                        <path d='M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
                    </svg>
                </div>
                <h2 className='text-[18px] font-bold text-[#1A1A1A] mb-2'>Invalid Link</h2>
                <p className='text-[13px] text-[#6B6B6B]'>This invitation link is invalid or has expired. Please contact your administrator.</p>
            </div>
        </div>
    );

    if (done) return (
        <div className='min-h-screen flex items-center justify-center bg-[#F7F8FA] p-4'>
            <div className='bg-white rounded-[16px] p-8 max-w-[420px] w-full text-center shadow-sm border border-[#F0F0F0]'>
                <div className='w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4'>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                        <path d='M20 6L9 17l-5-5' stroke='#2E7D32' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                    </svg>
                </div>
                <h2 className='text-[20px] font-bold text-[#1A1A1A] mb-2'>Password Set!</h2>
                <p className='text-[13px] text-[#6B6B6B] mb-6'>Your admin account is ready. You can now log in with your email and new password.</p>
                <button onClick={() => router.push('/admin/login')}
                    className='w-full h-[46px] bg-[#006AFF] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#0055CC]'>
                    Go to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#F7F8FA] p-4'>
            <div className='bg-white rounded-[16px] p-8 max-w-[440px] w-full shadow-sm border border-[#F0F0F0]'>
                {/* Logo / Brand */}
                <div className='text-center mb-6'>
                    <div className='w-12 h-12 rounded-[12px] bg-[#006AFF] flex items-center justify-center mx-auto mb-3'>
                        <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
                            <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' stroke='white' strokeWidth='1.5' strokeLinecap='round'/>
                            <path d='M9 22V12h6v10' stroke='white' strokeWidth='1.5' strokeLinecap='round'/>
                        </svg>
                    </div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Set Your Password</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-1'>
                        Welcome! Set a password for <span className='text-[#1A1A1A] font-medium'>{email}</span>
                    </p>
                </div>

                <div className='space-y-4'>
                    {/* Password */}
                    <div>
                        <label className='text-[13px] font-medium text-[#1A1A1A] block mb-1.5'>New Password</label>
                        <div className='relative'>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder='Create a strong password'
                                className='h-[46px] w-full px-3 pr-10 border border-[#D0D0D0] rounded-[10px] text-[13px] focus:outline-none focus:border-[#006AFF]'
                            />
                            <button type='button' onClick={() => setShowPw(v => !v)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#1A1A1A]'>
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                    {showPw
                                        ? <><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></>
                                        : <><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' stroke='currentColor' strokeWidth='1.5'/><circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='1.5'/></>
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Strength indicators */}
                    {password.length > 0 && (
                        <div className='grid grid-cols-2 gap-1.5'>
                            {[
                                ['At least 8 characters', checks.length],
                                ['Uppercase letter (A-Z)', checks.uppercase],
                                ['Lowercase letter (a-z)', checks.lowercase],
                                ['Number (0-9)', checks.number],
                                ['Special character (!@#...)', checks.special],
                            ].map(([label, ok]) => (
                                <div key={label as string} className='flex items-center gap-1.5'>
                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-[#E8F5E9]' : 'bg-[#F5F5F5]'}`}>
                                        {ok
                                            ? <svg width='8' height='8' viewBox='0 0 24 24' fill='none'><path d='M20 6L9 17l-5-5' stroke='#2E7D32' strokeWidth='3' strokeLinecap='round'/></svg>
                                            : <div className='w-1.5 h-1.5 rounded-full bg-[#D0D0D0]' />
                                        }
                                    </div>
                                    <span className={`text-[11px] ${ok ? 'text-[#2E7D32]' : 'text-[#9E9E9E]'}`}>{label as string}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div>
                        <label className='text-[13px] font-medium text-[#1A1A1A] block mb-1.5'>Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                placeholder='Re-enter your password'
                                className={`h-[46px] w-full px-3 pr-10 border rounded-[10px] text-[13px] focus:outline-none ${confirm && confirm !== password ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#D0D0D0] focus:border-[#006AFF]'}`}
                            />
                            <button type='button' onClick={() => setShowConfirm(v => !v)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#1A1A1A]'>
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                    {showConfirm
                                        ? <><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></>
                                        : <><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' stroke='currentColor' strokeWidth='1.5'/><circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='1.5'/></>
                                    }
                                </svg>
                            </button>
                        </div>
                        {confirm && confirm !== password && (
                            <p className='text-[11px] text-[#EF4444] mt-1'>Passwords do not match</p>
                        )}
                    </div>

                    <button onClick={handleSubmit} disabled={loading || !allValid || password !== confirm}
                        className='w-full h-[46px] bg-[#006AFF] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#0055CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2'>
                        {loading ? 'Setting password...' : 'Set Password & Activate Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SetupPasswordPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <SetupPasswordPageInner />
        </Suspense>
    );
}