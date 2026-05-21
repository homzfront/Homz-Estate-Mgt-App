'use client';
import React, { useState } from 'react';
import { useAuthSlice } from '@/store/authStore';
import { SettingsRow, SettingsSection } from '@/app/(dashboard)/components/settings-components';

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 10V8a6 6 0 0112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91v2.89c0 .61-.26 1.54-.57 2.06l-1.15 1.91c-.71 1.18-.22 2.49 1.08 2.93 4.31 1.44 8.96 1.44 13.27 0 1.21-.4 1.74-1.83 1.08-2.93l-1.15-1.91c-.3-.52-.56-1.45-.56-2.06V8.91c0-3.3-2.71-6-6.02-6z" stroke="#006AFF" strokeWidth="1.5"/>
        <path d="M15.02 19.06c0 1.65-1.35 3-3 3s-3-1.35-3-3" stroke="#006AFF" strokeWidth="1.5"/>
    </svg>
);
const HelpIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" stroke="#006AFF" strokeWidth="1.5"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const InfoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" stroke="#006AFF" strokeWidth="1.5"/>
        <path d="M12 8v4M12 16h.01" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 12H3.62M5.85 8.65L2.5 12l3.35 3.35" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export default function ResidentSettingsHub() {
    const { logOutUser } = useAuthSlice();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <div className='p-8 w-full'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Settings</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Manage your preferences, security and notifications</p>
            </div>

            <div className='flex flex-col gap-4 max-w-[700px]'>
                <SettingsSection>
                    <SettingsRow icon={<LockIcon />} title='Login & Security' description='Change password and manage account security' href='/resident/settings/security' />
                    <SettingsRow icon={<BellIcon />} title='Notifications' description='Manage push/email alerts' href='/resident/notifications' />
                    <SettingsRow icon={<HelpIcon />} title='Support / Help' description='Contact support' href='/resident/support' />
                    <SettingsRow icon={<InfoIcon />} title='About Homz' description='Terms, privacy policy, and app info' href='/resident/settings/about' />
                </SettingsSection>

                <SettingsSection>
                    <SettingsRow icon={<LogoutIcon />} title='Logout' description='' onClick={() => setShowLogoutConfirm(true)} danger />
                </SettingsSection>
            </div>

            {showLogoutConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[360px] p-6 shadow-xl'>
                        <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
                            <LogoutIcon />
                        </div>
                        <h3 className='text-[16px] font-bold text-BlackHomz text-center mb-1'>Log out?</h3>
                        <p className='text-[13px] text-GrayHomz text-center mb-6'>Are you sure you want to log out of your account?</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowLogoutConfirm(false)}
                                className='flex-1 h-[44px] border border-[#E8E8E8] rounded-[8px] text-[13px] font-medium text-BlackHomz hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={() => { setShowLogoutConfirm(false); logOutUser(); }}
                                className='flex-1 h-[44px] bg-red-500 text-white rounded-[8px] text-[13px] font-semibold hover:bg-red-600'>
                                Yes, Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}