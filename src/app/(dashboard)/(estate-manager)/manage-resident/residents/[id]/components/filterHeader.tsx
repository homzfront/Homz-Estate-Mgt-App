/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import Dropdown from "@/components/general/dropDown";

interface FilterHeaderProps {
}

const FilterHeader = ({ }: FilterHeaderProps) => {
    const [isOpenI, setIsOpenI] = useState(false);
    const closeDeleteAction = useRef<HTMLDivElement>(null);

    useClickOutside(closeDeleteAction as any, () => {
        setIsOpenI(false)
    });

    return (
        <div className="mt-6 mb-8 w-full">
            <div className='flex w-full justify-between gap-4 md:gap-0 items-center'>
                <div className="w-[200px] md:w-[250px]">
                    <Dropdown
                        showSearch
                        className="md:min-w-[250px]"
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
                <div className='flex items-center gap-2'>
                    <div className='relative'>
                        <div ref={closeDeleteAction}>
                            <div
                                onClick={() => {
                                    setIsOpenI(!isOpenI);
                                }}
                                className='cursor-pointer w-auto border border-BlueHomz px-3 h-[45px] md:h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                                <FilterIconBlue />
                                <span>
                                    {isOpenI ?
                                        <ArrowUpII className="#006AFF" /> :
                                        <ArrowDown className="#006AFF" />
                                    }
                                </span>
                            </div>

                            {isOpenI && (
                                <div className='absolute z-50 top-11 right-0 bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[450px] overflow-y-auto scrollbar-container flex flex-col gap-2'>
                                    <p className="text-[13px] text-GrayHomz">Filter by:</p>
                                    {/* Frequency */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Frequency <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Payment Type */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Payment Type <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Mode of Payment */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Mode of Payment <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {/* Status */}
                                    <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        Status <ArrowDown className="#4E4E4E" />
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
                </div>
            </div>
        </div>
    );
};

export default FilterHeader;
