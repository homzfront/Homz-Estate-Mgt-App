"use client"
import React from 'react'
import { useAccessStore } from '@/store/useAccessStore'
import EmptyAccess from '@/components/icons/estateManager/desktop/emptyAccess'
import AddWhiteBox from '@/components/icons/addWhiteBox'
import Dropdown from '@/components/general/dropDown'
import ResetIcon from '@/components/icons/resetIcon'
import Table from '@/app/(dashboard)/components/table'
import AddBlue from '@/components/icons/addBlue'
import AddIcon from '@/components/icons/addIcon'

const ManageResidents = () => {
    const [steps, setSteps] = React.useState<number>(0);
    const { accessData, setAccessData, accessForm, setAccessForm } = useAccessStore();
    const [selectedStatus, setSelectedStatus] = React.useState<string>("")
    const pages = [
        "All Records", "Manually Added Records"
    ];
    const optionData = [
        { id: 1, label: "Pending" }, { id: 2, label: "Signed In" }, { id: 3, label: "Signed Out" }
    ];

    return (
        <div className='mb-[150px]'>
            {accessData ?
                <div className='p-8'>
                    <div className='flex justify-between items-center border-b border-[#E6E6E6] pb-8'>
                        <div>
                            <h1 className='text-BlackHomz font-normal md:font-bold text-[16px] md:text-[23px] flex items-center gap-4'>Visitor Access Control <span className='md:hidden bg-whiteblue h-[36px] w-[36px] rounded-[8px] flex items-center justify-center'><AddIcon /></span></h1>
                            <h3 className='text-GrayHomz font-normal hidden md:block text-[16px]'>Click on access status to change visitor’s access status</h3>
                            <h3 className='text-GrayHomz2 font-normal text-sm md:hidden mt-2'>Tap on access status to change visitor’s access status</h3>
                        </div>
                        <button onClick={() => setAccessForm(true)} className='hidden bg-BlueHomz px-3 h-[37px] rounded-[4px] cursor-pointer text-sm font-normal text-white md:flex items-center gap-1'>
                            <AddWhiteBox /> Register Visitor
                        </button>
                    </div>
                    <div className='mt-8'>
                        <div className='flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between md:items-center'>
                            <div className='flex items-center gap-2'>
                                {
                                    pages.map((data, index) => (
                                        <div
                                            onClick={() => setSteps(index)}
                                            key={index}
                                            className={`${index === steps ? "text-white bg-BlueHomz" : "bg-whiteblue text-BlueHomz"} text-sm flex items-center px-3 h-[37px] rounded-[4px] cursor-pointer`}
                                        >
                                            {data}
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Dropdown
                                    options={optionData}
                                    onSelect={() => { }}
                                    selectOption={"Access Status"}
                                    height='h-[37px]'
                                    borderColor='border-[#A9A9A9]'
                                    showSearch={false}
                                />
                                <button className='px-3 h-[37px] border border-BlueHomz rounded-[4px] flex items-center gap-1 text-BlueHomz text-sm'>
                                    <ResetIcon />Reset
                                </button>
                            </div>
                        </div>
                        <div>
                            <Table
                                fromDefault={false}
                            />
                        </div>
                    </div>
                </div>
                :
                <div className='p-8'>
                    <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Visitor Access Control</h1>
                    <h3 className='text-GrayHomz font-normal text-sm md:tex t-[16px]'>Visitor records of all your Residents will be displayed here</h3>
                    <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                <EmptyAccess />
                            </div>
                            <p className='mt-2 text-[#141313] font-medium text-sm md:text-[16px]'>Add New Estate to Get Started</p>
                            <button onClick={() => setAccessData(true)} className='bg-BlueHomz px-4 py-2 rounded-[4px] cursor-ponter text-sm font-normal text-white flex items-center gap-1'>
                                <AddWhiteBox /> Register Visitor
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ManageResidents