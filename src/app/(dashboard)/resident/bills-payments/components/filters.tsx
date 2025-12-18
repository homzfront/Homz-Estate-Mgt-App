/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import { useResidentBillStore } from '@/store/useResidentBillStore';
import BlueSearch from '@/components/icons/blueSearch';

const Filters = () => {
    const [isOpenI, setIsOpenI] = useState(false);
    const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
    const closeAction = useRef<HTMLDivElement>(null);
    const { setSearch, setFrequency, search, frequency, reset } = useResidentBillStore();
    const [localSearch, setLocalSearch] = useState(search);

    // Debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(localSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, setSearch]);

    useClickOutside(closeAction as any, () => {
        setIsOpenI(false);
        setShowFrequencyDropdown(false);
    });

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'frequency') {
            setFrequency(value);
        }
    };

    const getFrequencyDisplay = () => {
        if (!frequency) return 'All Frequencies';
        const options = {
            weekly: 'Weekly',
            biweekly: 'Biweekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            annually: 'Annually'
        };
        return options[frequency as keyof typeof options] || 'All Frequencies';
    };

    return (
        <div className="mt-4 w-full">
            <div className='flex items-center gap-4'>
                {/* Search bar outside */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search bills..."
                        className="w-full h-[45px] pl-4 pr-10 border rounded-md text-sm outline-none"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <BlueSearch />
                    </div>
                </div>
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
                                {/* Bill Name commented out */}
                                {/* <button className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                    Bill Name <ArrowDown className="#4E4E4E" />
                                </button> */}
                                {/* Frequency */}
                                <div className='relative'>
                                    <button
                                        onClick={() => {
                                            setShowFrequencyDropdown(!showFrequencyDropdown);
                                        }}
                                        className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                        {getFrequencyDisplay()} <ArrowDown className="#4E4E4E" />
                                    </button>
                                    {showFrequencyDropdown && (
                                        <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-[4px] mt-1 z-10 shadow-lg'>
                                            {[
                                                { value: '', label: 'All Frequencies' },
                                                { value: 'weekly', label: 'Weekly' },
                                                { value: 'biweekly', label: 'Biweekly' },
                                                { value: 'monthly', label: 'Monthly' },
                                                { value: 'quarterly', label: 'Quarterly' },
                                                { value: 'annually', label: 'Annually' }
                                            ].map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleFilterChange('frequency', option.value);
                                                        setShowFrequencyDropdown(false);
                                                    }}
                                                    className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-[4px] last:rounded-b-[4px]'
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Reset Button */}
                                <button
                                    onClick={() => {
                                        setFrequency('');
                                        setLocalSearch('');
                                        reset();
                                    }}
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
