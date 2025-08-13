/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Dropdown from '@/components/general/dropDown'
import CustomInput from '@/components/general/customInput'
import DateIcon from '@/components/icons/dateIcon'


const buildingOptions = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    label: `Building Name ${i + 1}`
}))

const apartmentOptions = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    label: `Apartment Name ${i + 1}`
}))

const selectZoneOptions = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    label: `Zone Name ${i + 1}`
}))

const streetOptions = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    label: `Street Name ${i + 1}`
}))

const ownerTypeOption = [
    {
        id: 1,

        label: "I am renting this apartment/property",
    },
    {
        id: 2,
        label: "I own this apartment/property"
    }
];

const Resident = () => {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        selectOwnershipType: '',
        rentDuration: '',
        rentStartDate: '',
        rentDueDate: '',
    });

    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('I am renting this apartment/property');
    const [selectedStreetName, setSelectedStreetName] = useState('');
    const [selectedStreetZone, setSelectedStreetZone] = useState('');

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

    const handleSubmit = () => {
        const payload = {
            selectedStreetName,
            selectedStreetZone,
            selectedOwner,
            selectedApartment,
            selectedBuilding,
        }
        console.log(payload);
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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
            <div className="max-w-[720px] mx-auto mt-5 md:mt-10 p-4 md:p-2">
                <h1 className='text-[23px] font-semibold text-BlackHomz'>
                    Set Up Your Residential Details
                </h1>
                <p className='text-[16px] font-normal text-GrayHomz'>
                    Review and complete your residential information to get started with your property dashboard.
                </p>
            </div>


            {/* Form Section */}
            <div className="max-w-[720px] mx-auto mt-4 md:mt-1 md:p-2 md:bg-[#FCFCFC] flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1">
                    <div className="flex flex-col gap-1 px-4">
                        <label className="text-sm font-medium">
                            Estate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={"Auto filled"}
                            className='h-[45px] rounded-[4px] bg-[#E6E6E6] px-6 flex justify-between items-center'
                        />
                        {/* Search and list handled inside dropdown */}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Building Section */}
                    <div className="flex flex-col gap-1 px-4">
                        <label className="text-sm font-medium">
                            Select Zone <span className="font-normal"> (optional)</span>
                        </label>
                        <Dropdown
                            options={selectZoneOptions}
                            onSelect={handleZoneSelect}
                            selectOption="N/A"
                        />
                        {/* Search and list handled inside dropdown */}
                    </div>

                    {/* Apartment Section */}
                    <div className="flex flex-col gap-1 px-4">
                        <label className="text-sm font-medium">
                            Street Name <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={streetOptions}
                            onSelect={handleStreetSelect}
                            selectOption="Select Street"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Building Section */}
                    <div className="flex flex-col gap-1 px-4">
                        <label className="text-sm font-medium">
                            Building <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={buildingOptions}
                            onSelect={handleBuildingSelect}
                            selectOption="Select Building"
                        />
                        {/* Search and list handled inside dropdown */}
                    </div>

                    {/* Apartment Section */}
                    <div className="flex flex-col gap-1 px-4">
                        <label className="text-sm font-medium">
                            Apartment <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={apartmentOptions}
                            onSelect={handleApartmentSelect}
                            selectOption="Select Apartment"
                        />
                    </div>
                </div>

                {/* Building Section */}
                <div className="flex flex-col gap-1 px-4">
                    <label className="text-sm font-medium">
                        Select Ownership Type <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        options={ownerTypeOption}
                        onSelect={handleOwnerSelect}
                        selectOption={selectedOwner}
                        showSearch={false}
                    />
                    {/* Search and list handled inside dropdown */}
                </div>

                {/* Building Section */}
                {selectedOwner === "I am renting this apartment/property" ?
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
                            <select className="absolute top-9 right-2 border-none text-xs px-2 py-1">
                                <option value="months">Months</option>
                                <option value="years">Years</option>
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
                                    Auto-filled
                                </span>
                            </div>
                        </div>
                    </div>
                    : <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                        <div className='w-full md:w-[100%]'>
                            <label className="text-sm text-BlackHomz font-medium">
                                Residency Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CustomInput
                                    borderColor="#4E4E4E"
                                    type="date"
                                    className="h-[45px] px-4 pr-10 input-hide-date-icon mt-1"
                                    onChange={(e) => handleInputChange('rentStartDate', e.target.value)}
                                    required
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                    <DateIcon />
                                </span>
                            </div>
                        </div>
                    </div>}

                {/* Go to Dashboard Button */}
                <div className="mt-10 flex justify-end px-4 md:px-0">
                    <button
                        onClick={() => {
                            if (router) {
                                router.push('/resident/dashboard')
                            } else {
                                handleSubmit()
                            }
                        }}
                        className="bg-BlueHomz hover:bg-BlueHomzDark h-[45px] flex justify-center items-center font-normal text-[16px] text-white px-6 py-2 rounded-md"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Resident
