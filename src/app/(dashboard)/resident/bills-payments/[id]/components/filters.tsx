/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";

interface FiltersProps {
}

const Filters = ({ }: FiltersProps) => {
    const [isOpenI, setIsOpenI] = useState(false);
    const closeAction = useRef<HTMLDivElement>(null);

    useClickOutside(closeAction as any, () => {
        setIsOpenI(false)
    });

    return (
        <div className="mt-4 w-full">
            <div className='flex items-center gap-2'>
                <div className='relative'>
                    <div ref={closeAction}>
                        <div
                            onClick={() => {
                                setIsOpenI(!isOpenI);
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
                        {isOpenI && (
                            <div className='absolute z-50 top-11 right-0 bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[450px] overflow-y-auto scrollbar-container flex flex-col gap-2'>
                                <p className="text-[13px] text-GrayHomz">Filter by:</p>
                                {/* Bill Name */}
                                <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                    Bill Name <ArrowDown className="#4E4E4E" />
                                </button>
                                {/* Frequency */}
                                <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                    Frequency <ArrowDown className="#4E4E4E" />
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
    );
};

export default Filters;
