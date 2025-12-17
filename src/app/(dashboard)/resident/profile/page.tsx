"use client"

import CustomInput from '@/components/general/customInput'
import CameraIcon from '@/components/icons/cameraIcon'
import DeleteIcon from '@/components/icons/deleteIcon'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import ChangePassword from './(changePassword)/changePassword'
import { useAuthSlice } from '@/store/authStore'
import { useResidentStore } from '@/store/useResidentStore'

const Profile = () => {
  const { residentProfile, getResidentProfile, userData } = useAuthSlice()
  const { isResident } = useResidentStore()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDeleteImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  // Fetch resident profile when component mounts
  useEffect(() => {
    if (!isResident) return
    const residentId = userData?._id || userData?.userId
    if (residentId) {
      getResidentProfile(residentId)
    }
  }, [isResident, userData, getResidentProfile])

  // Update form when residentProfile changes
  useEffect(() => {
    if (!residentProfile) return;

    setFormData({
      firstName: residentProfile.firstName || '',
      lastName: residentProfile.lastName || '',
      email: residentProfile.email || '',
      phoneNumber: '', // phone not available yet
    });
  }, [residentProfile]);

  return (
    <div className='p-8 mb-[150px]'>
      <h1 className='text-[16px] md:text-[20px] text-BlackHomz font-normal md:font-medium'>
        Profile
      </h1>

      {/* Tabs */}
      <div className='mt-4 flex flex-col md:flex-row gap-4'>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-md ${activeTab === 'personal' ? 'bg-BlueHomz text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-md ${activeTab === 'password' ? 'bg-BlueHomz text-white' : 'bg-blue-200 text-blue-600'}`}
          >
            Change Password
          </button>
        </div>

        {/* Mobile-only gray line */}
        <div className="md:hidden mt-2 mb-4 h-[10px] bg-black w-max rounded-full"></div>
      </div>

      {/* Tab Content */}
      <div className='mt-4'>
        {activeTab === 'personal' && (
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Image Upload Section */}
              <div className='md:h-[200px] bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex gap-4 items-center'>
                <Image
                  src={imagePreview || "/emptyImageUpload.png"}
                  alt='Profile'
                  height={152}
                  width={152}
                  className='hidden md:block rounded-full'
                />
                <Image
                  src={imagePreview || "/emptyImageUploadMo.png"}
                  alt='Profile'
                  height={72}
                  width={72}
                  className='md:hidden rounded-full'
                />
                <div className='flex flex-col gap-2'>
                  {!selectedImage ? (
                    <label className='cursor-pointer text-BlueHomz flex items-center gap-1'>
                      <CameraIcon />
                      Click to upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className='flex flex-col gap-2'>
                      <label className='cursor-pointer text-BlueHomz flex items-center gap-1'>
                        <CameraIcon />
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                      <button
                        onClick={handleDeleteImage}
                        className='flex items-center gap-1 text-RedHomz'
                      >
                        <DeleteIcon />
                        Delete Photo
                      </button>
                    </div>
                  )}
                  <p className='text-[11px] font-normal text-GrayHomz'>PDF, JPG (max. 5mb)</p>
                </div>
              </div>


              {/* Personal Info Form */}
              <div className='bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex flex-col gap-8'>
                <div className='flex flex-col gap-1 w-full text-sm'>
                  <h3 className='mb-1 text-sm font-medium text-GrayHomz'>Email</h3>
                  <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                    {formData.email || "Auto-filled"}
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

            <div className='mt-8 flex justify-end'>
              <button
                className={`${!formData?.firstName || !formData?.lastName || !formData?.phoneNumber
                  ? "bg-GrayHomz6 text-GrayHomz5 cursor-not-allowed"
                  : "text-white bg-BlueHomz hover:bg-blue-700"
                  } 
      rounded-[4px] md:text-[16px] text-sm font-normal h-[48px] px-6 flex justify-center items-center
      w-full md:w-auto` }
                disabled={!formData?.firstName || !formData?.lastName || !formData?.phoneNumber}
              >
                Save Update
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className='mt-4'>
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
