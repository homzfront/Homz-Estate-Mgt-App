'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import MakePaymentModal from '@/app/(dashboard)/components/make-payment-modal';
import toast from 'react-hot-toast';

interface Due {
    _id: string;
    billType: string;
    billName?: string;
    amount: number;
    amountPaid: number;
    dueDate: string;
    status: string;
    frequency?: string;
    period?: string;
    billingId: string;
}

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
    PAID:         { label: 'Paid',         bg: '#E8F5E9', color: '#2E7D32' },
    PARTIAL:      { label: 'Partial',      bg: '#FFF3E0', color: '#E65100' },
    PENDING:      { label: 'Due',          bg: '#EEF5FF', color: '#006AFF' },
    OVERDUE:      { label: 'Overdue',      bg: '#FFEBEE', color: '#C62828' },
    UPCOMING:     { label: 'Upcoming',     bg: '#F5F5F5', color: '#616161' },
};

function formatNaira(n: number) {
    return `₦${Number(n || 0).toLocaleString('en-NG')}`;
}
function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DuesPaymentsPage() {
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';
    const residentId = active?.associatedIds?.residentId || '';

    const [dues, setDues] = useState<Due[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'all'>('pending');
    const [payBill, setPayBill] = useState<Due | null>(null);

    useEffect(() => {
        if (orgId && estateId && residentId) fetchDues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId, estateId, residentId, activeTab]);

    const fetchDues = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: '1', limit: '30' });
            if (activeTab !== 'all') {
                if (activeTab === 'pending') params.set('status', 'PENDING');
                else if (activeTab === 'paid') params.set('status', 'PAID');
            }
            const res = await api.get(
                `/residents/bills/organizations/${orgId}/estates/${estateId}/residents/${residentId}?${params}`
            );
            const data = res.data?.data;
            setDues(data?.results || data?.bills || []);
        } catch {
            setDues([]);
        } finally {
            setLoading(false);
        }
    };

    const totalDue = dues
        .filter(d => d.status !== 'PAID')
        .reduce((sum, d) => sum + (d.amount - d.amountPaid), 0);

    const tabs: { key: 'pending' | 'paid' | 'all'; label: string }[] = [
        { key: 'pending', label: 'Pending' },
        { key: 'paid', label: 'Paid' },
        { key: 'all', label: 'All' },
    ];

    return (
        <div className='p-8 w-full'>
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-semibold text-BlackHomz'>Dues & Payments</h1>
                    <p className='text-sm text-GrayHomz mt-0.5'>View and pay your estate bills and levies.</p>
                </div>
                {totalDue > 0 && (
                    <div className='bg-[#FFEBEE] border border-[#FFCDD2] rounded-[10px] px-4 py-2.5 text-right'>
                        <p className='text-[11px] text-GrayHomz'>Total Outstanding</p>
                        <p className='text-[18px] font-bold text-[#C62828]'>{formatNaira(totalDue)}</p>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className='flex gap-2 mb-5'>
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 h-[34px] rounded-[4px] text-sm font-medium transition-all ${
                            activeTab === t.key ? 'bg-BlueHomz text-white' : 'bg-whiteblue text-BlueHomz'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className='flex justify-center py-16'>
                    <div className='w-7 h-7 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : dues.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 gap-3'>
                    <div className='w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className='text-base font-semibold text-BlackHomz'>
                        {activeTab === 'paid' ? 'No paid bills yet' : 'No pending dues'}
                    </p>
                    <p className='text-sm text-GrayHomz text-center max-w-[280px]'>
                        {activeTab === 'paid'
                            ? 'Bills you have paid will appear here.'
                            : 'You have no outstanding bills at the moment.'}
                    </p>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {dues.map(due => {
                        const cfg = STATUS_STYLE[due.status] || STATUS_STYLE.PENDING;
                        const remaining = due.amount - due.amountPaid;
                        const canPay = due.status !== 'PAID' && remaining > 0;

                        return (
                            <div key={due._id} className='bg-white rounded-[12px] border border-[#E6E6E6] px-5 py-4'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1 min-w-0 pr-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <p className='text-[14px] font-semibold text-BlackHomz'>
                                                {due.billName || due.billType?.replace(/_/g, ' ')}
                                            </p>
                                            <span
                                                className='text-[10px] font-semibold px-2 py-0.5 rounded-full'
                                                style={{ backgroundColor: cfg.bg, color: cfg.color }}
                                            >
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-3 text-[12px] text-GrayHomz'>
                                            <span>Due: {formatDate(due.dueDate)}</span>
                                            {due.frequency && <span>· {due.frequency}</span>}
                                            {due.period && <span>· {due.period}</span>}
                                        </div>
                                        {due.amountPaid > 0 && due.status !== 'PAID' && (
                                            <p className='text-[11px] text-GrayHomz mt-1'>
                                                Paid: {formatNaira(due.amountPaid)} · Remaining: {formatNaira(remaining)}
                                            </p>
                                        )}
                                    </div>
                                    <div className='text-right flex-shrink-0'>
                                        <p className='text-[16px] font-bold text-BlackHomz mb-2'>
                                            {formatNaira(due.status === 'PAID' ? due.amountPaid : remaining || due.amount)}
                                        </p>
                                        {canPay && (
                                            <button
                                                onClick={() => setPayBill(due)}
                                                className='h-[34px] px-4 bg-BlueHomz text-white text-[12px] font-semibold rounded-[6px] hover:opacity-90'
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Make Payment Modal */}
            {payBill && (
                <MakePaymentModal
                    isOpen={!!payBill}
                    onClose={() => setPayBill(null)}
                    bill={{
                        billingPaymentId: payBill._id,
                        billName: payBill.billName || payBill.billType,
                        amount: payBill.amount - payBill.amountPaid,
                        dueDate: payBill.dueDate,
                        frequency: payBill.frequency,
                    }}
                    onSuccess={() => {
                        setPayBill(null);
                        fetchDues();
                        toast.success('Payment successful!');
                    }}
                />
            )}
        </div>
    );
}