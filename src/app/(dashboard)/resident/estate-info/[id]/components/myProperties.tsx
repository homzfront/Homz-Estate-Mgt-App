import ArrowDown from '@/components/icons/arrowDown';
import BuildingIcon from '@/components/icons/building';
import React from 'react'

const propertyCards = [
    {
        id: 1,
        name: "Block A, Flat 3",
        extra: "Owner",
        details: {
            role: "Primary Resident",
            rentStart: "10th June, 2024",
            rentDue: "9th June, 2025",
            apartment: "Block A, Flat 3",
            building: "Evergreen Heights",
            street: "Palm Avenue",
            zone: "Zone 4",
        },
    },
    {
        id: 2,
        name: "Apartment 14",
        extra: "Renter",
        details: {
            role: "Co-Resident",
            rentStart: "1st Jan, 2024",
            rentDue: "31st Dec, 2024",
            apartment: "Apartment 14",
            building: "Maple Towers",
            street: "Sunset Boulevard",
            zone: "Zone 2",
        },
    },
    {
        id: 3,
        name: "Villa 7B",
        extra: "Co-Resident",
        details: {
            role: "Co-Resident",
            rentStart: "15th March, 2024",
            rentDue: "14th March, 2025",
            apartment: "Villa 7B",
            building: "Royal Gardens",
            street: "Crescent Lane",
            zone: "Zone 1",
        },
    },
];


const MyProperties = () => {
    const [openId, setOpenId] = React.useState<number | null>(null);

    const toggleOpen = (id: number) => {
        setOpenId(openId === id ? null : id);
    };
    return (
        <div className='mt-4 p-6 bg-inputBg rounded-[12px]'>
            <p className='text-sm text-BlackHomz font-medium'>
                Your Properties in This Estate
            </p>
            <p className='mt-1 text-[13px] text-GrayHomz font-normal '>
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
                                    <p className={`${openId === card.id ? "" : "text-BlackHomz"} text-sm font-medium`}>[{card.name}]</p>
                                    <p className={`${openId === card.id ? "" : "text-GrayHomz"} text-[11px] font-normal`}>[{card.extra}]</p>
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
                                    <p className="text-GrayHomz font-normal">{card.extra}</p>

                                    <p className="text-BlackHomz font-medium">Role</p>
                                    <p className="text-GrayHomz font-normal">{card.details.role}</p>

                                    <p className="text-BlackHomz font-medium">Rent Start Date</p>
                                    <p className="text-GrayHomz font-normal">{card.details.rentStart}</p>

                                    <p className="text-BlackHomz font-medium">Rent Due Date</p>
                                    <p className="text-GrayHomz font-normal">{card.details.rentDue}</p>

                                    <p className="text-BlackHomz font-medium">Apartment</p>
                                    <p className="text-GrayHomz font-normal">{card.details.apartment}</p>

                                    <p className="text-BlackHomz font-medium">Building</p>
                                    <p className="text-GrayHomz font-normal">{card.details.building}</p>

                                    <p className="text-BlackHomz font-medium">Street</p>
                                    <p className="text-GrayHomz font-normal">{card.details.street}</p>

                                    <p className="text-BlackHomz font-medium">Zone</p>
                                    <p className="text-GrayHomz font-normal">{card.details.zone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyProperties