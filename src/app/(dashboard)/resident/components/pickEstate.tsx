/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import ArrowRight from '@/components/icons/arrowRight'
import BlueSearch from '@/components/icons/blueSearch'
import EstateInfoIcon from '@/components/icons/estateInfoIcon'
import { useSelectedEsate } from '@/store/useSelectedEstate'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PickEstateProps {
    closeRef?: any;
}

const option = [
    { id: 1, estate: 'Golden Gates Estate', building: "Building 10", apartmentName: "Apartment 10", residents: 20 },
    { id: 2, estate: 'Silver Oaks Estate', building: "Building 6", apartmentName: "Apartment 1", residents: 50 },
    { id: 3, estate: 'Emerald City Estate', building: "Building 6", apartmentName: "Apartment 2", residents: 23 },
    { id: 4, estate: 'Ruby Gardens Estate', building: "Building 14", apartmentName: "Apartment 4", residents: 45 },
    { id: 5, estate: 'Sapphire Heights Estate', building: "Building 8", apartmentName: "Apartment 8", residents: 35 },
]


const PickEstate = ({ closeRef }: PickEstateProps) => {
    const router = useRouter();
    const [hoverEstate, setHoverEstate] = React.useState<boolean>(false);
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
    const [searchEstate, setSearchEstate] = React.useState<string>('');
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);


    return (
        <div ref={closeRef} className={`p-4 rounded-[12px] bg-white ${openEstateList ? "md:w-[320px]" : "md:w-[270px]"}  min-w-[260px] mt-[120px] mb-[50px] md:mt-0 md:mb-0`}>
            {!openEstateList ?
                <div>
                    <div className='bg-inputBg rounded-[12px] p-3'>
                        <div className='flex gap-2 items-start w-full'>
                            <div className="min-w-[40px] w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={"/houses.jpg"}
                                    alt={"estate-img"}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className='flex flex-col gap-1 w-full'>
                                <span className='text-sm font-medium text-GrayHomz truncate'>{selectedEstate ? selectedEstate?.estate : option?.[0]?.estate}</span>
                                <span className='text-[11px] font-normal text-GrayHomz truncate'>{selectedEstate ? `${selectedEstate.building}, ${selectedEstate.apartmentName}` : `${option?.[0].building}, ${option?.[0].apartmentName}`}</span>
                                <div className='mt-2 flex items-center justify-between w-full'>
                                    <button onClick={() => router.push(`/resident/estate-info/${selectedEstate ? selectedEstate?.estate : option?.[0]?.estate}`)} className='text-[13px] font-normal text-BlueHomz flex items-center gap-2'><EstateInfoIcon /> Estate Information </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mt-4'>
                        <button onClick={() => setOpenEstateList(true)} onMouseEnter={() => setHoverEstate(true)} onMouseLeave={() => setHoverEstate(false)} className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start flex w-full justify-between items-center'>Estate {hoverEstate ? <ArrowRight className='#006AFF' /> : <ArrowRight className='#4E4E4E' />}</button>
                        <button onClick={() => router.push("/resident/profile")} className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start'>Profile</button>
                        <button className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-whiteblue hover:text-error hover:rounded-[4px] text-start'>Logout</button>
                    </div>
                </div>
                :
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search estate"
                            className="w-full h-[45px] pl-10 pr-4 outline-none border border-GrayHomz2 rounded-md text-sm placeholder:text-GrayHomz2 placeholder:text-xs"
                            value={searchEstate}
                            onChange={(e) => setSearchEstate(e.target.value)}
                            autoFocus
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <BlueSearch />
                        </div>
                    </div>
                    <div>
                        {option.filter((item) => item.estate.toLowerCase().includes(searchEstate.toLowerCase())).map((item) => (
                            <div key={item.id} className='flex items-center justify-between gap-2 py-3'>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-BlackHpmz'>{item.estate}</span>
                                    <span className='text-[11px] font-normal text-GrayHomz'>{item.building}, {item.apartmentName}</span>
                                </div>
                                <div
                                    onClick={() => {
                                        setSelectedEstate(item);
                                        setOpenEstateList(false);
                                    }}
                                    className={`flex gap-2 items-center rounded-[4px] ${selectedEstate?.id === item.id ? "text-GrayHomz2 bg-GrayHomz6 pointer-events-none" : "cursor-pointer text-BlueHomz bg-whiteblue"} px-2 py-1 rounded-[4px] text-xs`}
                                >
                                    {selectedEstate?.id === item.id ? "Selected" : "Switch"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default PickEstate