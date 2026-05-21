'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

type TabType = 'residents' | 'payments' | 'activity';

interface Resident {
    userId?: string;
    _id: string;
    residentName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    unit?: string;
    apartment?: string;
    building?: string;
    role?: string;
    dependents?: number;
    dateJoined?: string;
    createdAt?: string;
    status?: string;
    isActive?: boolean;
}

interface Payment {
    _id: string;
    amount: number;
    billType: string;
    status: string;
    paymentType?: string;
    paymentMode?: string;
    paymentDate?: string;
    dueDate?: string;
    createdAt?: string;
    referenceTransaction?: string;
    residentName?: string;
    unit?: string;
}

export default function EstateDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [tab, setTab] = useState<TabType>('residents');
    const [estate, setEstate] = useState<any>(null);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [residentPage, setResidentPage] = useState(1);
    const [residentTotalPages, setResidentTotalPages] = useState(1);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [suspending, setSuspending] = useState(false);
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);

    useEffect(() => {
        fetchEstate();
    }, [id]);

    useEffect(() => {
        const onFocus = () => {
            if (tab === 'residents') fetchResidents(residentPage);
            else if (tab === 'payments') fetchPayments();
            else fetchActivity();
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [tab, estate, residentPage]);

    useEffect(() => {
        if (estate) {
            if (tab === 'residents') fetchResidents(residentPage);
            else if (tab === 'payments') fetchPayments();
            else fetchActivity();
        }
    }, [tab, estate]);

    const fetchEstate = async () => {
        try {
            const [detailRes, statsRes] = await Promise.allSettled([
                api.get(`/admin/estates/${id}`),
                api.get(`/admin/estates/${id}/stats`),
            ]);
            const detail = detailRes.status === 'fulfilled' ? (detailRes.value.data?.data || detailRes.value.data || {}) : {};
            const stats = statsRes.status === 'fulfilled' ? (statsRes.value.data?.data || {}) : {};
            setEstate({ ...detail, ...stats });
        } catch { toast.error('Failed to load estate'); }
        finally { setLoading(false); }
    };

    const fetchResidents = async (page = residentPage) => {
        try {
            const res = await api.get(`/admin/estates/${id}/residents`, { params: { page: String(page), limit: '20' } });
            const d = res.data?.data || res.data || {};
            setResidents(d.results || d.data || []);
            setResidentTotalPages(d.totalPages || Math.ceil((d.totalCount || 0) / 20) || 1);
        } catch { setResidents([]); }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get(`/admin/estates/${id}/payments`);
            const list = res.data?.data?.results || res.data?.data || [];
            setPayments(list);
        } catch { setPayments([]); }
    };

    const fetchActivity = async () => {
        try {
            const res = await api.get(`/admin/estates/${id}/activities`);
            const d = res.data?.data || res.data || {};
            const list = d.results || d.data || (Array.isArray(d) ? d : []);
            setActivity(list);
        } catch { setActivity([]); }
    };

    const handleSuspend = async () => {
        setSuspending(true);
        const currentlyActive = estate?.isActive !== false;
        try {
            await api.patch(`/admin/estates/${id}/status`, { isActive: !currentlyActive });
            toast.success(`Estate ${currentlyActive ? 'suspended' : 'activated'} successfully`);
            await fetchEstate();
        } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to update estate status'); }
        finally { setSuspending(false); }
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    return (
        <div className='p-6'>
            {/* Back */}
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Back
            </button>

            {/* Header */}
            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-semibold text-[#1A1A1A] flex items-center gap-2'>
                        {estate?.name || 'Estate'}
                        <span className={`text-[14px] font-medium ${(estate?.status === 'Active' || estate?.isActive !== false) ? 'text-[#2E7D32]' : 'text-[#E65100]'}`}>
                            ({(estate?.status === 'Active' || estate?.isActive !== false) ? 'Active' : 'Suspended'})
                        </span>
                    </h1>
                    <p className='text-[13px] text-[#6B6B6B] mt-0.5'>View estate details, residents, and activity across this estate</p>
                </div>
                <div className='flex gap-3'>
                    <button onClick={() => router.push(`/admin/estates/${id}/edit`)}
                        className='h-[38px] px-5 border border-[#E8E8E8] text-[#1A1A1A] rounded-[8px] text-[13px] font-medium hover:bg-[#F5F5F5] transition-colors'>
                        Edit Estate
                    </button>
                    <button onClick={() => setShowSuspendConfirm(true)} disabled={suspending}
                        className={`h-[38px] px-5 rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-60
                            ${(estate?.isActive !== false) ? 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] border border-[#EF4444]' : 'bg-[#F0FFF4] text-[#38A169] hover:bg-[#DCFCE7] border border-[#38A169]'}`}>
                        {suspending ? '...' : (estate?.isActive !== false) ? 'Suspend Estate' : 'Activate Estate'}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 mb-6'>
                {[
                    { label: 'Total Resident', value: (estate?.totalResident || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#006AFF" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#006AFF" strokeWidth="1.5"/></svg>, bg: '#EEF5FF' },
                    { label: 'Active Users', value: estate?.activeUsers || 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F0FFF4' },
                    { label: 'Total transaction', value: `₦${(estate?.totalTransaction || 0).toLocaleString()}.00`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F5F3FF' },
                ].map((s, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4 flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: s.bg }}>{s.icon}</div>
                        <div>
                            <p className='text-[20px] font-bold text-[#1A1A1A]'>{s.value}</p>
                            <p className='text-[12px] text-[#6B6B6B]'>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className='flex gap-1 border-b border-[#F0F0F0] mb-4'>
                {(['residents', 'payments', 'activity'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 text-[13px] font-medium capitalize transition-colors
                            ${tab === t ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                        {t === 'activity' ? 'Activity Logs' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Residents tab */}
            {tab === 'residents' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <div className='px-5 py-3 border-b border-[#F0F0F0]'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Residents</h3>
                        <p className='text-[12px] text-[#9E9E9E]'>View residents associated with this estate</p>
                    </div>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Resident Name', 'Email', 'Unit', 'Role', 'Dependents', 'Date Joined', 'Status', 'Actions'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {residents.length === 0 ? (
                                <tr><td colSpan={8} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No residents found</td></tr>
                            ) : residents.map((r) => (
                                <tr key={r._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{r.residentName || `${r.firstName || ''} ${r.lastName || ''}`}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{r.email}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{r.unit || r.apartment || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{r.role || 'Resident'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A] text-center'>{r.dependents ?? 0}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(r.dateJoined || r.createdAt) ? new Date((r.dateJoined || r.createdAt)!).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${r.status === 'accepted' || r.isActive !== false ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                                            {r.status === 'accepted' || r.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <button onClick={() => r.userId ? router.push(`/admin/users/${r.userId}`) : toast.error('User ID not found')} className='text-[12px] text-[#006AFF] font-medium hover:underline'>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Payments tab */}
            {tab === 'payments' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Reference', 'Bill Type', 'Amount', 'Payment Type', 'Date Created', 'Payment Date', 'Status'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr><td colSpan={6} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No payments found</td></tr>
                            ) : payments.map((p) => (
                                <tr key={p._id} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[12px] text-[#6B6B6B] font-mono'>{p.referenceTransaction?.slice(-8) || p._id.slice(-8)}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A] capitalize'>{p.billType?.replace(/_/g, ' ').toLowerCase()}</td>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>₦{p.amount?.toLocaleString()}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B] capitalize'>{p.paymentType === 'in-app' ? 'Wallet' : p.paymentType || p.paymentMode || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>
                                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize
                                            ${p.status === 'paid' ? 'bg-[#E8F5E9] text-[#2E7D32]' : p.status === 'partialpaid' ? 'bg-[#EEF5FF] text-[#006AFF]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                                            {p.status === 'partialpaid' ? 'Partial' : p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Activity tab */}
            {tab === 'activity' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['User', 'Action', 'Target', 'Date', 'Time'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activity.length === 0 ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No activity found</td></tr>
                            ) : activity.map((a, i) => (
                                <tr key={i} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{a.user || a.actorName || a.userName || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.action || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.target || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.date ? new Date(a.date).toLocaleDateString() : a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.date ? new Date(a.date).toLocaleTimeString() : a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        {showSuspendConfirm && (
            <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-[16px] w-full max-w-[380px] p-6'>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${(estate?.isActive !== false) ? 'bg-[#FEF2F2]' : 'bg-[#F0FFF4]'}`}>
                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                            {(estate?.isActive !== false)
                                ? <path d='M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
                                : <path d='M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z' stroke='#38A169' strokeWidth='1.5' strokeLinecap='round'/>
                            }
                        </svg>
                    </div>
                    <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>
                        {(estate?.isActive !== false) ? 'Suspend this estate?' : 'Activate this estate?'}
                    </h3>
                    <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>
                        {(estate?.isActive !== false)
                            ? 'Residents and managers will lose access to this estate immediately.'
                            : 'This estate and its users will regain access to the platform.'}
                    </p>
                    <div className='flex gap-3'>
                        <button onClick={() => setShowSuspendConfirm(false)}
                            className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                            Cancel
                        </button>
                        <button onClick={async () => { setShowSuspendConfirm(false); await handleSuspend(); }} disabled={suspending}
                            className={`flex-1 h-[40px] rounded-[8px] text-[13px] font-semibold text-white disabled:opacity-50
                                ${(estate?.isActive !== false) ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#38A169] hover:bg-[#2F855A]'}`}>
                            {(estate?.isActive !== false) ? 'Yes, Suspend' : 'Yes, Activate'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}