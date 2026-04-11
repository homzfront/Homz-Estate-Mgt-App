/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomInput from '@/components/general/customInput';
import React, { useState, useEffect } from 'react';
import UpdateButtonPassword from '../(changePassword)/components/updateButtonPassword';
import { useAuthSlice } from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const BusinessInfo = () => {
  const { communityProfile, getCommunityManaProfile } = useAuthSlice();

  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
  });

  const [doneUpdate, setDoneUpdate] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate form when communityProfile changes
  useEffect(() => {
    if (!communityProfile) return;
    setFormData({
      businessName: communityProfile.business?.businessName || '',
      businessAddress: communityProfile.business?.businessAddress || '',
    });
  }, [communityProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityProfile?._id) return;

    setLoading(true);
    try {
      await api.patch(`/community-manager/update-profile/${communityProfile._id}`, {
        business: {
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
        },
      });

      // Refresh profile in store
      await getCommunityManaProfile();

      setDoneUpdate(true);
      toast.success("Business info updated!", {
        position: "top-center",
        duration: 2000,
        style: { background: "#E8F5E9", color: "#2E7D32", fontWeight: 500, padding: "12px 20px", borderRadius: "8px" },
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update business info";
      toast.error(msg, { position: "top-center", duration: 4000 });
      setShowDialogue(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row gap-4 mt-4">
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
          loading={loading}
          showDialogue={showDialogue}
          setShowDialogue={setShowDialogue}
        />
      </div>
    </div>
  );
};

export default BusinessInfo;