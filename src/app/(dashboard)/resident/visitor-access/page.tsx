/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAccessCodeSlice } from '@/store/useAccessCode';
// import { useSearchParams } from 'next/navigation';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import { LoaderIcon } from 'react-hot-toast';

const VisitorAccess = () => {
  // const searchParams = useSearchParams();
  // const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 10;
  const [totalPages, setTotalPages] = React.useState(1);
  // const [steps, setSteps] = React.useState<number>(0);
  const [openAccessCodeForm, setOpenAccessCodeForm] = React.useState<boolean>(false);
  // const [accessData, setAccessData] = React.useState<boolean>(true);
  const [openSuccessModal, setOpenSuccessModal] = React.useState<boolean>(false);
  const [openFilterModal, setOpenFilterModal] = React.useState<boolean>(false);
  const [search] = React.useState<string>('');
  // Remove explicit page state; store manages pagination
  const [dateFilter, setDateFilter] = React.useState<string>('');
  const { accessCode, getAccessCode, initialLoading } = useAccessCodeSlice();
  const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
  const [showPendingModal, setShowPendingModal] = React.useState(false);
  const prevEstateIdRef = React.useRef<string | null>(null);
 
  // Pagination handled via infinite scroll in table

  React.useEffect(() => {
    if (accessCode) setTotalPages(Math.ceil(accessCode?.length / pageSize));
  }, [accessCode]);

  const fetchAccessCode = async () => {
    if (selectedEstate) {
      await getAccessCode(1, pageSize, search, dateFilter);
    }
  };

  // Only fetch when selectedEstate changes or filters change
  React.useEffect(() => {
    if (!selectedEstate) return;

    const estateChanged = prevEstateIdRef.current !== selectedEstate.estateId;
    const isFirstLoad = !accessCode && initialLoading;
    
    // Fetch only if: estate changed, first load, or filters changed
    if (estateChanged || isFirstLoad) {
      prevEstateIdRef.current = selectedEstate.estateId;
      getAccessCode(1, pageSize, search, dateFilter);
    }
  }, [selectedEstate?.estateId]);

  // Separate effect for filter changes (date filter only, since search is not used)
  React.useEffect(() => {
    if (selectedEstate && dateFilter !== '' && prevEstateIdRef.current === selectedEstate.estateId) {
      getAccessCode(1, pageSize, search, dateFilter);
    }
  }, [dateFilter]);

  // Show full-page loader only on initial load with no data
  if (initialLoading && !accessCode) {
    return <div className='h-screen flex justify-center items-center w-full'><LoaderIcon /></div>
  }
  return (
    <div className='p-8'>
      {
        openAccessCodeForm &&
        <CustomModal isOpen={openAccessCodeForm} onRequestClose={() => setOpenAccessCodeForm(false)}>
          <AccessCodeForm
            setOpenAccessCodeForm={setOpenAccessCodeForm}
            setOpenSuccessModal={setOpenSuccessModal}
            fetchAccessCode={fetchAccessCode}
          />
        </CustomModal>
      }
      {
        showPendingModal &&
        <CustomModal isOpen={showPendingModal} onRequestClose={() => setShowPendingModal(false)}>
          <div className='p-6 min-w-[340px] w-full md:w-[500px] bg-white rounded-[12px]'>
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-warningBg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 13C11.7348 13 11.4804 12.8946 11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V8C11 7.73478 11.1054 7.48043 11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289C12.8946 7.48043 13 7.73478 13 8V12C13 12.2652 12.8946 12.5196 12.7071 12.7071C12.5196 12.8946 12.2652 13 12 13ZM12 17C11.7033 17 11.4133 16.912 11.1666 16.7472C10.92 16.5824 10.7277 16.3481 10.6142 16.074C10.5007 15.7999 10.4709 15.4983 10.5288 15.2074C10.5867 14.9164 10.7296 14.6491 10.9393 14.4393C11.1491 14.2296 11.4164 14.0867 11.7074 14.0288C11.9983 13.9709 12.2999 14.0007 12.574 14.1142C12.8481 14.2277 13.0824 14.42 13.2472 14.6666C13.412 14.9133 13.5 15.2033 13.5 15.5C13.5 15.8978 13.342 16.2794 13.0607 16.5607C12.7794 16.842 12.3978 17 12 17Z" fill="#DC6803"/>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[16px] md:text-[18px] font-bold text-warning2 text-center">
                  Access Restricted
                </p>
                <p className="text-[13px] md:text-[14px] font-normal text-GrayHomz text-center">
                  You can&apos;t request visitor access yet because your join request to <span className="font-medium">{selectedEstate?.estateName}</span> is still pending approval from the estate manager.
                </p>
                <p className="text-[13px] md:text-[14px] font-normal text-GrayHomz text-center">
                  Once your request is approved, you&apos;ll be able to request visitor access and enjoy all estate features.
                </p>
              </div>
            </div>
            <div className='flex justify-center items-center mt-6'>
              <button
                className='w-full bg-BlueHomz text-white rounded-[4px] h-[48px] font-medium text-sm'
                onClick={() => setShowPendingModal(false)}
              >
                Close
              </button>
            </div>
          </div>
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
                  value={dateFilter}
                  className='w-full h-[37px] px-2 input-hide-date-icon'
                  onChange={(e: any) => setDateFilter(e.target.value)}
                  borderColor='border-[#A9A9A9]'
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <DateIcon />
                </span>
              </div>
              <button onClick={() => setDateFilter('')} className='w-full h-[37px] bg-BlueHomz rounded-[4px] flex items-center justify-center gap-1 text-white text-sm'>
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
            setOpenSuccessModal(false);
          }}
          closeSuccessModal={() => setOpenSuccessModal(false)}
        />
      }
      {accessCode && accessCode?.length > 0 ?
        <div>
          <div className='md:grid md:grid-cols-3 justify-between items-center pb-0'>
            <div className='flex w-full justify-between items-center'>
              <h1 className='text-BlackHomz font-normal text-[16px] md:text-[20px] flex items-center gap-2'>Visitors <span className='py-1 px-2 bg-[#EEF5FF] rounded-[8px] text-BlueHomz'>{accessCode?.length || 0}</span>
                <button 
                  onClick={() => {
                    if (selectedEstate?.status === 'pending') {
                      setShowPendingModal(true);
                    } else {
                      setOpenAccessCodeForm(true);
                    }
                  }} 
                  className='ml-4 md:hidden bg-BlueHomz h-[35px] w-[40px] rounded-[4px] cursor-pointer text-sm font-normal text-white flex items-center justify-center'
                >
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
                    value={dateFilter}
                    className='w-full h-[37px] px-2 input-hide-date-icon'
                    onChange={(e: any) => setDateFilter(e.target.value)}
                    borderColor='border-[#A9A9A9]'
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <DateIcon />
                  </span>
                </div>
              </div>
              <button onClick={() => setDateFilter('')} className='px-3 h-[37px] border border-BlueHomz rounded-[4px] flex items-center gap-1 text-BlueHomz text-sm'>
                <ResetIcon />Reset
              </button>
            </div>
            <div className='hidden md:flex justify-end items-center'>
              <button 
                onClick={() => {
                  if (selectedEstate?.status === 'pending') {
                    setShowPendingModal(true);
                  } else {
                    setOpenAccessCodeForm(true);
                  }
                }} 
                className='hidden bg-BlueHomz w-[160px] h-[37px] rounded-[4px] cursor-pointer text-sm font-normal text-white md:flex justify-center items-center gap-1'
              >
                <AddWhiteBox /> Get access code
              </button>
            </div>
          </div>
          <div className='mt-8'>
            {/* <div className='flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between md:items-center'>
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
            </div> */}
            <div>
              <Table
                totalPages={totalPages}
                fromDefault={false}
                fetchAccessCode={fetchAccessCode}
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
                  if (selectedEstate?.status === 'pending') {
                    setShowPendingModal(true);
                  } else {
                    setOpenAccessCodeForm(true);
                  }
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