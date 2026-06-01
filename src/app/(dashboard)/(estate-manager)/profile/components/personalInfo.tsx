/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomInput from "@/components/general/customInput";
import UpdateButtonPassword from "../(changePassword)/components/updateButtonPassword";
import { useAuthSlice } from "@/store/authStore";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Image from "next/image";

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
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !communityProfile?._id) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to backend
    setPhotoLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      await api.patch(`/community-manager/update-profile-photo/${communityProfile._id}`, fd);
      await getCommunityManaProfile();
      toast.success("Profile photo updated!", {
        position: "top-center",
        duration: 2000,
        style: { background: "#E8F5E9", color: "#2E7D32", fontWeight: 500, padding: "12px 20px", borderRadius: "8px" },
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to upload photo";
      toast.error(msg, { position: "top-center", duration: 4000 });
      setPhotoPreview(null);
    } finally {
      setPhotoLoading(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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

  const currentPhoto = photoPreview || communityProfile?.personal?.profilePhoto || null;
  const fullName = `${communityProfile?.personal?.firstName || ""} ${communityProfile?.personal?.lastName || ""}`.trim();

  return (
    <div>
      {/* Profile photo section */}
      <div className="flex items-center gap-4 mb-4 bg-[#FCFCFC] rounded-[12px] p-4">
        <div className="relative flex-shrink-0">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt="Profile photo"
              width={72}
              height={72}
              className="w-[72px] h-[72px] rounded-full object-cover border border-[#E6E6E6]"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-BlueHomz flex items-center justify-center text-white text-[22px] font-bold select-none">
              {fullName ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
            </div>
          )}
          {/* Upload overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoLoading}
            className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all group"
          >
            {photoLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 16.7v1.3a2 2 0 01-2 2H6a2 2 0 01-2-2v-1.3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-BlackHomz">{fullName || "Your Name"}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoLoading}
            className="text-[12px] text-BlueHomz hover:underline mt-0.5 disabled:opacity-50"
          >
            {photoLoading ? "Uploading..." : "Change photo"}
          </button>
          <p className="text-[11px] text-GrayHomz mt-0.5">JPG or PNG, max 5MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

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