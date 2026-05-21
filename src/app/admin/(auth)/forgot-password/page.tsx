'use client';
import React, { useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { toast.error('Please enter your email'); return; }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to send reset email';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally { setLoading(false); }
    };

    return (
        <div className='min-h-screen flex'>
            {/* Left panel - branding */}
            <div className='hidden lg:flex w-[45%] bg-[#006AFF] flex-col justify-between p-12 relative overflow-hidden'>
                {/* Background pattern */}
                <div className='absolute inset-0 opacity-10'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='absolute rounded-full border border-white'
                            style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                    ))}
                </div>
                {/* Logo */}
                <div className='relative z-10'>
                    <div className='flex items-center gap-2'>
                        <div className='w-9 h-9 rounded-[8px] bg-white flex items-center justify-center'>
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' stroke='#006AFF' strokeWidth='1.8' strokeLinecap='round'/>
                                <path d='M9 22V12h6v10' stroke='#006AFF' strokeWidth='1.8' strokeLinecap='round'/>
                            </svg>
                        </div>
                        <span className='text-white font-bold text-[20px]'>Homz</span>
                    </div>
                </div>
                {/* Center content */}
                <div className='relative z-10 flex-1 flex flex-col justify-center'>
                    <h2 className='text-white text-[32px] font-bold leading-tight mb-4'>
                        Secure Estate<br/>Management Platform
                    </h2>
                    <p className='text-white/70 text-[14px] leading-relaxed max-w-[320px]'>
                        Manage residents, estates, payments and access control — all in one place. Your admin account keeps everything running smoothly.
                    </p>
                    <div className='mt-8 grid grid-cols-2 gap-4'>
                        {[
                            { label: 'Estates Managed', value: '50+' },
                            { label: 'Active Residents', value: '2,000+' },
                            { label: 'Daily Transactions', value: '500+' },
                            { label: 'Support Requests', value: '24/7' },
                        ].map(s => (
                            <div key={s.label} className='bg-white/10 rounded-[10px] p-3'>
                                <p className='text-white font-bold text-[20px]'>{s.value}</p>
                                <p className='text-white/60 text-[11px]'>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='relative z-10'>
                    <p className='text-white/40 text-[11px]'>© 2026 Homz. All rights reserved.</p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className='flex-1 bg-[#F5F7FA] flex items-center justify-center p-6'>
                <div className='bg-white rounded-[16px] w-full max-w-[420px] p-8 shadow-sm border border-[#F0F0F0]'>
                    {/* Mobile logo */}
                    <div className='flex items-center gap-2 mb-6 lg:hidden'>
                        <div className='w-8 h-8 rounded-[8px] bg-[#006AFF] flex items-center justify-center'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' stroke='white' strokeWidth='1.8'/>
                            </svg>
                        </div>
                        <span className='font-bold text-[#1A1A1A]'>Homz Admin</span>
                    </div>

                    {!sent ? (
                        <>
                            <h1 className='text-[22px] font-bold text-[#1A1A1A] mb-1'>Forgot Password</h1>
                            <p className='text-[13px] text-[#6B6B6B] mb-6'>Enter your admin email and we'll send you a link to reset your password.</p>

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div>
                                    <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>Email Address</label>
                                    <input type='email' value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder='admin@homz.ng'
                                        className='w-full h-[44px] px-3 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]' />
                                </div>
                                <button type='submit' disabled={loading}
                                    className='w-full h-[44px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 transition-colors'>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='text-center py-4'>
                            <div className='w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4'>
                                <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                                    <path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z' stroke='#2E7D32' strokeWidth='1.5'/>
                                    <path d='M22 6l-10 7L2 6' stroke='#2E7D32' strokeWidth='1.5' strokeLinecap='round'/>
                                </svg>
                            </div>
                            <h2 className='text-[18px] font-bold text-[#1A1A1A] mb-2'>Check your email</h2>
                            <p className='text-[13px] text-[#6B6B6B] mb-6'>
                                We sent a reset link to <span className='font-medium text-[#1A1A1A]'>{email}</span>
                            </p>
                            <button onClick={() => setSent(false)} className='text-[13px] text-[#006AFF] hover:underline'>
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}

                    <div className='mt-6 pt-5 border-t border-[#F0F0F0] text-center'>
                        <Link href='/admin/login' className='text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center justify-center gap-1.5'>
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}