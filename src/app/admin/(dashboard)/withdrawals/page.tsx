
'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';

type WithdrawalStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'COMPLETED'
    | 'FAILED';

interface BankDetails {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode?: string;
}

interface AssociatedIds {
    organizationId?: string;
    estateId?: string;
    communityManagerId: string;
}

interface EstateInfo {
    _id?: string;
    name?: string;
    estateName?: string;
}

interface CommunityManagerInfo {
    _id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface Withdrawal {
    _id: string;
    amount: number;
    status: WithdrawalStatus;

    associatedIds?: AssociatedIds;

    bankDetails: BankDetails;

    reason?: string;

    transactionId?: string;

    processedBy?: string;
    processedAt?: string;

    transferReference?: string;
    transferCode?: string;
    transferRecipientCode?: string;
    transferId?: number;

    requiresOtp?: boolean;

    failureReason?: string;

    completedAt?: string;

    createdAt: string;
    updatedAt: string;

    estate?: EstateInfo;
    communityManager?: CommunityManagerInfo;

    estateInfo?: EstateInfo;
    manager?: CommunityManagerInfo;
}

interface WithdrawalListResponse {
    currentPage: number;
    totalCount: number;
    totalPages: number;
    limit: number;
    results: Withdrawal[];
}

interface WithdrawalSummaryItem {
    count: number;
    amount: number;
}

interface WithdrawalSummary {
    PENDING?: WithdrawalSummaryItem;
    APPROVED?: WithdrawalSummaryItem;
    REJECTED?: WithdrawalSummaryItem;
    COMPLETED?: WithdrawalSummaryItem;
    FAILED?: WithdrawalSummaryItem;
}

interface ApiResponse<T> {
    message?: string;
    data: T;
    success?: boolean;
}

const money = (amount = 0) =>
    `₦${Number(amount).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date?: string) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleString('en-NG', {
        timeZone: 'UTC',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const maskAccount = (account?: string) => {
    if (!account) return '—';

    if (account.length <= 4) return account;

    return `••••••${account.slice(-4)}`;
};

const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.';

const getEstateName = (withdrawal: Withdrawal) =>
    withdrawal.estate?.name ||
    withdrawal.estate?.estateName ||
    withdrawal.estateInfo?.name ||
    withdrawal.estateInfo?.estateName ||
    'Estate';

const getManagerName = (withdrawal: Withdrawal) => {
    const manager =
        withdrawal.communityManager || withdrawal.manager;

    if (!manager) return 'Community Manager';

    if (manager.name) return manager.name;

    return (
        [manager.firstName, manager.lastName]
            .filter(Boolean)
            .join(' ') || 'Community Manager'
    );
};

const getManagerEmail = (withdrawal: Withdrawal) =>
    withdrawal.communityManager?.email ||
    withdrawal.manager?.email ||
    '—';

const statusClasses: Record<WithdrawalStatus, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-blue-50 text-blue-700',
    COMPLETED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
    FAILED: 'bg-red-50 text-red-700',
};

function StatusBadge({
    status,
}: {
    status: WithdrawalStatus;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}
        >
            {status}
        </span>
    );
}

/* =========================================================
   APPROVE WITHDRAWAL CONFIRMATION MODAL
========================================================= */

function ApproveWithdrawalModal({
    withdrawal,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    withdrawal: Withdrawal | null;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    if (!open || !withdrawal) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#EEEEEE] px-6 py-5">

                    <div>
                        <h3 className="text-lg font-semibold text-[#181818]">
                            Approve Withdrawal
                        </h3>

                        <p className="mt-1 text-xs text-[#777777]">
                            Review the payment details before approving.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-xl leading-none text-[#999999] hover:text-[#222222] disabled:opacity-40"
                    >
                        ×
                    </button>

                </div>

                {/* Body */}
                <div className="space-y-5 px-6 py-5">

                    {/* Amount */}
                    <div className="rounded-xl bg-[#F7F9FC] px-4 py-5 text-center">

                        <p className="text-xs text-[#888888]">
                            Withdrawal amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#181818]">
                            {money(withdrawal.amount)}
                        </p>

                    </div>

                    {/* Details */}
                    <div className="space-y-4">

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-[#888888]">
                                Estate
                            </span>

                            <span className="text-right text-xs font-semibold text-[#222222]">
                                {getEstateName(withdrawal)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-[#888888]">
                                Community Manager
                            </span>

                            <span className="text-right text-xs font-semibold text-[#222222]">
                                {getManagerName(withdrawal)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-[#888888]">
                                Bank
                            </span>

                            <span className="text-right text-xs font-semibold text-[#222222]">
                                {withdrawal.bankDetails.bankName}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-[#888888]">
                                Account name
                            </span>

                            <span className="max-w-[240px] text-right text-xs font-semibold text-[#222222]">
                                {withdrawal.bankDetails.accountName}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-[#888888]">
                                Account number
                            </span>

                            <span className="text-right text-xs font-semibold text-[#222222]">
                                {maskAccount(
                                    withdrawal.bankDetails.accountNumber
                                )}
                            </span>
                        </div>

                    </div>

                    {/* Warning */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <div className="flex gap-3">

                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm text-amber-700">
                                !
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-amber-800">
                                    Confirm payment
                                </p>

                                <p className="mt-1 text-xs leading-5 text-amber-700">
                                    Confirming this request will initiate a
                                    transfer from the Homz Paystack balance to
                                    the estate bank account.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-[#EEEEEE] px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-11 flex-1 rounded-lg border border-[#DDDDDD] text-xs font-semibold text-[#555555] transition hover:bg-[#F8F8F8] disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="h-11 flex-1 rounded-lg bg-[#006AFF] text-xs font-semibold text-white transition hover:bg-[#0056CC] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm & Pay'}
                    </button>

                </div>

            </div>
        </div>
    );
}

/* =========================================================
   REJECT WITHDRAWAL MODAL
========================================================= */

function RejectWithdrawalModal({
    open,
    onClose,
    onConfirm,
    loading,
    reason,
    onReasonChange,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    reason: string;
    onReasonChange: (value: string) => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[480px] rounded-2xl bg-white shadow-2xl">
                <div className="border-b border-[#EEEEEE] px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#181818]">
                                Reject Withdrawal
                            </h3>

                            <p className="mt-1 text-xs text-[#777777]">
                                Provide a reason for rejecting this request.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="text-xl leading-none text-[#999999] hover:text-[#222222] disabled:opacity-40"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                        <p className="text-xs font-semibold text-red-700">
                            This action will reject the withdrawal and return the held amount to the estate wallet.
                        </p>
                    </div>

                    <label className="block text-sm font-medium text-[#333333]">
                        Rejection reason
                        <textarea
                            value={reason}
                            onChange={(event) => onReasonChange(event.target.value)}
                            rows={5}
                            placeholder="Enter the reason for rejecting this withdrawal"
                            className="mt-2 min-h-[120px] w-full rounded-lg border border-[#D9E2F2] bg-white px-3 py-2 text-sm text-[#222222] outline-none focus:border-[#006AFF]"
                        />
                    </label>
                </div>

                <div className="flex gap-3 border-t border-[#EEEEEE] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-11 flex-1 rounded-lg border border-[#DDDDDD] text-xs font-semibold text-[#555555] transition hover:bg-[#F8F8F8] disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || !reason.trim()}
                        className="h-11 flex-1 rounded-lg bg-red-600 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Reject Withdrawal'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   WITHDRAWAL DETAILS MODAL
========================================================= */

function WithdrawalDetailsModal({
    withdrawal,
    onClose,
    onApprove,
    onReject,
    onFinalize,
    actionLoading,
}: {
    withdrawal: Withdrawal | null;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onFinalize: (otp: string) => void;
    actionLoading: boolean;
}) {
    const [otp, setOtp] = useState('');

    useEffect(() => {
        setOtp('');
    }, [withdrawal?._id]);

    if (!withdrawal) return null;

    const isPending = withdrawal.status === 'PENDING';

    const needsOtp =
        withdrawal.status === 'APPROVED' &&
        withdrawal.requiresOtp === true;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

            <div className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#EEEEEE] p-6">

                    <div>
                        <p className="text-xs text-[#999999]">
                            Withdrawal request
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#181818]">
                            {money(withdrawal.amount)}
                        </h2>

                        <p className="mt-1 font-mono text-[10px] text-[#999999]">
                            {withdrawal._id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-[#999999] hover:text-[#222222]"
                    >
                        ×
                    </button>

                </div>

                {/* Body */}
                <div className="space-y-5 p-6">

                    {/* Status */}
                    <div className="flex items-center justify-between">

                        <span className="text-xs text-[#777777]">
                            Status
                        </span>

                        <StatusBadge status={withdrawal.status} />

                    </div>

                    {/* People */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <p className="text-[11px] text-[#999999]">
                                Estate
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#222222]">
                                {getEstateName(withdrawal)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#999999]">
                                Community Manager
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#222222]">
                                {getManagerName(withdrawal)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#999999]">
                                Manager email
                            </p>

                            <p className="mt-1 break-all text-sm text-[#444444]">
                                {getManagerEmail(withdrawal)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#999999]">
                                Requested
                            </p>

                            <p className="mt-1 text-sm text-[#444444]">
                                {formatDate(withdrawal.createdAt)}
                            </p>
                        </div>

                    </div>

                    {/* Bank details */}
                    <div className="rounded-xl border border-[#EAEAEA] p-4">

                        <p className="mb-3 text-xs font-semibold text-[#006AFF]">
                            Destination bank account
                        </p>

                        <div className="space-y-3">

                            <div className="flex justify-between gap-4">
                                <span className="text-xs text-[#999999]">
                                    Account name
                                </span>

                                <span className="text-right text-xs font-medium text-[#222222]">
                                    {withdrawal.bankDetails.accountName}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-xs text-[#999999]">
                                    Bank
                                </span>

                                <span className="text-right text-xs font-medium text-[#222222]">
                                    {withdrawal.bankDetails.bankName}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-xs text-[#999999]">
                                    Account number
                                </span>

                                <span className="text-right text-xs font-medium text-[#222222]">
                                    {maskAccount(
                                        withdrawal.bankDetails.accountNumber
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-xs text-[#999999]">
                                    Bank code
                                </span>

                                <span className="text-right text-xs font-medium text-[#222222]">
                                    {withdrawal.bankDetails.bankCode || '—'}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Transfer information */}
                    {withdrawal.transferReference && (
                        <div className="rounded-xl bg-[#F8FAFC] p-4">

                            <p className="text-[11px] text-[#999999]">
                                Transfer reference
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-[#333333]">
                                {withdrawal.transferReference}
                            </p>

                            {withdrawal.transferCode && (
                                <>
                                    <p className="mt-3 text-[11px] text-[#999999]">
                                        Paystack transfer code
                                    </p>

                                    <p className="mt-1 font-mono text-xs text-[#333333]">
                                        {withdrawal.transferCode}
                                    </p>
                                </>
                            )}

                        </div>
                    )}

                    {/* Failure reason */}
                    {withdrawal.failureReason && (
                        <div className="rounded-xl bg-red-50 p-4">

                            <p className="text-xs font-semibold text-red-700">
                                Transfer failure
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                {withdrawal.failureReason}
                            </p>

                        </div>
                    )}

                    {/* Rejection reason */}
                    {withdrawal.reason && (
                        <div className="rounded-xl bg-red-50 p-4">

                            <p className="text-xs font-semibold text-red-700">
                                Rejection reason
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                {withdrawal.reason}
                            </p>

                        </div>
                    )}

                    {/* OTP */}
                    {needsOtp && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                            <p className="text-sm font-semibold text-blue-800">
                                Paystack OTP required
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-700">
                                Paystack requires an OTP to finalize this
                                transfer.
                            </p>

                            <div className="mt-3 flex gap-2">

                                <input
                                    value={otp}
                                    onChange={(event) =>
                                        setOtp(
                                            event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 10)
                                        )
                                    }
                                    placeholder="Enter OTP"
                                    inputMode="numeric"
                                    className="h-10 flex-1 rounded-lg border border-[#D9E2F2] bg-white px-3 text-sm outline-none focus:border-[#006AFF]"
                                />

                                <button
                                    type="button"
                                    disabled={!otp || actionLoading}
                                    onClick={() => onFinalize(otp)}
                                    className="rounded-lg bg-[#006AFF] px-4 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionLoading
                                        ? 'Processing...'
                                        : 'Finalize'}
                                </button>

                            </div>

                        </div>
                    )}

                    {/* Pending explanation */}
                    {isPending && (
                        <div className="rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] p-4">

                            <p className="text-xs font-semibold text-[#222222]">
                                Admin approval required
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#666666]">
                                Approving this request will initiate a Paystack
                                transfer from Homz&apos;s Paystack balance to the
                                estate bank account.
                            </p>

                            <p className="mt-2 text-xs leading-5 text-[#666666]">
                                Rejecting it will return the held amount to the
                                estate wallet.
                            </p>

                        </div>
                    )}

                    {/* Actions */}
                    {isPending && (
                        <div className="flex gap-3">

                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={onReject}
                                className="h-11 flex-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reject
                            </button>

                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={onApprove}
                                className="h-11 flex-1 rounded-lg bg-[#006AFF] text-sm font-semibold text-white hover:bg-[#0056CC] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Approve & Pay
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

/* =========================================================
   ADMIN WITHDRAWALS PAGE
========================================================= */

export default function AdminWithdrawalsPage() {

    const [withdrawals, setWithdrawals] =
        useState<Withdrawal[]>([]);

    const [summary, setSummary] =
        useState<WithdrawalSummary>({});

    const [status, setStatus] =
        useState<WithdrawalStatus | 'ALL'>('PENDING');

    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const [selected, setSelected] =
        useState<Withdrawal | null>(null);

    const [showApproveModal, setShowApproveModal] =
        useState(false);

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectionTarget, setRejectionTarget] =
        useState<Withdrawal | null>(null);

    const [rejectionReason, setRejectionReason] =
        useState('');

    const [actionLoading, setActionLoading] =
        useState(false);

    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const showToast = (
        type: 'success' | 'error',
        message: string
    ) => {
        setToast({
            type,
            message,
        });

        setTimeout(() => {
            setToast(null);
        }, 4500);
    };

    /* =========================================================
       FETCH WITHDRAWALS
    ========================================================= */

    const fetchWithdrawals = async () => {
        setLoading(true);

        try {
            const params: Record<string, string> = {
                page: String(page),
                limit: '20',
            };

            if (status !== 'ALL') {
                params.status = status;
            }

            if (search.trim()) {
                params.search = search.trim();
            }

            const response =
                await api.get<ApiResponse<WithdrawalListResponse>>(
                    '/admin/wallets/withdrawals',
                    {
                        params,
                    }
                );

            const payload = response.data.data;

            setWithdrawals(payload.results || []);
            setPage(payload.currentPage || page);
            setTotalPages(payload.totalPages || 1);
            setTotalCount(payload.totalCount || 0);

        } catch (error) {
            showToast(
                'error',
                getErrorMessage(error)
            );

            setWithdrawals([]);

        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       FETCH SUMMARY
    ========================================================= */

    const fetchSummary = async () => {
        try {
            const response =
                await api.get<ApiResponse<WithdrawalSummary>>(
                    '/admin/wallets/withdrawals/summary'
                );

            setSummary(response.data.data || {});

        } catch (error) {
            console.error(
                'Failed to load withdrawal summary',
                error
            );
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [status, page, search]);

    useEffect(() => {
        fetchSummary();
    }, []);

    /* =========================================================
       OPEN WITHDRAWAL
    ========================================================= */

    const openWithdrawal = async (
        withdrawal: Withdrawal
    ) => {
        try {
            const response =
                await api.get<ApiResponse<Withdrawal>>(
                    `/admin/wallets/withdrawals/${withdrawal._id}`
                );

            setSelected(response.data.data);

        } catch (error) {
            showToast(
                'error',
                getErrorMessage(error)
            );
        }
    };

    /* =========================================================
       OPEN APPROVE MODAL
    ========================================================= */

    const openApproveModal = () => {
        if (!selected) return;

        setShowApproveModal(true);
    };

    /* =========================================================
       APPROVE WITHDRAWAL
    ========================================================= */

    const approveWithdrawal = async () => {
        if (!selected) return;

        setActionLoading(true);

        try {
            const response =
                await api.post<ApiResponse<Withdrawal>>(
                    `/admin/wallets/withdrawals/${selected._id}/approve`
                );

            const updated = response.data.data;

            setSelected(updated);

            showToast(
                'success',
                response.data.message ||
                'Withdrawal approved and transfer initiated.'
            );

            await Promise.all([
                fetchWithdrawals(),
                fetchSummary(),
            ]);

        } catch (error) {
            showToast(
                'error',
                getErrorMessage(error)
            );

        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================================
       REJECT WITHDRAWAL
    ========================================================= */

    const rejectWithdrawal = async (reason: string) => {
        const target = selected || rejectionTarget;

        if (!target) return;

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            showToast(
                'error',
                'A rejection reason is required.'
            );

            return;
        }

        setActionLoading(true);

        try {
            const response =
                await api.post<ApiResponse<Withdrawal>>(
                    `/admin/wallets/withdrawals/${target._id}/reject`,
                    {
                        reason: trimmedReason,
                    }
                );

            showToast(
                'success',
                response.data.message ||
                'Withdrawal rejected and funds returned.'
            );

            setSelected(null);
            setRejectionTarget(null);

            await Promise.all([
                fetchWithdrawals(),
                fetchSummary(),
            ]);

        } catch (error) {
            showToast(
                'error',
                getErrorMessage(error)
            );

        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================================
       FINALIZE PAYSTACK TRANSFER
    ========================================================= */

    const finalizeWithdrawal = async (
        otp: string
    ) => {
        if (!selected) return;

        setActionLoading(true);

        try {
            const response =
                await api.post<ApiResponse<Withdrawal>>(
                    `/admin/wallets/withdrawals/${selected._id}/finalize`,
                    {
                        otp,
                    }
                );

            setSelected(response.data.data);

            showToast(
                'success',
                response.data.message ||
                'Transfer finalized successfully.'
            );

            await Promise.all([
                fetchWithdrawals(),
                fetchSummary(),
            ]);

        } catch (error) {
            showToast(
                'error',
                getErrorMessage(error)
            );

        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================================
       SUMMARY CARDS
    ========================================================= */

    const cards = [
        {
            key: 'PENDING',
            label: 'Pending approval',
            data: summary.PENDING,
        },
        {
            key: 'APPROVED',
            label: 'Processing',
            data: summary.APPROVED,
        },
        {
            key: 'COMPLETED',
            label: 'Completed',
            data: summary.COMPLETED,
        },
        {
            key: 'FAILED',
            label: 'Failed',
            data: summary.FAILED,
        },
    ];

    return (
        <div className="p-6">

            {/* =====================================================
          TOAST
      ====================================================== */}

            {toast && (
                <div
                    className={`fixed right-5 top-5 z-[300] max-w-[420px] rounded-lg px-4 py-3 text-xs font-medium text-white shadow-lg ${toast.type === 'success'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* =====================================================
          PAGE HEADER
      ====================================================== */}

