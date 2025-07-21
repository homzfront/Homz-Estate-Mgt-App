"use client"
import AddBlue from '@/components/icons/addBlue';
import AddIcon from '@/components/icons/addIcon';
import ArrowRight from '@/components/icons/arrowRight';
import EmptyEstateIcon from '@/components/icons/estateManager/desktop/emptyEstateIcon';
import RegisterTenantIcon from '@/components/icons/estateManager/desktop/registerTenantIcon';
import RegisterTenantIconMobile from '@/components/icons/estateManager/mobile/registerTenantIcon';
import EmptyEstateIconMobile from '@/components/icons/estateManager/mobile/emptyEstateIconMobile';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const Dashboard = () => {
    const userData = useUserStore((state) => state.userData);
    const router = useRouter();

    return (
        <div className='mb-[150px]'>
            {userData ?
                <div className='p-8'>
                    <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Welcome, Victor</h1>
                    <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Here’s what’s happening across your estate today.</h3>
                    <div className='mt-8 bg-warningBg p-4 w-[320px] rounded-[12px] border-l-[4px] border-[#DC6803] flex flex-col gap-10'>
                        <div className="flex justify-between">
                            <h3 className="font-[500] text-[14px] text-BlackHomz">Total Residents</h3>
                            <Link
                                href={"/"}
                                className="flex items-center"
                            >
                                <h3 className=" text-[11px] font-[400] text-warning">
                                    view all
                                </h3>
                                <ArrowRight className='#DC6803' />
                            </Link>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className='flex flex-col'>
                                <h1 className="text-BlackHomz font-[700] text-[36px]">
                                    0
                                </h1>
                                <h3 className="text-GrayHomz font-[500] text-[13px]">
                                    Residents
                                </h3>
                            </div>
                            <div className="cursor-pointer flex flex-col items-end gap-2">
                                <div>
                                    <AddBlue className='#DC6803' />
                                </div>
                                <h3 className="text-[11px] font-[400] text-warning">
                                    Add Resident
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 rounded-[12px] bg-[#F6F6F6] md:bg-white md:border md:border-[#E6E6E6] h-auto h-[450px] md:h-[600px] p-4'>
                        <h3 className='text-sm font-medium text-GrayHomz'>Access Control</h3>
                        <div className='h-[90%] flex flex-col w-full items-center justify-center mt-10 md:mt-0'>
                            <div className='bg-[#EEF5FF] hidden md:flex items-center justify-center h-[144px] w-[144px] rounded-full'>
                                <RegisterTenantIcon />
                            </div>
                               <div className='bg-[#FFFFFF] md:hidden flex items-center justify-center h-[112px] w-[112px] rounded-full'>
                                <RegisterTenantIconMobile />
                            </div>
                            <div className='flex flex-col gap-3 items-center mt-4'>
                                <h1 className='text-[#141313] font-normal text-[16px]'>No Access Request</h1>
                                <h3 className='text-[#141313] font-normal text-sm text-center'>There are currently no access requests across your estate. </h3>
                                <button className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Register Visitor</button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='p-8'>
                    <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Welcome, Victor</h1>
                    <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Add a new estate to get started</h3>
                    <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <div className='hidden md:flex w-[144px] h-[144px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                <EmptyEstateIcon />
                            </div>
                            <div className='md:hidden w-[112px] h-[112px] rounded-full bg-[#EEF5FF] flex justify-center items-center'>
                                <EmptyEstateIconMobile />
                            </div>
                            <p className='text-[#141313] font-medium text-sm md:text-[16px]'>Add New Estate to Get Started</p>
                            <button onClick={() => router.push("/add-estate")} className='text-BlueHomz cursor-ponter text-sm font-normal flex items-center gap-1'>
                                <AddIcon /> Add Estate
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard