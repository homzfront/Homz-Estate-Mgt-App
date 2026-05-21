'use client';
import React from 'react';
import { useAuthSlice } from '@/store/authStore';
import { useAbility } from '@/contexts/AbilityContext';
import { SettingsRow, SettingsSection } from '@/app/(dashboard)/components/settings-components';

// Icons
const BankIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M2 8.5h20M6 16.5h2M10.5 16.5h4M6.44 3.5h11.11C21.11 3.5 22 4.38 22 7.89v8.22C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

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
const IdIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17.5 2h-11C4.5 2 3 3.5 3 5.5v13C3 20.5 4.5 22 6.5 22h11c2 0 3.5-1.5 3.5-3.5v-13C21 3.5 19.5 2 17.5 2z" stroke="#006AFF" strokeWidth="1.5"/>
        <path d="M8 10h8M8 14h5" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const CardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M2 8.5h20M6 16.5h2M10.5 16.5h4M6.44 3.5h11.11C21.11 3.5 22 4.38 22 7.89v8.22C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const HelpIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" stroke="#006AFF" strokeWidth="1.5"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 12H3.62M5.85 8.65L2.5 12l3.35 3.35" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export default function EMSettingsHub() {
    const { logOutUser } = useAuthSlice();
    const ability = useAbility();

    return (
        <div className='p-8 w-full'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Settings</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>Manage your account preferences and app configurations</p>
            </div>

            <div className='flex flex-col gap-4 max-w-[700px]'>
                <SettingsSection>
                    <SettingsRow
                        icon={<LockIcon />}
                        title='Change Password'
                        description='Update login credentials'
                        href='/profile'
                    />
                    <SettingsRow
                        icon={<BankIcon />}
                        title='Bank Details'
                        description='Update your payout bank account'
                        href='/settings/bank-details'
                    />
                    <SettingsRow
                        icon={<BellIcon />}
                        title='Notifications'
                        description='Manage push/email alerts'
                        href='/notifications'
                    />
                    {ability.can('read', 'estate-info') && (
                        <SettingsRow
                            icon={<IdIcon />}
                            title='KYC Verification'
                            description='Complete or view KYC status'
                            href='/kyc'
                        />
                    )}
                    {ability.can('read', 'estate-info') && (
                        <SettingsRow
                            icon={<CardIcon />}
                            title='Subscription Plan'
                            description='Manage estate subscription plan'
                            href='/subscription'
                        />
                    )}
                    <SettingsRow
                        icon={<HelpIcon />}
                        title='Support / Help'
                        description='Contact support'
                        href='/support'
                    />
                </SettingsSection>

                <SettingsSection>
                    <SettingsRow
                        icon={<LogoutIcon />}
                        title='Logout'
                        description=''
                        onClick={logOutUser}
                        danger
                    />
                </SettingsSection>
            </div>
        </div>
    );
}