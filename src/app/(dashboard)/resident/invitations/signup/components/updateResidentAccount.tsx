/* eslint-disable @typescript-eslint/no-explicit-any */
import DotLoader from '@/components/general/dotLoader';
import { useAuthSlice } from '@/store/authStore';
import { useResidentStore } from '@/store/useResidentStore';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UpdateResidentAccount = () => {
    const { organizationId, estateId } = useResidentStore();
    const { residentProfile } = useAuthSlice();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        estateName: '', // Non-editable as per image
        zone: '', // Non-editable dropdown as per image
        streetName: '', // Non-editable dropdown as per image
        building: '', // Non-editable as per image
        apartment: '', // Non-editable as per image
        ownershipType: '', // Non-editable as per image
        rentDuration: '', // Non-editable as per image
        rentStartDate: '', // Non-editable as per image
        rentDueDate: '', // Non-editable as per image
        durationType: '', // Non-editable as per image
        residentType: '' // Non-editable as per image""
    });

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    React.useEffect(() => {
        if (residentProfile) {
            setFormData({
                firstName: residentProfile.firstName || '',
                lastName: residentProfile.lastName || '',
                estateName: residentProfile.estateName || '',
                zone: residentProfile.zone || '',
                streetName: residentProfile.streetName || '',
                building: residentProfile.building || '',
                apartment: residentProfile.apartment || '',
                ownershipType: residentProfile.ownershipType === 'rented' ? 'I am renting this apartment' : residentProfile.ownershipType || '',
                rentDuration: residentProfile.rentedDetails?.rentDuration ? `e.g ${residentProfile.rentedDetails.rentDuration}` : '',
                rentStartDate: residentProfile.rentedDetails?.rentStartDate ? new Date(residentProfile.rentedDetails.rentStartDate).toLocaleDateString() : '',
                rentDueDate: residentProfile.rentedDetails?.rentDueDate ? new Date(residentProfile.rentedDetails.rentDueDate).toLocaleDateString() : '',
                durationType: residentProfile.rentedDetails?.rentDurationType || 'Months/Years',
                residentType: residentProfile.residentType || ''
            });
        }
    }, [residentProfile]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            setIsLoading(true)
            const payload = {
                "firstName": formData?.firstName,
                "lastName": formData?.lastName,
            }
            await api.patch(`/resident/update-profile/organizations/${organizationId}/estates/${estateId}/residents/${residentProfile?._id}`, payload);
            toast.success("Profile created successfully!", {
                position: "top-center",
                duration: 2000,
                style: {
                    background: "#E8F5E9",
                    color: "#2E7D32",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
            router.push("/resident/dashboard")
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while updating your profile";

            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 4000,
                style: {
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-[#FCFCFC] rounded-lg shadow-sm w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* First Name Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                        />
                    </div>

                    {/* Last Name Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="border-t border-gray-200 my-2"></div>

                {/* Estate Name Field */}
                {formData.estateName && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Estate Name <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.estateName}
                        </div>
                    </div>
                )}

                {/* Zone and Street Name Fields */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    {formData.zone && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Select Zone (optional)
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.zone}
                            </div>
                        </div>
                    )}
                    {formData.streetName && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Street Name <span className="text-red-500">*</span>
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.streetName}
                            </div>
                        </div>
                    )}
                </div>

                {/* Building and Apartment Fields */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    {formData.building && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Building <span className="text-red-500">*</span>
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.building}
                            </div>
                        </div>
                    )}
                    {formData.apartment && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Apartment <span className="text-red-500">*</span>
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.apartment}
                            </div>
                        </div>
                    )}
                </div>

                {/* Resident Type */}
                {formData.residentType && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Resident Type <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.residentType}
                        </div>
                    </div>
                )}

                {/* Ownership Type */}
                {formData.ownershipType && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Select Ownership Type <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.ownershipType}
                        </div>
                    </div>
                )}

                {/* Rent Duration */}
                {formData.rentDuration && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Rent Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center justify-between px-3 text-gray-700">
                            {formData.rentDuration}  <span>{formData.durationType}</span>
                        </div>
                    </div>
                )}

                {/* Rent Start Date and Rent Due Date */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    {formData.rentStartDate && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Rent Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.rentStartDate}
                            </div>
                        </div>
                    )}
                    {formData.rentDueDate && (
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Rent Due Date <span className="text-red-500">*</span>
                            </label>
                            <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                                {formData.rentDueDate}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className='flex justify-end'>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`bg-BlueHomz text-white py-3 w-full md:w-[240px] text-[16px] rounded font-medium hover:bg-blue-700 transition-colors mt-4 ${isLoading && "flex justify-center items-center"}`}
                    >
                        {isLoading ? <DotLoader /> : "Confirm & Go to Dashboard"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateResidentAccount;