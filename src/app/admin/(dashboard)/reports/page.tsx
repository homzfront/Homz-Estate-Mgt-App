'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';



function LineChart({ data }: { data: { month: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const W = 460; const H = 180; const PAD = { t: 10, r: 10, b: 28, l: 48 };
    const cW = W - PAD.l - PAD.r; const cH = H - PAD.t - PAD.b;
    const x = (i: number) => PAD.l + (i / (data.length - 1)) * cW;
    const y = (v: number) => PAD.t + cH - ((v - min) / (max - min || 1)) * cH;
    const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
    const [hov, setHov] = useState<number | null>(null);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className='w-full h-full'>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => <line key={i} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + t * cH} y2={PAD.t + t * cH} stroke="#F0F0F0" strokeWidth="1" />)}
            <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38A169" /><stop offset="100%" stopColor="#38A169" stopOpacity="0" /></linearGradient></defs>
            <polygon points={`${x(0)},${PAD.t + cH} ${pts} ${x(data.length - 1)},${PAD.t + cH}`} fill="url(#rg)" opacity="0.15" />
            <polyline points={pts} fill="none" stroke="#38A169" strokeWidth="2" strokeLinejoin="round" />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={x(i)} cy={y(d.value)} r={hov === i ? 5 : 3} fill={hov === i ? '#38A169' : 'white'} stroke="#38A169" strokeWidth="2" style={{ cursor: 'pointer' }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
                    {hov === i && <><rect x={x(i) - 36} y={y(d.value) - 26} width="72" height="20" rx="4" fill="white" stroke="#E8E8E8" /><text x={x(i)} y={y(d.value) - 12} textAnchor="middle" fontSize="9" fill="#38A169" fontWeight="600">₦{(d.value / 1000000).toFixed(1)}M</text></>}
                    <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d.month}</text>
                </g>
            ))}
            {[0, 0.5, 1].map((t, i) => { const v = min + t * (max - min); return <text key={i} x={PAD.l - 4} y={PAD.t + (1 - t) * cH + 4} textAnchor="end" fontSize="8" fill="#9E9E9E">{v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 1000).toFixed(0)}K`}</text>; })}
        </svg>
    );
}

function BarChart({ data }: { data: { name: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value));
    const W = 440; const H = 180; const PAD = { t: 10, r: 10, b: 28, l: 48 };
    const cW = W - PAD.l - PAD.r; const cH = H - PAD.t - PAD.b;
    const barW = (cW / data.length) * 0.55;
    const gap = cW / data.length;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className='w-full h-full'>
            {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + (1 - t) * cH} y2={PAD.t + (1 - t) * cH} stroke="#F0F0F0" strokeWidth="1" />)}
            {data.map((d, i) => {
                const bH = (d.value / (max || 1)) * cH;
                const bx = PAD.l + i * gap + (gap - barW) / 2;
                return (
                    <g key={i}>
                        <rect x={bx} y={PAD.t + cH - bH} width={barW} height={bH} fill="#006AFF" rx="2" opacity="0.85" />
                        <text x={bx + barW / 2} y={H - 6} textAnchor="middle" fontSize="8" fill="#9E9E9E">{d.name}</text>
                    </g>
                );
            })}
            {[0, 0.5, 1].map((t, i) => { const v = Math.round(t * max); return <text key={i} x={PAD.l - 4} y={PAD.t + (1 - t) * cH + 4} textAnchor="end" fontSize="8" fill="#9E9E9E">{v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 1000).toFixed(0)}K`}</text>; })}
        </svg>
    );
}

interface ReportRow { estateName: string; totalPayments: number; transactions: number; totalResidents: number; activeResidents: number; }

