/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomInput from '@/components/general/customInput';
import React, { useState, useEffect } from 'react';
import UpdateButtonPassword from '../(changePassword)/components/updateButtonPassword';
// import CameraIcon from '@/components/icons/cameraIcon';
// import DeleteIcon from '@/components/icons/deleteIcon';
import { useAuthSlice } from '@/store/authStore';
import Image from 'next/image';

const BusinessInfo = () => {
  const { communityProfile } = useAuthSlice();

  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
  });

  const [doneUpdate, setDoneUpdate] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Populate form when communityProfile changes
  useEffect(() => {
    if (!communityProfile) return;

    setFormData({
      businessName: communityProfile.business?.businessName || '',
      businessAddress: communityProfile.business?.businessAddress || '',
    });

    if (communityProfile.business?.photoUrl) {
      setImagePreview(communityProfile.business.photoUrl);
    }
  }, [communityProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || e.target.files.length === 0) return;
  //   const file = e.target.files[0];
  //   setSelectedImage(file);
  //   setImagePreview(URL.createObjectURL(file));
  // };

  // const handleDeleteImage = () => {
  //   setSelectedImage(null);
  //   setImagePreview('');
  // };

  const updateDone = async (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update business info & upload photo
  };

  // Check if form is complete
  const isFormComplete =
    formData.businessName.trim() !== '' &&
    formData.businessAddress.trim() !== '';

  return (
    <div className="mt-4">
      {/* Horizontal layout: Image + Form */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Image Upload Section */}
        {/* <div className='md:w-1/2 md:h-[200px] bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex gap-4 items-center'>
          <Image
            src={imagePreview || "/emptyImageUpload.png"}
            alt='Business'
            height={152}
            width={152}
            className='hidden md:block rounded-full'
          />
          <Image
            src={imagePreview || "/emptyImageUploadMo.png"}
            alt='Business'
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
        </div> */}

        {/* Business Form */}
        <div className="md:w-1/2 bg-[#FCFCFC] rounded-[12px] p-4 flex flex-col gap-4">
          <CustomInput
            label="Business Name"
            placeholder="e.g Builders Group Ltd"
            value={formData.businessName}
            onValueChange={(value) => handleInputChange('businessName', value)}
            className='h-[45px] w-full pl-4'
          />
          <CustomInput
            label="Business Address"
            placeholder="e.g Shomolu estate, Lagos"
            value={formData.businessAddress}
            onValueChange={(value) => handleInputChange('businessAddress', value)}
            className='h-[45px] w-full pl-4'
          />
        </div>
      </div>

      {/* Save Update Button */}
      <div className="mt-4 flex justify-end">
        <UpdateButtonPassword
          updateDone={updateDone}
          doneUpdate={doneUpdate}
          setDoneUpdate={setDoneUpdate}
          loading={false}
          showDialogue={showDialogue}
          setShowDialogue={setShowDialogue}
           
        />
      </div>
    </div>
  )
}

export default BusinessInfo;