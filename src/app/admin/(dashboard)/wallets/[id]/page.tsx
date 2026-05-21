'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';

interface WalletDetail {
    _id?: string;
    balance?: number;
    ownerType?: string;
    isActive?: boolean;
    currency?: string;
    estateName?: string;
    role?: string;
    userName?: string;
    ownerName?: string;
    ownerRole?: string;
    ownerUnit?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    firstName?: string;
    lastName?: string;
    recentTransactions?: any[];
    owner?: {
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
        phone?: string;
        unit?: string;
        apartment?: string;
    };
    estate?: { name?: string; basicDetails?: { name?: string } };
}

interface Payment {
    _id: string;
    userName?: string;
    billType?: string;
    amount: number;
    amountPaid?: number;
    status: string;
    createdAt: string;
    paymentDate?: string;
}

const formatNaira = (n: number) =>
    '₦' + (n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function WalletDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [wallet, setWallet] = useState<WalletDetail | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [payLoading, setPayLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchWallet();
            fetchPayments();
        }
    }, [id]);

    const fetchWallet = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/wallets/${id}`);
            const raw = res.data?.data || res.data || {};
            setWallet({
                ...raw,
                ownerPhone: (raw.phone && raw.phone !== 'N/A') ? raw.phone : raw.ownerPhone || null,
                ownerEmail: (raw.email && raw.email !== 'N/A') ? raw.email : raw.ownerEmail || null,
                ownerUnit:  raw.unit || raw.ownerUnit || null,
                userName:   raw.userName || raw.ownerName || null,
                role:       raw.role || raw.ownerType || null,
                estateName: (raw.estateName && raw.estateName !== 'N/A') ? raw.estateName : raw.estate?.name || null,
            });
            if (raw?.recentTransactions) {
                setPayments(raw.recentTransactions || []);
            }
            // recentTransactions is included in the wallet detail response

        } catch {
            /* silent */
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        // transactions loaded from wallet detail response (recentTransactions)
        setPayLoading(false);
    };

    const roleLabel = (role?: string) => {
        if (!role) return '—';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase().replace(/_/g, ' ');
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    return (
        <div className='p-8 w-full max-w-[900px]'>
            {/* Back */}
            <button
                onClick={() => router.back()}
                className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70 transition-opacity'
            >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
                Back
            </button>

            {/* Header card */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 mb-5'>
                <p className='text-[12px] text-[#9E9E9E] mb-1'>Wallet Details</p>
                <h1 className='text-[22px] font-bold text-[#1A1A1A]'>{wallet?.userName
    || wallet?.ownerName
    || wallet?.owner?.name
    || (wallet?.owner?.firstName ? `${wallet.owner.firstName} ${wallet.owner.lastName || ''}`.trim() : '')
    || (wallet?.firstName ? `${wallet.firstName} ${wallet.lastName || ''}`.trim() : '')
    || '—'}</h1>
                <p className='text-[13px] text-[#9E9E9E] mt-0.5'>
                    {wallet?.role || (wallet?.ownerType === 'ESTATE' ? 'Community Manager' : wallet?.ownerType === 'RESIDENT' ? 'Resident' : '—')}
                    {wallet?.estateName ? ` (${wallet.estateName})` : ''}
                </p>
            </div>

            {/* Balance card */}
            <div className='rounded-[12px] overflow-hidden mb-5' style={{ background: 'linear-gradient(135deg, #1a6fe8 0%, #0052cc 60%, #003a99 100%)' }}>
                <div className='px-6 pt-6 pb-5'>
                    <p className='text-[13px] text-white/80 mb-2'>Available Wallet Balance</p>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[34px] font-bold text-white tracking-tight'>
                            {formatNaira(wallet?.balance ?? 0)}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${wallet?.isActive ? 'bg-transparent border-white/50 text-white' : 'bg-transparent border-white/30 text-white/60'}`}>
                            {wallet?.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info grid */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6 mb-5'>
                <div className='grid grid-cols-3 gap-y-6'>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>User</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.userName
    || wallet?.ownerName
    || wallet?.owner?.name
    || (wallet?.owner?.firstName ? `${wallet.owner.firstName} ${wallet.owner.lastName || ''}`.trim() : '')
    || (wallet?.firstName ? `${wallet.firstName} ${wallet.lastName || ''}`.trim() : '')
    || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Role</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.role || (wallet?.ownerType === 'ESTATE' ? 'Community Manager' : wallet?.ownerType === 'RESIDENT' ? 'Resident' : '—')}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Estate</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.estateName || wallet?.estate?.name || wallet?.estate?.basicDetails?.name || '—'}</p>
                    </div>
                    {wallet?.ownerType === 'RESIDENT' && (
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Unit</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.ownerUnit || '—'}</p>
                    </div>
                    )}
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Phone</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.ownerPhone || wallet?.owner?.phoneNumber || wallet?.owner?.phone || '—'}</p>
                    </div>
                    <div>
                        <p className='text-[11px] text-[#9E9E9E] mb-1'>Email</p>
                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{wallet?.ownerEmail || wallet?.owner?.email || '—'}</p>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className='bg-white rounded-[12px] border border-[#F0F0F0] p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Recent Payments</h3>
                    <button
                        onClick={() => router.push('/admin/transactions')}
                        className='text-[12px] text-[#006AFF] hover:underline flex items-center gap-1'
                    >
                        View All
                        <svg width='11' height='11' viewBox='0 0 24 24' fill='none'>
                            <path d='M5 12h14M12 5l7 7-7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                        </svg>
                    </button>
                </div>

                {payLoading ? (
                    <div className='flex justify-center py-8'>
                        <div className='w-5 h-5 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : payments.length === 0 ? (
                    <p className='text-[13px] text-[#9E9E9E] text-center py-8'>No payments found</p>
                ) : (
                    <div className='divide-y divide-[#F5F5F5]'>
                        {payments.map((p) => (
                            <div key={p._id} className='flex items-center gap-4 py-4'>
                                {/* Check icon */}
                                <div className='w-9 h-9 rounded-full border-2 border-[#2E7D32] flex items-center justify-center flex-shrink-0'>
                                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                        <path d='M20 6L9 17l-5-5' stroke='#2E7D32' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <p className='text-[13px] font-medium text-[#1A1A1A]'>{p.userName || wallet?.userName || wallet?.ownerName || '—'}</p>
                                    <p className='text-[11px] text-[#9E9E9E]'>
                                        {p.billType
                                            ? p.billType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                            : 'Estate dues'}
                                    </p>
                                </div>

                                <div className='text-right flex-shrink-0'>
                                    <p className='text-[13px] font-semibold text-[#1A1A1A]'>
                                        {formatNaira(p.amountPaid ?? p.amount)}
                                    </p>
                                    <p className='text-[11px] text-[#9E9E9E]'>~ {formatDate(p.paymentDate || p.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}