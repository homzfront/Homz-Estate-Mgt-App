/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import DeleteIcon from "@/components/icons/deleteIcon";
import Dropdown from "@/components/general/dropDown";
import CoinsIcon from "@/components/icons/coinsIcon";
import AddWhiteBox from "@/components/icons/addWhiteBox";


const Filters = () => {
    const [isOpenTwo, setIsOpenTwo] = useState(false);
    const [isOpenI, setIsOpenI] = useState(false);
    const closeAction = useRef<HTMLDivElement>(null);
    const closeDeleteAction = useRef<HTMLDivElement>(null);

    useClickOutside(closeAction as any, () => {
        setIsOpenTwo(false)
    });

    useClickOutside(closeDeleteAction as any, () => {
        setIsOpenI(false)
    });

    return (
        <div className="mt-4 w-full">
            <div className='flex w-full justify-between items-center'>
                <>
                    <div className='hidden md:block'>
                        <Dropdown
                            showSearch
                            className="min-w-[250px]"
                            onSelect={() => { }}
                            borderColor="border-GrayHomz2"
                            selectOption="All Bills"
                            options={[
                                { id: 1, label: "All Bills" },
                                { id: 2, label: "Estate Dues" },
                                { id: 3, label: "Estate Security" },
                                { id: 4, label: "Service Charge" },
                            ]}
                        />
                    </div>
                    <div className='md:hidden block'>
                        <button className='bg-BlueHomz rounded-[4px] h-[37px] px-4 flex justify-center items-center gap-2 text-sm font-semibold text-white'>
                            <AddWhiteBox /> Create Bill
                        </button>
                    </div>
                </>
                <div className='flex items-center gap-2'>
                    <div className='relative'>
                        <div ref={closeDeleteAction}>
                            <div
                                onClick={() => {
                                    setIsOpenI(!isOpenI);
                                    setIsOpenTwo(false);
                                }}
                                className='cursor-pointer w-auto border border-BlueHomz px-3 h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                                <FilterIconBlue />
                                <span>
                                    {isOpenI ?
                                        <ArrowUpII className="#006AFF" /> :
                                        <ArrowDown className="#006AFF" />
                                    }
                                </span>
                            </div>
                            {/* {isOpenI && (
                                <div className='absolute z-50 top-11 right-0 bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[300px] overflow-y-auto scrollbar-container'>
                                    <div className='text-sm text-GrayHomz font-medium flex flex-col gap-0'>
                                        <button
                                            className='mt-1 text-sm font-normal text-BlueHomz bg-whiteblue flex justify-between px-3 py-2 w-full border border-BlueHomz rounded-[4px]'>
                                            <span className='mx-auto flex gap-2 items-center'>Reset   <Reset className='#006aff' /></span>
                                        </button>
                                    </div>
                                </div>
                            )} */}

                            {isOpenI && (
                                <div className='absolute z-50 top-11 right-0 bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[450px] overflow-y-auto scrollbar-container flex flex-col gap-2'>
                                    <p className="text-[13px] text-GrayHomz">Filter by:</p>
                                    {/* Bill Type */}
                                    <button className='md:hidden mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Bill Type <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Frequency */}
                                    <button className='md:hidden mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Frequency <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Status */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Status <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Residence Category */}
                                    <button className='md:hidden mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Residence Category <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Residence Type */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Residence Type <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Date */}
                                    <button className='relative mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 w-full rounded-[4px] bg-[#F6F6F6]'>
                                        <input
                                            type='date'
                                            className="w-full py-2 outline-none bg-[#F6F6F6] text-GrayHomz"
                                            // value={toDate}
                                            // onChange={(e) => setToDate(e.target.value)}
                                            placeholder='End Date'
                                        />
                                    </button>
                                    {/* Reset Button */}
                                    <button
                                        className='mt-1 text-sm font-normal text-BlueHomz bg-whiteblue flex justify-between px-3 py-2 w-full border border-BlueHomz rounded-[4px]'>
                                        <span className='mx-auto flex gap-2 items-center'>Reset   <Reset className='#006aff' /></span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='relative'>
                        <div ref={closeAction}>
                            <div
                                onClick={() => {
                                    setIsOpenTwo(!isOpenTwo);
                                    setIsOpenI(false);
                                }}
                                className='md:hidden cursor-pointer w-auto text-sm text-BlueHomz font-medium border border-BlueHomz px-3 h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                                <span className=''>Actions</span>
                                <span className=''>
                                    {isOpenTwo ? <ArrowUpII className="#006AFF" /> : <ArrowDown className="#006AFF" />}
                                </span>
                            </div>

                            {isOpenTwo && (
                                <div className='absolute z-50 top-11 right-[0px] bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[4px] max-h-[300px] overflow-y-auto scrollbar-container'>
                                    <div className='text-sm text-GrayHomz font-medium flex flex-col gap-0'>
                                        <button
                                            className='text-sm font-normal text-error hover:bg-whiteblue h-[37px] px-3 rounded-[4px] flex justify-start items-center gap-1'> <DeleteIcon /> Delete selected bills
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className='hidden border border-error text-sm font-normal text-error hover:bg-bgRed h-[37px] px-3 rounded-[4px] md:flex justify-start items-center gap-1'>
                        <DeleteIcon /> Delete selected bills
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
