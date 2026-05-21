'use client';
import React, { useEffect, useState, Suspense} from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api';

type TabType = 'all' | 'SUCCESS' | 'FAILED' | 'PENDING' | 'CREDIT' | 'DEBIT';

interface Transaction {
    _id?: string;
    reference?: string;
    referenceTransaction?: string;
    amount?: number;
    amountPaid?: number;
    type?: string;
    category?: string;
    phone?: string;
    email?: string;
    unit?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    billType?: string;
    paymentMode?: string;
    paymentDate?: string;
    status?: string;
    paymentSettlementType?: string;
    createdAt?: string;
    estateName?: string;
    userName?: string;
    role?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        paid: 'bg-[#E8F5E9] text-[#2E7D32]',
        completed: 'bg-[#E8F5E9] text-[#2E7D32]',
        partialpaid: 'bg-[#FFF3E0] text-[#E65100]',
        partial: 'bg-[#FFF3E0] text-[#E65100]',
        pending: 'bg-[#FFF8E1] text-[#F57F17]',
        failed: 'bg-[#FEF2F2] text-[#EF4444]',
    };
    const labels: Record<string, string> = { paid: 'Completed', completed: 'Completed', partialpaid: 'Partially Paid', partial: 'Partially Paid', pending: 'Pending', failed: 'Failed' };
    const key = status?.toLowerCase();
    return <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${styles[key] || 'bg-[#F5F5F5] text-[#6B6B6B]'}`}>{labels[key] || status}</span>;
};

const PaymentTypeBadge = ({ type }: { type: string }) => {
    if (!type) return <span className='text-[12px] text-[#9E9E9E]'>—</span>;
    const isCredit = type.toUpperCase() === 'CREDIT';
    return (
        <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${isCredit ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FEF2F2] text-[#EF4444]'}`}>
            {isCredit ? 'Credit' : 'Debit'}
        </span>
    );
};
const _OldPaymentTypeBadge = ({ type }: { type: string }) => {
    if (!type) return <span className='text-[#9E9E9E]'>—</span>;
    const label = type === 'full' ? 'Full' : type === 'partial' ? 'Partial' : type;
    const color = type === 'full' ? 'text-[#2E7D32]' : type === 'partial' ? 'text-[#E65100]' : 'text-[#9E9E9E]';
    return <span className={`text-[12px] font-medium ${color}`}>{label}</span>;
};

