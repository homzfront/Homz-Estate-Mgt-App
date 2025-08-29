/* eslint-disable @typescript-eslint/no-explicit-any */
import { useResidentStore } from '@/store/useResidentStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import React, { useState } from 'react';

const UpdateResidentAccount = () => {
    const { publicCommunity, setPublicCommunity } = useSelectedCommunity();
    const { organizationId, estateId } = useResidentStore();
    const [formData, setFormData] = useState({
        firstName: '[Autofilled - First Name]',
        lastName: '[Autofilled - Last Name]',
        estateName: 'Auto filled', // Non-editable as per image
        zone: 'None', // Non-editable dropdown as per image
        streetName: '[Select Name]', // Non-editable dropdown as per image
        building: '[Building Name]', // Non-editable as per image
        apartment: '[Apartment Name]', // Non-editable as per image
        ownershipType: 'I am renting this apartment', // Non-editable as per image
        rentDuration: 'e.g 12', // Non-editable as per image
        rentStartDate: '[Rent Start Date]', // Non-editable as per image
        rentDueDate: '[Rent Due Date]' // Non-editable as per image
    });

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getPublicEstate = async () => {
        try {
            const response: any = await fetch(`http://localhost:4000/api/v1/estates/public/single-estate/organizations/${organizationId}/estates/${estateId}`

            );
            const data = await response.json();
            console.log("Public Estate Response:", data);
            setPublicCommunity(data?.data);
        } catch (error) {
            console.error("Failed to fetch estates:", error);
        };
    }

    React.useEffect(() => {
        getPublicEstate();
    }, [organizationId, estateId]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    console.log("Public Community:", publicCommunity);

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
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Estate Name <span className="text-red-500">*</span>
                    </label>
                    <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                        {formData.estateName}
                    </div>
                </div>

                {/* Zone and Street Name Fields */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Select Zone (optional)
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.zone}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Street Name <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.streetName}
                        </div>
                    </div>
                </div>

                {/* Building and Apartment Fields */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Building <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.building}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Apartment <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.apartment}
                        </div>
                    </div>
                </div>

                {/* Ownership Type */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Select Ownership Type <span className="text-red-500">*</span>
                    </label>
                    <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                        {formData.ownershipType}
                    </div>
                </div>

                {/* Rent Duration */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Rent Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center justify-between px-3 text-gray-700">
                        {formData.rentDuration}  <span>Months/Years</span>
                    </div>
                </div>

                {/* Rent Start Date and Rent Due Date */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Rent Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.rentStartDate}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Rent Due Date <span className="text-red-500">*</span>
                        </label>
                        <div className="h-10 rounded bg-gray-100 text-sm w-full flex items-center px-3 text-gray-700">
                            {formData.rentDueDate}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        className="bg-BlueHomz text-white py-3 w-full md:w-[240px] text-[16px] rounded font-medium hover:bg-blue-700 transition-colors mt-4"
                    >
                        Confirm & Go to Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateResidentAccount;