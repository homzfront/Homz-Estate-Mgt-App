/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import CustomModal from '@/components/general/customModal';
import ArrowDown from '@/components/icons/arrowDown'
import Image from 'next/image'
import React from 'react'
// import Dropdown from '@/components/general/dropDown';
// import HomDashIcon from '@/components/icons/homDashIcon';
// import NoHomDashIcon from '@/components/icons/noHomDashIcon';
import AddIcon from '@/components/icons/addIcon';
import AccessIcon from '@/components/icons/accessIcon';
// import { useRouter } from 'next/navigation';
import PickEstate from '../components/pickEstate';
import useClickOutside from '@/app/utils/useClickOutside';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import ArrowRight from '@/components/icons/arrowRight';
import LockWarning from '@/components/icons/estateManager&Resident/desktop/lockWarning';
import RequestUnsuccessful from '@/components/icons/estateManager&Resident/desktop/requestUnsuccessful';
import ExportIcon from '@/components/icons/estateManager&Resident/desktop/exportIcon';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useAuthSlice } from '@/store/authStore';
import capitalizeFirstLetter from '@/app/utils/capitalizeFirstLetter';
import formatDateReadable from '@/app/utils/formatDateReadable';
import { useRouter } from 'next/navigation';
import { useAccessCodeSlice } from '@/store/useAccessCode';
import { LoaderIcon } from 'react-hot-toast';
import Table from '../visitor-access/components/table';

// const option = [
//   { id: 1, estate: 'Golden Gates Estate', building: "Building 10", apartmentName: "Apartment 10", residents: 20 },
// ]

