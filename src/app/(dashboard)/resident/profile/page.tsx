"use client"
import CustomInput from '@/components/general/customInput'
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long'
import CameraIcon from '@/components/icons/cameraIcon'
import Image from 'next/image'
import React from 'react'

const Profile = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div className='p-8 mb-[150px]'>
      <div className='flex gap-2 items-center'>
        <div className='md:hidden'><ArrowLeft16Long /></div>
        <h1 className='text-[16px] md:text-[20px] text-BlackHomz font-normal md:font-medium'>
          Profile
        </h1>
      </div>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='md:h-[200px] bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex gap-4 items-center'>
          <Image
            src={"/emptyImageUploadMo.png"}
            alt='emp-img'
            height={72}
            width={72}
            className='md:hidden'
          />
          <Image
            src={"/emptyImageUpload.png"}
            alt='emp-img'
            height={152}
            width={152}
            className='hidden md:block'
          />
          <div>
            <p className='text-BlueHomz md:font-semibold font-normal text-sm flex items-center gap-1'>
              <CameraIcon />  Click to upload
            </p>
            <p className='text-[11px] font-normal text-GrayHomz'>
              PDF, JPG (max. 5mb)
            </p>
          </div>
        </div>
        <div className='bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex flex-col gap-4'>
          <div className='flex flex-col gap-1 w-full text-sm'>
            <h3 className='mb-1 text-sm font-medium text-GrayHomz'>Email</h3>
            <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
              Auto-filled
            </span>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <CustomInput
              borderColor="#A9A9A9"
              label="First Name"
              placeholder="e.g Dele"
              value={formData.firstName}
              onValueChange={(value) => handleInputChange('firstName', value)}
              className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
            />
            <CustomInput
              borderColor="#A9A9A9"
              label="Last Name"
              placeholder="e.g Dayo"
              value={formData.lastName}
              onValueChange={(value) => handleInputChange('lastName', value)}
              className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
            />
          </div>
          <CustomInput
            borderColor="#A9A9A9"
            type='number'
            label="Phone Number"
            placeholder="[0000 - 000 - 0000]"
            value={formData.phoneNumber}
            onValueChange={(value) => handleInputChange('phoneNumber', value)}
            className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
          />
        </div>
      </div>
      <div>
        <div />
        <button
          className={`${(!formData?.firstName || !formData?.lastName || !formData?.phoneNumber) ? "bg-GrayHomz6 text-GrayHomz5" : "text-white bg-BlueHomz"} rounded-[4px] mt-4 md:text-[16px] text-sm font-normal h-[48px] w-full md:w-[120px] flex justify-center items-center`}
          disabled={!formData?.firstName || !formData?.lastName || !formData?.phoneNumber}
        >
          Save Update
        </button>
      </div>
    </div>
  )
}

export default Profile