'use client';
import React, { useEffect, useState } from 'react';
import { useWalletStore, WalletTransaction } from '@/store/useWalletStore';
import AddFundsModal from '@/app/(dashboard)/components/add-funds-modal';
import RequestPayoutsModal from '@/app/(dashboard)/components/request-payouts-modal';
import ReceiptModal, { ReceiptData } from '@/app/(dashboard)/components/receipt-modal';
import Dropdown from '@/components/general/dropDown';

interface WalletPageProps {
    role: 'resident' | 'em';
    orgId: string;
    estateId: string;
}

const STATUS_OPTIONS = [
    { id: 'ALL', label: 'All Status' },
    { id: 'SUCCESSFUL', label: 'Successful' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'FAILED', label: 'Failed' },
];

function formatNaira(amount: number) {
    // Backend returns amount in naira (not kobo)
    return `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const TX_LABELS: Record<string, string> = {
    FUNDING:      'Wallet Top-up',
    BILL_PAYMENT: 'Bill Payment',
    WITHDRAWAL:   'Payout Request',
    REFUND:       'Refund',
    SUBSCRIPTION: 'Subscription',
};

function txTypeLabel(tx: WalletTransaction) {
    // Use category for readable label, fall back to type
    return TX_LABELS[tx.category] || tx.category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Transaction';
}

function txIcon(tx: WalletTransaction) {
    const isCredit = tx.type === 'CREDIT';
    const color = isCredit ? '#039855' : '#E65100';
    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-[#E8F5E9]' : 'bg-[#FFF3E0]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d={isCredit ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}

function isSuccess(status: string) { return status === 'SUCCESS' || status === 'SUCCESSFUL'; }

function statusColor(status: string) {
    if (isSuccess(status)) return 'text-[#039855]';
    if (status === 'FAILED') return 'text-red-500';
    return 'text-orange-500';
}

function statusBg(status: string) {
    if (isSuccess(status)) return 'bg-[#E8F5E9]';
    if (status === 'FAILED') return 'bg-[#FFEBEE]';
    return 'bg-[#FFF3E0]';
}

function buildReceiptData(tx: WalletTransaction): ReceiptData {
    const d = new Date(tx.createdAt);
    const billName = tx.metadata?.billName && tx.metadata.billName !== 'Deleted Bill'
        ? tx.metadata.billName.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        : tx.category === 'BILL_PAYMENT' ? undefined : undefined;
    return {
        receiptId: tx.reference || tx._id.slice(-8).toUpperCase(),
        transferReference: tx.reference,
        amountPaid: tx.amount,
        paymentDate: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentTime: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
        billName,
        paymentType: txTypeLabel(tx),
        paymentMethod: 'Homz Wallet',
        payer: tx.metadata?.payerName,
        estateApartment: tx.metadata?.estateApartment,
        status: tx.status,
    };
}

export default function WalletPage({ role, orgId, estateId }: WalletPageProps) {
    const {
        balance, isLoadingBalance, transactions, isLoadingTx, totalPages, currentPage, totalCount,
        fetchResidentBalance, fetchResidentTransactions,
        fetchEMBalance, fetchEMTransactions,
        withdrawals, fetchWithdrawals,
    } = useWalletStore();

    const [showAddFunds, setShowAddFunds] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(1);

    const fetchBalance = () => role === 'resident'
        ? fetchResidentBalance(orgId, estateId)
        : fetchEMBalance(orgId, estateId);

    const fetchTx = (p = page, status?: string) => role === 'resident'
        ? fetchResidentTransactions(orgId, estateId, p, status)
        : fetchEMTransactions(orgId, estateId, p, status);

    useEffect(() => {
        if (orgId && estateId) {
            fetchBalance();
            fetchTx(1);
            if (role === 'em') fetchWithdrawals(orgId, estateId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId, estateId, role]);

    const handleStatusFilter = (opt: { id: string | number }) => {
        const s = String(opt.id);
        setStatusFilter(s);
        setPage(1);
        fetchTx(1, s === 'ALL' ? undefined : s);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        fetchTx(p, statusFilter === 'ALL' ? undefined : statusFilter);
    };

    return (
        <div className='p-4 md:p-8 w-full'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-BlackHomz'>
                    {role === 'resident' ? 'My Wallet' : 'Estate Wallet'}
                </h1>
                <p className='text-sm text-GrayHomz mt-0.5'>
                    {role === 'resident' ? 'Manage your wallet balance and transactions.' : 'View estate collections and request payouts.'}
                </p>
            </div>

            {/* Balance Card */}
            <div className='rounded-[16px] p-6 mb-6 relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #006AFF 0%, #0040CC 100%)' }}>
                {/* Decorative circles */}
                <div className='absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10' />
                <div className='absolute -bottom-6 -right-4 w-20 h-20 rounded-full bg-white/10' />

                <div className='relative flex items-start justify-between'>
                    <div>
                        <p className='text-white text-[13px] font-medium opacity-80 mb-1'>
                            {role === 'resident' ? 'Available Balance' : 'Estate Balance'}
                        </p>
                        {isLoadingBalance ? (
                            <div className='w-32 h-8 bg-white/20 rounded animate-pulse' />
                        ) : (
                            <p className='text-white text-[32px] font-bold tracking-tight'>{formatNaira(balance)}</p>
                        )}
                        <p className='text-white text-[12px] opacity-70 mt-1'>
                            {role === 'resident' ? 'Available for bills and payments' : 'Total estate collections'}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {role === 'resident' ? (
                            <button
                                onClick={() => setShowAddFunds(true)}
                                className='bg-white text-BlueHomz text-[13px] font-semibold px-5 py-2.5 rounded-[8px] hover:bg-[#F0F5FF] transition-colors whitespace-nowrap'
                            >
                                + Fund Wallet
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowWithdraw(true)}
                                className='bg-white text-BlueHomz text-[13px] font-semibold px-5 py-2.5 rounded-[8px] hover:bg-[#F0F5FF] transition-colors whitespace-nowrap'
                            >
                                Request Payout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Payout history for EM */}
            {role === 'em' && withdrawals.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-[16px] font-semibold text-BlackHomz mb-3'>Payout Requests</h2>
                    <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-whiteblue h-[44px] text-[12px] font-semibold text-BlackHomz'>
                                    <th className='text-left pl-5'>Date</th>
                                    <th className='text-right pr-5'>Amount</th>
                                    <th className='text-left pl-5 hidden md:table-cell'>Bank</th>
                                    <th className='text-center px-4'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.map((w, i) => (
                                    <tr key={w._id} className={`${i !== 0 ? 'border-t border-[#F5F5F5]' : ''} hover:bg-[#F9FBFF]`}>
                                        <td className='py-3 pl-5 text-[12px] text-GrayHomz'>{formatDate(w.createdAt)}</td>
                                        <td className='py-3 pr-5 text-right text-[13px] font-semibold text-BlackHomz'>{formatNaira(w.amount)}</td>
                                        <td className='py-3 pl-5 text-[12px] text-GrayHomz hidden md:table-cell'>
                                            {(w as any).bankDetails?.bankName || '—'}
                                        </td>
                                        <td className='py-3 px-4 text-center'>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize
                                                ${w.status === 'COMPLETED' ? 'bg-[#E8F5E9] text-[#039855]'
                                                : w.status === 'PENDING' ? 'bg-[#FFF3E0] text-[#E65100]'
                                                : w.status === 'APPROVED' ? 'bg-[#EEF5FF] text-BlueHomz'
                                                : 'bg-[#FFEBEE] text-red-500'}`}>
                                                {w.status.charAt(0) + w.status.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transaction history */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 className='text-[16px] font-semibold text-BlackHomz'>Transaction History</h2>
                    <p className='text-[12px] text-GrayHomz mt-0.5'>
                        {totalCount > 0 ? `${totalCount} transaction${totalCount !== 1 ? 's' : ''} total` : 'All wallet activity'}
                    </p>
                </div>
                <div className='w-[160px]'>
                    <Dropdown
                        options={STATUS_OPTIONS}
                        onSelect={handleStatusFilter}
                        selectOption='All Status'
                        showSearch={false}
                        height='h-[38px]'
                        selectedId={statusFilter}
                    />
                </div>
            </div>

            {/* Transactions */}
            {isLoadingTx ? (
                <div className='flex justify-center py-12'>
                    <div className='w-7 h-7 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : transactions.length === 0 ? (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] flex flex-col items-center justify-center py-16 gap-3'>
                    <div className='w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5H7C4 20.5 2 19 2 15.5V8.5Z" stroke="#006AFF" strokeWidth="1.5"/>
                            <path d="M15.5 12C15.5 10.62 16.62 9.5 18 9.5H22V14.5H18C16.62 14.5 15.5 13.38 15.5 12Z" stroke="#006AFF" strokeWidth="1.5"/>
                        </svg>
                    </div>
                    <p className='text-base font-semibold text-BlackHomz'>No transactions yet</p>
                    <p className='text-sm text-GrayHomz text-center max-w-[260px]'>
                        {role === 'resident'
                            ? 'Fund your wallet to start making payments.'
                            : 'Estate transactions will appear here.'}
                    </p>
                </div>
            ) : (
                <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden'>
                    {transactions.map((tx, idx) => (
                        <div key={tx._id} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFF] transition-colors ${idx !== 0 ? 'border-t border-[#F5F5F5]' : ''}`}>
                            {txIcon(tx)}
                            <div className='flex-1 min-w-0'>
                                <p className='text-[13px] font-semibold text-BlackHomz'>
                                    {tx.metadata?.billName && tx.metadata.billName !== 'Deleted Bill'
                                        ? `Bill Payment — ${tx.metadata.billName.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`
                                        : tx.category === 'BILL_PAYMENT'
                                            ? 'Bill Payment'
                                            : txTypeLabel(tx)}
                                </p>
                                <p className='text-[11px] text-GrayHomz mt-0.5'>
                                    {formatDate(tx.createdAt)} · {formatTime(tx.createdAt)}
                                </p>
                                {tx.reference && (
                                    <p className='text-[10px] text-GrayHomz2 mt-0.5 font-mono'>{tx.reference}</p>
                                )}
                            </div>
                            <div className='text-right flex-shrink-0'>
                                <p className='text-[14px] font-bold text-BlackHomz'>{formatNaira(tx.amount)}</p>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBg(tx.status)} ${statusColor(tx.status)}`}>
                                    {isSuccess(tx.status) ? 'Success' : tx.status === 'FAILED' ? 'Failed' : 'Pending'}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedTx(tx)}
                                className='text-[12px] font-medium text-BlueHomz hover:underline ml-2 flex-shrink-0'
                                title='Download receipt'
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex items-center justify-between px-5 py-3 border-t border-[#F5F5F5]'>
                            <p className='text-[12px] text-GrayHomz'>Page {currentPage} of {totalPages}</p>
                            <div className='flex gap-2'>
                                <button
                                    disabled={page <= 1}
                                    onClick={() => handlePageChange(page - 1)}
                                    className='px-3 py-1.5 text-[12px] border border-[#E6E6E6] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5] font-medium'
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                    className='px-3 py-1.5 text-[12px] border border-[#E6E6E6] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5] font-medium'
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <AddFundsModal
                isOpen={showAddFunds}
                onClose={() => setShowAddFunds(false)}
                balance={balance}
                onSuccess={() => { fetchBalance(); fetchTx(1); setPage(1); }}
            />
            <RequestPayoutsModal
                isOpen={showWithdraw}
                onClose={() => setShowWithdraw(false)}
                balance={balance}
                orgId={orgId}
                estateId={estateId}
                onSuccess={() => { fetchBalance(); fetchTx(1); setPage(1); }}
            />
            <ReceiptModal
                isOpen={!!selectedTx}
                onClose={() => setSelectedTx(null)}
                data={selectedTx ? buildReceiptData(selectedTx) : null}
            />
        </div>
    );
}