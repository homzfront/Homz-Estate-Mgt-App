'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Table from './components/table'
import Filters from './components/filters'
import ArrowLeft from '@/components/icons/arrowLeft'

const PaymentRecordPage = () => {
    const router = useRouter()

    return (
        <div className="w-full p-8">
            <div className='flex justify-between items-start w-full mb-6'>
                <div className='flex flex-col gap-1 w-full'>
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className='mb-4 flex justify-center items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                            <ArrowLeft /> Back
                        </button>
                        <div>
                        </div>
                    </div>
                    <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>
                        [Bill Record]
                    </h2>
                    <p className='text-base text-GrayHomz font-normal w-full'>
                        Here are your payment records for this billing.
                    </p>
                </div>
                <span className='block -mt-3 md:mt-0'><Filters /></span>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <button className="px-3 py-2 text-white font-medium text-sm  bg-BlueHomz rounded-[4px]">
                    All Records
                </button>
            </div>

            {/* Table */}
            <Table />
        </div>
    )
}

export default PaymentRecordPage
