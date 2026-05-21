'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/store/admin/useAdminStore';
import api from '@/utils/api';

/* ─── Simple SVG line chart ─────────────────────────────────── */
function SimpleLineChart({ data }: { data: { month: string; value: number }[] }) {
    if (!data || data.length === 0) return (
        <div className='w-full h-full flex items-center justify-center text-[12px] text-[#9E9E9E]'>No data yet</div>
    );
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const W = 480; const H = 160; const PAD = { t: 10, r: 10, b: 30, l: 50 };
    const chartW = W - PAD.l - PAD.r;
    const chartH = H - PAD.t - PAD.b;
    const x = (i: number) => data.length === 1 ? PAD.l + chartW / 2 : PAD.l + (i / (data.length - 1)) * chartW;
    const y = (v: number) => PAD.t + chartH - ((v - min) / (max - min || 1)) * chartH;
    const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className='w-full h-full'>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={PAD.l} x2={W - PAD.r}
                    y1={PAD.t + t * chartH} y2={PAD.t + t * chartH}
                    stroke="#F0F0F0" strokeWidth="1" />
            ))}
            {/* Line */}
            <polyline points={points} fill="none" stroke="#38A169" strokeWidth="2" strokeLinejoin="round" />
            {/* Area fill */}
            <polygon points={`${x(0)},${PAD.t + chartH} ${points} ${x(data.length - 1)},${PAD.t + chartH}`}
                fill="url(#lineGrad)" opacity="0.2" />
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38A169" />
                    <stop offset="100%" stopColor="#38A169" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Dots + hover */}
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={x(i)} cy={y(d.value)} r={hovered === i ? 5 : 3}
                        fill={hovered === i ? '#38A169' : 'white'} stroke="#38A169" strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
                    {hovered === i && (
                        <g>
                            <rect x={x(i) - 35} y={y(d.value) - 28} width="70" height="22" rx="4" fill="white" stroke="#E8E8E8" />
                            <text x={x(i)} y={y(d.value) - 13} textAnchor="middle" fontSize="10" fill="#38A169" fontWeight="600">
                                ₦{(d.value / 1000000).toFixed(1)}M
                            </text>
                        </g>
                    )}
                    {/* X labels */}
                    <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#9E9E9E">{d.month}</text>
                </g>
            ))}
            {/* Y labels */}
            {[0, 0.5, 1].map((t, i) => {
                const val = min + t * (max - min);
                return <text key={i} x={PAD.l - 5} y={PAD.t + (1 - t) * chartH + 4} textAnchor="end" fontSize="9" fill="#9E9E9E">
                    {val >= 1000000 ? `${(val / 1000000).toFixed(0)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
                </text>;
            })}
        </svg>
    );
}

/* ─── Simple SVG bar chart ──────────────────────────────────── */
function SimpleBarChart({ data }: { data: { month: string; residents: number }[] }) {
    if (!data || data.length === 0) return (
        <div className='w-full h-full flex items-center justify-center text-[12px] text-[#9E9E9E]'>No data yet</div>
    );
    const max = Math.max(...data.map(d => d.residents));
    const W = 480; const H = 160; const PAD = { t: 10, r: 10, b: 30, l: 45 };
    const chartW = W - PAD.l - PAD.r;
    const chartH = H - PAD.t - PAD.b;
    const barW = (chartW / data.length) * 0.55;
    const gap = chartW / data.length;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className='w-full h-full'>
            {[0, 0.5, 1].map((t, i) => (
                <line key={i} x1={PAD.l} x2={W - PAD.r}
                    y1={PAD.t + (1 - t) * chartH} y2={PAD.t + (1 - t) * chartH}
                    stroke="#F0F0F0" strokeWidth="1" />
            ))}
            {data.map((d, i) => {
                const barH = (d.residents / (max || 1)) * chartH;
                const bx = PAD.l + i * gap + (gap - barW) / 2;
                const by = PAD.t + chartH - barH;
                return (
                    <g key={i}>
                        <rect x={bx} y={by} width={barW} height={barH} fill="#006AFF" rx="2" opacity="0.85" />
                        <text x={bx + barW / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#9E9E9E">{d.month}</text>
                    </g>
                );
            })}
            {[0, 0.5, 1].map((t, i) => {
                const val = Math.round(t * max);
                return <text key={i} x={PAD.l - 5} y={PAD.t + (1 - t) * chartH + 4} textAnchor="end" fontSize="9" fill="#9E9E9E">{val}</text>;
            })}
        </svg>
    );
}

/* Real data loaded from API */

function ActivityIcon({ type }: { type: string }) {
    if (type === 'join') return (
        <div className='w-9 h-9 rounded-full bg-[#EEF5FF] flex items-center justify-center flex-shrink-0'>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#006AFF" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#006AFF" strokeWidth="1.5"/></svg>
        </div>
    );
    if (type === 'access') return (
        <div className='w-9 h-9 rounded-full bg-[#F0FFF4] flex items-center justify-center flex-shrink-0'>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="21" r="2" stroke="#38A169" strokeWidth="1.5"/><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
    );
    return (
        <div className='w-9 h-9 rounded-full bg-[#FFFBEB] flex items-center justify-center flex-shrink-0'>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#D97706" strokeWidth="1.5"/></svg>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { admin } = useAdminStore();
    const [stats, setStats] = useState({ estates: 0, residents: 0, activeUsers: 0, totalTxn: 0 });
    const [txnChart, setTxnChart] = useState<{month:string,value:number}[]>([]);
    const [chartMonths, setChartMonths] = useState(12);
    const [growthChart, setGrowthChart] = useState<{month:string,residents:number}[]>([]);
    const [recentPayments, setRecentPayments] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [attention, setAttention] = useState({ maintenance: 0, overdue: 0, joinRequests: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [subRes, walletRes, estateRes] = await Promise.allSettled([
                    api.get('/admin/subscriptions/summary'),
                    api.get('/admin/wallets/summary'),
                    api.get('/admin/estates'),
                ]);
                const sub    = subRes.status    === 'fulfilled' ? subRes.value.data?.data    : {};
                const wallet = walletRes.status === 'fulfilled' ? walletRes.value.data?.data : {};
                const estate = estateRes.status === 'fulfilled' ? estateRes.value.data?.data : {};
                setStats({
                    estates: estate?.total || 0,
                    residents:   sub?.totalSubscriptions  || 0,
                    activeUsers: sub?.activeSubscriptions || 0,
                    totalTxn:    wallet?.totalBalance     || 0,
                });
            } catch { /* use defaults */ }
        };

        const fetchAttention = async () => {
            try {
                const [mainRes, supportRes, usersRes] = await Promise.allSettled([
                    api.get('/admin/maintenance'),
                    api.get('/admin/support/summary'),
                    api.get('/admin/users', { params: { status: 'inactive' } }),
                ]);
                const main    = mainRes.status    === 'fulfilled' ? mainRes.value.data?.data    || {} : {};
                const support = supportRes.status === 'fulfilled' ? supportRes.value.data?.data || {} : {};
                const users   = usersRes.status   === 'fulfilled'
                    ? usersRes.value.data?.totalCount || usersRes.value.data?.data?.totalCount || 0
                    : 0;
                setAttention({
                    maintenance:  main?.totalCount       || 0,
                    overdue:      support?.pendingTickets || 0,
                    joinRequests: users,
                });
            } catch { /* silent */ }
        };

        const fetchCharts = async () => {
            try {
                const [txnRes, growthRes] = await Promise.allSettled([
                    api.get('/admin/wallets/charts/transactions', { params: { months: chartMonths } }),
                    api.get('/admin/wallets/charts/estates'),
                ]);
                if (txnRes.status === 'fulfilled') {
                    const d = txnRes.value.data?.data;
                    if (Array.isArray(d)) {
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        setTxnChart(d.map((item: any) => ({
                            month: months[(item.month - 1)] || String(item.month),
                            value: item.totalVolume || 0,
                        })));
                    }
                }
                if (growthRes.status === 'fulfilled') {
                    const d = growthRes.value.data?.data;
                    if (Array.isArray(d)) {
                        setGrowthChart(d.map((item: any) => ({
                            month: (item.estateName || 'Unknown').substring(0, 10),
                            residents: item.totalPayments || 0,
                        })));
                    }
                }
            } catch { /* silent */ }
        };

        const fetchLists = async () => {
            try {
                const [paymentsRes, activitiesRes] = await Promise.allSettled([
                    api.get('/admin/wallets/transactions'),
                    api.get('/admin/activities'),
                ]);
                if (paymentsRes.status === 'fulfilled') {
                    const d = paymentsRes.value.data?.data?.results || paymentsRes.value.data?.results || [];
                    setRecentPayments(Array.isArray(d) ? d.slice(0, 5).map((p: any) => ({
                        name:   p.userName   || p.estateName || 'Unknown',
                        type:   p.category   || p.type       || '—',
                        amount: p.amount     || 0,
                        date:   p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—',
                    })) : []);
                }
                if (activitiesRes.status === 'fulfilled') {
                    const d = activitiesRes.value.data?.data?.results || activitiesRes.value.data?.results || [];
                    setRecentActivities(Array.isArray(d) ? d.slice(0, 5).map((a: any) => ({
                        name:   a.user     || a.actorName || 'System',
                        action: typeof a.action === 'string' ? a.action : (typeof a.description === 'string' ? a.description : 'Activity'),
                        type:   (a.action || '').toLowerCase().includes('access') ? 'access'
                              : (a.action || '').toLowerCase().includes('join')   ? 'join'
                              : 'maintenance',
                        date:   a.date ? new Date(a.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
                              : a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—',
                    })) : []);
                }
            } catch { /* silent */ }
        };

        fetchStats();
        fetchCharts();
        fetchLists();
        fetchAttention();
    }, [chartMonths]);

    const statCards = [
        {
            label: 'Total Estates', value: stats.estates,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 22V9l9-7 9 7v13" stroke="#F97316" strokeWidth="1.5"/><path d="M9 22V16h6v6" stroke="#F97316" strokeWidth="1.5"/></svg>,
            bg: '#FFF7ED',
        },
        {
            label: 'Total Subscriptions', value: stats.residents.toLocaleString(),
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#006AFF" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#006AFF" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#006AFF" strokeWidth="1.5"/></svg>,
            bg: '#EEF5FF',
        },
        {
            label: 'Active Subscriptions', value: stats.activeUsers,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            bg: '#F0FFF4',
        },
        {
            label: 'Total Wallet Balance',
            value: `₦${stats.totalTxn.toLocaleString()}.00`,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            bg: '#F5F3FF',
        },
    ];

    return (
        <div className='p-6 space-y-6'>
            <div>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-[#EEF5FF] flex items-center justify-center'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/>
                            <circle cx='12' cy='7' r='4' stroke='#006AFF' strokeWidth='1.5'/>
                        </svg>
                    </div>
                    <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Hello, Admin</h1>
                </div>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Welcome back! Here&apos;s the current status across all estate</p>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-4 gap-4'>
                {statCards.map((card, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center mb-3' style={{ background: card.bg }}>
                            {card.icon}
                        </div>
                        <p className='text-[22px] font-bold text-[#1A1A1A]'>{card.value}</p>
                        <p className='text-[12px] text-[#6B6B6B] mt-0.5'>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Attention */}
            <div className='bg-[#FFF8F3] border border-[#FFE4CC] rounded-[10px] p-5'>
                <h2 className='text-[15px] font-semibold text-[#1A1A1A] mb-1'>Items Requiring Attention</h2>
                <p className='text-[12px] text-[#6B6B6B] mb-4'>Quick overview of maintenance, overdue payments, and pending join requests.</p>
                <div className='grid grid-cols-3 gap-4'>
                    {[
                        { label: 'Maintenance Requests', value: attention.maintenance, href: '/admin/support/maintenance' },
                        { label: 'Overdue Payments', value: attention.overdue, href: '/admin/transactions' },
                        { label: 'New Users', value: attention.joinRequests, href: '/admin/users?status=inactive' },
                    ].map((item, i) => (
                        <Link key={i} href={item.href}
                            className='bg-white border border-[#F0F0F0] rounded-[8px] p-4 flex items-center gap-3 hover:border-[#006AFF] transition-colors'>
                            <div className='w-10 h-10 rounded-[8px] bg-[#FFF0E6] flex items-center justify-center flex-shrink-0'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 22V9l9-7 9 7v13" stroke="#F97316" strokeWidth="1.5"/></svg>
                            </div>
                            <div>
                                <p className='text-[20px] font-bold text-[#1A1A1A] leading-none'>{item.value}</p>
                                <p className='text-[12px] text-[#6B6B6B] mt-0.5'>{item.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-2 gap-5'>
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Transaction Overview</h3>
                            <p className='text-[11px] text-[#9E9E9E]'>Track total transaction volume over time</p>
                        </div>
                        <select
                            value={chartMonths}
                            onChange={e => setChartMonths(Number(e.target.value))}
                            className='text-[12px] border border-[#E8E8E8] rounded-[6px] px-2 py-1 text-[#6B6B6B] focus:outline-none'>
                            <option value={12}>12 months</option>
                            <option value={6}>6 months</option>
                            <option value={3}>3 months</option>
                        </select>
                    </div>
                    <div className='h-[180px]'>
                        <SimpleLineChart data={txnChart} />
                    </div>
                </div>

                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='mb-3'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Top Estates by Volume</h3>
                        <p className='text-[11px] text-[#9E9E9E]'>Top estates ranked by total payment volume</p>
                    </div>
                    <div className='h-[180px]'>
                        <SimpleBarChart data={growthChart} />
                    </div>
                </div>
            </div>

            {/* Recent payments + activities */}
            <div className='grid grid-cols-2 gap-5'>
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Recent Payments</h3>
                        <Link href='/admin/transactions' className='text-[12px] text-[#006AFF] hover:underline flex items-center gap-1'>
                            View All <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </Link>
                    </div>
                    <div className='space-y-3'>
                        {recentPayments.map((p, i) => (
                            <div key={i} className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-full bg-[#F0FFF4] flex items-center justify-center flex-shrink-0'>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-[13px] font-medium text-[#1A1A1A] truncate'>{p.name}</p>
                                    <p className='text-[11px] text-[#9E9E9E]'>{p.type}</p>
                                </div>
                                <div className='text-right flex-shrink-0'>
                                    <p className='text-[13px] font-semibold text-[#1A1A1A]'>₦{p.amount.toLocaleString()}</p>
                                    <p className='text-[11px] text-[#9E9E9E]'>~ {p.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Recent Activities</h3>
                        <Link href='/admin/activity' className='text-[12px] text-[#006AFF] hover:underline flex items-center gap-1'>
                            View All <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </Link>
                    </div>
                    <div className='space-y-3'>
                        {recentActivities.map((a, i) => (
                            <div key={i} className='flex items-center gap-3'>
                                <ActivityIcon type={a.type} />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-[13px] font-medium text-[#1A1A1A] truncate'>{a.name}</p>
                                    <p className='text-[11px] text-[#9E9E9E]'>{a.action}</p>
                                </div>
                                <p className='text-[11px] text-[#9E9E9E] flex-shrink-0'>~ {a.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}