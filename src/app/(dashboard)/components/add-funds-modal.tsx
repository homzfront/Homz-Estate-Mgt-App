'use client';
import React, { useState } from 'react';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';

const QUICK_AMOUNTS = [10000, 30000, 50000, 100000, 150000, 200000];

type Step = 'input' | 'redirecting' | 'failed';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number; // naira
    onSuccess?: () => void;
}

function formatNaira(amount: number) {
    return `₦${Number(amount || 0).toLocaleString('en-NG')}`;
}

export default function AddFundsModal({ isOpen, onClose, balance, onSuccess }: AddFundsModalProps) {
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const residentId = active?.associatedIds?.residentId || '';
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';

    const [step, setStep] = useState<Step>('input');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const amountNaira = parseFloat(amount || '0');

    const handleFund = async () => {
        if (!amount || amountNaira <= 0) {
            toast.error('Please enter an amount', { position: 'top-center' });
            return;
        }
        if (amountNaira < 100) {
            toast.error('Minimum amount is ₦100', { position: 'top-center' });
            return;
        }
        if (!residentId) {
            toast.error('Unable to identify resident. Please try again.', { position: 'top-center' });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/payments/initialize', {
                amount: amountNaira,
                type: 'WALLET_FUNDING',
                residentId,
                organizationId: orgId,
                estateId,
                callbackUrl: `${window.location.origin}/resident/wallet`,
            });

            const paystackUrl = res.data?.data?.authorization_url;
            if (paystackUrl) {
                window.open(paystackUrl, '_blank');
                setStep('redirecting');
            } else {
                setStep('failed');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg) toast.error(msg, { position: 'top-center' });
            setStep('failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Refresh balance when user closes — Paystack may have completed
        onSuccess?.();
        setStep('input');
        setAmount('');
        onClose();
    };

    // ── Redirecting state ────────────────────────────────────────────────────
    if (step === 'redirecting') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-[440px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-5'>
                    <div className='w-20 h-20 rounded-full border border-[#C7DCFF] flex items-center justify-center'>
                        <svg className='animate-spin' width="40" height="40" viewBox="0 0 48 48" fill="none">
                            {[0,1,2,3,4,5,6,7].map((i) => (
                                <line key={i} x1="24" y1="6" x2="24" y2="14" stroke="#006AFF" strokeWidth="3" strokeLinecap="round"
                                    transform={`rotate(${i * 45} 24 24)`} strokeOpacity={1 - i * 0.1} />
                            ))}
                        </svg>
                    </div>
                    <div className='text-center'>
                        <h3 className='text-[18px] font-semibold text-BlackHomz mb-2'>Redirecting to Paystack</h3>
                        <p className='text-[13px] text-GrayHomz leading-relaxed'>
                            Complete your payment in the Paystack window that just opened.
                            Once done, come back here and click <span className='font-medium text-BlackHomz'>&quot;Done&quot;</span> to refresh your balance.
                        </p>
                    </div>

                    <div className='bg-[#FFF8E1] border border-[#FFE082] rounded-[10px] p-3 w-full'>
                        <p className='text-[12px] text-[#F57F17] text-center'>
                            ⚠️ Don&apos;t close this window until your payment is confirmed on Paystack
                        </p>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <button
                            onClick={handleClose}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90'
                        >
                            Done — Refresh My Balance
                        </button>
                        <button
                            onClick={() => { setStep('input'); setAmount(''); }}
                            className='w-full h-[44px] bg-[#F5F5F5] text-GrayHomz rounded-[8px] font-medium text-sm hover:bg-[#EBEBEB]'
                        >
                            Fund a Different Amount
                        </button>
                    </div>
                </div>
            </CustomModal>
        );
    }

    // ── Failed state ─────────────────────────────────────────────────────────
    if (step === 'failed') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-[400px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <path d="M14 14l28 28M42 14L14 42" stroke="#DC2626" strokeWidth="5" strokeLinecap="round"/>
                    </svg>
                    <h3 className='text-[18px] font-semibold text-BlackHomz'>Payment Failed</h3>
                    <p className='text-[13px] text-GrayHomz text-center'>
                        Could not initialize payment. Please try again.
                    </p>
                    <button
                        onClick={() => setStep('input')}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'
                    >
                        Retry
                    </button>
                    <button
                        onClick={handleClose}
                        className='w-full h-[44px] bg-[#F5F5F5] text-BlackHomz rounded-[8px] font-medium text-sm'
                    >
                        Cancel
                    </button>
                </div>
            </CustomModal>
        );
    }

    // ── Input state ──────────────────────────────────────────────────────────
    return (
        <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
            <div className='w-[560px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                <div className='flex items-start justify-between mb-5'>
                    <div>
                        <h2 className='text-[18px] font-semibold text-BlackHomz'>Add Funds</h2>
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Add money to your Homz wallet</p>
                    </div>
                    <button onClick={handleClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Current balance */}
                <div className='bg-[#EEF5FF] rounded-[10px] p-4 mb-5'>
                    <p className='text-[12px] text-GrayHomz mb-1'>Wallet balance</p>
                    <p className='text-[22px] font-bold text-BlackHomz'>{formatNaira(balance)}</p>
                </div>

                {/* Amount input */}
                <div className='mb-4'>
                    <label className='text-[13px] font-medium text-BlackHomz mb-2 block'>Amount to Add</label>
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

                {/* Quick amounts */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    {QUICK_AMOUNTS.map((a) => (
                        <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors
                                ${amount === String(a)
                                    ? 'bg-BlueHomz text-white border-BlueHomz'
                                    : 'border-[#006AFF] text-BlueHomz hover:bg-[#EEF5FF]'}`}
                        >
                            ₦{a.toLocaleString()}
                        </button>
                    ))}
                </div>

                <p className='text-[11px] text-GrayHomz mb-6'>• Funds added to your wallet can be used to pay bills and services</p>

                <button
                    onClick={handleFund}
                    disabled={loading || amountNaira <= 0}
                    className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center'
                >
                    {loading ? <DotLoader /> : 'Fund my Wallet'}
                </button>
            </div>
        </CustomModal>
    );
}