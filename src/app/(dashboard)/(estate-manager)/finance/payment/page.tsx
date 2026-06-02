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
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

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

interface FeeEntry {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: string;
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

const fmt = (n: number) => `₦${n.toLocaleString()}`;
const genRef = () => `FIN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;

const Payment = () => {
  const router = useRouter();
  const ability = useAbility();
  const { canUse, promptUpgrade } = useSubscriptionStore();
  React.useEffect(() => { if (!ability.can('read', 'finance')) router.push('/dashboard'); }, [ability, router]);

  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const [summary, setSummary] = React.useState<BillSummaryRow[]>([]);
  const [cachedBillPayments, setCachedBillPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [drillBillType, setDrillBillType] = React.useState<string | null>(null);
  const [drillBillName, setDrillBillName] = React.useState<string>('');
  const [drillRecords, setDrillRecords] = React.useState<PaymentRecord[]>([]);
  const [loadingDrill, setLoadingDrill] = React.useState(false);

  // Export modal state
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportLoading, setExportLoading] = React.useState(false);

  // Generate Statement modal state
  const [showStatementModal, setShowStatementModal] = React.useState(false);
  const [statementStep, setStatementStep] = React.useState<'ask-fees' | 'enter-fees' | 'preview'>('ask-fees');
  const [includeFees, setIncludeFees] = React.useState<boolean | null>(null);
  const [fees, setFees] = React.useState<FeeEntry[]>([{ id: '1', name: '', type: 'fixed', value: '' }]);
  const [statementRef] = React.useState(genRef());
  const [generatingStatement, setGeneratingStatement] = React.useState(false);

  const orgId = selectedCommunity?.estate?.associatedIds?.organizationId;
  const estateId = selectedCommunity?.estate?._id;
  const estateName = selectedCommunity?.estate?.basicDetails?.name || 'Estate';

  React.useEffect(() => {
    if (!orgId || !estateId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/community-manager/bill-payment/summary/organizations/${orgId}/estates/${estateId}`);
        const raw = res?.data?.data;
        if (!raw) { setSummary([]); return; }
        if (Array.isArray(raw)) {
          setSummary(raw);
        } else if (raw.billPayments && Array.isArray(raw.billPayments)) {
          setCachedBillPayments(raw.billPayments);
          const byBillingId: Record<string, any> = {};
          for (const bp of raw.billPayments) {
            const key = String(bp.billingId);
            if (!byBillingId[key]) {
              byBillingId[key] = { billingId: key, billType: bp.billType || 'Unknown', totalResidents: new Set<string>(), totalExpected: 0, totalPaid: 0, outstanding: 0, pendingCount: 0, paidCount: 0, overdueCount: 0, seenPeriods: new Set<string>() };
            }
            const row = byBillingId[key];
            const resId = String(bp.associatedIds?.residentId || '');
            const periodKey = `${resId}_${bp.periodNumber}`;
            if (!row.seenPeriods.has(periodKey)) {
              row.seenPeriods.add(periodKey);
              if (resId) row.totalResidents.add(resId);
              row.totalExpected += bp.amount || 0;
              if (bp.periodStatus === 'pending') row.pendingCount++;
              if (bp.periodStatus === 'paid') row.paidCount++;
              if (bp.periodStatus === 'overdue') row.overdueCount++;
            }
            row.totalPaid += bp.amountPaid || 0;
          }
          const rows = Object.values(byBillingId).map((r: any) => ({
            billingId: r.billingId, billType: r.billType, totalResidents: r.totalResidents.size,
            totalExpected: r.totalExpected, totalPaid: Math.min(r.totalPaid, r.totalExpected),
            outstanding: Math.max(0, r.totalExpected - r.totalPaid),
            pendingCount: r.pendingCount, paidCount: r.paidCount, overdueCount: r.overdueCount,
          }));
          setSummary(rows.length > 0 ? rows : [{ billType: 'All', totalResidents: raw.totalResidents || 0, totalExpected: raw.totalExpected || 0, totalPaid: raw.totalPaid || 0, outstanding: raw.outstanding || 0, pendingCount: raw.pendingCount || 0, paidCount: raw.paidCount || 0, overdueCount: raw.overdueCount || 0 }]);
        } else {
          setSummary([{ billType: 'All', totalResidents: raw.totalResidents || 0, totalExpected: raw.totalExpected || 0, totalPaid: raw.totalPaid || 0, outstanding: raw.outstanding || 0, pendingCount: raw.pendingCount || 0, paidCount: raw.paidCount || 0, overdueCount: raw.overdueCount || 0 }]);
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
      if (cachedBillPayments.length > 0) {
        const residentsRes = await api.get(`/community-manager/resident/all/organizations/${orgId}/estates/${estateId}?limit=100&page=1`);
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
          .map((bp: any) => ({ _id: bp._id, billType: bp.billType, period: bp.period, periodNumber: bp.periodNumber, amount: bp.amount, amountPaid: bp.amountPaid, status: bp.periodStatus, paymentMode: bp.paymentMode, paymentDate: bp.paymentDate || bp.updatedAt, referenceTransaction: bp.referenceTransaction, _residentId: String(bp.associatedIds?.residentId || '') }))
          .sort((a: any, b: any) => new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime());
        setDrillRecords(filtered);
        setLoadingDrill(false);
        return;
      }
      const residentsRes = await api.get(`/community-manager/resident/all/organizations/${orgId}/estates/${estateId}?limit=100&page=1`);
      const residents = residentsRes?.data?.data?.results || [];
      const nameMap: Record<string, string> = {};
      residents.forEach((r: any) => {
        const name = `${r.firstName || ''} ${r.lastName || ''}`.trim() || r.email || 'Unknown';
        const apt = r.apartment ? ` · ${r.apartment}` : '';
        nameMap[r._id] = `${name}${apt}`;
      });
      setResidentMap(nameMap);
      const allRecords: PaymentRecord[] = [];
      await Promise.all(residents.slice(0, 20).map(async (r: any) => {
        try {
          const res = await api.get(`/community-manager/bill-payment/organizations/${orgId}/estates/${estateId}/residents/${r._id}?limit=50&page=1`);
          const records: PaymentRecord[] = res?.data?.data?.billing?.results || [];
          allRecords.push(...records.filter(p => billType === 'All' || p.billType === billType).map(p => ({ ...p, _residentId: r._id })));
        } catch { /* skip */ }
      }));
      setDrillRecords(allRecords.sort((a, b) => new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime()));
    } catch { setDrillRecords([]); }
    finally { setLoadingDrill(false); }
  };

  const summaryArr = Array.isArray(summary) ? summary : [];
  const totals = summaryArr.reduce(
    (acc, row) => ({ totalResidents: acc.totalResidents + row.totalResidents, totalExpected: acc.totalExpected + row.totalExpected, totalPaid: acc.totalPaid + row.totalPaid, outstanding: acc.outstanding + row.outstanding, pendingCount: acc.pendingCount + row.pendingCount, paidCount: acc.paidCount + row.paidCount, overdueCount: acc.overdueCount + row.overdueCount }),
    { totalResidents: 0, totalExpected: 0, totalPaid: 0, outstanding: 0, pendingCount: 0, paidCount: 0, overdueCount: 0 }
  );

  // ── Export handler ──────────────────────────────────────────────────────────
  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    if (!orgId || !estateId) return;
    setExportLoading(true);
    try {
      const res = await api.get(
        `/community-manager/bill-payment/${format}/export-statements/organizations/${orgId}/estates/${estateId}`,
        { responseType: 'blob' }
      );
      const mimeMap = { csv: 'text/csv', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pdf: 'application/pdf' };
      const blob = new Blob([res.data], { type: mimeMap[format] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${estateName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch {
      // Fallback to frontend CSV if backend fails
      if (format === 'csv') {
        const headers = ['Bill Type', 'Residents', 'Total Expected', 'Total Paid', 'Outstanding', 'Paid', 'Pending', 'Overdue'];
        const rows = summaryArr.map(r => [formatBillType(r.billType), r.totalResidents, r.totalExpected, r.totalPaid, r.outstanding, r.paidCount, r.pendingCount, r.overdueCount]);
        rows.push(['TOTAL', '—', totals.totalExpected, totals.totalPaid, totals.outstanding, totals.paidCount, totals.pendingCount, totals.overdueCount]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportModal(false);
      }
    } finally {
      setExportLoading(false);
    }
  };

  // ── Generate Statement handler ───────────────────────────────────────────────
  const calcFees = () => {
    return fees.filter(f => f.name && f.value).map(f => {
      const val = parseFloat(f.value) || 0;
      const amount = f.type === 'percentage' ? (totals.totalPaid * val) / 100 : val;
      return { ...f, amount };
    });
  };

  const totalFees = calcFees().reduce((sum, f) => sum + f.amount, 0);
  const netAmount = totals.totalPaid - totalFees;

  const addFee = () => setFees(prev => [...prev, { id: Date.now().toString(), name: '', type: 'fixed', value: '' }]);
  const removeFee = (id: string) => setFees(prev => prev.filter(f => f.id !== id));
  const updateFee = (id: string, field: keyof FeeEntry, value: string) => setFees(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));

  const generateStatementPDF = () => {
    setGeneratingStatement(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const computedFees = calcFees();

    const feesHTML = includeFees && computedFees.length > 0 ? `
      <div class="section">
        <div class="section-title">FEE BREAKDOWN</div>
        <table>
          <thead><tr><th>Fee Name</th><th>Type</th><th style="text-align:right">Amount (₦)</th></tr></thead>
          <tbody>
            ${computedFees.map(f => `<tr><td>${f.name}</td><td>${f.type === 'fixed' ? 'Fixed Amount' : `${f.value}%`}</td><td style="text-align:right">${f.amount.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="total-row"><span>Total Fees Deducted</span><span>₦${totalFees.toLocaleString()}</span></div>
      </div>
      <div class="section">
        <div class="section-title">NET COLLECTION SUMMARY</div>
        <table>
          <thead><tr><th>Description</th><th style="text-align:right">Amount (₦)</th></tr></thead>
          <tbody>
            <tr><td>Total Amount Collected</td><td style="text-align:right">${totals.totalPaid.toLocaleString()}</td></tr>
            <tr><td>Less: Total Fees</td><td style="text-align:right">(${totalFees.toLocaleString()})</td></tr>
            <tr class="highlight"><td><strong>Net Amount After Fees</strong></td><td style="text-align:right"><strong>${netAmount.toLocaleString()}</strong></td></tr>
          </tbody>
        </table>
      </div>` : '';

    const origin = window.location.origin;
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Financial Collection Statement</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; }
  /* ── Top navbar ── */
  .navbar { background: #003580; padding: 12px 40px; display: flex; align-items: center; justify-content: space-between; }
  .navbar img { height: 28px; }
  .navbar-right { color: rgba(255,255,255,0.7); font-size: 11px; }
  /* ── Content ── */
  .content { padding: 32px 40px; }
  .doc-header { border-bottom: 2px solid #003580; padding-bottom: 16px; margin-bottom: 24px; }
  .doc-header h1 { font-size: 16px; font-weight: bold; color: #003580; margin: 0 0 8px; letter-spacing: 1px; }
  .header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; color: #555; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 12px; font-weight: bold; color: #003580; background: #f0f4ff; padding: 6px 10px; margin-bottom: 0; border-left: 3px solid #003580; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f8f8f8; padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 1px solid #e0e0e0; }
  td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; }
  tr.highlight td { background: #f0f4ff; }
  .total-row { display: flex; justify-content: space-between; padding: 8px 10px; background: #003580; color: white; font-weight: bold; font-size: 12px; }
  .doc-footer-meta { border-top: 1px solid #e0e0e0; padding-top: 12px; margin-top: 24px; font-size: 10px; color: #888; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  /* ── Bottom footer ── */
  .site-footer { background: #003580; color: rgba(255,255,255,0.7); font-size: 10px; padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
  .site-footer img { height: 20px; opacity: 0.8; }
  .site-footer-links { display: flex; gap: 16px; }
  .site-footer-links a { color: rgba(255,255,255,0.7); text-decoration: none; }
  @media print { body { } .navbar, .site-footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <!-- Top navbar -->
  <div class="navbar">
    <img src="${origin}/Homz_colorless.png" alt="Homz.ng" onerror="this.style.display='none';this.nextSibling.style.display='block'"/>
    <span style="display:none;color:white;font-weight:bold;font-size:16px;">Homz.ng</span>
    <span class="navbar-right">Financial Statement</span>
  </div>

  <div class="content">
    <div class="doc-header">
      <h1>FINANCIAL COLLECTION STATEMENT</h1>
      <div class="header-grid">
        <div><strong>Statement Reference:</strong> ${statementRef}</div>
        <div><strong>Generated Date:</strong> ${dateStr}</div>
        <div><strong>Estate Name:</strong> ${estateName}</div>
        <div><strong>Reporting Period:</strong> All recorded periods</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">COLLECTION SUMMARY</div>
      <table>
        <thead><tr><th>Description</th><th style="text-align:right">Amount (₦)</th></tr></thead>
        <tbody>
          <tr><td>Total Expected Amount</td><td style="text-align:right">${totals.totalExpected.toLocaleString()}</td></tr>
          <tr><td>Total Amount Collected</td><td style="text-align:right">${totals.totalPaid.toLocaleString()}</td></tr>
          <tr><td>Outstanding Amount</td><td style="text-align:right">${totals.outstanding.toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>

    ${feesHTML}

    <div class="section">
      <div class="section-title">PAYMENT STATUS BREAKDOWN</div>
      <table>
        <thead><tr><th>Status</th><th style="text-align:right">Amount (₦)</th></tr></thead>
        <tbody>
          <tr><td>Paid</td><td style="text-align:right">${totals.totalPaid.toLocaleString()}</td></tr>
          <tr><td>Outstanding</td><td style="text-align:right">${totals.outstanding.toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">BILL TYPE BREAKDOWN</div>
      <table>
        <thead><tr><th>Bill Type</th><th style="text-align:right">Expected (₦)</th><th style="text-align:right">Collected (₦)</th><th style="text-align:right">Outstanding (₦)</th></tr></thead>
        <tbody>
          ${summaryArr.map(r => `<tr><td>${r.billType.replace(/_/g, ' ')}</td><td style="text-align:right">${r.totalExpected.toLocaleString()}</td><td style="text-align:right">${r.totalPaid.toLocaleString()}</td><td style="text-align:right">${r.outstanding.toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <p style="font-size:11px;color:#555;font-style:italic;margin-top:8px;">This statement reflects all recorded collections and applicable fees within the selected reporting period.</p>

    <div class="doc-footer-meta">
      <div><strong>Generated By:</strong> Estate Manager</div>
      <div><strong>Generated On:</strong> ${dateStr}, ${timeStr}</div>
      <div><strong>Statement Ref:</strong> ${statementRef}</div>
      <div><strong>Estate:</strong> ${estateName}</div>
    </div>
  </div>

  <!-- Bottom footer -->
  <div class="site-footer">
    <img src="${origin}/Homz_colorless.png" alt="Homz.ng" onerror="this.style.display='none';this.nextSibling.style.display='block'"/>
    <span style="display:none;color:white;">Homz.ng</span>
    <span>© ${new Date().getFullYear()} Homz.ng. All rights reserved.</span>
    <div class="site-footer-links">
      <a href="https://homz.ng/terms-and-conditions">Terms</a>
      <a href="https://homz.ng/privacy-policy">Privacy</a>
    </div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => { win.print(); setGeneratingStatement(false); setShowStatementModal(false); }, 500);
    } else {
      setGeneratingStatement(false);
    }
  };

  const resetStatement = () => {
    setStatementStep('ask-fees');
    setIncludeFees(null);
    setFees([{ id: '1', name: '', type: 'fixed', value: '' }]);
    setShowStatementModal(false);
  };

  const canShowActions = !loading && !drillBillType && summaryArr.length > 0 && ability.can('create', 'finance');

  return (
    <div className='p-4 md:p-8 w-full'>
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

            {/* Action buttons */}
            {canShowActions && (
              <div className='flex items-center gap-2 flex-wrap'>
                {canUse('exports') ? (
                  <>
                    <button onClick={() => setShowExportModal(true)}
                      className='h-[37px] px-4 border border-BlueHomz text-BlueHomz text-sm font-medium rounded-[4px] flex items-center gap-2 hover:bg-whiteblue whitespace-nowrap'>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      Export
                    </button>
                    <button onClick={() => { setShowStatementModal(true); setStatementStep('ask-fees'); }}
                      className='h-[37px] px-4 bg-BlueHomz text-white text-sm font-medium rounded-[4px] flex items-center gap-2 hover:bg-[#0055CC] whitespace-nowrap'>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      Generate Statement
                    </button>
                  </>
                ) : (
                  <button onClick={() => promptUpgrade('exports')}
                    className='h-[37px] px-4 border border-[#E6E6E6] text-GrayHomz text-sm font-medium rounded-[4px] flex items-center gap-2 opacity-60 whitespace-nowrap'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" stroke="#A9A9A9" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#A9A9A9" strokeWidth="1.5"/></svg>
                    Export
                  </button>
                )}
              </div>
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
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${p.status==='paid' ? 'bg-successBg text-Success' : p.status==='partialpaid' ? 'bg-[#EEF5FF] text-BlueHomz' : 'bg-warningBg text-warning2'}`}>
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
              {!loading && summaryArr.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                  <div className='border-l-[3px] border-BlueHomz bg-whiteblue rounded-[8px] p-4'>
                    <p className='text-[11px] text-BlueHomz font-medium'>Total Expected</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>{fmt(totals.totalExpected)}</p>
                  </div>
                  <div className='border-l-[3px] border-Success bg-successBg rounded-[8px] p-4'>
                    <p className='text-[11px] text-Success font-medium'>Total Collected</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>{fmt(totals.totalPaid)}</p>
                  </div>
                  <div className='border-l-[3px] border-error bg-[#FEF3F2] rounded-[8px] p-4'>
                    <p className='text-[11px] text-error font-medium'>Outstanding</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>{fmt(totals.outstanding)}</p>
                  </div>
                  <div className='border-l-[3px] border-warning2 bg-warningBg rounded-[8px] p-4'>
                    <p className='text-[11px] text-warning2 font-medium'>Overdue Records</p>
                    <p className='text-[18px] font-semibold text-BlackHomz mt-1'>{totals.overdueCount}</p>
                  </div>
                </div>
              )}

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
                          <td className='py-4 pr-4 text-right text-sm text-BlackHomz font-medium'>{fmt(row.totalExpected)}</td>
                          <td className='py-4 pr-4 text-right text-sm text-Success font-medium hidden md:table-cell'>{fmt(row.totalPaid)}</td>
                          <td className='py-4 pr-4 text-right text-sm text-error font-medium'>{fmt(row.outstanding)}</td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.paidCount} type='paid'/></td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.pendingCount} type='pending'/></td>
                          <td className='py-4 pr-4 text-center hidden md:table-cell'><StatusBadge count={row.overdueCount} type='overdue'/></td>
                        </tr>
                      ))}
                      <tr className='border-t bg-[#F8FAFF] font-semibold'>
                        <td className='py-4 pl-4 text-sm text-BlackHomz'>Total</td>
                        <td className='py-4 pr-4 text-right text-sm text-GrayHomz hidden md:table-cell'>—</td>
                        <td className='py-4 pr-4 text-right text-sm text-BlackHomz'>{fmt(totals.totalExpected)}</td>
                        <td className='py-4 pr-4 text-right text-sm text-Success hidden md:table-cell'>{fmt(totals.totalPaid)}</td>
                        <td className='py-4 pr-4 text-right text-sm text-error'>{fmt(totals.outstanding)}</td>
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

      {/* ── Export Modal ─────────────────────────────────────────────────────── */}
      {showExportModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-[16px] w-full max-w-[400px] p-6'>
            <div className='flex items-center justify-between mb-5'>
              <h3 className='text-[16px] font-bold text-BlackHomz'>Export Payment Data</h3>
              <button onClick={() => setShowExportModal(false)} className='text-GrayHomz hover:text-BlackHomz'>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <p className='text-[13px] text-GrayHomz mb-5'>Choose your preferred export format for the payment data.</p>
            <div className='flex flex-col gap-3'>
              {(['csv', 'xlsx', 'pdf'] as const).map(fmt => (
                <button key={fmt} onClick={() => handleExport(fmt)} disabled={exportLoading}
                  className='flex items-center gap-3 p-4 border border-[#E6E6E6] rounded-[8px] hover:border-BlueHomz hover:bg-whiteblue transition-colors disabled:opacity-50'>
                  <div className='w-8 h-8 rounded-[6px] flex items-center justify-center bg-whiteblue text-BlueHomz font-bold text-[11px]'>{fmt.toUpperCase()}</div>
                  <div className='text-left'>
                    <p className='text-[13px] font-semibold text-BlackHomz'>{fmt === 'csv' ? 'CSV File' : fmt === 'xlsx' ? 'Excel Spreadsheet' : 'PDF Document'}</p>
                    <p className='text-[11px] text-GrayHomz'>{fmt === 'csv' ? 'Comma-separated values' : fmt === 'xlsx' ? 'Microsoft Excel format' : 'Printable PDF format'}</p>
                  </div>
                  {exportLoading ? <div className='ml-auto w-4 h-4 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin'/> : <svg className='ml-auto' width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Generate Statement Modal ─────────────────────────────────────────── */}
      {showStatementModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-[16px] w-full max-w-[520px] p-6 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-5'>
              <h3 className='text-[16px] font-bold text-BlackHomz'>Generate Statement</h3>
              <button onClick={resetStatement} className='text-GrayHomz hover:text-BlackHomz'>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Step 1: Ask fees */}
            {statementStep === 'ask-fees' && (
              <>
                <div className='bg-[#F8FAFF] rounded-[10px] p-4 mb-5'>
                  <p className='text-[12px] text-GrayHomz mb-1'>Total Collected</p>
                  <p className='text-[22px] font-bold text-BlackHomz'>{fmt(totals.totalPaid)}</p>
                  <p className='text-[11px] text-GrayHomz mt-1'>{estateName}</p>
                </div>
                <p className='text-[14px] font-semibold text-BlackHomz mb-4'>Include Additional Fees?</p>
                <div className='flex flex-col gap-3 mb-6'>
                  <button onClick={() => { setIncludeFees(true); setStatementStep('enter-fees'); }}
                    className='flex items-center gap-3 p-4 border border-[#E6E6E6] rounded-[8px] hover:border-BlueHomz hover:bg-whiteblue transition-colors text-left'>
                    <div className='w-8 h-8 rounded-full bg-whiteblue text-BlueHomz flex items-center justify-center'>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <p className='text-[13px] font-semibold text-BlackHomz'>Yes, Include Fees</p>
                      <p className='text-[11px] text-GrayHomz'>Add management, maintenance or other fees</p>
                    </div>
                  </button>
                  <button onClick={() => { setIncludeFees(false); generateStatementPDF(); }}
                    className='flex items-center gap-3 p-4 border border-[#E6E6E6] rounded-[8px] hover:border-BlueHomz hover:bg-whiteblue transition-colors text-left'>
                    <div className='w-8 h-8 rounded-full bg-[#F0FFF4] text-Success flex items-center justify-center'>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <p className='text-[13px] font-semibold text-BlackHomz'>No, Generate Statement Without Fees</p>
                      <p className='text-[11px] text-GrayHomz'>Generate based on total collected only</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Enter fees */}
            {statementStep === 'enter-fees' && (
              <>
                <p className='text-[13px] text-GrayHomz mb-4'>Add fee entries below. You can add multiple fees.</p>
                <div className='flex flex-col gap-3 mb-4'>
                  {fees.map((fee, idx) => (
                    <div key={fee.id} className='border border-[#E6E6E6] rounded-[8px] p-3'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-[11px] font-semibold text-GrayHomz'>Fee {idx + 1}</span>
                        {fees.length > 1 && (
                          <button onClick={() => removeFee(fee.id)} className='text-error hover:text-[#DC2626]'>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                        )}
                      </div>
                      <input type='text' placeholder='Fee Name (e.g. Management Fee)' value={fee.name}
                        onChange={e => updateFee(fee.id, 'name', e.target.value)}
                        className='w-full h-[36px] border border-[#E6E6E6] rounded-[6px] px-3 text-[12px] mb-2 focus:outline-none focus:border-BlueHomz'/>
                      <div className='flex gap-2'>
                        <select value={fee.type} onChange={e => updateFee(fee.id, 'type', e.target.value)}
                          className='h-[36px] border border-[#E6E6E6] rounded-[6px] px-2 text-[12px] focus:outline-none focus:border-BlueHomz bg-white'>
                          <option value='fixed'>Fixed Amount</option>
                          <option value='percentage'>Percentage (%)</option>
                        </select>
                        <input type='number' placeholder={fee.type === 'fixed' ? 'Amount (₦)' : 'Percentage (%)'}
                          value={fee.value} onChange={e => updateFee(fee.id, 'value', e.target.value)}
                          className='flex-1 h-[36px] border border-[#E6E6E6] rounded-[6px] px-3 text-[12px] focus:outline-none focus:border-BlueHomz'/>
                      </div>
                      {fee.name && fee.value && (
                        <p className='text-[11px] text-GrayHomz mt-1.5'>
                          = {fmt(fee.type === 'fixed' ? parseFloat(fee.value) || 0 : (totals.totalPaid * (parseFloat(fee.value) || 0)) / 100)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addFee} className='flex items-center gap-1 text-[12px] text-BlueHomz hover:underline mb-5'>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Add another fee
                </button>

                {/* Summary preview */}
                <div className='bg-[#F8FAFF] rounded-[8px] p-4 mb-5 text-[12px]'>
                  <div className='flex justify-between mb-1'><span className='text-GrayHomz'>Total Collected</span><span className='font-semibold'>{fmt(totals.totalPaid)}</span></div>
                  <div className='flex justify-between mb-1'><span className='text-GrayHomz'>Total Fees</span><span className='text-error'>−{fmt(totalFees)}</span></div>
                  <div className='h-[1px] bg-[#E6E6E6] my-2'/>
                  <div className='flex justify-between'><span className='font-semibold text-BlackHomz'>Net Amount</span><span className='font-bold text-BlueHomz'>{fmt(netAmount)}</span></div>
                </div>

                <div className='flex gap-3'>
                  <button onClick={() => setStatementStep('ask-fees')}
                    className='flex-1 h-[40px] border border-[#E6E6E6] rounded-[8px] text-[13px] text-GrayHomz hover:bg-[#F5F5F5]'>
                    Back
                  </button>
                  <button onClick={generateStatementPDF} disabled={generatingStatement || fees.some(f => !f.name || !f.value)}
                    className='flex-1 h-[40px] bg-BlueHomz text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#0055CC] disabled:opacity-50 flex items-center justify-center gap-2'>
                    {generatingStatement ? <><div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'/> Generating...</> : 'Generate Statement'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;