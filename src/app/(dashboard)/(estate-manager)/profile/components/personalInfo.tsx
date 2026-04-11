/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import CustomInput from "@/components/general/customInput";
import UpdateButtonPassword from "../(changePassword)/components/updateButtonPassword";
import { useAuthSlice } from "@/store/authStore";
import api from "@/utils/api";
import toast from "react-hot-toast";

const PersonalInfo = () => {
  const { communityProfile, getCommunityManaProfile } = useAuthSlice();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [doneUpdate, setDoneUpdate] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate form when communityProfile changes
  useEffect(() => {
    if (!communityProfile) return;
    setFormData({
      firstName: communityProfile.personal?.firstName || "",
      lastName: communityProfile.personal?.lastName || "",
      phoneNumber: communityProfile.personal?.phoneNumber || "",
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      // Refresh profile in store
      await getCommunityManaProfile();

      setDoneUpdate(true);
      toast.success("Personal info updated!", {
        position: "top-center",
        duration: 2000,
        style: { background: "#E8F5E9", color: "#2E7D32", fontWeight: 500, padding: "12px 20px", borderRadius: "8px" },
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(msg, { position: "top-center", duration: 4000 });
      setShowDialogue(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFCFC] rounded-[12px] p-4">
        <CustomInput
          label="First Name"
          placeholder="e.g Daniel"
          value={formData.firstName}
          onValueChange={value => handleInputChange("firstName", value)}
          required
          className="h-[45px] pl-4"
        />
        <CustomInput
          label="Last Name"
          placeholder="e.g Dee"
          value={formData.lastName}
          onValueChange={value => handleInputChange("lastName", value)}
          required
          className="h-[45px] pl-4"
        />
        {/* Email is auto-filled, not editable */}
        <div className="flex flex-col">
          <label className="text-[12px] text-GrayHomz mb-1">Email</label>
          <span className="h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4">
            {communityProfile?.email || "Auto-filled"}
          </span>
        </div>
        <CustomInput
          label="Phone Number"
          placeholder="e.g 070 0000 0000"
          value={formData.phoneNumber}
          onValueChange={value => handleInputChange("phoneNumber", value)}
          required
          className="h-[45px] pl-4"
        />
      </div>

      <UpdateButtonPassword
        updateDone={updateDone}
        doneUpdate={doneUpdate}
        setDoneUpdate={setDoneUpdate}
        loading={loading}
        showDialogue={showDialogue}
        setShowDialogue={setShowDialogue}
      />
    </div>
  );
};

export default PersonalInfo;