export default function AdminReportsPage() {
    const [stats, setStats] = useState({ totalPayments: 0, totalTxn: 0, activeUsers: 0 });
    const [rows, setRows] = useState<ReportRow[]>([]);
    const [txnChartData, setTxnChartData] = useState<{month: string; value: number}[]>([]);
    const [estateChartData, setEstateChartData] = useState<{name: string; value: number}[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [walletSummary, estateCharts, txnCharts, userRes] = await Promise.allSettled([
                    api.get('/admin/wallets/summary'),
                    api.get('/admin/wallets/charts/estates', { params: { top: 10 } }),
                    api.get('/admin/wallets/charts/transactions', { params: { months: 12 } }),
                    api.get('/admin/users', { params: { limit: 1, status: 'active' } }),
                ]);
                // wallet summary: { totalBalance, activeCount, inactiveCount }
                const ws = walletSummary.status === 'fulfilled' ? walletSummary.value.data?.data || {} : {};
                // estate charts: [{ estateName, totalPayments, transactionCount, totalResidents, activeResidents }]
                const ec = estateCharts.status === 'fulfilled' ? (estateCharts.value.data?.data || []) : [];
                // txn charts: [{ month, totalVolume }] or [{ month, value }]
                const tc = txnCharts.status === 'fulfilled' ? (txnCharts.value.data?.data || []) : [];
                const ur = userRes.status === 'fulfilled' ? userRes.value.data || {} : {};

                // Total payments = sum of all estate totalPayments
                const totalPay = Array.isArray(ec) ? ec.reduce((sum: number, e: any) => sum + (e.totalPayments || 0), 0) : 0;
                const totalTxns = Array.isArray(ec) ? ec.reduce((sum: number, e: any) => sum + (e.transactionCount || 0), 0) : 0;

                setStats({
                    totalPayments: totalPay,
                    totalTxn: totalTxns,
                    activeUsers: ur.totalCount || ur.total || 0,
                });

                // txn chart data
                setTxnChartData(Array.isArray(tc) ? tc.map((t: any) => ({
                    month: t.month || `${t._id?.month}/${t._id?.year}` || '',
                    value: t.totalVolume || t.value || 0,
                })) : []);

                // estate bar chart
                const top5 = Array.isArray(ec) ? ec.slice(0, 5) : [];
                setEstateChartData(top5.map((e: any) => ({
                    name: e.estateName || 'N/A',
                    value: e.totalPayments || 0,
                })));

                // report rows
                setRows(Array.isArray(ec) ? ec.map((e: any) => ({
                    estateName: e.estateName || 'N/A',
                    totalPayments: e.totalPayments || 0,
                    transactions: e.transactionCount || 0,
                    totalResidents: e.totalResidents || 0,
                    activeResidents: e.activeResidents || 0,
                })) : []);
            } catch { /* use defaults */ }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const exportCSV = () => {
        const headers = ['Estate', 'Total Payments', 'Transactions', 'Total Residents', 'Active Residents'];
        const data = rows.map(r => [r.estateName, r.totalPayments, r.transactions, r.totalResidents, r.activeResidents]);
        const csv = [headers, ...data].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `report-${new Date().toISOString().split('T')[0]}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-[20px] font-semibold text-[#1A1A1A]'>Reports</h1>
                <p className='text-[13px] text-[#6B6B6B] mt-0.5'>Analyze payment activity, user trends and estate performance across the platform</p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4'>
                {[
                    { label: 'Total Payments', value: `₦${(stats.totalPayments || 0).toLocaleString()}.00`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F5F3FF' },
                    { label: 'Total No. of transactions', value: (stats.totalTxn || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F5F3FF' },
                    { label: 'Active Users', value: (stats.activeUsers || 0).toLocaleString(), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#38A169" strokeWidth="1.5"/><polyline points="22,4 12,14.01 9,11.01" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/></svg>, bg: '#F0FFF4' },
                ].map((c, i) => (
                    <div key={i} className='bg-white border border-[#F0F0F0] rounded-[10px] p-4 flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: c.bg }}>{c.icon}</div>
                        <div>
                            <p className='text-[20px] font-bold text-[#1A1A1A]'>{c.value}</p>
                            <p className='text-[12px] text-[#6B6B6B]'>{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className='grid grid-cols-2 gap-5'>
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Transaction Overview</h3>
                            <p className='text-[11px] text-[#9E9E9E]'>Track total transaction volume over time</p>
                        </div>
                        <select className='text-[12px] border border-[#E8E8E8] rounded-[6px] px-2 py-1 text-[#6B6B6B] focus:outline-none'>
                            <option>12 months</option><option>6 months</option><option>3 months</option>
                        </select>
                    </div>
                    <div className='h-[180px]'><LineChart data={txnChartData} /></div>
                </div>
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] p-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Payment by Estate</h3>
                            <p className='text-[11px] text-[#9E9E9E]'>Shows top performing estates based on total payments</p>
                        </div>
                        <select className='text-[12px] border border-[#E8E8E8] rounded-[6px] px-2 py-1 text-[#6B6B6B] focus:outline-none'>
                            <option>Top 5</option><option>Top 10</option>
                        </select>
                    </div>
                    <div className='h-[180px]'><BarChart data={estateChartData} /></div>
                </div>
            </div>

            {/* Breakdown table */}
            <div>
                <div className='flex items-center justify-between mb-3'>
                    <div>
                        <h3 className='text-[16px] font-semibold text-[#1A1A1A]'>Report Breakdown</h3>
                        <p className='text-[12px] text-[#6B6B6B]'>Detailed view of payments and activity across estates</p>
                    </div>
                    <button onClick={exportCSV} className='h-[36px] px-4 border border-[#006AFF] text-[#006AFF] rounded-[8px] text-[12px] font-medium hover:bg-[#EEF5FF] transition-colors'>
                        Export CSV
                    </button>
                </div>
                <div className='bg-white border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[#FAFAFA] border-b border-[#F0F0F0]'>
                                {['Estate', 'Total Payments', 'Transactions', 'Total residents', 'Active residents'].map(h => (
                                    <th key={h} className='text-left px-4 py-3 text-[12px] font-semibold text-[#6B6B6B]'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>Loading...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#9E9E9E]'>No report data available</td></tr>
                            ) : rows.map((r, i) => (
                                <tr key={i} className='border-b border-[#F8F8F8] hover:bg-[#FAFAFA]'>
                                    <td className='px-4 py-3 text-[13px] font-medium text-[#1A1A1A]'>{r.estateName}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>₦{r.totalPayments?.toLocaleString()}.00</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{r.transactions?.toLocaleString()}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{r.totalResidents?.toLocaleString()}</td>
                                    <td className='px-4 py-3 text-[13px] text-[#1A1A1A]'>{r.activeResidents?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}