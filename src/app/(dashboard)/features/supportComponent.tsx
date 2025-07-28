/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, FormEvent } from "react";
import SuccessModal from "../components/successModal";
import CustomInput from "@/components/general/customInput";
import SectionOne from "./sectionOne";

interface SupportFormData {
  fullname: string;
  phoneNumber: string;
  message: string;
}

const Support = () => {
  const [doneDialogue, setDoneDialogue] = useState<boolean>(false);
  const [formData, setFormData] = useState<SupportFormData>({
    fullname: "",
    phoneNumber: "",
    message: ""
  });
  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof SupportFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d+$/.test(formData.phoneNumber)) {
      setError("Phone number must contain only digits");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setDoneDialogue(true);
    // if (loading) return;

    // setLoading(true);

    // try {
    //   const response = await api.post("/support/create/enterprise", {
    //     fullname: formData.fullname,
    //     message: formData.message,
    //     phoneNumber: parseInt(formData.phoneNumber),
    //   });

    //   if (response.data.statuscode === 200 || response.data.statuscode === 201) {
    //     setFormData({
    //       fullname: "",
    //       phoneNumber: "",
    //       message: ""
    //     });
    //     setDoneDialogue(true);
    //   } else {
    //     const errorMessage = response?.error?.message || "Failed to send message";
    //     setError(errorMessage);
    //   }
    // } catch (error: any) {
    //   let errorMessage = "Failed to send message";

    //   if (error?.response?.data?.error?.errors?.length > 0) {
    //     errorMessage = error.response.data.error.errors[0];
    //   } else if (error?.response?.data?.message) {
    //     errorMessage = error.response.data.message;
    //   }

    //   setError(errorMessage);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="w-full p-7">
      <h1 className="text-[20px] font-[500] mb-4 text-BlackHomz">Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <SectionOne />
        <div>
          <div className="flex flex-col max-w-[780px] gap-4">
            <CustomInput
              label="Full Name"
              onChange={(e: any) => handleChange("fullname", e.target.value)}
              value={formData.fullname}
              type="text"
              placeholder="FullName"
              required
              className='h-[45px] pl-4'
            />
            <CustomInput
              label="Phone Number"
              type="text" // Changed from number to text to better handle validation
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e: any) => handleChange("phoneNumber", e.target.value)}
              required
              className='h-[45px] pl-4'
            />
            <label className="text-BlackHomz text-[14px] font-[500] mb-1">
              Your Message <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e: any) => handleChange("message", e.target.value)}
              placeholder="Your Message"
              className="rounded-md px-4 h-[156px] border py-2"
            />
            {error && <span className="text-error text-[11px] italic">{error}</span>}
            <button
              onClick={handleSubmit}
              className={`bg-BlueHomz mt-4 hover:bg-blue-400 text-white h-10 w-full rounded-md`}
              type="submit"
            // disabled={loading}
            >
              {/* {loading ? <LoadingFormII /> :  */}
              Send Message
            </button>
          </div>
        </div>
        {doneDialogue && (
          <SuccessModal
            isOpen={doneDialogue}
            handleSubmit={() => { setDoneDialogue(false) }}
            title="Message Sent"
            successText="We'll get back to you shortly"
            submitText="Close"
            closeSuccessModal={() => setDoneDialogue(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Support;