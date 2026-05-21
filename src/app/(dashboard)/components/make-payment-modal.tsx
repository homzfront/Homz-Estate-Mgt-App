'use client';
import React, { useState, useEffect } from 'react';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import { useWalletStore } from '@/store/useWalletStore';
import { useKycStore } from '@/store/useKycStore';
import { useRouter } from 'next/navigation';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import ReceiptModal, { ReceiptData } from '@/app/(dashboard)/components/receipt-modal';

interface BillInfo {
    billingPaymentId: string;  // the bill payment record _id
    billName: string;
    amount: number;            // in kobo
    dueDate: string;
    frequency?: string;
}

interface MakePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: BillInfo;
    onSuccess?: () => void;
}

type Step = 'select' | 'confirm' | 'processing' | 'success' | 'failed';

function formatNaira(amount: number) {
    return `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function StepDots({ step }: { step: Step }) {
    const steps = ['select', 'confirm', 'processing'];
    const idx = steps.indexOf(step);
    return (
        <div className='flex items-center gap-2'>
            {steps.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i <= idx ? 'bg-BlueHomz' : 'bg-[#E6E6E6]'}`} />
            ))}
        </div>
    );
}

export default function MakePaymentModal({ isOpen, onClose, bill, onSuccess }: MakePaymentModalProps) {
    const [step, setStep] = useState<Step>('select');
    const [payFull, setPayFull] = useState(true);
    const [customAmount, setCustomAmount] = useState('');
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const { balance, fetchResidentBalance } = useWalletStore();
    const { residentCommunity } = useResidentCommunity();
    const { status: kycStatus } = useKycStore();
    const router = useRouter();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';
    const residentId = active?.associatedIds?.residentId || '';

    useEffect(() => {
        if (isOpen && orgId && estateId) {
            fetchResidentBalance(orgId, estateId);
        }
        if (!isOpen) {
            setStep('select');
            setPayFull(true);
            setCustomAmount('');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, orgId, estateId]);

    const payAmount = payFull
        ? bill.amount
        : parseFloat(customAmount.replace(/,/g, '') || '0');

    const handlePayNow = () => {
        if (!payFull && payAmount <= 0) {
            toast.error('Please enter a valid amount', { position: 'top-center' });
            return;
        }
        if (payAmount > balance) {
            toast.error('Insufficient wallet balance. Please fund your wallet first.', { position: 'top-center' });
            return;
        }
        setStep('confirm');
    };

    const handleConfirm = async () => {
        // TODO: Re-enable once resident KYC backend endpoint is built
        // Resident KYC guard temporarily disabled - backend /residents/kyc endpoint not yet implemented
        // Guard: amount must be >= 1 (backend @Min(1))
        if (!payAmount || payAmount < 1) {
            toast.error('Nothing left to pay on this period.', { position: 'top-center' });
            setStep('select');
            return;
        }
        setStep('processing');
        try {
            const res = await api.post(
                `/resident/bill-payment/${bill.billingPaymentId}/pay-with-wallet/organizations/${orgId}/estates/${estateId}/residents/${residentId}`,
                { amount: payAmount }
            );
            const data = res.data?.data;
            const now = new Date();
            // Format bill name properly: "LAND_USE" → "Land Use"
            const formattedBillName = bill.billName
                ? bill.billName.split(/[_\s]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                : 'Bill Payment';
            const totalPaid = (data?.amountPaid ?? payAmount);
            const remaining = (data?.amount ?? 0) - totalPaid;
            const paymentStatus = remaining <= 0 ? 'SUCCESSFUL' : 'SUCCESSFUL';
            setReceiptData({
                receiptId: data?._id?.slice(-8).toUpperCase() || bill.billingPaymentId.slice(-8).toUpperCase(),
                transferReference: data?.referenceTransaction,
                amountPaid: payAmount,
                paymentDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                paymentTime: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
                billName: formattedBillName,
                paymentType: payFull ? 'Full Payment' : 'Partial Payment',
                paymentMethod: 'Homz Wallet',
                status: paymentStatus,
            });
            setStep('success');
            onSuccess?.();
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg) toast.error(msg, { position: 'top-center' });
            setStep('failed');
        }
    };

    const handleClose = () => {
        setStep('select');
        setPayFull(true);
        setCustomAmount('');
        onClose();
    };

    // ── Processing ───────────────────────────────────────────────────────────
    if (step === 'processing') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={() => {}}>
                <div className='w-[500px] max-w-[95vw] bg-white rounded-[16px] p-8'>
                    <div className='flex items-start justify-between mb-2'>
                        <div>
                            <h2 className='text-[18px] font-semibold text-BlackHomz'>Make Payment</h2>
                            <p className='text-[12px] text-GrayHomz'>Make a payment towards this bill</p>
                        </div>
                        <StepDots step={step} />
                    </div>
                    <div className='flex flex-col items-center justify-center py-12 gap-4'>
                        <svg className='animate-spin' width="56" height="56" viewBox="0 0 56 56" fill="none">
                            {[0,1,2,3,4,5,6,7].map((i) => (
                                <line key={i} x1="28" y1="6" x2="28" y2="16" stroke="#006AFF" strokeWidth="3.5" strokeLinecap="round"
                                    transform={`rotate(${i * 45} 28 28)`} strokeOpacity={1 - i * 0.1} />
                            ))}
                        </svg>
                        <h3 className='text-[18px] font-semibold text-BlackHomz'>Payment Processing</h3>
                        <p className='text-[13px] text-GrayHomz text-center max-w-[260px]'>
                            We&apos;re confirming your payment. This won&apos;t take long.
                        </p>
                    </div>
                </div>
            </CustomModal>
        );
    }

    // ── Success ──────────────────────────────────────────────────────────────
    if (step === 'success') {
        return (
            <>
                <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                    <div className='w-[400px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                        <div className='w-16 h-16 rounded-full border-[3px] border-[#039855] flex items-center justify-center'>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12l5 5L20 7" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className='text-[18px] font-semibold text-BlackHomz text-center'>Payment Successful</h3>
                        <p className='text-[13px] text-GrayHomz text-center'>
                            {formatNaira(payAmount)} has been paid towards {bill.billName}
                        </p>
                        <button
                            onClick={() => { setShowReceipt(true); }}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'
                        >
                            View Receipt
                        </button>
                        <button onClick={handleClose} className='w-full h-[48px] bg-[#F5F5F5] text-BlackHomz rounded-[8px] font-medium text-sm hover:bg-[#EBEBEB]'>
                            Cancel
                        </button>
                    </div>
                </CustomModal>
                <ReceiptModal isOpen={showReceipt} onClose={() => { setShowReceipt(false); handleClose(); }} data={receiptData} />
            </>
        );
    }

    // ── Failed ───────────────────────────────────────────────────────────────
    if (step === 'failed') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className='w-[400px] max-w-[95vw] bg-white rounded-[16px] p-8 flex flex-col items-center gap-4'>
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <path d="M14 14l28 28M42 14L14 42" stroke="#DC2626" strokeWidth="5" strokeLinecap="round"/>
                    </svg>
                    <h3 className='text-[18px] font-semibold text-BlackHomz'>Payment Failed</h3>
                    <p className='text-[13px] text-GrayHomz text-center'>
                        Your transaction could not be completed, please try again later.
                    </p>
                    <button onClick={() => setStep('select')} className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'>Retry</button>
                    <button onClick={handleClose} className='w-full h-[48px] bg-[#F5F5F5] text-BlackHomz rounded-[8px] font-medium text-sm'>Cancel</button>
                </div>
            </CustomModal>
        );
    }

    // ── Confirm ──────────────────────────────────────────────────────────────
    if (step === 'confirm') {
        return (
            <CustomModal isOpen={isOpen} onRequestClose={() => setStep('select')}>
                <div className='w-[500px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                    <div className='flex items-start justify-between mb-6'>
                        <div>
                            <h2 className='text-[18px] font-semibold text-BlackHomz'>Make Payment</h2>
                            <p className='text-[12px] text-GrayHomz'>Make a payment towards this bill</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <StepDots step={step} />
                            <button onClick={() => setStep('select')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col items-center gap-5 py-4'>
                        {/* Wallet icon */}
                        <div className='w-20 h-20 flex items-center justify-center'>
                            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                                <rect x="8" y="20" width="56" height="40" rx="6" stroke="#C0C0C0" strokeWidth="3"/>
                                <path d="M8 32h56" stroke="#C0C0C0" strokeWidth="3"/>
                                <circle cx="52" cy="44" r="4" fill="#C0C0C0"/>
                            </svg>
                        </div>
                        <h3 className='text-[20px] font-semibold text-BlackHomz'>Confirm Payment</h3>

                        {/* Bill summary */}
                        <div className='w-full border border-[#E6E6E6] rounded-[10px] p-4'>
                            <p className='text-[12px] text-GrayHomz mb-1'>You&apos;re paying for:</p>
                            <p className='text-[14px] font-semibold text-BlackHomz'>
                                Bill: {bill.billName} <span className='font-normal'>({formatNaira(payAmount)})</span>
                            </p>
                            <div className='flex items-center justify-between mt-2'>
                                {bill.frequency && <span className='text-[12px] text-BlueHomz'>{bill.frequency}</span>}
                                <span className='text-[12px] text-orange-500 ml-auto'>
                                    Due Date: {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity'
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </CustomModal>
        );
    }

    // ── Step 1: Select amount ────────────────────────────────────────────────
    return (
        <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
            <div className='w-[500px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                <div className='flex items-start justify-between mb-5'>
                    <div>
                        <h2 className='text-[18px] font-semibold text-BlackHomz'>Make Payment</h2>
                        <p className='text-[12px] text-GrayHomz'>Make a payment towards this bill</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <StepDots step={step} />
                        <button onClick={handleClose}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Wallet balance */}
                <div className='bg-[#EEF5FF] rounded-[10px] p-4 mb-4'>
                    <p className='text-[12px] text-GrayHomz mb-1'>Wallet balance</p>
                    <p className='text-[22px] font-bold text-BlackHomz'>{formatNaira(balance)}</p>
                </div>
                <p className='text-[11px] text-GrayHomz mb-4'>• This is your wallet balance. Funds here will be used to pay this bill</p>

                {/* Bill info */}
                <div className='border border-[#E6E6E6] rounded-[10px] p-4 mb-4'>
                    <p className='text-[12px] text-GrayHomz mb-1'>You&apos;re paying for:</p>
                    <p className='text-[14px] font-semibold text-BlackHomz'>
                        Bill: {bill.billName} <span className='font-normal'>({formatNaira(bill.amount)})</span>
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                        {bill.frequency && <span className='text-[12px] text-BlueHomz'>{bill.frequency}</span>}
                        <span className='text-[12px] text-orange-500 ml-auto'>
                            Due Date: {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Payment type radio */}
                <div className='flex flex-col gap-3 mb-4'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <div
                            onClick={() => setPayFull(true)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payFull ? 'border-BlueHomz' : 'border-[#C0C0C0]'}`}
                        >
                            {payFull && <div className='w-2.5 h-2.5 rounded-full bg-BlueHomz' />}
                        </div>
                        <span className='text-[13px] font-medium text-BlackHomz'>
                            Make full payment ({formatNaira(bill.amount)})
                        </span>
                    </label>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <div
                            onClick={() => setPayFull(false)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!payFull ? 'border-BlueHomz' : 'border-[#C0C0C0]'}`}
                        >
                            {!payFull && <div className='w-2.5 h-2.5 rounded-full bg-BlueHomz' />}
                        </div>
                        <span className='text-[13px] font-medium text-BlackHomz'>Pay a different amount</span>
                    </label>
                </div>

                {/* Custom amount input */}
                {!payFull && (
                    <div className='mb-4'>
                        <label className='text-[13px] font-medium text-BlackHomz mb-2 block'>Enter Amount:</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-[13px] font-medium text-BlackHomz'>₦</span>
                            <input
                                className='w-full h-[48px] border border-[#E6E6E6] rounded-[8px] pl-8 pr-4 text-sm outline-none focus:border-BlueHomz transition-colors'
                                placeholder='0'
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                        </div>
                        <p className='text-[11px] text-GrayHomz mt-1'>
                            Min: {formatNaira(bill.amount)} &bull; Max: {formatNaira(bill.amount)}
                        </p>
                    </div>
                )}

                <button
                    onClick={handlePayNow}
                    disabled={!payFull && payAmount <= 0}
                    className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50'
                >
                    Pay Now
                </button>
            </div>
        </CustomModal>
    );
}