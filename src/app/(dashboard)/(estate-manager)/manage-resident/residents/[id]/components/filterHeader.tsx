/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import useClickOutside from '@/app/utils/useClickOutside';
import Reset from "@/components/icons/reset";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import Dropdown from "@/components/general/dropDown";
import { useBillPaymentStore } from "@/store/useBillPaymentStore";
import { useSelectedCommunity } from "@/store/useSelectedCommunity";
import { useBillStore } from "@/store/useBillStore";
// import api from '@/utils/api';
// import { BillItem } from "@/store/useBillStore";

const FilterHeader = () => {
    const [isOpenI, setIsOpenI] = useState(false);
    const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
    const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);
    const [showPaymentModeDropdown, setShowPaymentModeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const closeDeleteAction = useRef<HTMLDivElement>(null);

    const {
        filters,
        isFilterActive,
        setFilter,
        clearFilters,
        fetchBillPayments,
        lastResidentId,
        lastApartmentId
    } = useBillPaymentStore();

    const { selectedCommunity } = useSelectedCommunity();
    const { items: bills, fetchBills } = useBillStore();

    // Fetch bills when component mounts or estate changes
    useEffect(() => {
        if (selectedCommunity?.estate?.associatedIds?.organizationId && selectedCommunity?.estate?._id) {
            fetchBills({ limit: 100 }); // Fetch all bills for dropdown
        }
    }, [selectedCommunity?.estate?._id, fetchBills]);

    useClickOutside(closeDeleteAction as any, () => {
        setIsOpenI(false);
        setShowFrequencyDropdown(false);
        setShowPaymentTypeDropdown(false);
        setShowPaymentModeDropdown(false);
        setShowStatusDropdown(false);
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilter(key as keyof typeof filters, value);
        // Trigger fetch with updated filters using last known resident and apartment IDs
        if (lastResidentId && lastApartmentId) {
            fetchBillPayments({ residentId: lastResidentId, apartmentId: lastApartmentId, page: 1 });
        }
    };

    const handleResetFilters = () => {
        clearFilters();
        // Trigger fetch with cleared filters using last known resident and apartment IDs
        if (lastResidentId && lastApartmentId) {
            fetchBillPayments({ residentId: lastResidentId, apartmentId: lastApartmentId, page: 1 });
        }
    };

    // Helper functions to get display text for selected filters
    const getFrequencyDisplay = () => {
        if (!filters.frequency) return 'Frequency';
        const options = [
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Biweekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annually', label: 'Annually' }
        ];
        return options.find(opt => opt.value === filters.frequency)?.label || 'Frequency';
    };

    const getPaymentTypeDisplay = () => {
        if (!filters.paymentType) return 'Payment Type';
        const options = [
            { value: 'Part-Payment', label: 'Part Payment' },
            { value: 'Full-Payment', label: 'Full Payment' }
        ];
        return options.find(opt => opt.value === filters.paymentType)?.label || 'Payment Type';
    };

    const getPaymentModeDisplay = () => {
        if (!filters.paymentMode) return 'Mode of Payment';
        const options = [
            { value: 'online', label: 'Online' },
            { value: 'offline', label: 'Offline' }
        ];
        return options.find(opt => opt.value === filters.paymentMode)?.label || 'Mode of Payment';
    };

    const getStatusDisplay = () => {
        if (!filters.status) return 'Status';
        const options = [
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'overdue', label: 'Overdue' }
        ];
        return options.find(opt => opt.value === filters.status)?.label || 'Status';
    };

    return (
        <div className="mt-6 mb-8 w-full">
            <div className='flex w-full justify-between gap-4 md:gap-0 items-center'>
                <div className="w-[200px] md:w-[250px]">
                    <Dropdown
                        showSearch
                        className="md:min-w-[250px]"
                        onSelect={(opt) => handleFilterChange('billingId', String(opt.id))}
                        selectOption={filters.billingId ? bills.find(b => b._id === filters.billingId)?.billName || "All Bills" : "All Bills"}
                        borderColor="border-GrayHomz2"
                        options={[
                            { id: '', label: "All Bills" },
                            ...bills.map(bill => ({
                                id: bill._id,
                                label: bill.billName
                            }))
                        ]}
                    />
                </div>
                <div className='flex items-center gap-2'>
                    {/* Export CSV button */}
                    <button
                        onClick={() => {
                            const { items } = useBillPaymentStore.getState();
                            if (!items.length) return;
                            const headers = ['Bill Type','Period','Amount','Amount Paid','Status','Payment Date','Due Date'];
                            const rows = items.map((r: any) => [
                                r.billType || '',
                                r.period || '',
                                r.amount || 0,
                                r.amountPaid || 0,
                                r.periodStatus || '',
                                r.paymentDate ? new Date(r.paymentDate).toLocaleDateString() : '—',
                                r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—',
                            ]);
                            const csv = [headers, ...rows].map((r: any[]) => r.join(',')).join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `bill-statement-${new Date().toISOString().split('T')[0]}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className='h-[45px] md:h-[38px] px-3 border border-GrayHomz2 text-GrayHomz text-sm rounded-[4px] flex items-center gap-1 hover:border-BlueHomz hover:text-BlueHomz transition-colors'
                        title='Export bill statement as CSV'
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        <span className="hidden md:inline">Export</span>
                    </button>
                    <div className='relative'>
                        <div ref={closeDeleteAction}>
                            <div
                                onClick={() => {
                                    setIsOpenI(!isOpenI);
                                }}
                                className={`cursor-pointer w-auto border px-3 h-[45px] md:h-[38px] flex justify-center items-center rounded-[4px] gap-1 ${isFilterActive ? 'border-BlueHomz bg-blue-50' : 'border-BlueHomz'}`}>
                                <FilterIconBlue />
                                <span>
                                    {isOpenI ?
                                        <ArrowUpII className="#006AFF" /> :
                                        <ArrowDown className="#006AFF" />
                                    }
                                </span>
                                {isFilterActive && (
                                    <span className="ml-1 bg-BlueHomz text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                                        !
                                    </span>
                                )}
                            </div>

                            {isOpenI && (
                                <div className='absolute z-50 top-11 right-0 bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[450px] overflow-y-auto scrollbar-container flex flex-col gap-2'>
                                    <p className="text-[13px] text-GrayHomz">Filter by:</p>
                                    
                                    {/* Frequency */}
                                    <div className='relative'>
                                        <button
                                            onClick={() => {
                                                setShowFrequencyDropdown(!showFrequencyDropdown);
                                                setShowPaymentTypeDropdown(false);
                                                setShowPaymentModeDropdown(false);
                                                setShowStatusDropdown(false);
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
                                    
                                    {/* Payment Type */}
                                    <div className='relative'>
                                        <button
                                            onClick={() => {
                                                setShowPaymentTypeDropdown(!showPaymentTypeDropdown);
                                                setShowFrequencyDropdown(false);
                                                setShowPaymentModeDropdown(false);
                                                setShowStatusDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                            {getPaymentTypeDisplay()} <ArrowDown className="#4E4E4E" />
                                        </button>
                                        {showPaymentTypeDropdown && (
                                            <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-[4px] mt-1 z-10 shadow-lg'>
                                                {[
                                                    { value: '', label: 'All Payment Types' },
                                                    { value: 'Part-Payment', label: 'Part Payment' },
                                                    { value: 'Full-Payment', label: 'Full Payment' }
                                                ].map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            handleFilterChange('paymentType', option.value);
                                                            setShowPaymentTypeDropdown(false);
                                                        }}
                                                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-[4px] last:rounded-b-[4px]'
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Mode of Payment */}
                                    <div className='relative'>
                                        <button
                                            onClick={() => {
                                                setShowPaymentModeDropdown(!showPaymentModeDropdown);
                                                setShowFrequencyDropdown(false);
                                                setShowPaymentTypeDropdown(false);
                                                setShowStatusDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                            {getPaymentModeDisplay()} <ArrowDown className="#4E4E4E" />
                                        </button>
                                        {showPaymentModeDropdown && (
                                            <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-[4px] mt-1 z-10 shadow-lg'>
                                                {[
                                                    { value: '', label: 'All Modes' },
                                                    { value: 'online', label: 'Online' },
                                                    { value: 'offline', label: 'Offline' }
                                                ].map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            handleFilterChange('paymentMode', option.value);
                                                            setShowPaymentModeDropdown(false);
                                                        }}
                                                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-[4px] last:rounded-b-[4px]'
                                                    >
                                                        {option.label}
                                                    </button>
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
                                                setShowPaymentTypeDropdown(false);
                                                setShowPaymentModeDropdown(false);
                                            }}
                                            className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full bg-[#F6F6F6] rounded-[4px]'>
                                            {getStatusDisplay()} <ArrowDown className="#4E4E4E" />
                                        </button>
                                        {showStatusDropdown && (
                                            <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-[4px] mt-1 z-10 shadow-lg'>
                                                {[
                                                    { value: '', label: 'All Status' },
                                                    { value: 'paid', label: 'Paid' },
                                                    { value: 'pending', label: 'Pending' },
                                                    { value: 'overdue', label: 'Overdue' }
                                                ].map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            handleFilterChange('status', option.value);
                                                            setShowStatusDropdown(false);
                                                        }}
                                                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-[4px] last:rounded-b-[4px]'
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Date */}
                                    <div className='relative'>
                                        <input
                                            type='date'
                                            className="w-full py-2 px-3 outline-none bg-[#F6F6F6] text-GrayHomz rounded-[4px] text-sm"
                                            value={filters.date || ''}
                                            onChange={(e) => handleFilterChange('date', e.target.value)}
                                            placeholder='Select Date'
                                        />
                                    </div>
                                    
                                    {/* Reset Button */}
                                    <button
                                        onClick={handleResetFilters}
                                        className='mt-1 text-sm font-normal text-BlueHomz bg-whiteblue flex justify-between px-3 py-2 w-full border border-BlueHomz rounded-[4px]'>
                                        <span className='mx-auto flex gap-2 items-center'>Reset <Reset className='#006aff' /></span>
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