'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Dropdown from '@/components/general/dropDown'


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
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('');
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
            <div className="max-w-[720px] mx-auto mt-4 md:mt-1 md:p-2 md:bg-[#FCFCFC]">
                <div className="grid grid-cols-1">
                    {/* Building Section */}
                    <div className="flex flex-col gap-4 p-4">
                        <label className="text-sm font-medium">
                            Select Ownership Type <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            options={ownerTypeOption}
                            onSelect={handleOwnerSelect}
                            selectOption="Select option"
                            showSearch={false}
                        />
                        {/* Search and list handled inside dropdown */}
                    </div>
                    <div className="flex flex-col gap-4 p-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Building Section */}
                    <div className="flex flex-col gap-4 p-4">
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
                    <div className="flex flex-col gap-4 p-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Building Section */}
                    <div className="flex flex-col gap-4 p-4">
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
                    <div className="flex flex-col gap-4 p-4">
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

                {/* Go to Dashboard Button */}
                <div className="mt-10 flex justify-end px-4 md:px-0">
                    <button
                        onClick={() => router.push('/dashboard')}
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
