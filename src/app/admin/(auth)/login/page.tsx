'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminStore } from '@/store/admin/useAdminStore';
import DotLoader from '@/components/general/dotLoader';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAdminStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        try {
            await login(email, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Invalid credentials';
            setError(Array.isArray(msg) ? msg[0] : msg);
            toast.error(Array.isArray(msg) ? msg[0] : msg, { position: 'top-center' });
        }
    };

    return (
        <div className='min-h-screen bg-[#F5F5F5] flex flex-col'>
            {/* Logo */}
            <div className='p-6'>
                <div className='flex items-center gap-2'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#006AFF"/>
                        <path d="M8 22V14L16 8L24 14V22H19V17H13V22H8Z" fill="white"/>
                    </svg>
                    <span className='text-[20px] font-bold text-[#1A1A1A]'>Homz<span className='text-[#006AFF]'>.ng</span></span>
                </div>
            </div>

            {/* Card */}
            <div className='flex-1 flex items-center justify-center px-4'>
                <div className='w-full max-w-[480px] bg-white rounded-[16px] shadow-sm border border-[#E8E8E8] p-8'>
                    <h1 className='text-[28px] font-semibold text-[#006AFF] mb-1'>Welcome Back, Admin</h1>
                    <p className='text-[14px] text-[#6B6B6B] mb-8'>Enter your details to sign in to your account</p>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                        {/* Email */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-[#1A1A1A]'>Email Address</label>
                            <div className='flex items-center gap-3 border border-[#D0D0D0] rounded-[8px] h-[48px] px-3 focus-within:border-[#006AFF] transition-colors'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9E9E9E" strokeWidth="1.5"/>
                                    <polyline points="22,6 12,13 2,6" stroke="#9E9E9E" strokeWidth="1.5"/>
                                </svg>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Myemail@gmail.com'
                                    className='flex-1 text-[14px] text-[#1A1A1A] bg-transparent outline-none placeholder:text-[#BDBDBD]'
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[13px] font-medium text-[#1A1A1A]'>Password</label>
                            <div className='flex items-center gap-3 border border-[#D0D0D0] rounded-[8px] h-[48px] px-3 focus-within:border-[#006AFF] transition-colors'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9E9E9E" strokeWidth="1.5"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9E9E9E" strokeWidth="1.5"/>
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    className='flex-1 text-[14px] text-[#1A1A1A] bg-transparent outline-none placeholder:text-[#BDBDBD]'
                                />
                                <button type='button' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9E9E9E" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#9E9E9E" strokeWidth="1.5"/></svg>
                                    )}
                                </button>
                            </div>
                            <div className='flex justify-end'>
                                <Link href='/admin/forgot-password' className='text-[13px] text-[#006AFF] hover:underline'>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && <p className='text-[13px] text-red-500 text-center'>{error}</p>}

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='h-[52px] w-full bg-[#006AFF] text-white rounded-[8px] font-semibold text-[15px] hover:bg-[#0055CC] transition-colors disabled:opacity-60 flex items-center justify-center'
                        >
                            {isLoading ? <DotLoader /> : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}