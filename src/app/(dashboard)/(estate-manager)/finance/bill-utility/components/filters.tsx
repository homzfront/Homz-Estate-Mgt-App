/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import DeleteIcon from "@/components/icons/deleteIcon";
import Dropdown from "@/components/general/dropDown";
import AddWhiteBox from "@/components/icons/addWhiteBox";
import { useBillStore } from "@/store/useBillStore";

const RESIDENCY_TYPES = [
    'All Residency Type',
    'Detached House / Bungalow',
    'Semi-Detached House',
    'Duplex/Two-Storey House',
    'Flat / Apartment',
    'Studio Apartment',
    'Terraced / Row House',
    'Serviced Apartment',
    'Penthouse',
    'Hostel / Lodging Unit',
    'Shop / Store',
    'Shopping Mall',
    'Office Space',
    'Kiosk / Mini-Store',
];

const FREQUENCY_OPTIONS = [
    { id: 'all', label: 'All Frequencies' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Biweekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'annually', label: 'Annually' },
];

const STATUS_OPTIONS = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
];

interface FiltersProps {
    handleCreateBillClick: () => void;
    selectedRowsCount: number;
    onDeleteSelected: () => void;
    isDeletingMultiple: boolean;
}

const Filters = ({ handleCreateBillClick, selectedRowsCount, onDeleteSelected, isDeletingMultiple }: FiltersProps) => {
    const [isOpenTwo, setIsOpenTwo] = useState(false);
    const [isOpenI, setIsOpenI] = useState(false);
    const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showResidencyDropdown, setShowResidencyDropdown] = useState(false);
    const closeAction = useRef<HTMLDivElement>(null);
    const closeDeleteAction = useRef<HTMLDivElement>(null);

    const {
        frequency,
        status,
        residencyType,
        setFrequency,
        setStatus,
        setResidencyType,
        clearFilters,
        fetchBills
    } = useBillStore();

    useClickOutside(closeAction as any, () => {
        setIsOpenTwo(false)
    });

    useClickOutside(closeDeleteAction as any, () => {
        setIsOpenI(false)
    });

    // Fetch bills when filters change
    useEffect(() => {
        fetchBills({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [frequency, status, residencyType]);

    const handleResetFilters = () => {
        clearFilters();
        setShowFrequencyDropdown(false);
        setShowStatusDropdown(false);
        setShowResidencyDropdown(false);
        setFrequency(''); // Reset to 'All Frequencies'
    };

    return (
        <div className="mt-4 w-full">
            <div className='flex w-full justify-between items-center'>
                <>
                    <div className='hidden md:block'>
                        <Dropdown
                            key={frequency || 'all-frequencies'}
                            options={FREQUENCY_OPTIONS}
                            onSelect={(opt) => setFrequency(opt.id === 'all' ? '' : String(opt.id))}
                            selectOption={FREQUENCY_OPTIONS.find(f => f.id === frequency)?.label || 'All Frequencies'}
                            className="min-w-[250px]"
                            showSearch={false}
                            borderColor="border-GrayHomz2"
                        />
                    </div>
                    <div className='md:hidden block'>
                        <button onClick={handleCreateBillClick} className='bg-BlueHomz rounded-[4px] h-[37px] px-4 flex justify-center items-center gap-2 text-sm font-semibold text-white'>
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

                                    {/* Frequency */}
                                    <div className='md:hidden relative'>
                                        <button
                                            onClick={() => {
                                                setShowFrequencyDropdown(!showFrequencyDropdown);
                                                setShowStatusDropdown(false);
                                                setShowResidencyDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between items-center px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px] hover:bg-[#EBEBEB] transition-colors'
                                        >
                                            <span className={frequency ? 'text-BlackHomz font-medium' : ''}>
                                                {frequency ? FREQUENCY_OPTIONS.find(f => f.id === frequency)?.label : 'Frequency'}
                                            </span>
                                            <span className={`transform transition-transform ${showFrequencyDropdown ? 'rotate-180' : ''}`}>
                                                <ArrowDown className="#4E4E4E" />
                                            </span>
                                        </button>
                                        {showFrequencyDropdown && (
                                            <div className='absolute z-[60] top-full mt-1 left-0 right-0 bg-white border border-[#E6E6E6] rounded-[4px] shadow-lg overflow-hidden'>
                                                {FREQUENCY_OPTIONS.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => {
                                                            setFrequency(opt.id === 'all' ? '' : String(opt.id));
                                                            setShowFrequencyDropdown(false);
                                                        }}
                                                        className={`px-3 py-2 hover:bg-whiteblue cursor-pointer text-sm transition-colors ${(opt.id === 'all' && !frequency) || opt.id === frequency
                                                            ? 'bg-whiteblue text-BlueHomz font-medium'
                                                            : 'text-GrayHomz'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className='relative'>
                                        <button
                                            onClick={() => {
                                                setShowStatusDropdown(!showStatusDropdown);
                                                setShowFrequencyDropdown(false);
                                                setShowResidencyDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between items-center px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px] hover:bg-[#EBEBEB] transition-colors'
                                        >
                                            <span className={status ? 'text-BlackHomz font-medium' : ''}>
                                                {status ? (status === 'active' ? 'Active' : 'Inactive') : 'Status'}
                                            </span>
                                            <span className={`transform transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`}>
                                                <ArrowDown className="#4E4E4E" />
                                            </span>
                                        </button>
                                        {showStatusDropdown && (
                                            <div className='absolute z-[60] top-full mt-1 left-0 right-0 bg-white border border-[#E6E6E6] rounded-[4px] shadow-lg overflow-hidden'>
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => {
                                                            setStatus(opt.id === 'all' ? '' : opt.id);
                                                            setShowStatusDropdown(false);
                                                        }}
                                                        className={`px-3 py-2 hover:bg-whiteblue cursor-pointer text-sm transition-colors ${(opt.id === 'all' && !status) || opt.id === status
                                                            ? 'bg-whiteblue text-BlueHomz font-medium'
                                                            : 'text-GrayHomz'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Residence Type */}
                                    <div className='relative'>
                                        <button
                                            onClick={() => {
                                                setShowResidencyDropdown(!showResidencyDropdown);
                                                setShowFrequencyDropdown(false);
                                                setShowStatusDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between items-center px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px] hover:bg-[#EBEBEB] transition-colors'
                                        >
                                            <span className={`truncate pr-2 ${residencyType ? 'text-BlackHomz font-medium' : ''}`}>
                                                {residencyType || 'Residence Type'}
                                            </span>
                                            <span className={`transform transition-transform flex-shrink-0 ${showResidencyDropdown ? 'rotate-180' : ''}`}>
                                                <ArrowDown className="#4E4E4E" />
                                            </span>
                                        </button>
                                        {showResidencyDropdown && (
                                            <div className='absolute z-[60] top-full mt-1 left-0 right-0 bg-white border border-[#E6E6E6] rounded-[4px] shadow-lg max-h-[200px] overflow-y-auto scrollbar-container'>
                                                {RESIDENCY_TYPES.map((type) => (
                                                    <div
                                                        key={type}
                                                        onClick={() => {
                                                            setResidencyType(type === 'All Residency Type' ? '' : type);
                                                            setShowResidencyDropdown(false);
                                                        }}
                                                        className={`px-3 py-2 hover:bg-whiteblue cursor-pointer text-sm transition-colors ${(type === 'All Residency Type' && !residencyType) || type === residencyType
                                                            ? 'bg-whiteblue text-BlueHomz font-medium'
                                                            : 'text-GrayHomz'
                                                            }`}
                                                    >
                                                        {type}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reset Button */}
                                    <button
                                        onClick={handleResetFilters}
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
                                            onClick={onDeleteSelected}
                                            disabled={selectedRowsCount === 0 || isDeletingMultiple}
                                            className='text-sm font-normal text-error hover:bg-whiteblue h-[37px] px-3 rounded-[4px] flex justify-start items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'>
                                            <DeleteIcon /> Delete selected bills {selectedRowsCount > 0 && `(${selectedRowsCount})`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onDeleteSelected}
                        disabled={selectedRowsCount === 0 || isDeletingMultiple}
                        className='hidden border border-error text-sm font-normal text-error hover:bg-bgRed h-[37px] px-3 rounded-[4px] md:flex justify-start items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'>
                        <DeleteIcon /> Delete selected bills {selectedRowsCount > 0 && `(${selectedRowsCount})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
