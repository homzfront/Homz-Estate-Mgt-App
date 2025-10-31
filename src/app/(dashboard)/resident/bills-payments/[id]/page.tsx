"use client";
import React from 'react';
import Filters from '../components/filters';
import Table from './components/table';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useRouter } from 'next/navigation';
const DetailedPage = () => {
    const router = useRouter();
    const boxData = [
        {
            id: 1,
            title: 'Total Bill Amount',
            amount: '₦85,000',
            textColor: '#039855',
            bgColor: '#CDEADD',
        },
        {
            id: 2,
            title: 'Pending Payments',
            amount: '₦35,000',
            textColor: '#DC6803',
            bgColor: '#F6F6F6',
        },
        {
            id: 4,
            title: 'Total Amount Paid',
            amount: '₦40,000',
            textColor: '#006AFF',
            bgColor: '#F6F6F6',
        },
        {
            id: 5,
            title: 'Overdue Payments',
            amount: '₦10,000',
            textColor: '#D92D20',
            bgColor: '#F6F6F6',
        },
    ];

    return (
        <div className='w-full p-8'>
                    <button onClick={() => router.back()} className='mb-4 flex justify-center items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                        <ArrowLeft /> Back
                    </button>
            <div className='flex justify-between items-start w-full'>
                <div className='flex flex-col gap-1 w-full'>
                    <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold'>[Bill Name]</h2>
                    <p className='block text-base text-GrayHomz font-normal w-full'>
                        Here’s a breakdown of your [bill name] for each billing period. Select a period to view payment details.
                    </p>
                </div>
              <span className='block'><Filters /></span>
            </div>
            <div className='my-4'>
                <div className='w-full flex flex-col gap-4 md:flex-row justify-between mb-6'>
                    {boxData.map((box) => (
                        <div
                            key={box.id}
                            className={`border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 md:gap-2 justify-between w-full min-w-[180px] ${box.id === 1 ? 'md:w-[180px] mr-4' : ''}`}
                            style={{ backgroundColor: box.bgColor, borderLeftColor: box.textColor }}
                        >
                            <p className='text-[11px] font-medium' style={{ color: box.textColor }}>{box.title}</p>
                            <p className='text-[13px] font-semibold'>{box.amount}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full'>
                <Table />
            </div>
        </div>
    )
}

export default DetailedPage