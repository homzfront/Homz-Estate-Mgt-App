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
import { getFriendlyErrorMessage } from '@/utils/friendlyErrorMessage'

import { useSelectedCommunity } from '@/store/useSelectedCommunity'
import { RESIDENCY_TYPES } from '@/constant'


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

const Resident = () => {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        selectOwnershipType: '',
        residentType: '',
        residencyStartDate: '',
        estateName: ''
    });
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('');
    const [selectedResidentType, setSelectedResidentType] = useState('');
    const [selectedStreetName, setSelectedStreetName] = useState('');
    const [selectedStreetZone, setSelectedStreetZone] = useState('');
    const { userData } = useAuthSlice();
    const [loading, setLoading] = useState(false);
    const { publicCommunity, setPublicCommunity } = useSelectedCommunity();


    // Prepare residency types for dropdown
    const residencyTypeOptions = RESIDENCY_TYPES.map((type, index) => ({
        id: index,
        label: type
    }));

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
            const response: any = await api.get(`/estates/public/single-estate/organizations/${organizationId}/estates/${estateId}`);
            setPublicCommunity(response?.data?.data);
        } catch { /* silent */ }
    }

    // Handle URL parameters
    useResidentParams()

    // Optional: Log the stored data for debugging
    React.useEffect(() => {
        if (residentToken && organizationId) {
            (async () => {
                const t = await getToken();
                if (!t || !userData) {
                    router.push("/register")
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

    const handleResidentTypeSelect = (option: { id: string | number; label: string }) => {
        setSelectedResidentType(option.label)
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
    const handleDurationTypeChange = (_type: string) => {
        // Rent duration type is now set by the CM during approval
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

            // Build the residence object to wrap in the residences array (as required by the backend DTO)
            const ownershipType = selectedOwner === "I am renting this apartment/property" ? "rented" : "owned";

            const residence: any = {
                zone: selectedStreetZone || undefined,
                streetName: selectedStreetName,
                building: selectedBuilding,
                apartment: selectedApartment,
                residencyType: selectedResidentType,
                ownershipType,
            };

            if (ownershipType === "owned") {
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
                residence.ownedDetails = {
                    residencyStartDate: new Date(formData.residencyStartDate).toISOString()
                };
            } else {
                // Rented — no rent dates needed here, CM sets them on approval
                residence.rentedDetails = {
                    rentDurationType: 'Monthly',
                    rentDuration: 0,
                    rentStartDate: null,
                    rentDueDate: null,
                };
            }

            const payload: any = {
                email: userData?.email || "",
                firstName: formData.firstName,
                lastName: formData.lastName,
                estateName: publicCommunity?.basicDetails?.name,
                // Top-level fields required by the backend DTO
                zone: selectedStreetZone || undefined,
                streetName: selectedStreetName,
                building: selectedBuilding,
                apartment: selectedApartment,
                residencyType: selectedResidentType,
                ownershipType,
                ...(ownershipType === "owned"
                    ? { ownedDetails: residence.ownedDetails }
                    : { rentedDetails: residence.rentedDetails }),
                residences: [residence],
            };

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
            const errorMessage = getFriendlyErrorMessage(error);
            toast.error(errorMessage, {
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

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[20px] sticky top-0 z-50'>
                <div className='w-full max-w-[1440px] mx-auto px-6 flex items-center justify-between'>
                    <Image
                        src={"/Homz_colorless.png"}
                        className="cursor-pointer"
                        height={27}
                        width={131}
                        alt="logo"
                        onClick={() => router.back()}
                    />
                    <span className='text-white text-sm font-normal opacity-80'>Resident Onboarding</span>
                </div>
            </div>

            {/* Main content — two column on desktop, single column on mobile */}
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* LEFT PANEL — Estate info (desktop only sidebar) */}
                    <div className="w-full lg:w-[340px] lg:sticky lg:top-[80px] flex-shrink-0">
                        <div className="bg-white rounded-[12px] border border-[#E6E6E6] p-6">
                            <h2 className='text-[16px] font-semibold text-BlackHomz mb-4'>Estate Information</h2>
                            <div className='flex flex-col gap-4'>
                                <div>
                                    <p className='text-xs text-GrayHomz font-normal mb-1'>Estate Name</p>
                                    <p className='text-sm font-medium text-BlackHomz'>
                                        {publicCommunity?.basicDetails?.name || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-xs text-GrayHomz font-normal mb-1'>Your Email</p>
                                    <p className='text-sm font-medium text-BlackHomz break-all'>
                                        {userData?.email || '—'}
                                    </p>
                                </div>
                                {publicCommunity?.basicDetails?.location?.state && (
                                    <div>
                                        <p className='text-xs text-GrayHomz font-normal mb-1'>Location</p>
                                        <p className='text-sm font-medium text-BlackHomz'>
                                            {publicCommunity?.basicDetails?.location?.area}, {publicCommunity?.basicDetails?.location?.state}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className='mt-6 pt-4 border-t border-[#E6E6E6]'>
                                <p className='text-xs text-GrayHomz font-normal leading-relaxed'>
                                    Fill in your residential details to complete your profile and access your dashboard.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL — Form */}
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-[12px] border border-[#E6E6E6] p-6 md:p-8">
                            <h1 className='text-[20px] md:text-[22px] font-semibold text-BlackHomz mb-1'>
                                Set Up Your Residential Details
                            </h1>
                            <p className='text-[14px] font-normal text-GrayHomz mb-6'>
                                Complete your residential information to get started.
                            </p>

                            <div className="flex flex-col gap-5">
                                {/* Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
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
                                    <div>
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

                                {/* Zone & Street */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Select Zone <span className="font-normal text-GrayHomz"> (optional)</span>
                                        </label>
                                        <Dropdown
                                            options={zoneOptions || []}
                                            onSelect={handleZoneSelect}
                                            selectOption="N/A"
                                        />
                                    </div>
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

                                {/* Building & Apartment */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Apartment <span className="text-red-500">*</span>
                                        </label>
                                        <Dropdown
                                            options={apartmentOptions || []}
                                            onSelect={handleApartmentSelect}
                                            selectOption="Select Apartment"
                                        />
                                    </div>
                                </div>

                                {/* Resident Type & Ownership Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Resident Type <span className="text-red-500">*</span>
                                        </label>
                                        <Dropdown
                                            options={residencyTypeOptions}
                                            onSelect={handleResidentTypeSelect}
                                            selectOption={"Select Resident Type"}
                                            showSearch={false}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Ownership Type <span className="text-red-500">*</span>
                                        </label>
                                        <Dropdown
                                            options={ownerTypeOption}
                                            onSelect={handleOwnerSelect}
                                            selectOption={"Select Ownership Type"}
                                            showSearch={false}
                                        />
                                    </div>
                                </div>

                                {/* Rented — inform resident CM will set dates on approval */}
                                {selectedOwner === "I am renting this apartment/property" && (
                                    <div className="flex items-start gap-3 p-4 bg-[#EEF5FF] rounded-[8px] border border-[#C7DCFF]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#006AFF" strokeWidth="1.5"/>
                                            <path d="M12 8V12M12 16H12.01" stroke="#006AFF" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-BlueHomz">Rent dates set by your estate manager</p>
                                            <p className="text-xs text-[#4A6FA5] mt-0.5 leading-relaxed">
                                                Your rent start and end dates will be assigned by your community manager when they approve your request. You don&apos;t need to fill these in.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Owned fields */}
                                {selectedOwner === "I own this apartment/property" && (
                                    <div className="flex flex-col gap-4 p-4 bg-[#F8F9FB] rounded-[8px] border border-[#E6E6E6]">
                                        <h3 className='text-sm font-semibold text-BlackHomz'>Ownership Details</h3>
                                        <div className='w-full sm:w-[50%]'>
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

                                {/* Submit */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        className={`bg-BlueHomz hover:bg-BlueHomzDark h-[45px] w-full sm:w-auto min-w-[180px] flex justify-center items-center font-normal text-[16px] text-white px-8 rounded-[4px] ${loading ? "pointer-events-none opacity-80" : ""}`}
                                        disabled={loading}
                                    >
                                        {loading ? <DotLoader /> : "Go to Dashboard"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Resident