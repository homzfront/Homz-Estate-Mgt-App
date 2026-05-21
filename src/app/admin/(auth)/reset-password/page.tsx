'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const t = searchParams?.get('token') || '';
        setToken(t);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) { toast.error('Please fill all fields'); return; }
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
        if (!token) { toast.error('Invalid or missing reset token'); return; }
        setLoading(true);
        try {
            await api.put('/auth/reset-password', { token, newPassword, confirmPassword });
            toast.success('Password reset successfully');
            router.push('/admin/login');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to reset password';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally { setLoading(false); }
    };

    const EyeIcon = ({ show }: { show: boolean }) => (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            {show
                ? <><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' stroke='#9E9E9E' strokeWidth='1.5'/><circle cx='12' cy='12' r='3' stroke='#9E9E9E' strokeWidth='1.5'/></>
                : <><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22' stroke='#9E9E9E' strokeWidth='1.5' strokeLinecap='round'/></>
            }
        </svg>
    );

    return (
        <div className='min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[420px] p-8 shadow-sm border border-[#F0F0F0]'>
                <div className='w-10 h-10 rounded-[10px] bg-[#006AFF] flex items-center justify-center mb-6'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                        <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' stroke='white' strokeWidth='1.5' strokeLinecap='round'/>
                    </svg>
                </div>

                <h1 className='text-[22px] font-bold text-[#1A1A1A] mb-1'>Reset Password</h1>
                <p className='text-[13px] text-[#6B6B6B] mb-6'>Enter your new password below. It must be at least 8 characters with uppercase, lowercase, number and special character.</p>

                {!token && (
                    <div className='bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] p-3 mb-4'>
                        <p className='text-[12px] text-[#EF4444]'>Invalid or missing reset token. Please request a new reset link.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>New Password</label>
                        <div className='relative'>
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder='Min 8 chars, uppercase, number, special'
                                className='w-full h-[44px] px-3 pr-10 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]'
                            />
                            <button type='button' onClick={() => setShowNew(v => !v)}
                                className='absolute right-3 top-1/2 -translate-y-1/2'>
                                <EyeIcon show={showNew} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className='text-[12px] font-medium text-[#1A1A1A] block mb-1.5'>Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder='Repeat new password'
                                className='w-full h-[44px] px-3 pr-10 border border-[#D0D0D0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#006AFF]'
                            />
                            <button type='button' onClick={() => setShowConfirm(v => !v)}
                                className='absolute right-3 top-1/2 -translate-y-1/2'>
                                <EyeIcon show={showConfirm} />
                            </button>
                        </div>
                    </div>
                    <button type='submit' disabled={loading || !token}
                        className='w-full h-[44px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 transition-colors'>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <Link href='/admin/login' className='text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center justify-center gap-1.5'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}