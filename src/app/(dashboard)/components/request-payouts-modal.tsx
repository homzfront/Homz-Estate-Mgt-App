'use client';
import React, { useState } from 'react';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import { useWalletStore } from '@/store/useWalletStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import toast from 'react-hot-toast';

type Step = 'input' | 'processing' | 'success' | 'failed';

interface RequestPayoutsModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
    orgId: string;
    estateId: string;
    onSuccess?: () => void;
}

function formatAmount(naira: number) {
    // Balance and amounts are stored in NAIRA (backend converts from kobo on receipt)
    return `₦${Number(naira || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

export default function RequestPayoutsModal({ isOpen, onClose, balance, orgId, estateId, onSuccess }: RequestPayoutsModalProps) {
    const [step, setStep] = useState<Step>('input');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { requestWithdrawal } = useWalletStore();
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    // Payout goes to estate bank account (estate operations money)
    const estateBank = selectedCommunity?.estate?.bankDetails;
    const bankIsVerified = !!(estateBank?.accountNumber);
    const amountNaira = Math.round(parseFloat(amount.replace(/,/g, '') || '0'));

    const handleRequest = async () => {
        if (!bankIsVerified) {
            toast.error('Please add the estate bank details in Estate Settings before requesting a payout.', { position: 'top-center', duration: 4000 });
            return;
        }
        if (amountNaira < 100) {
            toast.error('Minimum withdrawal is ₦100.', { position: 'top-center' });
            return;
        }
        if (amountNaira > balance) {
            toast.error('Amount exceeds available balance.', { position: 'top-center' });
            return;
        }
        setLoading(true);
        setStep('processing');
        try {
            await requestWithdrawal(orgId, estateId, amountNaira);
            setStep('success');
            onSuccess?.();
        } catch {
            setStep('failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setStep('input'); setAmount(''); onClose(); };
    const handleRetry = () => { setStep('input'); setAmount(''); };

    if (step === 'processing') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-full max-w-[400px] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <svg className='animate-spin' width="48" height="48" viewBox="0 0 48 48" fill="none">
                        {[0,1,2,3,4,5,6,7].map((i) => (
                            <line key={i} x1="24" y1="6" x2="24" y2="12" stroke="#006AFF" strokeWidth="3" strokeLinecap="round"
                                transform={`rotate(${i * 45} 24 24)`} strokeOpacity={1 - i * 0.1} />
                        ))}
                    </svg>
                    <h3 className='text-[18px] font-semibold text-BlackHomz'>Payment Processing</h3>
                    <p className='text-[13px] text-GrayHomz text-center'>We&apos;re confirming your payment. This won&apos;t take long.</p>
                </div>
            </CustomModal>
        );
    }

    if (step === 'success') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-full max-w-[400px] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 rounded-full border-[3px] border-[#039855] flex items-center justify-center'>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className='text-[18px] font-semibold text-BlackHomz'>Withdrawal Requested</h3>
                    <p className='text-[13px] text-GrayHomz text-center'>{formatAmount(amountNaira)} withdrawal request submitted. Funds will be transferred to the estate\'s bank account.</p>
                    <button onClick={handleClose} className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'>Done</button>
                </div>
            </CustomModal>
        );
    }

    if (step === 'failed') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-full max-w-[400px] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <path d="M14 14l28 28M42 14L14 42" stroke="#DC2626" strokeWidth="5" strokeLinecap="round"/>
                    </svg>
                    <h3 className='text-[18px] font-semibold text-BlackHomz'>Payment Failed</h3>
                    <p className='text-[13px] text-GrayHomz text-center'>Something went wrong, please try again later.</p>
                    <button onClick={handleRetry} className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'>Retry</button>
                    <button onClick={handleClose} className='w-full h-[48px] bg-[#F5F5F5] text-BlackHomz rounded-[8px] font-medium text-sm'>Cancel</button>
                </div>
            </CustomModal>
        );
    }

    return (
        <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
            <div className='w-full max-w-[560px] bg-white rounded-[16px] p-6'>
                <h2 className='text-[18px] font-semibold text-BlackHomz mb-5'>Request Payouts</h2>

                {/* Balance */}
                <div className='bg-[#EEF5FF] rounded-[10px] p-4 mb-4'>
                    <p className='text-[12px] text-GrayHomz mb-1'>Available Wallet balance</p>
                    <p className='text-[22px] font-bold text-BlackHomz'>{formatAmount(balance)}</p>
                </div>

                {/* Payout account */}
                <div className='border border-[#E6E6E6] rounded-[10px] p-4 mb-4'>
                    <p className='text-[13px] font-semibold text-BlackHomz mb-2'>Payout Account</p>
                    {bankIsVerified ? (
                        <div className='flex flex-col gap-1'>
                            <p className='text-[11px] text-GrayHomz2 mb-2'>Withdrawal will be sent to the estate&apos;s registered bank account</p>
                            <p className='text-[12px] text-GrayHomz'>Bank Name: <span className='text-BlackHomz font-medium'>{estateBank?.bankName}</span></p>
                            <p className='text-[12px] text-GrayHomz'>Account Name: <span className='text-BlackHomz font-medium'>{estateBank?.accountName}</span></p>
                            <p className='text-[12px] text-GrayHomz'>Account Number: <span className='text-BlackHomz font-medium'>{estateBank?.accountNumber}</span></p>
                            <p className='text-[11px] text-GrayHomz mt-2'>
                                To change payout account, update the estate bank details in <a href='/settings/bank-details' className='text-BlueHomz underline'>Estate Settings</a>
                            </p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            <p className='text-[12px] text-error font-medium'>No estate bank account configured.</p>
                            <p className='text-[12px] text-GrayHomz'>Add the estate&apos;s bank details before requesting a payout.</p>
                            <a href='/settings/bank-details' className='text-[12px] text-BlueHomz font-semibold hover:underline mt-1'>
                                &#8594; Go to Estate Settings to add bank details
                            </a>
                        </div>
                    )}
                </div>

                {/* Amount input */}
                <div className='mb-1'>
                    <label className='text-[13px] font-medium text-BlackHomz mb-2 block'>Amount to Withdraw</label>
                    <div className='relative'>
                        <span className='absolute left-4 top-3.5 text-[13px] font-medium text-BlackHomz'>₦</span>
                        <input
                            className='w-full h-[48px] border border-[#E6E6E6] rounded-[8px] pl-8 pr-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                            placeholder='0'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>
                </div>
                <p className='text-[11px] text-GrayHomz mb-5'>Withdraw funds from your Homz wallet to your bank account</p>

                <button
                    onClick={handleRequest}
                    disabled={loading || amountNaira < 100 || !bankIsVerified}
                    className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center'
                >
                    {loading ? <DotLoader /> : 'Request Payouts'}
                </button>
            </div>
        </CustomModal>
    );
}