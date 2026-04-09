'use client';
import ArrowDown from '@/components/icons/arrowDown';
import BuildingIcon from '@/components/icons/building';
import React from 'react';
import { useAuthSlice } from '@/store/authStore';
import formatDateReadable from '@/app/utils/formatDateReadable';

const MyProperties = () => {
    const residentProfile = useAuthSlice((state) => state.residentProfile);
    const [openId, setOpenId] = React.useState<number | null>(null);

    const toggleOpen = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    if (!residentProfile) {
        return (
            <div className='mt-4 p-6 bg-inputBg rounded-[12px]'>
                <p className='text-sm text-GrayHomz font-normal text-center'>No property data available.</p>
            </div>
        );
    }

    // Build property cards from the resident profile
    const propertyCards = [
        {
            id: 1,
            name: residentProfile.apartment || '-',
            extra: residentProfile.ownershipType
                ? residentProfile.ownershipType.charAt(0).toUpperCase() + residentProfile.ownershipType.slice(1)
                : '-',
            details: {
                ownershipType: residentProfile.ownershipType || '-',
                apartment: residentProfile.apartment || '-',
                building: residentProfile.building || '-',
                street: residentProfile.streetName || '-',
                zone: residentProfile.zone || '-',
                rentStart: residentProfile.rentedDetails?.rentStartDate
                    ? formatDateReadable(residentProfile.rentedDetails.rentStartDate)
                    : residentProfile.ownedDetails?.residencyStartDate
                        ? formatDateReadable(residentProfile.ownedDetails.residencyStartDate)
                        : '-',
                rentDue: residentProfile.rentedDetails?.rentDueDate
                    ? formatDateReadable(residentProfile.rentedDetails.rentDueDate)
                    : '-',
            },
        },
    ];

    return (
        <div className='mt-4 p-6 bg-inputBg rounded-[12px]'>
            <p className='text-sm text-BlackHomz font-medium'>
                Your Properties in This Estate
            </p>
            <p className='mt-1 text-[13px] text-GrayHomz font-normal'>
                These are the properties you&apos;re linked to in this estate. Click on any property to view its details.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-4">
                {propertyCards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => toggleOpen(card.id)}
                        className={`flex flex-col gap-2`}
                    >
                        <div className={`${openId === card.id ? "bg-BlueHomz text-white" : "bg-[#FCFCFC]"} w-full rounded-[8px] cursor-pointer p-4 flex justify-between items-center`}>
                            <div className='flex items-center gap-2'>
                                <div className={`h-[44px] w-[44px] rounded-full flex justify-center items-center ${openId === card.id ? "bg-[#EEF5FF]" : "bg-BlueHomz"}`}>
                                    <BuildingIcon className={openId === card.id ? "#006AFF" : "#FFFFFF"} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <p className={`${openId === card.id ? "" : "text-BlackHomz"} text-sm font-medium`}>{card.name}</p>
                                    <p className={`${openId === card.id ? "" : "text-GrayHomz"} text-[11px] font-normal`}>{card.extra}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 transition-transform duration-200 ${openId === card.id ? "transform rotate-180" : ""}`}>
                                <ArrowDown className={openId === card.id ? "#ffffff" : "#4e4e4e"} />
                            </div>
                        </div>
                        {openId === card.id && (
                            <div className="mt-1 bg-[#FCFCFC] text-sm p-4 rounded-[8px] space-y-2">
                                <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
                                    <p className="text-BlackHomz font-medium">Ownership Type</p>
                                    <p className="text-GrayHomz font-normal capitalize">{card.details.ownershipType}</p>

                                    {card.details.rentStart !== '-' && (
                                        <>
                                            <p className="text-BlackHomz font-medium">
                                                {residentProfile.ownershipType === 'rented' ? 'Rent Start Date' : 'Residency Start Date'}
                                            </p>
                                            <p className="text-GrayHomz font-normal">{card.details.rentStart}</p>
                                        </>
                                    )}

                                    {residentProfile.ownershipType === 'rented' && card.details.rentDue !== '-' && (
                                        <>
                                            <p className="text-BlackHomz font-medium">Rent Due Date</p>
                                            <p className="text-GrayHomz font-normal">{card.details.rentDue}</p>
                                        </>
                                    )}

                                    <p className="text-BlackHomz font-medium">Apartment</p>
                                    <p className="text-GrayHomz font-normal">{card.details.apartment}</p>

                                    <p className="text-BlackHomz font-medium">Building</p>
                                    <p className="text-GrayHomz font-normal">{card.details.building}</p>

                                    <p className="text-BlackHomz font-medium">Street</p>
                                    <p className="text-GrayHomz font-normal">{card.details.street}</p>

                                    {card.details.zone !== '-' && (
                                        <>
                                            <p className="text-BlackHomz font-medium">Zone</p>
                                            <p className="text-GrayHomz font-normal">{card.details.zone}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProperties;