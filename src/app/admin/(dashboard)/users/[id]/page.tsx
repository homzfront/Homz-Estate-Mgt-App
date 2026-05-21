'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'access' | 'payments' | 'activity';

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [tab, setTab] = useState<TabType>('overview');
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [userType, setUserType] = useState('');
    const [accessLogs, setAccessLogs] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [suspending, setSuspending] = useState(false);
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);

    useEffect(() => { fetchUser(); }, [id]);

    useEffect(() => {
        const onFocus = () => fetchUser();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [id]);
    useEffect(() => {
        if (!user) return;
        if (tab === 'access') fetchAccessLogs();
        else if (tab === 'payments') fetchPayments();
        else if (tab === 'activity') fetchActivity();
    }, [tab, user]);

    const fetchUser = async () => {
        try {
            const res = await api.get(`/admin/users/${id}`, { params: { _t: Date.now() } });
            const d = res.data?.data || res.data || {};
            setUser(d?.user || d);
            setProfile(d?.profile || null);
            setUserType(d?.type || 'USER');
        } catch { toast.error('Failed to load user'); }
        finally { setLoading(false); }
    };

    const fetchAccessLogs = async () => {
        try {
            const res = await api.get(`/admin/users/${id}/access-logs`, { params: { page: '1' } });
            const al = res.data?.data || res.data || {};
            setAccessLogs(al.results || al.data || []);
        } catch { setAccessLogs([]); }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get(`/admin/users/${id}/payments`, { params: { page: '1' } });
            const pay = res.data?.data || res.data || {};
            setPayments(pay.results || pay.data || []);
        } catch { setPayments([]); }
    };

    const fetchActivity = async () => {
        try {
            const res = await api.get(`/admin/users/${id}/activities`, { params: { page: '1' } });
            // Not wrapped in responseUtils - res.data IS the response
            const act = res.data?.data || res.data || {};
            const results = act.results || act.data || (Array.isArray(act) ? act : []);
            setActivity(results);
        } catch { setActivity([]); }
    };

    const handleSuspend = async () => {
        setSuspending(true);
        try {
            const res = await api.patch(`/admin/users/${id}/suspend`);
            const msg = res.data?.message || '';
            toast.success(msg || `User ${user?.isActive ? 'suspended' : 'activated'} successfully`);
            await fetchUser();
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to update status');
        }
        finally { setSuspending(false); }
    };

    // ── Profile field helpers based on type ──
    const getFirstName  = () => profile?.firstName  || profile?.personal?.firstName  || '';
    const getLastName   = () => profile?.lastName   || profile?.personal?.lastName   || '';
    const getPhone      = () => profile?.phoneNumber || profile?.personal?.phoneNumber || '—';
    const getEstate     = () => profile?.estateName || '—';
    const getRole       = () => profile?.role || '—';

    const getDisplayName = () => {
        const fn = getFirstName();
        const ln = getLastName();
        return fn ? `${fn} ${ln}`.trim() : user?.email || 'User';
    };

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='w-8 h-8 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
        </div>
    );

    const typeLabel: Record<string, string> = {
        ADMIN: 'Admin',
        COMMUNITY_MANAGER: 'Community Manager',
        RESIDENT: 'Resident',
    };

    return (
        <div className='p-6'>
            <button onClick={() => router.back()} className='flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#1A1A1A] mb-5'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 5l-7 7 7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                Back
            </button>

            {/* Header */}
            <div className='flex items-start justify-between mb-6'>
                <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 rounded-full bg-[#EEF5FF] flex items-center justify-center text-[#006AFF] font-bold text-[20px]'>
                        {getDisplayName()[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>{getDisplayName()}</h1>
                        <p className='text-[13px] text-[#6B6B6B]'>{user?.email}</p>
                        <div className='flex items-center gap-2 mt-1'>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${user?.isActive !== false ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                                {user?.isActive !== false ? 'Active' : 'Suspended'}
                            </span>
                            {userType && (
                                <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EEF5FF] text-[#006AFF]'>
                                    {typeLabel[userType] || userType}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <button onClick={() => setShowSuspendConfirm(true)} disabled={suspending}
                        className={`h-[36px] px-4 rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-60
                            ${user?.isActive !== false ? 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]' : 'bg-[#F0FFF4] text-[#38A169] hover:bg-[#DCFCE7]'}`}>
                        {suspending ? '...' : user?.isActive !== false ? 'Suspend User' : 'Activate User'}
                    </button>
                    <button onClick={() => router.push(`/admin/users/${id}/edit`)}
                        className='h-[36px] px-4 border border-[#E8E8E8] text-[#1A1A1A] rounded-[8px] text-[13px] hover:bg-[#F5F5F5]'>
                        Edit User
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-1 border-b border-[#F0F0F0] mb-5'>
                {(['overview', 'access', 'payments', 'activity'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 text-[13px] font-medium capitalize transition-colors
                            ${tab === t ? 'text-[#006AFF] border-b-2 border-[#006AFF]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}>
                        {t === 'access' ? 'Access Log' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* ── Overview ── */}
            {tab === 'overview' && (
                <div className='grid grid-cols-2 gap-5'>
                    {/* Left: profile-type-specific info */}
                    <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                        {userType === 'RESIDENT' && (
                            <>
                                <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Residence Details</h3>
                                <div className='space-y-3'>
                                    {[
                                        ['Estate',     getEstate()],
                                        ['Street',     profile?.streetName    || '—'],
                                        ['Building',   profile?.building      || '—'],
                                        ['Apartment',  profile?.apartment     || '—'],
                                        ['Residency',  profile?.residencyType || '—'],
                                        ['Ownership',  profile?.ownershipType || '—'],
                                        ['Zone',       profile?.zone          || '—'],
                                        ['Role',       getRole()],
                                    ].map(([k, v]) => (
                                        <div key={k} className='flex justify-between'>
                                            <span className='text-[13px] text-[#6B6B6B]'>{k}</span>
                                            <span className='text-[13px] font-medium text-[#1A1A1A] text-right max-w-[60%]'>{v}</span>
                                        </div>
                                    ))}
                                </div>
                                {profile?.dependents?.length > 0 && (
                                    <>
                                        <h3 className='text-[13px] font-semibold text-[#006AFF] mt-5 mb-3'>Dependents ({profile.dependents.length})</h3>
                                        <div className='space-y-2'>
                                            {profile.dependents.map((d: any, i: number) => (
                                                <div key={i} className='flex justify-between text-[13px] py-1'>
                                                    <span className='text-[#6B6B6B]'>{d.firstName} {d.lastName}</span>
                                                    <div className='flex gap-3 text-right'>
                                                        <span className='text-[#9E9E9E]'>{d.role || '—'}</span>
                                                        <span className='text-[#9E9E9E]'>{d.phoneNumber || ''}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {userType === 'COMMUNITY_MANAGER' && (
                            <>
                                <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Business Details</h3>
                                <div className='space-y-3'>
                                    {[
                                        ['Business Name',    profile?.business?.businessName    || profile?.businessName    || '—'],
                                        ['Business Address', profile?.business?.businessAddress || profile?.businessAddress || '—'],
                                        ['Phone',           getPhone()],
                                        ['Role',            getRole()],
                                    ].map(([k, v]) => (
                                        <div key={k} className='flex justify-between'>
                                            <span className='text-[13px] text-[#6B6B6B]'>{k}</span>
                                            <span className='text-[13px] font-medium text-[#1A1A1A] text-right max-w-[60%]'>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {userType === 'ADMIN' && (
                            <>
                                <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Admin Details</h3>
                                <div className='space-y-3'>
                                    {[
                                        ['Role',  profile?.role || '—'],
                                        ['Phone', getPhone()],
                                    ].map(([k, v]) => (
                                        <div key={k} className='flex justify-between'>
                                            <span className='text-[13px] text-[#6B6B6B]'>{k}</span>
                                            <span className='text-[13px] font-medium text-[#1A1A1A]'>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: account details (all types) */}
                    <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                        <h3 className='text-[13px] font-semibold text-[#006AFF] mb-4'>Account Details</h3>
                        <div className='space-y-3'>
                            {[
                                ['User ID',     `...${(user?._id || '').slice(-8)}`],
                                ['First Name',  getFirstName() || '—'],
                                ['Last Name',   getLastName()  || '—'],
                                ['Email',       user?.email    || '—'],
                                ['Phone',       getPhone()],
                                ['Verified',    user?.isVerified ? 'Yes' : 'No'],
                                ['Status',      user?.isActive !== false ? 'Active' : 'Suspended'],
                                ['Date Joined', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—'],
                            ].map(([k, v]) => (
                                <div key={k} className='flex justify-between'>
                                    <span className='text-[13px] text-[#6B6B6B]'>{k}</span>
                                    <span className='text-[13px] font-medium text-[#1A1A1A] text-right max-w-[60%]'>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Access logs ── */}
            {tab === 'access' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <h3 className='px-5 py-3 text-[14px] font-semibold text-[#1A1A1A] border-b border-[#F0F0F0]'>Access Logs</h3>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Visitor', 'Purpose', 'Code', 'Date', 'Status'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {accessLogs.length === 0 ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No access logs found</td></tr>
                            ) : accessLogs.map((log, i) => (
                                <tr key={i} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{log.visitor || log.visitorName || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{log.purpose || '—'}</td>
                                    <td className='px-4 py-3 text-[12px] font-mono text-[#6B6B6B]'>{log.accessCode || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(log.arrivalDate || log.date || log.createdAt) ? new Date(log.arrivalDate || log.date || log.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize
                                            ${log.accessStatus === 'signed in' || log.status === 'SIGNEDIN' ? 'bg-[#E8F5E9] text-[#2E7D32]' : log.accessStatus === 'expired' || log.status === 'EXPIRED' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F5F5F5] text-[#6B6B6B]'}`}>
                                            {log.accessStatus || log.status || '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Payments ── */}
            {tab === 'payments' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <h3 className='px-5 py-3 text-[14px] font-semibold text-[#1A1A1A] border-b border-[#F0F0F0]'>Payments</h3>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Amount', 'Type', 'Reference', 'Date', 'Status'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No payments found</td></tr>
                            ) : payments.map((p, i) => (
                                <tr key={i} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>₦{(p.amount || p.amountPaid || p.totalAmount || 0).toLocaleString()}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B] capitalize'>{(p.category || p.type || p.billType || '—').toLowerCase().replace(/_/g, ' ')}</td>
                                    <td className='px-4 py-3 text-[12px] font-mono text-[#9E9E9E]'>{(p.referenceTransaction || p.reference || '').slice(-10) || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize
                                            ${p.status === 'SUCCESS' ? 'bg-[#E8F5E9] text-[#2E7D32]' : p.status === 'FAILED' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                                            {p.status?.toLowerCase() || '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Activity ── */}
            {tab === 'activity' && (
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <h3 className='px-5 py-3 text-[14px] font-semibold text-[#1A1A1A] border-b border-[#F0F0F0]'>Activity Logs</h3>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Action', 'Target', 'Estate', 'Date', 'Time'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activity.length === 0 ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No activity found</td></tr>
                            ) : activity.map((a, i) => (
                                <tr key={i} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{a.action || a.description || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.target || a.module || '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{(a.estateName && a.estateName !== 'N/A') ? a.estateName : '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#6B6B6B]'>{a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Suspend/Activate modal ── */}
            {showSuspendConfirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] w-full max-w-[380px] p-6'>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${user?.isActive !== false ? 'bg-[#FEF2F2]' : 'bg-[#F0FFF4]'}`}>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                                {user?.isActive !== false
                                    ? <path d='M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' stroke='#EF4444' strokeWidth='1.5' strokeLinecap='round'/>
                                    : <path d='M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z' stroke='#38A169' strokeWidth='1.5' strokeLinecap='round'/>
                                }
                            </svg>
                        </div>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] text-center mb-1'>
                            {user?.isActive !== false ? 'Suspend this user?' : 'Activate this user?'}
                        </h3>
                        <p className='text-[13px] text-[#6B6B6B] text-center mb-6'>
                            {user?.isActive !== false
                                ? `${getDisplayName()} will lose access to the platform immediately.`
                                : `${getDisplayName()} will regain access to the platform.`}
                        </p>
                        <div className='flex gap-3'>
                            <button onClick={() => setShowSuspendConfirm(false)}
                                className='flex-1 h-[40px] border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#6B6B6B] hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={async () => { setShowSuspendConfirm(false); await handleSuspend(); }} disabled={suspending}
                                className={`flex-1 h-[40px] rounded-[8px] text-[13px] font-semibold text-white disabled:opacity-50 ${user?.isActive !== false ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#38A169] hover:bg-[#2F855A]'}`}>
                                {user?.isActive !== false ? 'Yes, Suspend' : 'Yes, Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}