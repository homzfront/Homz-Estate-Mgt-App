/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import CustomModal from '@/components/general/customModal';
import ArrowDown from '@/components/icons/arrowDown'
import Image from 'next/image'
import React from 'react'
import Dropdown from '@/components/general/dropDown';
import HomDashIcon from '@/components/icons/homDashIcon';
import NoHomDashIcon from '@/components/icons/noHomDashIcon';
import AddIcon from '@/components/icons/addIcon';
import AccessIcon from '@/components/icons/accessIcon';
import { useRouter } from 'next/navigation';
import PickEstate from '../components/pickEstate';
import useClickOutside from '@/app/utils/useClickOutside';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import ArrowRight from '@/components/icons/arrowRight';
import Table from './components/table';

const option = [
  { id: 1, estate: 'Golden Gates Estate', building: "Building 10", apartmentName: "Apartment 10", residents: 20 },
]

const Dashboard = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    property: '',
  });
  const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
  const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
  const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
  const closeRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(closeRef as any, () => {
    setOpenEstateList(false);
  });
  const options = [
    { id: 1, label: 'Property1' },
    { id: 2, label: 'Property2' },
    { id: 3, label: 'Property3' },
    { id: 4, label: 'Property4' },
  ];

  const secondOptions = [
    { id: 1, name: '[Primary Resident] / [Co-Resident]', extra: "Role" },
    { id: 2, name: '[Renter]/[Owner]', extra: "Ownership Type" },
    { id: 3, name: '[Rent Due Date]', extra: "Rent Due Date" },
  ]
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  React.useEffect(() => {
    setSelectedEstate(option[0]);
  }, [setSelectedEstate]);

  return (
    <div className='p-8 mb-[150px]'>
      {openEstateList &&
        <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
          <PickEstate closeRef={closeRef} />
        </CustomModal>
      }
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
          {selectedEstate ? selectedEstate?.estate : "Diamond Estate"}
        </div>
        <div className='mt-1.5'>
          <ArrowDown size={20} className='#4E4E4E' />
        </div>
      </button>
      <h1 className='text-BlackHomz font-bold text-[16px] md:text-[20px]'>Hello, [Resident’s First Name]</h1>
      <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Welcome to your estate dashboard.</h3>

      <div className='mt-4 md:mt-8 flex flex-col md:flex-row gap-6'>
        {/* blue-box */}
        <div className='bg-BlueHomz p-4 w-full max-w-[470px] rounded-[12px] flex flex-col gap-10'>
          <div className='flex items-center gap-2'>
            <HomDashIcon />
            <p className='text-[16px] md:text-[18px] font-medium text-white'>Your Properties</p>
          </div>
          <Dropdown
            options={options}
            onSelect={(option) => handleInputChange('property', option.label)}
            selectOption="Select Property"
            showSearch={false}
            borderColor='border-[#006AFF]'
            arrowColor='#006AFF'
            bgColor='bg-white'
            textColor='text-BlueHomz'
            openBorder='border-none'
          />
        </div>
        {/* Occupancy Information */}
        {formData && formData?.property?.length === 0 ?
          <div className='bg-inputBg p-5 w-full max-w-[620px] rounded-[12px] flex flex-col gap-2'>
            <NoHomDashIcon />
            <div className='flex flex-col gap-1'>
              <h2 className='text-sm md:text-[16px] font-medium text-BlackHomz'>No property selected.</h2>
              <p className='text-sm md:text-[16px] font-normal text-GrayHomz'>Please choose a property from the dropdown to view its details.</p>
            </div>
          </div>
          :
          <div className='bg-whiteblue p-4 w-full max-w-[620px] rounded-[12px] flex flex-col justify-between'>
            <div className='flex justify-between items-center'>
              <h1 className='text-sm md:text-[16px] font-bold text-BlackHomz'>Occupancy Information</h1>
              <span className='text-xs md:text-[13px] font-normal text-BlueHomz hidden md:flex items-center gap-1'>View More <ArrowRight className='#006AFF' /></span>
            </div>
            <div className="grid grid-cols-2 md:gap-4 md:grid-cols-3">
              {secondOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`
                    mt-6 md:mt-0 flex flex-col justify-between p-3 rounded-[8px] bg-white min-h-[100px]
                    ${index === 2 ? "col-span-2 md:col-span-1" : ""}
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
        }
      </div>

      {/* Visitor Access Section */}
      <div className={`mt-8 rounded-[12px] bg-inputBg md:bg-white md:border md:border-GrayHomz6 p-4 ${formData && formData?.property?.length > 0 ? "h-auto" : " h-[80vh] md:h-[500px]"}`}>
        <div className='flex justify-between items-center'>
          <h3 className='text-sm md:text-[16px] font-semibold md:font-bold text-GrayHomz'>Access Control</h3>
          <span className='text-xs md:text-[13px] font-normal text-BlueHomz hidden md:flex items-center gap-1'>View More <ArrowRight className='#006AFF' /></span>
        </div>
        {
          formData && formData?.property?.length > 0 ?
            <div>
              <Table />
            </div>
            :
            <div className='p-6 w-full'>
              <h1 className='text-sm md:text-[16px] font-medium md:font-semibold text-GrayHomz'>Visitor Access</h1>
              <div className='flex flex-col justify-center h-full items-center gap-2'>
                <AccessIcon />
                <p className='text-[#141313] font-medium text-sm md:text-[16px] text-center'>No Visitor Access Requests Yet</p>
                <h2 className='text-[#4E4E4E] font-normal text-sm md:text-[16px] text-center'>You haven’t requested access for any visitors yet. When you do, their details will show up here.</h2>
                <button onClick={() => router.push("")} className='text-BlueHomz cursor-ponter text-sm font-normal flex items-center gap-1'>
                  <AddIcon /> Request Visitor Access
                </button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Dashboard