            <div className="mb-6">

                <h1 className="text-xl font-semibold text-[#181818]">
                    Withdrawal Requests
                </h1>

                <p className="mt-1 text-sm text-[#666666]">
                    Review and approve estate withdrawal requests
                    before funds are transferred from Homz Paystack
                    balance.
                </p>

            </div>

            {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

            <div className="mb-6 grid grid-cols-4 gap-4">

                {cards.map((card) => (
                    <button
                        type="button"
                        key={card.key}
                        onClick={() => {
                            setStatus(
                                card.key as WithdrawalStatus
                            );
                            setPage(1);
                        }}
                        className="rounded-xl border border-[#EEEEEE] bg-white p-4 text-left transition hover:border-[#D9E5FF] hover:shadow-sm"
                    >

                        <p className="text-[11px] text-[#888888]">
                            {card.label}
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#181818]">
                            {card.data?.count || 0}
                        </p>

                        <p className="mt-1 text-xs text-[#777777]">
                            {money(card.data?.amount || 0)}
                        </p>

                    </button>
                ))}

            </div>

            {/* =====================================================
          FILTERS
      ====================================================== */}

            <div className="mb-4 flex items-center justify-between gap-4">

                <div className="flex gap-1 border-b border-[#EEEEEE]">

                    {[
                        ['PENDING', 'Pending'],
                        ['APPROVED', 'Processing'],
                        ['COMPLETED', 'Completed'],
                        ['REJECTED', 'Rejected'],
                        ['FAILED', 'Failed'],
                        ['ALL', 'All'],
                    ].map(([value, label]) => (
                        <button
                            type="button"
                            key={value}
                            onClick={() => {
                                setStatus(
                                    value as WithdrawalStatus | 'ALL'
                                );
                                setPage(1);
                            }}
                            className={`px-3 py-2 text-xs font-medium ${status === value
                                ? 'border-b-2 border-[#006AFF] text-[#006AFF]'
                                : 'text-[#777777] hover:text-[#333333]'
                                }`}
                        >
                            {label}
                        </button>
                    ))}

                </div>

                <input
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    placeholder="Search withdrawals..."
                    className="h-9 w-[260px] rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none transition focus:border-[#006AFF]"
                />

            </div>

            {/* =====================================================
          TABLE
      ====================================================== */}

            <div className="overflow-hidden rounded-xl border border-[#EEEEEE] bg-white">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        <thead>

                            <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Estate
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Community Manager
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Amount
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Destination
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Requested
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#777777]">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-16 text-center text-sm text-[#999999]"
                                    >
                                        Loading withdrawal requests...
                                    </td>
                                </tr>

                            ) : withdrawals.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-16 text-center text-sm text-[#999999]"
                                    >
                                        No withdrawal requests found.
                                    </td>
                                </tr>

                            ) : (

                                withdrawals.map((withdrawal) => (

                                    <tr
                                        key={withdrawal._id}
                                        className="border-b border-[#F4F4F4] hover:bg-[#FAFAFA]"
                                    >

                                        <td className="px-4 py-3">

                                            <p className="text-xs font-medium text-[#222222]">
                                                {getEstateName(withdrawal)}
                                            </p>

                                            <p className="mt-1 font-mono text-[9px] text-[#AAAAAA]">
                                                {withdrawal._id.slice(-8)}
                                            </p>

                                        </td>

                                        <td className="px-4 py-3">

                                            <p className="text-xs text-[#222222]">
                                                {getManagerName(withdrawal)}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#999999]">
                                                {getManagerEmail(withdrawal)}
                                            </p>

                                        </td>

                                        <td className="px-4 py-3 text-sm font-semibold text-[#222222]">
                                            {money(withdrawal.amount)}
                                        </td>

                                        <td className="px-4 py-3">

                                            <p className="text-xs text-[#222222]">
                                                {withdrawal.bankDetails.bankName}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#888888]">
                                                {maskAccount(
                                                    withdrawal.bankDetails.accountNumber
                                                )}
                                            </p>

                                        </td>

                                        <td className="px-4 py-3 text-xs text-[#666666]">
                                            {formatDate(withdrawal.createdAt)}
                                        </td>

                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                status={withdrawal.status}
                                            />
                                        </td>

                                        <td className="px-4 py-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openWithdrawal(withdrawal)
                                                }
                                                className="text-xs font-semibold text-[#006AFF] hover:underline"
                                            >
                                                Review
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}

                <div className="flex items-center justify-between border-t border-[#EEEEEE] px-4 py-3">

                    <p className="text-[11px] text-[#999999]">
                        {totalCount} withdrawal
                        {totalCount === 1 ? '' : 's'}
                    </p>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) =>
                                    Math.max(1, current - 1)
                                )
                            }
                            className="rounded-md border border-[#E5E5E5] px-3 py-1.5 text-xs disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="flex items-center px-2 text-xs text-[#777777]">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(
                                        totalPages,
                                        current + 1
                                    )
                                )
                            }
                            className="rounded-md border border-[#E5E5E5] px-3 py-1.5 text-xs disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

            {/* =====================================================
          WITHDRAWAL DETAILS MODAL
      ====================================================== */}

            <WithdrawalDetailsModal
                withdrawal={selected}
                onClose={() => setSelected(null)}
                onApprove={openApproveModal}
                onReject={() => {
                    if (selected) {
                        setRejectionTarget(selected);
                        setSelected(null);
                    }
                    setRejectionReason('');
                    setShowRejectModal(true);
                }}
                onFinalize={finalizeWithdrawal}
                actionLoading={actionLoading}
            />

            {/* =====================================================
          REJECT MODAL
      ====================================================== */}

            <RejectWithdrawalModal
                open={showRejectModal}
                onClose={() => {
                    if (!actionLoading) {
                        setShowRejectModal(false);
                        setRejectionReason('');
                        setRejectionTarget(null);
                    }
                }}
                onConfirm={async () => {
                    const trimmedReason = rejectionReason.trim();

                    if (!trimmedReason) {
                        showToast(
                            'error',
                            'A rejection reason is required.'
                        );
                        return;
                    }

                    setShowRejectModal(false);
                    await rejectWithdrawal(trimmedReason);
                }}
                loading={actionLoading}
                reason={rejectionReason}
                onReasonChange={setRejectionReason}
            />

            {/* =====================================================
          APPROVE CONFIRMATION MODAL
      ====================================================== */}

            <ApproveWithdrawalModal
                withdrawal={selected}
                open={showApproveModal}
                onClose={() => {
                    if (!actionLoading) {
                        setShowApproveModal(false);
                    }
                }}
                onConfirm={async () => {
                    setShowApproveModal(false);
                    await approveWithdrawal();
                }}
                loading={actionLoading}
            />

        </div>
    );
}
