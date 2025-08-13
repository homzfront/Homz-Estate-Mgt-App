import CopyIcon from '@/components/icons/copyIcon';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import React from 'react'

const EstateInformation = () => {
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    return (
        <div>
            <div className='bg-[#FCFCFC] rounded-[12px] p-4'>
                <p className='text-sm md:text-[16px] font-normal text-GrayHomz mb-2'>Estate Information</p>
                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Estate Name
                        </p>
                        <p className='text-sm text-GrayHomz font-normal'>
                            {selectedEstate?.estate ?? "[Selected Estate Name]"}
                        </p>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Location
                        </p>
                        <p className='text-sm text-GrayHomz font-normal'>
                            [Area], [State]
                        </p>
                    </div>
                </div>
                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
                        <p className="text-sm text-BlackHomz font-medium md:font-normal ">
                            Emergency Phone Number
                        </p>
                        <p className="text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4">
                            [08123456789] <CopyIcon className='#A9A9A9' />
                        </p>

                        <p className="text-sm text-BlackHomz font-medium md:font-normal ">
                            Utility Services Number
                        </p>
                        <p className="text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4">
                            [08123456789] <CopyIcon className='#A9A9A9' />
                        </p>

                        <p className="text-sm text-BlackHomz font-medium md:font-normal ">
                            Security Phone Number
                        </p>
                        <p className="text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4">
                            [08123456789] <CopyIcon className='#A9A9A9' />
                        </p>
                    </div>

                </div>
            </div >
            <div className='bg-[#FCFCFC] rounded-[12px] p-4 mt-5'>
                <p className='text-sm md:text-[16px] font-normal text-GrayHomz mb-2'>Estate Manager Information</p>
                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Manager’s
                            Phone Number
                        </p>
                        <p className='text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4'>
                            [08123456789] <CopyIcon className='#A9A9A9' />
                        </p>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Account Number
                        </p>
                        <p className='text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4'>
                            1524368709 <CopyIcon className='#A9A9A9' />
                        </p>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Account Name
                        </p>
                        <p className='text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4'>
                            [Account Name] <CopyIcon className='#A9A9A9' />
                        </p>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal '>
                            Bank Name
                        </p>
                        <p className='text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-4'>
                            [Bank Name] <CopyIcon className='#A9A9A9' />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstateInformation