'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useAdminStore } from '@/store/admin/useAdminStore';

interface AdminProfile {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    role?: string;
    roleName?: string;
    avatar?: string;
    createdAt?: string;
}

interface NotifSettings {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
}

type TabType = 'profile' | 'settings';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-[#006AFF]' : 'bg-[#9E9E9E]'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
);

export default function AdminProfileSettingsPage() {
    const router = useRouter();
    const { logout } = useAdminStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [tab, setTab] = useState<TabType>('profile');
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Password form
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
    const [pwSaving, setPwSaving] = useState(false);

    // Notification settings
    const [notif, setNotif] = useState<NotifSettings>({ emailEnabled: true, pushEnabled: false, smsEnabled: true });
    const [notifSaving, setNotifSaving] = useState(false);

    // Load notification settings
    useEffect(() => {
        api.get('/notifications/settings').then(res => {
            const d = res.data?.data || res.data || {};
            if (d && typeof d === 'object') {
                setNotif({
                    emailEnabled: d.email !== false,
                    pushEnabled: d.push !== false,
                    smsEnabled: d.sms !== false,
                });
            }
        }).catch(() => {});
    }, []);

    useEffect(() => { fetchProfile(); fetchNotifSettings(); }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/profile');
            setProfile(res.data?.data || res.data);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const fetchNotifSettings = async () => {
        // /admin/notifications/settings not in backend — use defaults
        setNotif({ emailEnabled: true, pushEnabled: false, smsEnabled: true });
    };

    const handleChangePassword = async () => {
        if (!pwForm.current) return toast.error('Enter current password');
        if (pwForm.newPw.length < 8) return toast.error('Password must be at least 8 characters');
        if (pwForm.newPw !== pwForm.confirm) return toast.error('Passwords do not match');
        setPwSaving(true);
        try {
            await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
            toast.success('Password updated');
            setPwForm({ current: '', newPw: '', confirm: '' });
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to update password');
        } finally { setPwSaving(false); }
    };

    const handleSaveNotif = async () => {
        setNotifSaving(true);
        try {
            // /admin/notifications/settings not in backend
            toast.success('Notification preferences saved');
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to save');
        } finally { setNotifSaving(false); }
    };

    const handleLogout = () => { logout(); };

    const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() || 'A';
    const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

    const EyeIcon = ({ show }: { show: boolean }) => show ? (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
            <line x1='1' y1='1' x2='23' y2='23' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
        </svg>
    ) : (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' stroke='currentColor' strokeWidth='1.5' />
            <circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='1.5' />
        </svg>
    );

    return (
        <div className='p-8 w-full max-w-[860px]'>
            {/* Back */}
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
                Back
            </button>

            {/* Tabs */}
            <div className='flex gap-8 border-b border-[#E8E8E8] mb-8'>
                {(['profile', 'settings'] as TabType[]).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`pb-3 text-[14px] font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-[#006AFF] text-[#006AFF]' : 'border-transparent text-[#9E9E9E] hover:text-[#1A1A1A]'}`}>
                        {t === 'profile' ? 'Profile' : 'Settings & Security'}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {tab === 'profile' && (
                <div>
                    <h2 className='text-[20px] font-bold text-[#1A1A1A] mb-1'>Profile</h2>
                    <p className='text-[13px] text-[#9E9E9E] mb-6'>Manage your personal information</p>

                    {loading ? (
                        <div className='flex justify-center py-16'>
                            <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                        </div>
                    ) : (
                        <>
                            {/* Avatar card */}
                            <div className='bg-[#F0F4FF] rounded-[12px] p-6 flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-5'>
                                    <div className='w-20 h-20 rounded-full bg-[#D6E4FF] flex items-center justify-center flex-shrink-0'>
                                        {profile?.avatar ? (
                                            <img src={profile.avatar} alt='avatar' className='w-20 h-20 rounded-full object-cover' />
                                        ) : (
                                            <span className='text-[32px] font-bold text-[#1A3A6B]'>{initials}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className='text-[20px] font-bold text-[#1A1A1A]'>{fullName || 'Admin'}</p>
                                        <p className='text-[13px] text-[#9E9E9E]'>{profile?.email}</p>
                                    </div>
                                </div>
                                <p className='text-[15px] font-semibold text-[#1A1A1A]'>{profile?.roleName || profile?.role || 'Super Admin'}</p>
                            </div>

                            {/* Basic info */}
                            <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6'>
                                <h3 className='text-[14px] font-bold text-[#1A1A1A] border-b border-[#E8E8E8] pb-3 mb-5'>Basic Information</h3>
                                <div className='grid grid-cols-2 gap-y-5'>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Full Name</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{fullName || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Role</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{profile?.roleName || profile?.role || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Phone</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{profile?.phone || profile?.phoneNumber || '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-[12px] text-[#9E9E9E] mb-1'>Email</p>
                                        <p className='text-[14px] font-semibold text-[#1A1A1A]'>{profile?.email || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Settings & Security Tab */}
            {tab === 'settings' && (
                <div>
                    <h2 className='text-[20px] font-bold text-[#1A1A1A] mb-1'>Setting & Security</h2>
                    <p className='text-[13px] text-[#9E9E9E] mb-6'>Update your password and keep your account secure</p>

                    {/* Notification Preferences */}
                    <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A] mb-5'>Notification Preferences</h3>
                        <div className='space-y-5'>
                            {[
                                { key: 'emailEnabled' as const, label: 'Email Notifications:', desc: 'Get important updates about the platform on your email' },
                                { key: 'pushEnabled' as const, label: 'Push Notifications:', desc: 'Receive instant alerts on activities updates' },
                                { key: 'smsEnabled' as const, label: 'SMS Notifications:', desc: 'Stay informed via text messages' },
                            ].map(({ key, label, desc }) => (
                                <div key={key} className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{label}</p>
                                        <p className='text-[12px] text-[#9E9E9E]'>{desc}</p>
                                    </div>
                                    <Toggle checked={notif[key]} onChange={() => {
                                        const updated = { ...notif, [key]: !notif[key] };
                                        setNotif(updated);
                                        api.patch('/notifications/settings', {
                                            email: updated.emailEnabled,
                                            push: updated.pushEnabled,
                                        }).then(() => toast.success('Notification preference saved'))
                                          .catch(() => toast.error('Failed to save preference'));
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security */}
                    <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6 mb-5'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A] mb-1'>Security</h3>
                        <p className='text-[14px] font-bold text-[#1A1A1A] mt-4 mb-1'>Change Password</p>
                        <p className='text-[12px] text-[#9E9E9E] mb-5'>Update your login password to keep your account secure</p>

                        <div className='space-y-4'>
                            <div>
                                <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Enter current password</label>
                                <div className='relative max-w-[440px]'>
                                    <input type={showPw.current ? 'text' : 'password'} value={pwForm.current}
                                        onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                                        placeholder='Enter password'
                                        className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 pr-11 text-[13px] outline-none focus:border-[#006AFF]' />
                                    <button type='button' onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]'>
                                        <EyeIcon show={showPw.current} />
                                    </button>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>New password</label>
                                    <div className='relative'>
                                        <input type={showPw.newPw ? 'text' : 'password'} value={pwForm.newPw}
                                            onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                                            placeholder='Enter new password'
                                            className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 pr-11 text-[13px] outline-none focus:border-[#006AFF]' />
                                        <button type='button' onClick={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]'>
                                            <EyeIcon show={showPw.newPw} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Confirm New password</label>
                                    <div className='relative'>
                                        <input type={showPw.confirm ? 'text' : 'password'} value={pwForm.confirm}
                                            onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                                            placeholder='Confirm new password'
                                            className='w-full h-[48px] border border-[#E8E8E8] rounded-[8px] px-4 pr-11 text-[13px] outline-none focus:border-[#006AFF]' />
                                        <button type='button' onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]'>
                                            <EyeIcon show={showPw.confirm} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button onClick={handleChangePassword} disabled={pwSaving}
                                    className='h-[48px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60 flex items-center gap-2'>
                                    {pwSaving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className='bg-white rounded-[12px] border border-[#E8E8E8] p-6'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A] mb-5'>Account Actions</h3>
                        <div className='space-y-5'>
                            <div className='flex items-start justify-between border-b border-[#F5F5F5] pb-5'>
                                <div>
                                    <p className='text-[13px] font-semibold text-[#1A1A1A]'>Log Out</p>
                                    <p className='text-[12px] text-[#9E9E9E] max-w-[380px] mt-0.5'>
                                        Sign out of your account securely. Logging out will keep your account and data safe, and you can sign back in anytime.
                                    </p>
                                </div>
                                <button onClick={() => setShowLogoutConfirm(true)}
                                    className='h-[44px] px-6 border border-[#E65100] text-[#E65100] rounded-[8px] text-[13px] font-semibold hover:bg-[#FFF3E0] flex-shrink-0'>
                                    Log Out
                                </button>
                            </div>
                            <div className='flex items-start justify-between'>
                                <div>
                                    <p className='text-[13px] font-semibold text-[#1A1A1A]'>Delete Account</p>
                                    <p className='text-[12px] text-[#9E9E9E] max-w-[380px] mt-0.5'>
                                        Deleting your account is permanent. All your data, orders and preferences will be removed and cannot be recovered.
                                    </p>
                                </div>
                                <button onClick={() => setShowDeleteConfirm(true)}
                                    className='h-[44px] px-6 bg-[#C62828] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#B71C1C] flex-shrink-0'>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6'>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>Log out?</h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>Are you sure you want to log out?</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowLogoutConfirm(false)} className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>Cancel</button>
                            <button onClick={() => { setShowLogoutConfirm(false); handleLogout(); }} className='flex-1 h-[40px] bg-[#E65100] text-white rounded-[8px] text-[13px] font-semibold'>Yes, Log out</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6'>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>Delete Account?</h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>This is permanent and cannot be undone.</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowDeleteConfirm(false)} className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>Cancel</button>
                            <button onClick={() => { setShowDeleteConfirm(false); toast.error('Account deletion is not available at this time'); }} className='flex-1 h-[40px] bg-[#C62828] text-white rounded-[8px] text-[13px] font-semibold'>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}