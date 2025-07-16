"use client"
import ArrowRightSolid from '@/components/icons/arrowRightSolid';
import EstateManagement from '@/components/icons/estateManagement';
import Resident from '@/components/icons/resident';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React from 'react'

const SelectProfile = () => {
    const router = useRouter();

    const data = [
        {
            id: 1,
            text: "Monitor estate-wide activities, handle visitor access for tenants, & more.",
            header: "Estate Manager",
            image: <EstateManagement />,
            link: "/estate-form"
        },
        {
            id: 1,
            text: "As a tenant, pay estate dues, and request visitor access in one place.",
            header: "Resident",
            image: <Resident />,
            link: "/resident"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[60px] px-[24px]'>
                <div className='w-full flex justify-center items-center'>
                    <span className='text-[23px] text-center md:text-auto md:text-[36px] font-semibold text-[#FFFFFF]'> How Would You Like To Use Homz?</span>
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-6 py-8 mt-14 w-full">
                <div
                    // onSubmit={handleSubmit(onSubmit)} 
                    className="w-full">
                    {/* Personal Information Section */}
                    <div className="mb-8 w-full">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {
                                data &&
                                data.map((data) => (
                                    <div className='w-[100%] flex gap-4 items-center bg-warningBg rounded-[8px] p-8'>
                                        <div>
                                            <div>{data?.image}</div>
                                            <h1 className='mt-4 text-BlackHomz font-semibold text-[20px]'>{data.header}</h1>
                                            <p className='mt-1 text-[#4E4E4E] font-normal text-[16px]'>{data.text}</p>
                                        </div>
                                        <Link href={`${data.link}`} className='cursor-pointer'>
                                            <ArrowRightSolid />
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SelectProfile