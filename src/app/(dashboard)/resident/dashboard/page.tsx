"use client"
import CustomModal from '@/components/general/customModal';
import ArrowDown from '@/components/icons/arrowDown'
import Image from 'next/image'
import React from 'react'
import PickEstate from '../../components/pickEstate';
import Dropdown from '@/components/general/dropDown';
import HomDashIcon from '@/components/icons/homDashIcon';
import NoHomDashIcon from '@/components/icons/noHomDashIcon';
import AddIcon from '@/components/icons/addIcon';
import AccessIcon from '@/components/icons/accessIcon';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  // const [formData, setFormData] = React.useState({
  //   property: '',
  // });
  const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
  const options = [
    { id: 1, label: 'Property1' },
    { id: 2, label: 'Property2' },
    { id: 3, label: 'Property3' },
    { id: 4, label: 'Property4' },
  ];
  // const handleInputChange = (field: string, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };
  return (
    <div className='p-8 mb-[150px]'>
      {openEstateList &&
        <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
          <PickEstate />
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
          Golden Palms Estate
        </div>
        <button className='mt-1.5'>
          <ArrowDown size={20} className='#4E4E4E' />
        </button>
      </button>
      <h1 className='text-BlackHomz font-bold text-[16px] md:text-[20px]'>Hello, [Resident’s First Name]</h1>
      <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Welcome to your estate dashboard.</h3>
      <div className='mt-8 flex flex-col md:flex-row gap-6'>
        <div className='bg-BlueHomz p-4 w-full max-w-[470px] rounded-[12px] flex flex-col gap-10'>
          <div className='flex items-center gap-2'>
            <HomDashIcon />
            <p className='text-[16px] md:text-[18px] font-medium text-white'>Your Properties</p>
          </div>
          <Dropdown
            options={options}
            // onSelect={(option) => handleInputChange('property', option.label)}
            onSelect={()=>{}}
            selectOption="Select Property"
            showSearch={false}
            borderColor='border-[#006AFF]'
            arrowColor='#006AFF'
            bgColor='bg-white'
            textColor='text-BlueHomz'
          />
        </div>
        <div className='bg-inputBg p-5 w-full max-w-[620px] rounded-[12px] flex flex-col gap-2'>
          <NoHomDashIcon />
          <div className='flex flex-col gap-1'>
            <h2 className='text-sm md:text-[16px] font-medium text-BlackHomz'>No property selected.</h2>
            <p className='text-sm md:text-[16px] font-normal text-GrayHomz'>Please choose a property from the dropdown to view its details.</p>
          </div>
        </div>
      </div>
      <div className='mt-8 bg-inputBg p-6 rounded-[12px] h-[80vh] md:h-[500px] w-full'>
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
    </div >
  )
}

export default Dashboard