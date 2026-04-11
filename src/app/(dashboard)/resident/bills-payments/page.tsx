"use client";
import React, { useEffect } from 'react';
import Table from './components/table';
import Filters from './components/filters';
import BillAndPayEmpty from '@/components/icons/BillAndPayEmpty';
import { useResidentBillStore } from '@/store/useResidentBillStore';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import LoadingSpinner from '@/components/general/loadingSpinner';

const BillAndPayment = () => {
  const {
    bills,
    hasAnyData,
    fetchResidentBills,
    isLoading,
    search,
    frequency,
    reset,
  } = useResidentBillStore();

  const { residentCommunity } = useResidentCommunity();
  const { selectedEstate } = useSelectedEsate();

  // Use selectedEstate if available, otherwise fall back to first community
  const activeCommunity = selectedEstate || residentCommunity?.[0];

  // Reset store on mount so navigating back always shows fresh data
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeCommunity) {
      const { estateId, associatedIds } = activeCommunity;
      fetchResidentBills({
        estateId,
        organizationId: associatedIds.organizationId,
        residentId: associatedIds.residentId,
        search: search || undefined,
        frequency: frequency || undefined,
        page: 1,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCommunity?.estateId, search, frequency]);

  return (
    <div className='w-full p-8'>
      <div className='flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between items-start w-full'>
        <div className='flex flex-col gap-1 w-full'>
          <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>Estate Bills & Payments</h2>
          {hasAnyData &&
            <>
              <p className='hidden md:block text-base text-GrayHomz font-normal w-full'>
                Here&apos;s a summary of all your active and recurring bills. Click on any bill to see its details and payment history
              </p>
              <p className='md:hidden text-sm text-GrayHomz font-normal w-full'>
                Here&apos;s a summary of all your active and recurring bills.
              </p>
            </>
          }
        </div>
        {hasAnyData && <span className='block -mt-3 md:mt-0'><Filters /></span>}
      </div>
      {isLoading ? (
        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
          <LoadingSpinner size={48} />
        </div>
      ) : !hasAnyData ? (
        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
          <div className='flex flex-col items-center gap-6'>
            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
              <BillAndPayEmpty />
            </div>
            <div className='text-base font-normal text-GrayHomz text-center'>
              You currently don&apos;t have any active bills. Once your community manager assigns new bills, they&apos;ll appear here.
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full'>
          <Table />
        </div>
      )}
    </div>
  );
};

export default BillAndPayment;