const Dashboard = () => {
  const router = useRouter();
  const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
  const [showTable, setShowTable] = React.useState<boolean>(false);
  const [unsucc, setUnsucc] = React.useState<boolean>(true);
  const residentCommunity = useResidentCommunity((state) => state.residentCommunity);
  const residentProfile = useAuthSlice((state) => state.residentProfile);
  const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
  const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
  const { accessCode, getAccessCode, initialLoading, isLoading, pageLoading } = useAccessCodeSlice();
  const closeRef = React.useRef<HTMLDivElement>(null);
  const prevEstateIdRef = React.useRef<string | null>(null);
  
  useClickOutside(closeRef as any, () => {
    setOpenEstateList(false);
  });
  // const options = [
  //   { id: 1, label: 'Property1' },
  //   { id: 2, label: 'Property2' },
  //   { id: 3, label: 'Property3' },
  //   { id: 4, label: 'Property4' },
  // ];

  const secondOptions = [
    { id: 1, name: 'Primary Resident', extra: "Role" },
    { id: 2, name: capitalizeFirstLetter(residentProfile?.ownershipType), extra: "Ownership Type" },
    { id: 3, name: formatDateReadable(residentProfile?.rentedDetails?.rentDueDate), extra: "Rent Due Date" },
  ];

  const fetchAccessCode = async () => {
    if (selectedEstate && selectedEstate.status === 'accepted') {
      await getAccessCode(1, 8, '', '');
    }
  };

  React.useEffect(() => {
    if (residentCommunity && residentCommunity?.length > 0 && !selectedEstate) {
      setSelectedEstate(residentCommunity[0]);
    } else {
      const foundEstate =
        residentCommunity?.find(
          (estate) => estate._id === selectedEstate?._id
        ) || null; // fallback to null if undefined

      setSelectedEstate(foundEstate);
    }
  }, [residentCommunity, selectedEstate, setSelectedEstate]);

  // Only fetch when selectedEstate changes
  React.useEffect(() => {
    if (!selectedEstate || selectedEstate.status !== 'accepted') return;

    const estateChanged = prevEstateIdRef.current !== selectedEstate.estateId;
    const isFirstLoad = !accessCode && initialLoading;
    
    // Fetch only if: estate changed or first load with no cached data
    if (estateChanged || isFirstLoad) {
      prevEstateIdRef.current = selectedEstate.estateId;
      fetchAccessCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEstate?.estateId]);

  React.useEffect(() => {
    if (selectedEstate?.status === "accepted") {
      setUnsucc(false)
      setShowTable(true)
    }
  }, [selectedEstate]);

  return (
    <div className='p-8 mb-[150px]'>
      {openEstateList &&
        <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
          <PickEstate closeRef={closeRef} />
        </CustomModal>
      }
      {showTable &&
        <button onClick={() => setOpenEstateList(true)} className='md:hidden border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between w-full h-[48px] rounded-[4px] px-4 mb-4 onClick={()=> setOpenEsateList(true)}'>
          <div className='flex gap-2 items-center'>
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={"/houses.jpg"}
                alt={"estate-img"}
                width={24}
                height={24}
                className="object-cover w-full h-full"
              />
            </div>
            <div className='flex flex-col'>
              <p>{selectedEstate ? selectedEstate?.estateName : ""}</p>
              <span className='text-xs'>
                {/* [Block 6], [Apartment 1] {selectedEstate ? `, ${selectedEstate?.building}, ${selectedEstate?.apartmentName}` : ""  } */}
              </span>
            </div>
          </div>
          <div className='mt-1.5'>
            <ArrowDown size={20} className='#4E4E4E' />
          </div>
        </button>
      }
      {(!unsucc && residentProfile?.firstName) &&
        <>
          <h1 className='text-BlackHomz font-bold text-[16px] md:text-[20px]'>Hello, {residentProfile?.firstName}</h1>
          <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>{showTable ? "Welcome to your estate dashboard" : "You’ve successfully created your account and requested to join [Building name], [Apartment name] under [Estate Name]."}</h3>
        </>
      }
      {(!showTable && selectedEstate?.status === 'pending' ?
        <div className="flex flex-col md:flex-row mt-6 items-start gap-4 p-4 border border-warning2 rounded-[12px] bg-warningBg w-full md:w-[600px] lg:w-[900px]">
          {/* Left Circle with Icon */}
          <LockWarning />

          {/* Right Content */}
          <div className="flex-1">
            <h2 className="text-[18px] font-medium text-warning2 mb-2">
              Join Request Pending
            </h2>
            <p className="text-sm text-GrayHomz font-normal mb-3">
              Your request to join <span className="font-medium">{selectedEstate?.estateName}</span> is currently
              pending approval from the estate manager. Once your request is
              accepted, you&apos;ll be able to:
            </p>
            <ul className="list-disc list-inside text-sm text-GrayHomz font-normal space-y-1 mb-3">
              <li className="">
                View estate and property details
              </li>
              <li>Request visitor access</li>
              <li>Make payments</li>
              <li>Receive estate announcement</li>
            </ul>
            <p className="text-sm text-GrayHomz font-normal">
              We&apos;ll notify you as soon as your request is accepted.
            </p>
          </div>
        </div> : selectedEstate?.status === 'rejected' ?
          <div className="flex flex-col md:flex-row mt-6 items-start gap-4 p-4 border border-[#D92D20] rounded-[12px] bg-[#FDF2F2] w-full md:w-[600px] lg:w-[900px]">
            {/* Left Circle with Icon */}
            <RequestUnsuccessful />

            {/* Right Content */}
            <div className="flex-1">
              <h2 className="text-[18px] font-medium text-[#D92D20] mb-2">
                Your Join Request Was Not Approved
              </h2>
              <p className="text-sm text-GrayHomz font-normal mb-3">
                Your request to join <span className="font-medium">{selectedEstate?.estateName}</span> was reviewed and unfortunately not
                approved by the estate manager. If this was unexpected or you believe it may have been a mistake, you can contact them for clarification or reach out to our support team.
              </p>
              <button className="text-sm text-BlueHomz font-normal flex items-center gap-2">
                Contact Support <ExportIcon className='#006AFF' />
              </button>
            </div>
          </div> : null
      )}
      {showTable &&
        <div className='mt-4 md:mt-8'>
          {/* Occupancy Information */}
          <div className='bg-whiteblue p-4 w-full rounded-[12px] flex flex-col justify-between border border-BlueHomz'>
            <div className='flex justify-between items-center'>
              <h1 className='text-sm md:text-[16px] font-bold text-BlackHomz'>Occupancy Information</h1>
              <span className='text-xs md:text-[13px] font-normal text-BlueHomz hidden md:flex items-center gap-1'>More Info <ArrowRight className='#006AFF' /></span>
            </div>
            <div className="grid grid-cols-2 md:gap-4 md:grid-cols-3 md:mt-6">
              {secondOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`
                    mt-2 md:mt-0 flex flex-col justify-between p-3 rounded-[8px] bg-white min-h-[100px] md:h-[120px]
                    ${index === 2 ? "col-span-2 md:col-span-1" : ""}
                    ${index === 1 ? "ml-1" : ""}
                  `}
                >
                  <span className="text-xs md:text-[13px] font-normal text-GrayHomz">
                    {option.extra}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-BlackHomz mt-auto">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }

      {/* Visitor Access Section */}
      {((initialLoading || isLoading || pageLoading) && !showTable) ? (
        <div className='h-[60vh] w-full flex items-center justify-center text-GrayHomz'><LoaderIcon /></div>
      ) : showTable ? (
        <div className={`mt-8 rounded-[12px]  ${accessCode && accessCode?.length > 0 ? "bg-inputBg md:bg-white" : "bg-[#F6F6F6]"} md:border md:border-GrayHomz6 py-4 ${accessCode && accessCode?.length > 0 ? "h-auto" : " h-[80vh] md:h-[500px]"}`}>
          <div className='flex justify-between items-center px-4'>
            <h3 className='text-sm md:text-[16px] font-semibold md:font-bold text-GrayHomz'>Visitor Access</h3>
            {accessCode && accessCode?.length > 0 && <span onClick={() => router.push("/resident/visitor-access")} className='cursor-pointer text-xs md:text-[13px] font-normal text-BlueHomz hidden md:flex items-center gap-1'>View More <ArrowRight className='#006AFF' /></span>}
          </div>
          {
            accessCode && accessCode?.length > 0 ?
              <div className='px-4 md:px-0'>
                <Table
                  totalPages={1}
                  fromDefault={false}
                  fetchAccessCode={fetchAccessCode}
                />
              </div>
              :
              <div className='p-6 w-full'>
                <div className='mt-[20%] md:mt-[10%] flex flex-col justify-center h-full items-center gap-2'>
                  <AccessIcon />
                  <p className='text-[#141313] font-medium text-sm md:text-[16px] text-center'>No Visitor Access Requests Yet</p>
                  <h2 className='text-[#4E4E4E] font-normal text-sm md:text-[16px] text-center'>You haven’t requested access for any visitors yet. When you do, their details will show up here.</h2>
                  <button onClick={() => router.push("/resident/visitor-access")} className='text-BlueHomz cursor-ponter text-sm font-normal flex items-center gap-1'>
                    <AddIcon /> Request Visitor Access
                  </button>
                </div>
              </div>
          }
        </div>
      ) : null
      }
    </div>
  )
}

export default Dashboard