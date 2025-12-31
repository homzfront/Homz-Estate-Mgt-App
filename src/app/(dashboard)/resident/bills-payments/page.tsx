"use client";
import React, { useEffect, useRef } from 'react';
import Table from './components/table';
import Filters from './components/filters';
import BillAndPayEmpty from '@/components/icons/BillAndPayEmpty';
import { useResidentBillStore } from '@/store/useResidentBillStore';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import LoadingSpinner from '@/components/general/loadingSpinner';
// import { useSelectedCommunity } from '@/store/useSelectedCommunity'; // If needed to know which community is active

const BillAndPayment = () => {
  const {
    bills,
    hasAnyData,
    fetchResidentBills,
    isLoading,
    metrics,
    search,
    frequency
  } = useResidentBillStore();

  const { residentCommunity } = useResidentCommunity();

  // Logic to get the correct IDs. 
  // Assuming we use the first community or a selected one.
  // You might need to use a selector if the user can switch communities.
  const activeCommunity = residentCommunity?.[0]; // Replace with actual selection logic
  // console.log("residentCommunity:", residentCommunity)
  // console.log("bills:", bills)
  useEffect(() => {
    if (activeCommunity) {
      const { estateId, associatedIds } = activeCommunity;
      fetchResidentBills({
        estateId,
        organizationId: associatedIds.organizationId,
        residentId: associatedIds.residentId,
      });
    }
  }, [activeCommunity, fetchResidentBills, search, frequency]); // Re-fetch when filters change

  return (
    <div className='w-full p-8'>
      <div className='flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between items-start w-full'>
        <div className='flex flex-col gap-1 w-full'>
          <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>Estate Bills & Payments</h2>
          {hasAnyData &&
            <>
              <p className='hidden md:block text-base text-GrayHomz font-normal w-full'>
                Here’s a summary of all your active and recurring bills. Click on any bill to see its details and payment history
              </p>
              <p className='md:hidden text-sm text-GrayHomz font-normal w-full'>
                Here’s a summary of all your active and recurring bills.
              </p>
            </>
          }
        </div>
        {/* {hasAnyData ? <span className='block -mt-3 md:mt-0'><Filters /></span> : isLoading ? <div>Loading...</div> : null} */}
      </div>
      {isLoading ? (
        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
          <LoadingSpinner size={48} />
        </div>
      ) : !hasAnyData ? (
        isLoading ? (
          <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
            <LoadingSpinner size={48} />
          </div>
        ) : (
          <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
            <div className='flex flex-col items-center gap-6'>
              <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                <BillAndPayEmpty />
              </div>
              <div className='text-base font-normal text-GrayHomz'>You currently don&apos;t have any active bills. Once your community manager assigns new bills, they&apos;ll appear here.</div>
            </div>
          </div>
        )
      ) : (
        <div className='w-full'>
          <Table />
        </div>
      )}
    </div>
  );
};

export default BillAndPayment;