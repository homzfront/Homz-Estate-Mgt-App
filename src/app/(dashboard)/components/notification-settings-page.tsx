'use client';
import React, { useEffect } from 'react';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useRouter } from 'next/navigation';
import { useNotificationStore, NotificationSettings } from '@/store/useNotificationStore';

interface ToggleRowProps {
    label: string;
    description: string;
    value: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const ToggleRow = ({ label, description, value, onChange, disabled }: ToggleRowProps) => (
    <div className={`flex items-center justify-between py-4 border-b border-[#F0F0F0] last:border-b-0 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className='flex flex-col gap-0.5'>
            <p className='text-[14px] font-medium text-BlackHomz'>{label}</p>
            <p className='text-[12px] text-GrayHomz'>{description}</p>
        </div>
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-BlueHomz' : 'bg-[#D0D0D0]'}`}
        >
            <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

const ROWS: { key: keyof NotificationSettings; label: string; description: string }[] = [
    { key: 'pushNotifications',     label: 'Push Notifications',    description: 'Receive alerts on your device' },
    { key: 'emailNotifications',    label: 'Email Notifications',   description: 'Receive alerts on your email address' },
    { key: 'billingsAndPayments',   label: 'Billings & Payments',   description: 'Bills, payment, and overdue alerts' },
    { key: 'residentActivity',      label: 'Resident Activity',     description: 'New residents, join requests and profile updates' },
    { key: 'accessControl',         label: 'Access Control',        description: 'Visitor access codes and access status updates' },
    { key: 'walletAndTransactions', label: 'Wallet & Transactions',  description: 'Wallet credits, debits and payments' },
    { key: 'systemAndSecurity',     label: 'System & Security',     description: 'Login alerts, password and security updates' },
];

const NotificationSettingsPage = ({ backPath }: { backPath: string }) => {
    const router = useRouter();
    const { settings, fetchSettings, updateSettings, isLoadingSettings, isSavingSettings } = useNotificationStore();

    useEffect(() => {
        fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='p-4 md:p-8 w-full'>
            <button
                onClick={() => router.push(backPath)}
                className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'
            >
                <ArrowLeft /> Back
            </button>

            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>Notifications</h1>
                <p className='text-sm text-GrayHomz mt-0.5'>
                    Manage alerts &amp; choose how you want to receive updates
                </p>
            </div>

            {isLoadingSettings ? (
                <div className='flex justify-center py-12'>
                    <div className='w-6 h-6 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : (
                <>
                    <div className='bg-white rounded-[12px] border border-[#E6E6E6] px-4'>
                        {ROWS.map(row => (
                            <ToggleRow
                                key={row.key}
                                label={row.label}
                                description={row.description}
                                value={settings[row.key]}
                                onChange={() => updateSettings({ [row.key]: !settings[row.key] })}
                                disabled={isSavingSettings}
                            />
                        ))}
                    </div>

                    {isSavingSettings && (
                        <div className='flex items-center gap-2 mt-3'>
                            <div className='w-3.5 h-3.5 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                            <p className='text-[12px] text-GrayHomz'>Saving preferences...</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NotificationSettingsPage;