"use client"
import AddIcon from '@/components/icons/addIcon';
import BigKeyIcon from '@/components/icons/estateManager&Resident/desktop/bigKeyIcon';
import React from 'react'
import AccessCodeForm from './components/accessCodeForm';
import SuccessModal from '../../components/successModal';
import CustomModal from '@/components/general/customModal';
import ResetIcon from '@/components/icons/resetIcon';
import CustomInput from '@/components/general/customInput';
import AddWhiteBox from '@/components/icons/addWhiteBox';
import Table from './components/table';
import FilterIconBlue from '@/components/icons/filterIconBlue';
import Close from '@/components/icons/Close';
import DateIcon from '@/components/icons/dateIcon';

const VisitorAccess = () => {
  const [steps, setSteps] = React.useState<number>(0);
  const [openAccessCodeForm, setOpenAccessCodeForm] = React.useState<boolean>(false);
  const [accessData, setAccessData] = React.useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState<boolean>(false);
  const [openFilterModal, setOpenFilterModal] = React.useState<boolean>(false);

  const pages = [
    "All", "Co-owner", "Admin", "Staff", "Dependent"
  ];
  return (
    <div className='p-8'>
      {
        openAccessCodeForm &&
        <CustomModal isOpen={openAccessCodeForm} onRequestClose={() => setOpenAccessCodeForm(false)}>
          <AccessCodeForm
            setOpenAccessCodeForm={setOpenAccessCodeForm}
            setOpenSuccessModal={setOpenSuccessModal}
          />
        </CustomModal>
      }
      {
        openFilterModal &&
        <CustomModal isOpen={openFilterModal} onRequestClose={() => setOpenFilterModal(false)}>
          <div className='p-4 rounded-[12px] bg-white w-[350px] mb-0'>
            <div className='flex justify-between items-center'>
              <p>Filter by</p>
              <button onClick={() => setOpenFilterModal(false)} className='border border-GrayHomz rounded-[6px] h-[24px] w-[24px] flex justify-center items-center'><Close /></button>
            </div>
            <div className='flex flex-col items-center gap-4 mt-6'>
              <div className="relative mt-1 w-full">
                <CustomInput
                  type='date'
                  className='w-full h-[37px] px-2 input-hide-date-icon'
                  onClick={() => { }}
                  borderColor='border-[#A9A9A9]'
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <DateIcon />
                </span>
              </div>
              <button className='w-full h-[37px] bg-BlueHomz rounded-[4px] flex items-center justify-center gap-1 text-white text-sm'>
                <ResetIcon className='#FFFFFF' />Reset
              </button>
            </div>
          </div>
        </CustomModal>
      }

      {
        openSuccessModal &&
        <SuccessModal
          isOpen={openSuccessModal}
          title='Success! Access Code Sent'
          color='text-BlueHomz'
          handleBack={() => {
            setOpenSuccessModal(false)
            setAccessData(true)
          }}
          closeSuccessModal={() => setOpenSuccessModal(false)}
        />
      }
      {accessData ?
        <div>
          <div className='md:grid md:grid-cols-3 justify-between items-center pb-0'>
            <div className='flex w-full justify-between items-center'>
              <h1 className='text-BlackHomz font-normal text-[16px] md:text-[20px] flex items-center gap-2'>Visitors <span className='py-1 px-2 bg-[#EEF5FF] rounded-[8px] text-BlueHomz'>8</span>
                <button onClick={() => setOpenAccessCodeForm(true)} className='ml-4 md:hidden bg-BlueHomz h-[35px] w-[40px] rounded-[4px] cursor-pointer text-sm font-normal text-white flex items-center justify-center'>
                  <AddWhiteBox />
                </button>
              </h1>
              <button onClick={() => setOpenFilterModal(true)} className='md:hidden py-2 px-3 bg-[#EEF5FF] rounded-[4px] text-BlueHomz'><FilterIconBlue /></button>
            </div>
            <div className='hidden md:flex items-center gap-2'>
              <div className='flex flex-row gap-2 items-center'>
                <p className='text-[16px] text-GrayHomz font-normal min-w-[70px]'>Filter by:</p>
                <div className="relative w-full">
                  <CustomInput
                    type='date'
                    className='w-full h-[37px] px-2 input-hide-date-icon'
                    onClick={() => { }}
                    borderColor='border-[#A9A9A9]'
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <DateIcon />
                  </span>
                </div>
              </div>
              <button className='px-3 h-[37px] border border-BlueHomz rounded-[4px] flex items-center gap-1 text-BlueHomz text-sm'>
                <ResetIcon />Reset
              </button>
            </div>
            <div className='hidden md:flex justify-end items-center'>
              <button onClick={() => setOpenAccessCodeForm(true)} className='hidden bg-BlueHomz w-[160px] h-[37px] rounded-[4px] cursor-pointer text-sm font-normal text-white md:flex justify-center items-center gap-1'>
                <AddWhiteBox /> Get access code
              </button>
            </div>
          </div>
          <div className='mt-8'>
            <div className='flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between md:items-center'>
              <div className='flex items-center flex-wrap gap-2'>
                {
                  pages.map((data, index) => (
                    <div
                      onClick={() => setSteps(index)}
                      key={index}
                      className={`${index === steps ? "text-white bg-BlueHomz" : "bg-whiteblue text-BlueHomz"} text-sm flex items-center px-3 h-[37px] rounded-[4px] cursor-pointer`}
                    >
                      {data}
                    </div>
                  ))
                }
              </div>
            </div>
            <div>
              <Table
                fromDefault={false}
              />
            </div>
          </div>
        </div>
        :
        <div>
          <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Visitor Access</h1>
          <h3 className='text-GrayHomz font-normal text-sm md:tex t-[16px]'>Generate access codes for your visitors to gain entry into the estate</h3>
          <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex w-[136px] h-[136px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                <BigKeyIcon />
              </div>
              <button
                onClick={() => {
                  setOpenAccessCodeForm(true)
                }}
                className='px-4 py-2 cursor-ponter text-sm font-normal text-BlueHomz flex items-center gap-1'
              >
                <AddIcon /> Get Access Code
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default VisitorAccess