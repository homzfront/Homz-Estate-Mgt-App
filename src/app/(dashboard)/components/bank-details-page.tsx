/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import DotLoader from '@/components/general/dotLoader';

interface NigerianBank { name: string; code: string; }

export default function BankDetailsPage() {
    const router = useRouter();
    const { communityProfile, getCommunityManaProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    // communityProfile.bankDetails is what the backend validates for payouts
    // estate.bankDetails is a fallback for pre-fill only
    const cmBank = communityProfile?.bankDetails;
    const estateBank = selectedCommunity?.estate?.bankDetails;
    const existing = cmBank || estateBank;

    const [banks, setBanks] = useState<NigerianBank[]>([]);
    const [selectedBankCode, setSelectedBankCode] = useState('');
    const [resolvingAccount, setResolvingAccount] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        accountNumber: existing?.accountNumber || '',
        bankName: existing?.bankName || '',
        accountName: existing?.accountName || '',
    });

    // Sync form when profile loads
    useEffect(() => {
        if (existing?.accountNumber) {
            setForm({
                accountNumber: existing.accountNumber,
                bankName: existing.bankName || '',
                accountName: existing.accountName || '',
            });
        }
    }, [existing?.accountNumber]);

    // Fetch bank list
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/state-area/banks');
                if (res.data?.success && res.data?.data) {
                    const seen = new Set<string>();
                    const unique = res.data.data.filter((b: any) => {
                        if (seen.has(b.code)) return false;
                        seen.add(b.code); return true;
                    });
                    setBanks(unique.map((b: any) => ({ name: b.name, code: b.code })));
                }
            } catch { /* silent */ }
        };
        fetch();
    }, []);

    // Auto-resolve account name
    useEffect(() => {
        const acctNum = form.accountNumber.replace(/\D/g, '');
        if (acctNum.length !== 10 || !selectedBankCode) return;

        const resolve = async () => {
            setResolvingAccount(true);
            try {
                const res = await api.get(`/state-area/bank/resolve?account_number=${acctNum}&bank_code=${selectedBankCode}`);
                if (res.data?.success && res.data?.data?.account_name) {
                    setForm((f) => ({ ...f, accountName: res.data.data.account_name }));
                } else {
                    setForm((f) => ({ ...f, accountName: '' }));
                    toast.error('Could not verify account. Please check the number and bank.');
                }
            } catch {
                setForm((f) => ({ ...f, accountName: '' }));
                toast.error('Account verification failed. Please try again.');
            } finally {
                setResolvingAccount(false);
            }
        };
        resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.accountNumber, selectedBankCode]);

    const handleSave = async () => {
        if (!form.accountNumber || !form.bankName || !form.accountName) {
            toast.error('Please fill in all fields', { position: 'top-center' });
            return;
        }
        if (form.accountNumber.replace(/\D/g, '').length !== 10) {
            toast.error('Account number must be 10 digits', { position: 'top-center' });
            return;
        }
        setSaving(true);
        try {
            await api.patch('/community-manager/bank-details', {
                accountNumber: form.accountNumber.replace(/\D/g, ''),
                accountName: form.accountName,
                bankName: form.bankName,
                bankCode: selectedBankCode,
            });
            await getCommunityManaProfile();
            toast.success('Bank details saved successfully!', {
                position: 'top-center',
                style: { background: '#E8F5E9', color: '#2E7D32', fontWeight: 500 },
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to save bank details', { position: 'top-center' });
        } finally {
            setSaving(false);
        }
    };

    // isVerified = CM profile bank is set (what backend validates for payouts)
    const isVerified = !!(cmBank?.accountNumber && cmBank?.accountName && cmBank?.bankName);

    return (
        <div className='p-8 w-full'>
            <button onClick={() => router.back()} className='mb-6 flex items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                <ArrowLeft /> Back
            </button>

            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-semibold text-BlackHomz'>Bank Details</h1>
                    <p className='text-sm text-GrayHomz mt-0.5'>Your payout account for receiving estate payments</p>
                </div>
                {isVerified && (
                    <span className='text-[12px] font-medium px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex-shrink-0 ml-4'>
                        ✓ Verified
                    </span>
                )}
            </div>

            {/* Info banner */}
            <div className='bg-[#EEF5FF] border border-[#C7DCFF] rounded-[10px] p-4 mb-6 flex gap-3'>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className='flex-shrink-0 mt-0.5'>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#006AFF"/>
                </svg>
                <div className='flex flex-col gap-1'>
                    <p className='text-[12px] text-BlueHomz leading-relaxed'>
                        This is your payout account for withdrawing estate collections to your bank. When you request a payout, Homz will process the transfer to this account.
                    </p>
                    {!isVerified && estateBank?.accountNumber && (
                        <p className='text-[11px] text-BlueHomz opacity-80 mt-1'>
                            ↑ Your estate bank details have been pre-filled below. Confirm and save to enable payouts.
                        </p>
                    )}
                </div>
            </div>

            <div className='bg-white rounded-[12px] border border-[#E6E6E6] p-6 max-w-[600px]'>
                <div className='flex flex-col gap-5'>
                    {/* Account Number */}
                    <CustomInput
                        label='Account Number'
                        placeholder='e.g 1524368709'
                        value={form.accountNumber}
                        onValueChange={(v) => setForm((f) => ({ ...f, accountNumber: v, accountName: '' }))}
                        type='number'
                        required
                        className='h-[45px] pl-4'
                    />

                    {/* Bank selector */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-BlackHomz'>
                            Bank Name <span className='text-error'>*</span>
                        </label>
                        <Dropdown
                            options={banks.map((b) => ({ id: b.code, label: b.name }))}
                            onSelect={(opt) => {
                                setSelectedBankCode(String(opt.id));
                                setForm((f) => ({ ...f, bankName: opt.label as string, accountName: '' }));
                            }}
                            selectOption={form.bankName || 'Search or select bank'}
                            selectedId={selectedBankCode || null}
                            showSearch
                            height='h-[45px]'
                            borderColor='border-[#A9A9A9]'
                            arrowColor='#A9A9A9'
                            displayMode='portal'
                            isLoading={banks.length === 0}
                        />
                    </div>

                    {/* Account Name — auto-filled */}
                    <div className='relative'>
                        <CustomInput
                            label='Account Name'
                            placeholder={resolvingAccount ? 'Verifying...' : 'Auto-filled after entering account number'}
                            value={form.accountName}
                            onValueChange={() => {}}
                            className={`h-[45px] pl-4 ${resolvingAccount ? 'opacity-60' : ''}`}
                            disabled={resolvingAccount}
                        />
                        {resolvingAccount && (
                            <span className='absolute right-3 top-[38px] text-xs text-GrayHomz animate-pulse'>
                                Verifying...
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || resolvingAccount || !form.accountName}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center mt-2'
                    >
                        {saving ? <DotLoader /> : 'Save Bank Details'}
                    </button>
                </div>
            </div>
        </div>
    );
}