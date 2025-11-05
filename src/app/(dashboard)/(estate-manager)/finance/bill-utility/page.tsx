"use client";
import React from 'react';
import Table from './components/table';
import BillingEmpty from '@/components/icons/BillingEmpty';
import AddWhiteBox from '@/components/icons/addWhiteBox';
import Filters from './components/filters';
import CoinsIcon from '@/components/icons/coinsIcon';
import SelectCurrency from './components/selectCurrency';
import EditBilling from './components/editBilling';
import SuccessModal from '@/app/(dashboard)/components/successModal';

const BillAndUti = () => {
  const [hasAnyData, setHasAnyData] = React.useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openEditBillingModal, setOpenEditBillingModal] = React.useState(false);

  return (
    <div className='w-full min-w-[375px] md:min-w-[1070px] p-8'>
      {openSuccessModal && (
        <SuccessModal
          isOpen={openSuccessModal}
          closeSuccessModal={() => setOpenSuccessModal(false)}
          handleBack={() => setOpenSuccessModal(false)}
          title="Bill Created Successfully!"
          successText="The bill has been added and is now visible in your billing overview."
        />
      )}
      {openCurrencyModal && (
        <SelectCurrency
          isOpen={openCurrencyModal}
          onRequestClose={() => setOpenCurrencyModal(false)}
          setOpenEditBillingModal={setOpenEditBillingModal}
        />
      )}
      {openEditBillingModal && (
        <EditBilling
          isOpen={openEditBillingModal}
          onRequestClose={() => setOpenEditBillingModal(false)}
          setOpenSuccessModal={setOpenSuccessModal}
          setHasAnyData={setHasAnyData}
        />
      )}
      <div className='flex flex-col md:flex-row gap-2 md:gap-0 justify-start md:justify-between'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>Estate Billing & Payments</h2>
          <p className='hidden md:block text-base text-GrayHomz font-normal max-w-[560px]'>
            Manage all your estate bills in one place. Create new bills, track payments, and view payment status for every tenant.
          </p>
          <p className='md:hidden text-sm text-GrayHomz font-normal max-w-[560px]'>
            Manage all your estate bills in one place.
          </p>
        </div>
        {hasAnyData &&
          <div className='hidden md:flex justify-center items-center gap-2'>
            <button className='h-[37px] w-12 rounded-[4px] hidden md:flex justify-center items-center bg-whiteblue border border-BlueHomz'>
              <CoinsIcon />
            </button>
            <button onClick={() => setOpenCurrencyModal(true)} className='bg-BlueHomz rounded-[4px] h-[37px] px-6 flex justify-center items-center gap-2 text-sm font-semibold text-white'>
              <AddWhiteBox /> Create Bill
            </button>
          </div>
        }
      </div>
      {!hasAnyData ? (
        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
          <div className='flex flex-col items-center gap-6'>
            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
              <BillingEmpty />
            </div>
            <button onClick={() => setOpenCurrencyModal(true)} className='bg-BlueHomz rounded-[4px] h-12 px-6 flex justify-center items-center gap-2 text-base font-semibold text-white'> <AddWhiteBox /> Create Bill</button>
          </div>
        </div>
      ) : (
        <div className='w-full'>
          <Filters setOpenCurrencyModal={setOpenCurrencyModal} />
          <Table />
        </div>
      )}
    </div>
  );
};

export default BillAndUti;