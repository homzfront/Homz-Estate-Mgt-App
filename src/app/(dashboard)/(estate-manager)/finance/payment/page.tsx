/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import EmptyEstateState from '../../components/emptyEstateState';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import LoadingSpinner from '@/components/general/loadingSpinner';
import formatBillType from '@/app/utils/formatBillType';

interface BillSummaryRow {
  billType: string;
  billingId?: string;
  billName?: string;
  totalResidents: number;
  totalExpected: number;
  totalPaid: number;
  outstanding: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;
}

interface PaymentRecord {
  _id: string;
  billType: string;
  period: string;
  amount: number;
  amountPaid: number;
  status: string;
  paymentMode: string;
  paymentDate: string;
  referenceTransaction?: string;
  _residentId?: string;
}

const StatusBadge = ({ count, type }: { count: number; type: 'paid' | 'pending' | 'overdue' }) => {
  if (count === 0) return <span className="text-GrayHomz5 text-[11px]">—</span>;
  const styles = { paid: 'bg-successBg text-Success', pending: 'bg-warningBg text-warning2', overdue: 'bg-[#FEF3F2] text-error' };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[type]}`}>{count}</span>;
};

const PaymentModeBadge = ({ mode }: { mode: string }) => {
  if (mode === 'in-app') return <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EEF5FF] text-BlueHomz'>Wallet</span>;
  if (mode === 'offline') return <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#E65100]'>Offline</span>;
  return <span className='text-[11px] text-GrayHomz'>—</span>;
};

const Payment = () => {
  const router = useRouter();
  const ability = useAbility();
  React.useEffect(() => { if (!ability.can('read', 'finance')) router.push('/dashboard'); }, [ability, router]);

  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const [summary, setSummary] = React.useState<BillSummaryRow[]>([]);
  const [cachedBillPayments, setCachedBillPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [drillBillType, setDrillBillType] = React.useState<string | null>(null);
  const [drillBillName, setDrillBillName] = React.useState<string>('');
  const [drillRecords, setDrillRecords] = React.useState<PaymentRecord[]>([]);
  const [loadingDrill, setLoadingDrill] = React.useState(false);

  const orgId = selectedCommunity?.estate?.associatedIds?.organizationId;
  const estateId = selectedCommunity?.estate?._id;

  React.useEffect(() => {
    if (!orgId || !estateId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/community-manager/bill-payment/summary/organizations/${orgId}/estates/${estateId}`);
        const raw = res?.data?.data;

        if (!raw) { setSummary([]); return; }

        // Backend returns a SINGLE object (grouped across all bill types)
        // We reshape it into per-billType rows using the billPayments array
        if (Array.isArray(raw)) {
          setSummary(raw);
        } else if (raw.billPayments && Array.isArray(raw.billPayments)) {
          // Cache billPayments for drill-down use
          setCachedBillPayments(raw.billPayments);
          // Group by billingId (unique per bill creation) not billType (same name = same bucket)
          const byBillingId: Record<string, any> = {};
          for (const bp of raw.billPayments) {
            const key = String(bp.billingId);
            if (!byBillingId[key]) {
              byBillingId[key] = {
                billingId: key,
                billType: bp.billType || 'Unknown',
                totalResidents: new Set<string>(),
                totalExpected: 0,
                totalPaid: 0,
                outstanding: 0,
                pendingCount: 0,
                paidCount: 0,
                overdueCount: 0,
                seenPeriods: new Set<string>(),
              };
            }
            const row = byBillingId[key];
            const resId = String(bp.associatedIds?.residentId || '');
            // Each resident+period counted once for expected/status (multiple payment records per period are history)
            const periodKey = `${resId}_${bp.periodNumber}`;
            if (!row.seenPeriods.has(periodKey)) {
              row.seenPeriods.add(periodKey);
              if (resId) row.totalResidents.add(resId);
              row.totalExpected += bp.amount || 0;
              if (bp.periodStatus === 'pending') row.pendingCount++;
              if (bp.periodStatus === 'paid') row.paidCount++;
              if (bp.periodStatus === 'overdue') row.overdueCount++;
            }
            // amountPaid accumulates across all payment records for this period
            row.totalPaid += bp.amountPaid || 0;
          }
          const rows = Object.values(byBillingId).map((r: any) => ({
            billingId: r.billingId,
            billType: r.billType,
            totalResidents: r.totalResidents.size,
            totalExpected: r.totalExpected,
            totalPaid: Math.min(r.totalPaid, r.totalExpected),
            outstanding: Math.max(0, r.totalExpected - r.totalPaid),
            pendingCount: r.pendingCount,
            paidCount: r.paidCount,
            overdueCount: r.overdueCount,
          }));
          setSummary(rows.length > 0 ? rows : [{
            billType: 'All',
            totalResidents: raw.totalResidents || 0,
            totalExpected: raw.totalExpected || 0,
            totalPaid: raw.totalPaid || 0,
            outstanding: raw.outstanding || 0,
            pendingCount: raw.pendingCount || 0,
            paidCount: raw.paidCount || 0,
            overdueCount: raw.overdueCount || 0,
          }]);
        } else {
          // Fallback: single row with no billType breakdown
          setSummary([{
            billType: 'All',
            totalResidents: raw.totalResidents || 0,
            totalExpected: raw.totalExpected || 0,
            totalPaid: raw.totalPaid || 0,
            outstanding: raw.outstanding || 0,
            pendingCount: raw.pendingCount || 0,
            paidCount: raw.paidCount || 0,
            overdueCount: raw.overdueCount || 0,
          }]);
        }
      } catch { setSummary([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [estateId]);

  const [residentMap, setResidentMap] = React.useState<Record<string, string>>({});

  const handleDrillDown = async (billType: string, billName = '') => {
    if (!orgId || !estateId) return;
    setDrillBillType(billType);
    setDrillBillName(billName || billType);
    setLoadingDrill(true);
    try {
      // Use cached billPayments from the summary response (fast, no extra API calls)
      if (cachedBillPayments.length > 0) {
        const residentsRes = await api.get(
          `/community-manager/resident/all/organizations/${orgId}/estates/${estateId}?limit=100&page=1`
        );
        const residents = residentsRes?.data?.data?.results || [];
        const nameMap: Record<string, string> = {};
        residents.forEach((r: any) => {
          const name = `${r.firstName || ''} ${r.lastName || ''}`.trim() || r.email || 'Unknown';
          const apt = r.apartment ? ` · ${r.apartment}` : '';
          nameMap[r._id] = `${name}${apt}`;
        });
        setResidentMap(nameMap);

        const filtered = cachedBillPayments
          .filter((bp: any) => billType === 'All' || String(bp.billingId) === billType)
          .map((bp: any) => ({
            _id: bp._id,
            billType: bp.billType,
            period: bp.period,
            periodNumber: bp.periodNumber,
            amount: bp.amount,
            amountPaid: bp.amountPaid,
            status: bp.periodStatus,
            paymentMode: bp.paymentMode,
            paymentDate: bp.paymentDate || bp.updatedAt,
            referenceTransaction: bp.referenceTransaction,
            _residentId: String(bp.associatedIds?.residentId || ''),
          }))
          .sort((a: any, b: any) =>
            new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime()
          );

        setDrillRecords(filtered);
        setLoadingDrill(false);
        return;
      }

      // Fallback: fetch per-resident if no cached data
      const residentsRes = await api.get(
        `/community-manager/resident/all/organizations/${orgId}/estates/${estateId}?limit=100&page=1`
      );
      const residents = residentsRes?.data?.data?.results || [];
      const nameMap: Record<string, string> = {};
      residents.forEach((r: any) => {
        const name = `${r.firstName || ''} ${r.lastName || ''}`.trim() || r.email || 'Unknown';
        const apt = r.apartment ? ` · ${r.apartment}` : '';
        nameMap[r._id] = `${name}${apt}`;
      });
      setResidentMap(nameMap);

      const allRecords: PaymentRecord[] = [];
      await Promise.all(
        residents.slice(0, 20).map(async (r: any) => {
          try {
            const res = await api.get(
              `/community-manager/bill-payment/organizations/${orgId}/estates/${estateId}/residents/${r._id}?limit=50&page=1`
            );
            const records: PaymentRecord[] = res?.data?.data?.billing?.results || [];
            allRecords.push(...records
              .filter(p => billType === 'All' || p.billType === billType)
              .map(p => ({ ...p, _residentId: r._id }))
            );
          } catch { /* skip */ }
        })
      );

      setDrillRecords(allRecords.sort((a, b) =>
        new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime()
      ));
    } catch { setDrillRecords([]); }
    finally { setLoadingDrill(false); }
  };

  const summaryArr = Array.isArray(summary) ? summary : [];
  const totals = summaryArr.reduce(
    (acc, row) => ({
      totalResidents: acc.totalResidents + row.totalResidents,
      totalExpected: acc.totalExpected + row.totalExpected,
      totalPaid: acc.totalPaid + row.totalPaid,
      outstanding: acc.outstanding + row.outstanding,
      pendingCount: acc.pendingCount + row.pendingCount,
      paidCount: acc.paidCount + row.paidCount,
      overdueCount: acc.overdueCount + row.overdueCount,
    }),
    { totalResidents: 0, totalExpected: 0, totalPaid: 0, outstanding: 0, pendingCount: 0, paidCount: 0, overdueCount: 0 }
  );

  return (
    <div className='p-8 w-full'>
      {!selectedCommunity ? <EmptyEstateState /> : (
        <div>
          {/* Header */}
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6'>
            <div className='flex flex-col gap-1'>
              {drillBillType ? (
                <>
                  <button onClick={() => { setDrillBillType(null); setDrillRecords([]); setDrillBillName(''); }} className='flex items-center gap-1 text-[12px] text-GrayHomz hover:text-BlueHomz mb-1 w-fit'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Back to summary
                  </button>
                  <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>{(drillBillName || drillBillType || '').replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} — Payment Records</h2>
                  <p className='text-sm text-GrayHomz'>Individual payment records including payment mode (Wallet / Offline)</p>
                </>
              ) : (
                <>
                  <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>Payment Overview</h2>
                  <p className='text-sm text-GrayHomz'>Click any bill type to view individual payment records.</p>
                </>
              )}
            </div>
            {!loading && !drillBillType && summaryArr.length > 0 && ability.can('create', 'finance') && (
              <button
                onClick={() => {
                  const headers = ['Bill Type','Residents','Total Expected','Total Paid','Outstanding','Paid','Pending','Overdue'];
                  const rows = summaryArr.map(r => [formatBillType(r.billType),r.totalResidents,r.totalExpected,r.totalPaid,r.outstanding,r.paidCount,r.pendingCount,r.overdueCount]);
                  rows.push(['TOTAL','—',totals.totalExpected,totals.totalPaid,totals.outstanding,totals.paidCount,totals.pendingCount,totals.overdueCount]);
                  const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
                  const blob = new Blob([csv],{type:'text/csv'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href=url; a.download=`payments-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                  URL.revokeObjectURL(url);
                }}
                className='h-[37px] px-4 border border-BlueHomz text-BlueHomz text-sm font-medium rounded-[4px] flex items-center gap-2 hover:bg-whiteblue whitespace-nowrap'
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Export CSV
              </button>
            )}
          </div>

          {/* Drill-down view */}
          {drillBillType ? (
            loadingDrill ? (
              <div className='h-[400px] flex items-center justify-center'><LoadingSpinner size={40} /></div>
            ) : drillRecords.length === 0 ? (
              <div className='h-[300px] flex flex-col items-center justify-center gap-3'>
                <p className='text-BlueHomz font-medium text-[16px]'>No payment records found</p>
                <p className='text-sm text-GrayHomz'>No payments have been made for this bill type yet.</p>
              </div>
            ) : (
              <div className='border rounded-[8px] overflow-x-auto scrollbar-container'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-whiteblue h-[44px] text-[12px] font-semibold text-BlackHomz'>
                      <th className='text-left pl-4'>Resident</th>
                      <th className='text-left pl-4'>Period</th>
                      <th className='text-center px-4'>#</th>
                      <th className='text-right pr-4'>Bill Amount</th>
                      <th className='text-right pr-4'>Amount Paid</th>
                      <th className='text-center px-4'>Mode</th>
                      <th className='text-center px-4'>Status</th>
                      <th className='text-left pl-4'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drillRecords.map((p, i) => (
                      <tr key={`drill-${p._id}-${i}`} className='border-t hover:bg-gray-50 transition-colors'>
                        <td className='py-3 pl-4 text-[12px] text-BlackHomz font-medium'>{p._residentId && residentMap[p._residentId] ? residentMap[p._residentId] : '—'}</td>
                        <td className='py-3 pl-4 text-[12px] text-GrayHomz capitalize'>{p.period?.replace(/_/g, ' ') || '—'}</td>
                        <td className='py-3 px-4 text-center text-[12px] text-GrayHomz'>{(p as any).periodNumber ?? '—'}</td>
                        <td className='py-3 pr-4 text-right text-[12px] text-BlackHomz font-medium'>₦{(p.amount||0).toLocaleString()}</td>
                        <td className='py-3 pr-4 text-right text-[12px] text-Success font-medium'>₦{(p.amountPaid||0).toLocaleString()}</td>
                        <td className='py-3 px-4 text-center'><PaymentModeBadge mode={p.paymentMode} /></td>
                        <td className='py-3 px-4 text-center'>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize
                            ${p.status==='paid' ? 'bg-successBg text-Success' : p.status==='partialpaid' ? 'bg-[#EEF5FF] text-BlueHomz' : 'bg-warningBg text-warning2'}`}>
                            {p.status==='partialpaid'?'Partial':p.status}
                          </span>
                        </td>
                        <td className='py-3 pl-4 text-[11px] text-GrayHomz'>
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <>
              {/* Summary cards */}
              {!loading && summaryArr.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                  <div className='border-l-[3px] border-BlueHomz bg-whiteblue rounded-[8px] p-4'>
                    <p className='text-[11px] text-BlueHomz font-medium'>Total Expected</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>₦{totals.totalExpected.toLocaleString()}</p>
                  </div>
                  <div className='border-l-[3px] border-Success bg-successBg rounded-[8px] p-4'>
                    <p className='text-[11px] text-Success font-medium'>Total Collected</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>₦{totals.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className='border-l-[3px] border-error bg-[#FEF3F2] rounded-[8px] p-4'>
                    <p className='text-[11px] text-error font-medium'>Outstanding</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>₦{totals.outstanding.toLocaleString()}</p>
                  </div>
                  <div className='border-l-[3px] border-warning2 bg-warningBg rounded-[8px] p-4'>
                    <p className='text-[11px] text-warning2 font-medium'>Overdue Records</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>{totals.overdueCount}</p>
                  </div>
                </div>
              )}

              {/* Summary table */}
              {loading ? (
                <div className='h-[400px] flex items-center justify-center'><LoadingSpinner size={48} /></div>
              ) : summaryArr.length === 0 ? (
                <div className='h-[400px] flex flex-col items-center justify-center gap-3'>
                  <p className='text-BlueHomz font-medium text-[16px] md:text-[20px]'>No payment records yet</p>
                  <p className='text-sm text-GrayHomz text-center max-w-[400px]'>Payment records will appear here once residents start making payments.</p>
                </div>
              ) : (
                <div className='border rounded-[8px] overflow-x-auto scrollbar-container'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-whiteblue h-[50px] text-[12px] font-semibold text-BlackHomz'>
                        <th className='text-left pl-4 w-[180px]'>Bill Type</th>
                        <th className='text-right pr-4 hidden md:table-cell'>Residents</th>
                        <th className='text-right pr-4'>Total Expected</th>
                        <th className='text-right pr-4 hidden md:table-cell'>Total Paid</th>
                        <th className='text-right pr-4'>Outstanding</th>
                        <th className='text-center pr-4 hidden md:table-cell'>Paid</th>
                        <th className='text-center pr-4 hidden md:table-cell'>Pending</th>
                        <th className='text-center pr-4 hidden md:table-cell'>Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryArr.map((row, i) => (
                        <tr key={`sum-${i}`} onClick={() => handleDrillDown((row as any).billingId || row.billType, row.billType)} className='border-t hover:bg-[#F6F9FF] transition-colors cursor-pointer'>
                          <td className='py-4 pl-4 text-sm font-medium text-BlueHomz'>
                            <span className='flex items-center gap-1'>
                              {row.billType.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </span>
                          </td>
                          <td className='py-4 pr-4 text-right text-sm text-GrayHomz hidden md:table-cell'>{row.totalResidents}</td>
                          <td className='py-4 pr-4 text-right text-sm text-BlackHomz font-medium'>₦{row.totalExpected.toLocaleString()}</td>
                          <td className='py-4 pr-4 text-right text-sm text-Success font-medium hidden md:table-cell'>₦{row.totalPaid.toLocaleString()}</td>
                          <td className='py-4 pr-4 text-right text-sm text-error font-medium'>₦{row.outstanding.toLocaleString()}</td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.paidCount} type='paid'/></td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.pendingCount} type='pending'/></td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.overdueCount} type='overdue'/></td>
                        </tr>
                      ))}
                      <tr className='border-t bg-[#F8FAFF] font-semibold'>
                        <td className='py-4 pl-4 text-sm text-BlackHomz'>Total</td>
                        <td className='py-4 pr-4 text-right text-sm text-GrayHomz hidden md:table-cell'>—</td>
                        <td className='py-4 pr-4 text-right text-sm text-BlackHomz'>₦{totals.totalExpected.toLocaleString()}</td>
                        <td className='py-4 pr-4 text-right text-sm text-Success hidden md:table-cell'>₦{totals.totalPaid.toLocaleString()}</td>
                        <td className='py-4 pr-4 text-right text-sm text-error'>₦{totals.outstanding.toLocaleString()}</td>
                        <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={totals.paidCount} type='paid'/></td>
                        <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={totals.pendingCount} type='pending'/></td>
                        <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={totals.overdueCount} type='overdue'/></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;