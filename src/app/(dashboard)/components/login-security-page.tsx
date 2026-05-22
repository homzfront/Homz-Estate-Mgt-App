'use client';
import React, { useState, useEffect } from 'react';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import DotLoader from '@/components/general/dotLoader';

function PasswordInput({ label, value, onChange, placeholder }: {
    label: string; value: string;
    onChange: (v: string) => void; placeholder: string;
}) {
    const [visible, setVisible] = useState(false);
    return (
        <div className='flex flex-col gap-1.5'>
            <label className='text-[13px] font-medium text-BlackHomz'>{label}</label>
            <div className='relative'>
                <div className='absolute left-3.5 top-3.5'>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 10V8a6 6 0 0112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="#A9A9A9" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className='w-full h-[48px] border border-[#E6E6E6] rounded-[8px] pl-10 pr-10 text-sm outline-none focus:border-BlueHomz transition-colors'
                />
                <button
                    type='button'
                    onClick={() => setVisible(!visible)}
                    className='absolute right-3.5 top-3.5 text-GrayHomz'
                >
                    {visible ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="#A9A9A9" strokeWidth="1.5"/>
                            <circle cx="12" cy="12" r="3" stroke="#A9A9A9" strokeWidth="1.5"/>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#A9A9A9" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}



export default function LoginSecurityPage() {
    const router = useRouter();
    const [loginActivity, setLoginActivity] = useState<{device: string; location: string; ip: string; isCurrent: boolean; createdAt: string}[]>([]);

    useEffect(() => {
        api.get('/auth/login-history').then(res => {
            const data = res.data?.data || res.data || [];
            setLoginActivity(Array.isArray(data) ? data : []);
        }).catch(() => {});
    }, []);

    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        if (days === 1) return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!current || !newPass || !confirm) {
            toast.error('Please fill in all fields', { position: 'top-center' });
            return;
        }
        if (newPass.length < 8) {
            toast.error('New password must be at least 8 characters', { position: 'top-center' });
            return;
        }
        if (newPass !== confirm) {
            toast.error('Passwords do not match', { position: 'top-center' });
            return;
        }
        if (newPass === current) {
            toast.error('New password must be different from current password', { position: 'top-center' });
            return;
        }
        setLoading(true);
        try {
            await api.put('/auth/change-password', { oldPassword: current, newPassword: newPass, confirmPassword: confirm });
            toast.success('Password updated successfully!', {
                position: 'top-center',
                style: { background: '#E8F5E9', color: '#2E7D32', fontWeight: 500 },
            });
            setCurrent(''); setNewPass(''); setConfirm('');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update password';
            toast.error(msg, { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4 md:p-8 w-full'>
            <button onClick={() => router.back()} className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                <ArrowLeft /> Back
            </button>

            <h1 className='text-[20px] font-semibold text-BlackHomz mb-6'>Login &amp; Security</h1>

            {/* Change Password */}
            <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6 mb-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 10V8a6 6 0 0112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className='text-[14px] font-semibold text-BlackHomz'>Change Password</p>
                </div>
                <p className='text-[12px] text-GrayHomz mb-5'>Update your account password</p>

                <div className='flex flex-col gap-4'>
                    <PasswordInput label='Current Password' value={current} onChange={setCurrent} placeholder='Enter your password' />
                    <PasswordInput label='New Password' value={newPass} onChange={setNewPass} placeholder='Enter your password' />
                    <PasswordInput label='Confirm New Password' value={confirm} onChange={setConfirm} placeholder='Enter your password' />
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-6 flex items-center justify-center'
                >
                    {loading ? <DotLoader /> : 'Update Password'}
                </button>
            </div>

            {/* Login Activity */}
            <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" stroke="#1A1A1A" strokeWidth="1.5"/>
                        <path d="M12 6v6l4 2" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className='text-[14px] font-semibold text-BlackHomz'>Login Activity</p>
                </div>
                <p className='text-[12px] text-GrayHomz mb-5'>Recent Sign-ins to your account</p>

                <div className='flex flex-col gap-3'>
                    {loginActivity.length === 0 ? (
                        <p className='text-[13px] text-GrayHomz py-4 text-center'>No login history available</p>
                    ) : loginActivity.slice(0, 5).map((a, i) => (
                        <div key={i} className='flex items-center gap-3'>
                            <span className='w-2 h-2 bg-BlueHomz rounded-full flex-shrink-0' />
                            <div>
                                <p className='text-[13px] font-medium text-BlackHomz'>
                                    {a.device || 'Unknown device'} {a.location ? `• ${a.location}` : ''} {a.isCurrent ? <span className='text-[10px] text-green-500 font-semibold ml-1'>Current</span> : null}
                                </p>
                                <p className='text-[11px] text-GrayHomz'>Last active : {formatTime(a.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}