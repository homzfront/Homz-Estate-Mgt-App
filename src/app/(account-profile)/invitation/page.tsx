/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Dropdown from '@/components/general/dropDown'
import CustomInput from '@/components/general/customInput'
import DateIcon from '@/components/icons/dateIcon'
import { getToken } from "@/utils/cookies";
import { useAuthSlice } from '@/store/authStore'
import { useResidentStore } from '@/store/useResidentStore'
import { useResidentParams } from '@/hooks/useResidentParams'
import toast from "react-hot-toast";
import DotLoader from '@/components/general/dotLoader'
import api from '@/utils/api'
import { formatDueDateForSubmission } from '@/app/utils/formatDueDateForSubmission'
import { useSelectedCommunity } from '@/store/useSelectedCommunity'


const ownerTypeOption = [
    {
        id: 1,
        label: "I am renting this apartment/property",
        value: "rented"
    },
    {
        id: 2,
        label: "I own this apartment/property",
        value: "owned"
    }
];

const durationTypeOptions = [
    { id: 1, label: "Months", value: "months" },
    { id: 2, label: "Years", value: "years" }
];

const Resident = () => {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        selectOwnershipType: '',
        rentDuration: '',
        rentDurationType: 'months',
        rentStartDate: '',
        rentDueDate: '',
        residencyStartDate: '',
        estateName: ''
    });
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('');
    // const [selectedOwner, setSelectedOwner] = useState(ownerTypeOption[0]);
    const [selectedStreetName, setSelectedStreetName] = useState('');
    const [selectedStreetZone, setSelectedStreetZone] = useState('');
    const [calculatedDueDate, setCalculatedDueDate] = useState('');
    const { userData } = useAuthSlice();
    const [loading, setLoading] = useState(false);
    const { publicCommunity, setPublicCommunity } = useSelectedCommunity();


    // Zones
    const zoneOptions = publicCommunity?.zones.map((z) => ({
        id: z.name,
        label: z.name,
    }));

    // Streets
    const streetOptions = publicCommunity?.streets.map((s) => ({
        id: s.name,
        label: s.name,
    }));

    // Buildings
    const buildingOptions = publicCommunity?.buildings.map((b) => ({
        id: b.name,
        label: b.name,
    }));

    // Apartments
    const apartmentOptions = publicCommunity?.apartments.map((a) => ({
        id: a.name,
        label: a.name,
    }));


    // Extract data from the store
    const { token: residentToken, organizationId, estateId } = useResidentStore();

    const getPublicEstate = async () => {
        try {
<<<<<<< HEAD
            const response: any = await api.get(`/estates/public/single-estate/organizations/${organizationId}/estates/${estateId}`);
=======
            const response = await api.get(`/estates/public/single-estate/organizations/${organizationId}/estates/${estateId}`);
>>>>>>> 762c43f57b54fdcd25a67b1f1ece1bcf4789d65e
            setPublicCommunity(response?.data?.data);
        } catch (error) {
            console.error("Failed to fetch estates:", error);
        };
    }

    // Handle URL parameters
    useResidentParams()

    // Optional: Log the stored data for debugging
    React.useEffect(() => {
        if (residentToken && organizationId) {
            (async () => {
                const t = await getToken();
                console.log(t)
                if (!t || !userData) {
                    router.push("/login")
                } else {
                    getPublicEstate();
                }
            })();
        }
    }, [residentToken, organizationId]);

    const handleBuildingSelect = (option: { id: string | number; label: string }) => {
        setSelectedBuilding(option.label)
    }

    const handleApartmentSelect = (option: { id: string | number; label: string }) => {
        setSelectedApartment(option.label)
    }

    const handleOwnerSelect = (option: { id: string | number; label: string }) => {
        setSelectedOwner(option.label)
    }

    const handleStreetSelect = (option: { id: string | number; label: string }) => {
        setSelectedStreetName(option.label)
    }

    const handleZoneSelect = (option: { id: string | number; label: string }) => {
        setSelectedStreetZone(option.label)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const calculateDueDate = () => {
        if (!formData.rentStartDate || !formData.rentDuration) {
            setCalculatedDueDate('');
            return;
        }

        const startDate = new Date(formData.rentStartDate);
        if (!startDate) {
            setCalculatedDueDate('');
            return;
        }

        const duration = parseInt(formData.rentDuration);
        const dueDate = new Date(startDate);

        if (formData.rentDurationType === 'months') {
            // Move forward by `duration` months, keeping the same day
            dueDate.setMonth(dueDate.getMonth() + duration);
            // Subtract one day to get the day before
            dueDate.setDate(dueDate.getDate() - 1);
        } else if (formData.rentDurationType === 'years') {
            // Move forward by `duration` years, keeping the same day
            dueDate.setFullYear(dueDate.getFullYear() + duration);
            // Subtract one day to get the day before
            dueDate.setDate(dueDate.getDate() - 1);
        }

        // Handle edge case: if the resulting date is invalid (e.g., Feb 30), adjust to last day of previous month
        if (dueDate.getDate() !== (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())).getDate()) {
            dueDate.setDate(0); // Set to last day of previous month
        }

        // Format: MM/DD/YYYY
        const formatted =
            String(dueDate.getMonth() + 1).padStart(2, '0') + '/' +
            String(dueDate.getDate()).padStart(2, '0') + '/' +
            dueDate.getFullYear();

        setCalculatedDueDate(formatted);
    };


    React.useEffect(() => {
        if (formData.rentStartDate && formData.rentDurationType && formData.rentDuration) {
            calculateDueDate()
            return;
        }

    }, [formData.rentStartDate, formData.rentDuration, formData.rentDurationType]);

    const handleDurationTypeChange = (type: string) => {
        setFormData(prev => ({
            ...prev,
            rentDurationType: type
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validate required fields
            if (!formData.firstName || !formData.lastName || !selectedStreetName || !selectedBuilding || !selectedApartment || !selectedOwner) {
                toast.error("Please fill in all required fields", {
                    position: "top-center",
                    duration: 3000,
                    style: {
                        background: "#FFEBEE",
                        color: "#D32F2F",
                        fontWeight: 500,
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                });
                return;
            }

            // Prepare the payload based on ownership type
            const payload: any = {
                email: userData?.email || "",
                firstName: formData.firstName,
                lastName: formData.lastName,
                estateName: publicCommunity?.basicDetails?.name,
                zone: selectedStreetZone || undefined, // Optional
                streetName: selectedStreetName,
                building: selectedBuilding,
                apartment: selectedApartment,
                ownershipType: selectedOwner?.length > 0 && selectedOwner === "I am renting this apartment/property" ? "rented" : "owned",
            };

            if (selectedOwner === "I own this apartment/property") {
                if (!formData.residencyStartDate) {
                    toast.error("Residency start date is required", {
                        position: "top-center",
                        duration: 3000,
                        style: {
                            background: "#FFEBEE",
                            color: "#D32F2F",
                            fontWeight: 500,
                            padding: "12px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                    });
                    return;
                }
                payload.ownedDetails = {
                    residencyStartDate: new Date(formData.residencyStartDate).toISOString()
                };
            } else if (selectedOwner === "I am renting this apartment/property") {
                if (!formData.rentDuration || !formData.rentStartDate) {
                    toast.error("Rent duration and start date are required", {
                        position: "top-center",
                        duration: 3000,
                        style: {
                            background: "#FFEBEE",
                            color: "#D32F2F",
                            fontWeight: 500,
                            padding: "12px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                    });
                    return;
                }

                const startDate = new Date(formData.rentStartDate);
                payload.rentedDetails = {
                    rentDurationType: formData.rentDurationType === 'months' ? 'Monthly' : 'Yearly',
                    rentDuration: parseInt(formData.rentDuration),
                    rentStartDate: startDate.toISOString(),
                    rentDueDate: formatDueDateForSubmission(calculatedDueDate)
                };
            }

            // Make API call
            await api.post(`/resident/create-profile/organizations/${organizationId}/estates/${estateId}?invitationToken=${residentToken}`, payload);

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

            // Redirect to dashboard after success
            router.push('/resident/dashboard');

        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while creating your profile";

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
            setLoading(false);
        }
    };

    // console.log("selectedOwner:", selectedOwner)
    // console.log("formData:", formData)
    // console.log("userData:", userData)

    console.log("publicCommunity:", publicCommunity)

    return (
        <div>
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[24px]'>
                <div className='w-full flex justify-center items-center'>
                    <Image
                        src={"/Homz_colorless.png"}
                        className="ml-2 cursor-pointer"
                        height={27}
                        width={131}
                        alt="logo"
                        onClick={() => router.back()}
                    />
                </div>
            </div>
            {/* Header */}
            <div className="max-w-[750px] mx-auto mt-5 md:mt-10 p-4 md:p-2">
                <h1 className='text-[23px] font-semibold text-BlackHomz'>
                    Set Up Your Residential Details
                </h1>
                <p className='text-[16px] font-normal text-GrayHomz'>
                    Review and complete your residential information to get started with your property dashboard.
                </p>
            </div>


            {/* Form Section */}
            <div className="max-w-[750px] mx-auto mt-4 p-4 pb-5 bg-[#FCFCFC] hidden md:grid grid-cols-2 gap-6">
                <div className='w-full md:w-[100%]'>
                    <label className="text-sm text-BlackHomz font-medium">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <CustomInput
                        borderColor="#4E4E4E"
                        type="text"
                        placeholder='e.g, Hunter'
                        className="h-[45px] px-4 mt-1"
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                    />
                </div>
                <div className='w-full md:w-[100%]'>
                    <label className="text-sm text-BlackHomz font-medium">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <CustomInput
                        borderColor="#4E4E4E"
                        type="text"
                        placeholder='e.g, Jude'
                        className="h-[45px] px-4 mt-1"
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                    />
                </div>
            </div>


            <div className="max-w-[750px] mx-auto mt-4 md:p-2 md:bg-[#FCFCFC] flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={`${userData?.email ? userData?.email : ""}`}
                            className='h-[45px] rounded-[4px] bg-[#E6E6E6] px-6 flex justify-between items-center'
                            disabled
                        />
                    </div>
                    <div className='w-full md:w-[100%]'>
                        <label className="text-sm text-BlackHomz font-medium">
                            Estate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={`${publicCommunity?.basicDetails?.name ? publicCommunity?.basicDetails?.name : ""}`}
                            className='h-[45px] mt-1 w-full rounded-[4px] bg-[#E6E6E6] px-6 flex justify-between items-center'
                            disabled
                        />
                    </div>
                </div>

                {/* Name */}
                <div className="md:hidden grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                    <div className='w-full md:w-[100%]'>
                        <label className="text-sm text-BlackHomz font-medium">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <CustomInput
                            borderColor="#4E4E4E"
                            type="text"
                            placeholder='e.g, Hunter'
                            className="h-[45px] px-4 mt-1"
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                        />
                    </div>
                    <div className='w-full md:w-[100%]'>
                        <label className="text-sm text-BlackHomz font-medium">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <CustomInput
                            borderColor="#4E4E4E"
                            type="text"
                            placeholder='e.g, Jude'
                            className="h-[45px] px-4 mt-1"
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                    {/* Zone Section */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            Select Zone <span className="font-normal"> (optional)</span>
                        </label>
                        <Dropdown
                            options={zoneOptions || []}
                            onSelect={handleZoneSelect}
                            selectOption="N/A"
                        />
                    </div>

                    {/* Street Section */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            Street Name <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={streetOptions || []}
                            onSelect={handleStreetSelect}
                            selectOption="Select Street"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                    {/* Building Section */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            Building <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={buildingOptions || []}
                            onSelect={handleBuildingSelect}
                            selectOption="Select Building"
                        />
                    </div>

                    {/* Apartment Section */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            Apartment <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={apartmentOptions  || []}
                            onSelect={handleApartmentSelect}
                            selectOption="Select Apartment"
                        />
                    </div>
                </div>

                {/* Ownership Type Section */}
                <div className="flex flex-col gap-1 px-4">
                    <label className="text-sm font-medium">
                        Select Ownership Type <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        options={ownerTypeOption}
                        onSelect={handleOwnerSelect}
                        selectOption={"Select OwnerShip Type"}
                        showSearch={false}
                    />
                </div>

                {/* Conditional Fields based on Ownership Type */}
                {selectedOwner === "I am renting this apartment/property" && (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 px-4">
                        <div className='relative'>
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Rent Duration"
                                placeholder="e.g 12"
                                value={formData.rentDuration}
                                onValueChange={(value) => handleInputChange('rentDuration', value)}
                                required
                                type='number'
                                className='h-[45px] pl-4 pr-[100px] mt-1'
                            />
                            <select
                                className="absolute top-9 right-2 border-none text-xs px-2 py-1 bg-transparent"
                                value={formData.rentDurationType}
                                onChange={(e) => handleDurationTypeChange(e.target.value)}
                            >
                                {durationTypeOptions.map(option => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6'>
                            <div className='w-full md:w-[50%]'>
                                <label className="text-sm text-BlackHomz font-medium">
                                    Rent Start Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <CustomInput
                                        borderColor="#4E4E4E"
                                        type="date"
                                        className="h-[45px] px-4 pr-10 input-hide-date-icon"
                                        onChange={(e) => handleInputChange('rentStartDate', e.target.value)}
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                        <DateIcon />
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 w-full md:w-[50%] text-sm'>
                                <h3 className='text-sm font-medium text-BlackHomz mb-1'>Rent Due Date <span className='text-error'>*</span></h3>
                                <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                    {calculatedDueDate ? calculatedDueDate : 'Auto-filled'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {selectedOwner === "I own this apartment/property" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                        <div className='w-full md:w-[100%]'>
                            <label className="text-sm text-BlackHomz font-medium">
                                Residency Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CustomInput
                                    borderColor="#4E4E4E"
                                    type="date"
                                    className="h-[45px] px-4 pr-10 input-hide-date-icon mt-1"
                                    onChange={(e) => handleInputChange('residencyStartDate', e.target.value)}
                                    required
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                    <DateIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-10 flex justify-end px-4 md:px-0">
                    <button
                        onClick={handleSubmit}
                        className={`bg-BlueHomz hover:bg-BlueHomzDark h-[45px] flex justify-center items-center max-w-[210px] font-normal text-[16px] text-white px-6 py-2 rounded-md ${loading ? "pointer-events-none w-full flex justify-center" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? <DotLoader /> : "Go to Dashboard"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Resident