"use client";
import React from 'react';
import Table from './components/table';
import Filters from './components/filters';
import BillAndPayEmpty from '@/components/icons/BillAndPayEmpty';

const BillAndPayment = () => {
  const [hasAnyData, setHasAnyData] = React.useState(false);

  return (
    <div className='w-full p-8'>
      <div className='flex justify-between items-start w-full'>
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
        {hasAnyData && <span className='block -mt-3 md:mt-0'><Filters /></span>}
      </div>
      {!hasAnyData ? (
        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
          <div className='flex flex-col items-center gap-6'>
            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
              <BillAndPayEmpty />
            </div>
            <div onClick={() => setHasAnyData(true)} className='text-base font-normal text-GrayHomz'>You currently don’t have any active bills. Once your estate manager assigns new bills, they’ll appear here.</div>
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