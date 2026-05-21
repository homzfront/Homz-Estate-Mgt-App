'use client';
import React from 'react';
import CustomModal from '@/components/general/customModal';
import Image from 'next/image';

export interface ReceiptData {
    receiptId: string;
    transferReference?: string;
    amountPaid: number;
    paymentDate: string;
    paymentTime: string;
    billName?: string;
    paymentType?: string;
    paymentMethod?: string;
    payer?: string;
    estateApartment?: string;
    status: 'SUCCESS' | 'SUCCESSFUL' | 'FAILED' | 'PENDING';
}

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReceiptData | null;
}

function formatNaira(amount: number) {
    return `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

export default function ReceiptModal({ isOpen, onClose, data }: ReceiptModalProps) {
    if (!data) return null;

    const handleShare = async () => {
        const text = `Receipt #${data.receiptId}\nAmount: ${formatNaira(data.amountPaid)}\nDate: ${data.paymentDate}\nStatus: ${data.status}`;
        if (navigator.share) {
            await navigator.share({ title: 'Payment Receipt', text });
        } else {
            await navigator.clipboard.writeText(text);
        }
    };

    return (
        <CustomModal isOpen={isOpen} onRequestClose={onClose}>
            <div className='w-[620px] max-w-[95vw] bg-white rounded-[16px] p-6 max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-start justify-between mb-5'>
                    <div>
                        <h2 className='text-[18px] font-semibold text-BlackHomz'>Receipt</h2>
                        <p className='text-[12px] text-GrayHomz mt-0.5'>Receipt for your recent payment</p>
                    </div>
                    <button onClick={onClose} className='text-GrayHomz hover:text-BlackHomz'>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Receipt card */}
                <div className='border border-[#006AFF40] rounded-[12px] p-5'>
                    {/* Logo + amount */}
                    <div className='flex items-center gap-2 mb-4'>
                        <Image src='/Homz-pc-icon.png' alt='Homz' width={80} height={20} />
                    </div>
                    <div className='text-center mb-4'>
                        <p className='text-[28px] font-bold text-BlackHomz'>{formatNaira(data.amountPaid)}</p>
                        <p className={`text-[13px] font-medium mt-1 ${(data.status === 'SUCCESSFUL' || data.status === 'SUCCESS') ? 'text-[#039855]' : data.status === 'FAILED' ? 'text-red-500' : 'text-orange-500'}`}>
                            {(data.status === 'SUCCESSFUL' || data.status === 'SUCCESS') ? 'Successful' : data.status === 'FAILED' ? 'Failed' : 'Pending'}
                        </p>
                    </div>

                    {/* Receipt Summary */}
                    <p className='text-[13px] font-semibold text-BlueHomz mb-3 underline'>Receipt Summary</p>
                    <div className='flex flex-col gap-2.5 mb-4'>
                        {[
                            { label: 'Receipt ID:', value: `#${data.receiptId}` },
                            { label: 'Transfer Reference:', value: `#${data.transferReference || data.receiptId}` },
                            { label: 'Amount Paid:', value: formatNaira(data.amountPaid) },
                            { label: 'Payment Date:', value: data.paymentDate },
                            { label: 'Payment Time:', value: data.paymentTime },
                        ].map(({ label, value }) => (
                            <div key={label} className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>{label}</span>
                                <span className='text-[12px] font-medium text-BlackHomz'>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Payment Details */}
                    {(data.billName || data.payer) && (
                        <>
                            <p className='text-[13px] font-semibold text-BlueHomz mb-3 underline'>Payment Details</p>
                            <div className='flex flex-col gap-2.5'>
                                {[
                                    data.billName && { label: 'Bill Name:', value: data.billName },
                                    data.paymentType && { label: 'Payment Type:', value: data.paymentType },
                                    data.paymentMethod && { label: 'Payment Method:', value: data.paymentMethod },
                                    data.payer && { label: 'Payer:', value: data.payer },
                                    data.estateApartment && { label: 'Estate / Apartment', value: data.estateApartment },
                                ].filter(Boolean).map((item: any) => (
                                    <div key={item.label} className='flex items-center justify-between'>
                                        <span className='text-[12px] text-GrayHomz'>{item.label}</span>
                                        <span className='text-[12px] font-medium text-BlackHomz'>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Download Receipt button */}
                <button
                    onClick={() => window.print()}
                    className='w-full mt-4 h-[48px] bg-BlueHomz text-white rounded-[8px] text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity'
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16l-4-4h3V4h2v8h3l-4 4zM4 20h16v-4h-2v2H6v-2H4v4z" fill="white"/>
                    </svg>
                    Download Receipt
                </button>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    className='w-full mt-3 h-[48px] border border-[#006AFF] rounded-[8px] text-BlueHomz text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#EEF5FF] transition-colors'
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Share Receipt
                </button>
            </div>
        </CustomModal>
    );
}