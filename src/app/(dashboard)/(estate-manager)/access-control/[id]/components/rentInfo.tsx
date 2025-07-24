import ArrowRight from '@/components/icons/arrowRight'
import Tower from '@/components/icons/tower'
import React from 'react'

const RentInfo = () => {
    return (
        <div>
            <p className="mt-2 text-GrayHomz font-normal text-[16px]">
                View rent information for all properties currently rented by this Resident.
            </p>
            <div
        
                className="mt-4 p-4 bg-[#FCFCFC] rounded-[8px] flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex justify-center items-center h-[44px] w-[44px] rounded-full bg-BlueHomz">
                        <Tower />
                    </div>
                    <div className="text-GrayHomz font-medium flex flex-col gap-1 ml-1">
                        <p className="text-sm">[2-Bedroom Bungalow]</p>
                        <p className="text-[11px]">[View Gold Property]</p>
                    </div>
                </div>
                <ArrowRight className="#4E4E4E" />
            </div>
              <div
        
                className="mt-4 p-4 bg-[#FCFCFC] rounded-[8px] flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex justify-center items-center h-[44px] w-[44px] rounded-full bg-BlueHomz">
                        <Tower />
                    </div>
                    <div className="text-GrayHomz font-medium flex flex-col gap-1 ml-1">
                        <p className="text-sm">[4-Bedroom Bungalow]</p>
                        <p className="text-[11px]">[View Gold Property]</p>
                    </div>
                </div>
                <ArrowRight className="#4E4E4E" />
            </div>
              <div
        
                className="mt-4 p-4 bg-[#FCFCFC] rounded-[8px] flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex justify-center items-center h-[44px] w-[44px] rounded-full bg-BlueHomz">
                        <Tower />
                    </div>
                    <div className="text-GrayHomz font-medium flex flex-col gap-1 ml-1">
                        <p className="text-sm">[8-Bedroom Bungalow]</p>
                        <p className="text-[11px]">[View Gold Property]</p>
                    </div>
                </div>
                <ArrowRight className="#4E4E4E" />
            </div>
        </div>
    )
}

export default RentInfo