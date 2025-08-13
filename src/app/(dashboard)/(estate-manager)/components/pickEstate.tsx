/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddIcon from '@/components/icons/addIcon'
import DeleteIcon from '@/components/icons/deleteIcon'
import EstateInfoIcon from '@/components/icons/estateInfoIcon'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const PickEstate = ({closeRef}: any) => {
    const router = useRouter();
    return (
        <div ref={closeRef} className='p-4 rounded-[12px] bg-inputBg md:w-[350px] min-w-[340px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
            <div className='bg-white rounded-[12px] p-3'>
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
                        <span className='text-sm font-medium text-GrayHomz'>Golden Palms Estate</span>
                        <span className='text-[11px] font-normal text-GrayHomz'>[50 Residents]</span>
                        <div className='mt-3 flex items-center justify-between w-full'>
                            <button onClick={() => router.push("/estate-info/123")} className='text-[13px] font-normal text-BlueHomz flex items-center gap-2'><EstateInfoIcon /> Estate Information </button>
                            <DeleteIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <button className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-[#E6E6E6] hover:rounded-[4px] text-start'>Start Gate Estate</button>
                <button className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-[#E6E6E6] hover:rounded-[4px] text-start'>Upspring Estate</button>
                <button className='text-GrayHomz text-sm font-normal px-4 py-3 hover:bg-[#E6E6E6] hover:rounded-[4px] text-start'>Rising Star Estate</button>
            </div>
            <button className='w-full text-BlueHomz text-sm font-normal py-4 flex items-center gap-2' onClick={() => router.push("/add-estate")}>
                <AddIcon /> Add New Estate
            </button>
        </div>
    )
}

export default PickEstate