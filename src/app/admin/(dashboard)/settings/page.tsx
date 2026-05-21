'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface NotificationSettings {
    push?: boolean;
    email?: boolean;
    categories?: {
        billingsPayments?: boolean;
        residentActivity?: boolean;
        accessControl?: boolean;
        walletTransactions?: boolean;
        systemSecurity?: boolean;
    };
}

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button type='button' onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#006AFF]' : 'bg-[#D0D0D0]'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5 mb-4'>
        <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>{title}</h3>
        {children}
    </div>
);

const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className='flex items-center justify-between py-3 border-b border-[#F8F8F8] last:border-0'>
        <div>
            <p className='text-[13px] font-medium text-[#1A1A1A]'>{label}</p>
            {hint && <p className='text-[11px] text-[#9E9E9E] mt-0.5'>{hint}</p>}
        </div>
        {children}
    </div>
);

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<NotificationSettings>({
        push: true, email: true,
        categories: { billingsPayments: true, residentActivity: true, accessControl: true, walletTransactions: true, systemSecurity: true },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/notifications/settings');
            const d = res.data?.data || res.data || {};
            if (d && typeof d === 'object') {
                setSettings(d);
            }
        } catch { /* use defaults */ }
        finally { setLoading(false); }
    };

    const update = (key: keyof NotificationSettings, val: any) => {
        setSettings(s => ({ ...s, [key]: val }));
    };

    const updateCategory = (key: string, val: boolean) => {
        setSettings(s => ({
            ...s,
            categories: { ...s.categories, [key]: val },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/notifications/settings', settings);
            toast.success('Settings saved successfully');
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to save settings');
        } finally { setSaving(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    return (
        <div className='p-6 max-w-[700px]'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Settings</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Manage your notification preferences and account settings</p>
            </div>

            <Section title='Notification Channels'>
                <Row label='Push Notifications' hint='Receive push notifications on your device'>
                    <Toggle checked={!!settings.push} onChange={() => update('push', !settings.push)} />
                </Row>
                <Row label='Email Notifications' hint='Receive notifications via email'>
                    <Toggle checked={!!settings.email} onChange={() => update('email', !settings.email)} />
                </Row>
            </Section>

            <Section title='Notification Categories'>
                {[
                    { key: 'billingsPayments', label: 'Billing & Payments', hint: 'Payment confirmations, invoices, wallet activity' },
                    { key: 'residentActivity', label: 'Resident Activity', hint: 'New residents, profile updates, invitations' },
                    { key: 'accessControl', label: 'Access Control', hint: 'Visitor access, security codes, gate activity' },
                    { key: 'walletTransactions', label: 'Wallet Transactions', hint: 'Deposits, withdrawals, transfers' },
                    { key: 'systemSecurity', label: 'System & Security', hint: 'Login alerts, admin changes, system updates' },
                ].map(({ key, label, hint }) => (
                    <Row key={key} label={label} hint={hint}>
                        <Toggle
                            checked={!!settings.categories?.[key as keyof typeof settings.categories]}
                            onChange={() => updateCategory(key, !settings.categories?.[key as keyof typeof settings.categories])}
                        />
                    </Row>
                ))}
            </Section>

            <div className='flex justify-end'>
                <button onClick={handleSave} disabled={saving}
                    className='h-[44px] px-8 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-60'>
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}