interface TxnDetailModalProps { txn: Transaction | null; onClose: () => void; }
function TxnDetailModal({ txn, onClose }: TxnDetailModalProps) {
    const [detail, setDetail] = React.useState<any>(null);
    const [loadingDetail, setLoadingDetail] = React.useState(false);

    React.useEffect(() => {
        if (!txn?._id) return;
        setLoadingDetail(true);
        api.get(`/admin/wallets/transactions/${txn._id}`)
            .then(res => {
                const raw = res.data?.data || res.data || {};
                const isResident = !!(raw.residentProfile);
                setDetail({
                    ...raw,
                    userName:   raw.userName || txn.userName,
                    estateName: (raw.estateName && raw.estateName !== 'N/A') ? raw.estateName : txn.estateName,
                    role:       isResident ? 'Resident' : 'Community Manager',
                    phone:      raw.residentProfile?.phoneNumber || raw.cmProfile?.personal?.phoneNumber || null,
                    email:      raw.residentProfile?.email || raw.cmProfile?.email || null,
                    unit:       isResident && raw.residentProfile?.building && raw.residentProfile?.apartment
                                    ? `Unit ${raw.residentProfile.building} - Apt ${raw.residentProfile.apartment}`
                                    : null,
                    isResident,
                });
            })
            .catch(() => setDetail(null))
            .finally(() => setLoadingDetail(false));
    }, [txn?._id]);

    if (!txn) return null;
    const d = detail || txn;
    const ref = d.reference || txn.reference || txn._id || '';

    const handleDownload = () => {
        const rows = [
            ['Field', 'Value'],
            ['Transaction ID', `TXN-${String(ref).slice(-10).toUpperCase()}`],
            ['User', d.userName || '—'],
            ['Estate', d.estateName || '—'],
            ['Role', d.role || '—'],
            ['Phone', d.phone || '—'],
            ['Email', d.email || '—'],
            ['Amount', `₦${(d.amount || 0).toLocaleString()}`],
            ['Category', d.category || '—'],
            ['Payment Type', d.type || '—'],
            ['Status', d.status || '—'],
            ['Date', d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB') : '—'],
            ['Reference', ref],
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction-${String(ref).slice(-10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto'>
                <div className='flex items-start justify-between mb-4'>
                    <div>
                        <h2 className='text-[16px] font-semibold text-[#1A1A1A]'>Transaction Details</h2>
                        <p className='text-[12px] text-[#9E9E9E] mt-0.5 font-mono'>TXN-{String(ref).slice(-10).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className='text-[#9E9E9E] hover:text-[#1A1A1A]'>
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none'><path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                    </button>
                </div>

                {loadingDetail ? (
                    <div className='flex justify-center py-8'>
                        <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : (
                    <>
                        <p className='text-[28px] font-bold text-[#1A1A1A] mb-1'>₦{(d.amount || 0).toLocaleString()}</p>
                        <StatusBadge status={d.status || txn.status || 'pending'} />

                        <div className='grid grid-cols-2 gap-3 mt-5'>
                            {[
                                ['User', d.userName || '—'],
                                ['Estate', (d.estateName && d.estateName !== 'N/A') ? d.estateName : '—'],
                                ['Role', d.role || (txn.type === 'ESTATE' ? 'Community Manager' : 'Resident')],
                                ...(d.isResident !== false ? [['Unit', d.unit || '—'] as [string, string]] : []),
                                ['Phone', (d.phone && d.phone !== 'N/A') ? d.phone : '—'],
                                ['Email', (d.email && d.email !== 'N/A') ? d.email : '—'],
                            ].map(([k, v]) => (
                                <div key={k as string}>
                                    <p className='text-[11px] text-[#9E9E9E]'>{k}</p>
                                    <p className='text-[13px] font-medium text-[#1A1A1A]'>{v}</p>
                                </div>
                            ))}
                        </div>

                        <div className='border border-[#F0F0F0] rounded-[10px] p-4 mt-4'>
                            <h3 className='text-[12px] font-semibold text-[#006AFF] mb-3'>Payment Info</h3>
                            <div className='space-y-2'>
                                {[
                                    ['Bill Type', d.category ? d.category.replace(/_/g, ' ') : '—'],
                                    ['Payment Type', d.type ? (d.type.charAt(0) + d.type.slice(1).toLowerCase()) : '—'],
                                    ['Date', d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                                    ['Reference', String(ref).slice(-16).toUpperCase()],
                                ].map(([k, v]) => (
                                    <div key={k} className='flex justify-between'>
                                        <span className='text-[12px] text-[#9E9E9E]'>{k}</span>
                                        <span className='text-[12px] font-medium text-[#1A1A1A] text-right'>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleDownload}
                            className='w-full mt-4 h-[44px] bg-[#006AFF] text-white rounded-[10px] text-[13px] font-semibold hover:bg-[#0055CC] flex items-center justify-center gap-2'>
                            <svg width='15' height='15' viewBox='0 0 24 24' fill='none'>
                                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                            </svg>
                            Download Receipt
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}


function AdminTransactionsPageInner() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState<Transaction | null>(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => { fetchTransactions(); }, [tab, page, categoryFilter, dateFilter, searchParams]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page) };
            const urlSearch = searchParams?.get('search') || '';
            if (urlSearch) params.search = urlSearch;
            if (tab === 'SUCCESS' || tab === 'FAILED' || tab === 'PENDING') params.status = tab;
            if (tab === 'CREDIT' || tab === 'DEBIT') params.type = tab;
            if (categoryFilter) params.category = categoryFilter;
            if (dateFilter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                params.startDate = today; params.endDate = today;
            } else if (dateFilter === '7days') {
                const d = new Date(); d.setDate(d.getDate() - 7);
                params.startDate = d.toISOString().split('T')[0];
            } else if (dateFilter === '30days') {
                const d = new Date(); d.setDate(d.getDate() - 30);
                params.startDate = d.toISOString().split('T')[0];
            }
            const res = await api.get('/admin/wallets/transactions', { params });
            const td = res.data?.data || res.data || {};
            setTransactions(td.results || []);
            setTotalPages(td.totalPages || Math.ceil((td.totalCount || td.total || 0) / 20) || 1);
        } catch { setTransactions([]); }
        finally { setLoading(false); }
    };

    const TABS: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' }, { key: 'SUCCESS', label: 'Completed' },
        { key: 'CREDIT', label: 'Credit' }, { key: 'PENDING', label: 'Pending' }, { key: 'FAILED', label: 'Failed' },
    ];

    const getPaymentType = (t: Transaction) => t.type || '';

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Transactions</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Monitor all payments across estates, including completed, pending, and failed transaction</p>
            </div>

            {/* Tabs + filters */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex gap-1 border-b border-[#F0F0F0]'>
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
                            className={`px-4 py-2 text-[13px] font-medium transition-colors
                                ${tab === t.key ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                        className='h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] focus:outline-none bg-white'>
                        <option value=''>All Types</option>
                        <option value='BILL_PAYMENT'>Bill Payment</option>
                        <option value='SUBSCRIPTION'>Subscription</option>
                        <option value='WITHDRAWAL'>Withdrawal</option>
                        <option value='DEPOSIT'>Deposit</option>
                        <option value='TRANSFER'>Transfer</option>
                        <option value='REFUND'>Refund</option>
                    </select>
                    <select value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                        className='h-[34px] px-3 border border-[#E8E8E8] rounded-[6px] text-[12px] text-[#6B6B6B] focus:outline-none bg-white'>
                        <option value=''>All Dates</option>
                        <option value='today'>Today</option>
                        <option value='7days'>Last 7 days</option>
                        <option value='30days'>Last 30 days</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                            {['Transaction ID', 'User Name', 'Estate', 'Bill Type', 'Payment Type', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                                <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} className='text-center py-12 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={9} className='text-center py-12 text-[13px] text-[#9E9E9E]'>No transactions found</td></tr>
                        ) : transactions.map((t) => (
                            <tr key={t._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors'>
                                <td className='px-4 py-3 text-[12px] font-mono text-[#6B6B6B]'>TRX {(t.reference || t.referenceTransaction || t._id || '').slice(-8).toUpperCase()}</td>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{t.userName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{t.estateName || '—'}</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B] capitalize'>{t.category ? t.category.replace(/_/g, ' ') : t.billType || '—'}</td>
                                <td className='px-4 py-3'><PaymentTypeBadge type={getPaymentType(t)} /></td>
                                <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>₦{(t.amount || 0).toLocaleString()}.00</td>
                                <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                    {new Date(t.paymentDate || t.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </td>
                                <td className='px-4 py-3'><StatusBadge status={t.status || 'pending'} /></td>
                                <td className='px-4 py-3'>
                                    <button onClick={() => setSelected(t)} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]'>
                        <p className='text-[12px] text-[#9E9E9E]'>Page {page} of {totalPages}</p>
                        <div className='flex gap-2'>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Prev</button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className='px-3 py-1.5 text-[12px] border border-[#E8E8E8] rounded-[6px] disabled:opacity-40 hover:bg-[#F5F5F5]'>Next</button>
                        </div>
                    </div>
                )}
            </div>

            <TxnDetailModal txn={selected} onClose={() => setSelected(null)} />
        </div>
    );
}

export default function AdminTransactionsPage() {
    return (
        <Suspense fallback={<div className='flex justify-center py-16'><div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' /></div>}>
            <AdminTransactionsPageInner />
        </Suspense>
    );
}