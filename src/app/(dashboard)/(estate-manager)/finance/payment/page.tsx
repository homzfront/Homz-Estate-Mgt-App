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
  totalResidents: number;
  totalExpected: number;
  totalPaid: number;
  outstanding: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;
}

const StatusBadge = ({ count, type }: { count: number; type: 'paid' | 'pending' | 'overdue' }) => {
  if (count === 0) return <span className="text-GrayHomz5 text-[11px]">—</span>;
  const styles = {
    paid: 'bg-successBg text-Success',
    pending: 'bg-warningBg text-warning2',
    overdue: 'bg-[#FEF3F2] text-error',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[type]}`}>
      {count}
    </span>
  );
};

const Payment = () => {
  const router = useRouter();
  const ability = useAbility();

  React.useEffect(() => {
    if (!ability.can('read', 'finance')) {
      router.push('/dashboard');
    }
  }, [ability, router]);

  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const [summary, setSummary] = React.useState<BillSummaryRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const orgId = selectedCommunity?.estate?.associatedIds?.organizationId;
    const estateId = selectedCommunity?.estate?._id;
    if (!orgId || !estateId) { setLoading(false); return; }

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/community-manager/bill-payment/summary/organizations/${orgId}/estates/${estateId}`
        );
        setSummary(res?.data?.data || []);
      } catch {
        setSummary([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedCommunity?.estate?._id]);

  // Totals row
  const totals = summary.reduce(
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
      {!selectedCommunity ? (
        <EmptyEstateState />
      ) : (
        <div>
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6'>
            <div className='flex flex-col gap-1'>
              <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>Payment Overview</h2>
              <p className='text-sm text-GrayHomz font-normal'>
                Summary of all bill payments across the estate, organised by bill type.
              </p>
            </div>
            {!loading && summary.length > 0 && ability.can('create', 'finance') && (
              <button
                onClick={() => {
                  const headers = ['Bill Type','Residents','Total Expected','Total Paid','Outstanding','Paid Records','Pending Records','Overdue Records'];
                  const rows = summary.map(r => [
                    formatBillType(r.billType),
                    r.totalResidents,
                    r.totalExpected,
                    r.totalPaid,
                    r.outstanding,
                    r.paidCount,
                    r.pendingCount,
                    r.overdueCount,
                  ]);
                  rows.push(['TOTAL','—',totals.totalExpected,totals.totalPaid,totals.outstanding,totals.paidCount,totals.pendingCount,totals.overdueCount]);
                  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bill-summary-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className='h-[37px] px-4 border border-BlueHomz text-BlueHomz text-sm font-medium rounded-[4px] flex items-center gap-2 hover:bg-whiteblue transition-colors whitespace-nowrap'
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Export CSV
              </button>
            )}
          </div>

          {/* Summary cards */}
          {!loading && summary.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
              <div className='border-l-[3px] border-BlueHomz bg-whiteblue rounded-[8px] p-4'>
                <p className='text-[11px] text-BlueHomz font-medium'>Total Expected</p>
                <p className='text-[18px] font-semibold text-BlackHomz mt-1'>
                  ₦{totals.totalExpected.toLocaleString()}
                </p>
              </div>
              <div className='border-l-[3px] border-Success bg-successBg rounded-[8px] p-4'>
                <p className='text-[11px] text-Success font-medium'>Total Collected</p>
                <p className='text-[18px] font-semibold text-BlackHomz mt-1'>
                  ₦{totals.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className='border-l-[3px] border-error bg-[#FEF3F2] rounded-[8px] p-4'>
                <p className='text-[11px] text-error font-medium'>Outstanding</p>
                <p className='text-[18px] font-semibold text-BlackHomz mt-1'>
                  ₦{totals.outstanding.toLocaleString()}
                </p>
              </div>
              <div className='border-l-[3px] border-warning2 bg-warningBg rounded-[8px] p-4'>
                <p className='text-[11px] text-warning2 font-medium'>Overdue Records</p>
                <p className='text-[18px] font-semibold text-BlackHomz mt-1'>
                  {totals.overdueCount}
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className='h-[400px] flex items-center justify-center'>
              <LoadingSpinner size={48} />
            </div>
          ) : summary.length === 0 ? (
            <div className='h-[400px] flex flex-col items-center justify-center gap-3'>
              <p className='text-BlueHomz font-medium text-[16px] md:text-[20px]'>No payment records yet</p>
              <p className='text-sm text-GrayHomz text-center max-w-[400px]'>
                Payment records will appear here once residents start making payments or you record offline payments.
              </p>
            </div>
          ) : (
            <div className='border rounded-[8px] overflow-x-auto scrollbar-container'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-whiteblue h-[50px] text-[12px] font-semibold text-BlackHomz'>
                    <th className='text-left pl-4 w-[180px]'>Bill Type</th>
                    <th className='text-right pr-4 hidden md:table-cell w-[100px]'>Residents</th>
                    <th className='text-right pr-4 w-[140px]'>Total Expected</th>
                    <th className='text-right pr-4 hidden md:table-cell w-[140px]'>Total Paid</th>
                    <th className='text-right pr-4 w-[140px]'>Outstanding</th>
                    <th className='text-center pr-4 hidden md:table-cell w-[80px]'>Paid</th>
                    <th className='text-center pr-4 hidden md:table-cell w-[80px]'>Pending</th>
                    <th className='text-center pr-4 hidden md:table-cell w-[80px]'>Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, i) => (
                    <tr key={i} className='border-t hover:bg-gray-50 transition-colors'>
                      <td className='py-4 pl-4 text-sm font-medium text-BlackHomz'>
                        {formatBillType(row.billType)}
                      </td>
                      <td className='py-4 pr-4 text-right text-sm text-GrayHomz hidden md:table-cell'>
                        {row.totalResidents}
                      </td>
                      <td className='py-4 pr-4 text-right text-sm text-BlackHomz font-medium'>
                        ₦{row.totalExpected.toLocaleString()}
                      </td>
                      <td className='py-4 pr-4 text-right text-sm text-Success font-medium hidden md:table-cell'>
                        ₦{row.totalPaid.toLocaleString()}
                      </td>
                      <td className='py-4 pr-4 text-right text-sm text-error font-medium'>
                        ₦{row.outstanding.toLocaleString()}
                      </td>
                      <td className='py-4 pr-4 text-center hidden md:table-cell'>
                        <StatusBadge count={row.paidCount} type='paid' />
                      </td>
                      <td className='py-4 pr-4 text-center hidden md:table-cell'>
                        <StatusBadge count={row.pendingCount} type='pending' />
                      </td>
                      <td className='py-4 pr-4 text-center hidden md:table-cell'>
                        <StatusBadge count={row.overdueCount} type='overdue' />
                      </td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className='border-t bg-[#F8FAFF] font-semibold'>
                    <td className='py-4 pl-4 text-sm text-BlackHomz'>Total</td>
                    <td className='py-4 pr-4 text-right text-sm text-GrayHomz hidden md:table-cell'>
                      —
                    </td>
                    <td className='py-4 pr-4 text-right text-sm text-BlackHomz'>
                      ₦{totals.totalExpected.toLocaleString()}
                    </td>
                    <td className='py-4 pr-4 text-right text-sm text-Success hidden md:table-cell'>
                      ₦{totals.totalPaid.toLocaleString()}
                    </td>
                    <td className='py-4 pr-4 text-right text-sm text-error'>
                      ₦{totals.outstanding.toLocaleString()}
                    </td>
                    <td className='py-4 pr-4 text-center hidden md:table-cell'>
                      <StatusBadge count={totals.paidCount} type='paid' />
                    </td>
                    <td className='py-4 pr-4 text-center hidden md:table-cell'>
                      <StatusBadge count={totals.pendingCount} type='pending' />
                    </td>
                    <td className='py-4 pr-4 text-center hidden md:table-cell'>
                      <StatusBadge count={totals.overdueCount} type='overdue' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;