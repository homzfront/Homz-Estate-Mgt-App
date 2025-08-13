/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import AddNormal from "@/components/icons/addNormal";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import FilterIconBlue from "@/components/icons/filterIconBlue";
import Reset from "@/components/icons/reset";
import BlueSearch from "@/components/icons/blueSearch";
import DotsBlue from "@/components/icons/dotsBlue";
import Ticked from "@/components/icons/ticked";
import UnTicked from "@/components/icons/unTicked";
import useClickOutside from '@/app/utils/useClickOutside';
import ManualAddIcon from "@/components/icons/estateManager&Resident/desktop/manualAddIcon";
import ShareIcon from "@/components/icons/estateManager&Resident/desktop/shareIcon";
import BillMiniIcon from "@/components/icons/estateManager&Resident/desktop/billMiniIcon";
import ExportIcon from "@/components/icons/estateManager&Resident/desktop/exportIcon";
import AddIcon from "@/components/icons/addIcon";

interface HeaderFilterProps {
    setOpenInvite: (data: boolean) => void;
    setOpenManualForm: (data: boolean) => void;
}

const HeaderFilter: React.FC<HeaderFilterProps> = ({ setOpenInvite, setOpenManualForm }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenTwo, setIsOpenTwo] = useState(false);
    const [isOpenI, setIsOpenI] = useState(false);
    const [openZone, setOpenZone] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");
    const [ZoneData] = useState(["Zone A", "Zone B"]);
    const closeFilter = useRef<HTMLDivElement>(null);
    const closeAction = useRef<HTMLDivElement>(null);

    useClickOutside(closeFilter as any, () => {
        setIsOpen(false);
        setOpenZone(false);
    });

    useClickOutside(closeAction as any, () => {
        setIsOpenTwo(false)
    });

    const clear = () => {
        setSearch("");
        setSelectedZone(null);
        setFromDate("");
        setToDate("");
    };

    return (
        <div>
            <div className="md:hidden flex items-center gap-4 mb-4">
                <div className='flex items-center gap-2 space-x-1'>
                    <h2 className='font-medium text-[16px] text-BlackHomz'>Residents </h2>
                    <p className='text-sm text-BlueHomz font-normal py-1 rounded-[8px] bg-[#EEF5FF] px-2'>528</p>
                </div>
                <button onClick={() => setOpenInvite(true)} className="py-2 rounded-[8px] bg-BlueHomz px-3 flex justify-center items-center">
                    <AddIcon className="#ffffff" />
                </button>
            </div>
            <div className='flex w-full gap-4 justify-between'>
                <div className="hidden md:flex items-center gap-4">
                    <div className='flex items-center gap-2 space-x-1'>
                        <h2 className='font-medium text-[20px] text-BlackHomz'>Residents </h2>
                        <p className='text-[18px] text-BlueHomz font-normal py-1 rounded-[8px] bg-[#EEF5FF] px-2'>528</p>
                    </div>
                    <button onClick={() => setOpenInvite(true)} className="py-2 rounded-[8px] bg-BlueHomz px-3 flex justify-center items-center">
                        <AddIcon className="#ffffff" />
                    </button>
                </div>
                <div className='mb-2 md:hidden h-[38px] w-full border border-[#A9A9A9] rounded-[4px] px-3 flex items-center justify-center gap-2'>
                    <BlueSearch className="#E6E6E6" />
                    <input
                        type='text'
                        className='placeholder:text-[#A9A9A9] w-full outline-none placeholder:text-[13px] text-[13px]'
                        placeholder='Search...'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                <div className='relative flex justify-end md:justify-normal md:items-center gap-2'>
                    <div ref={closeFilter}>
                        <div
                            onClick={() => {
                                setIsOpen(!isOpen);
                                setOpenZone(false);
                            }}
                            className='cursor-pointer w-auto border border-BlueHomz px-3 h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                            <FilterIconBlue />
                            <span className='hidden md:block'>
                                {isOpen ? <ArrowUpII className="#006AFF" /> : <ArrowDown className="#006AFF" />}
                            </span>
                        </div>
                        {isOpen && (
                            <div className='absolute z-50 top-10 right-[50px] md:right-[104px] bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[350px] overflow-auto scrollbar-container'>
                                {openZone ? (
                                    <div className='text-sm text-GrayHomz font-medium'>
                                        {ZoneData.map((prop, index) => (
                                            <div
                                                key={index}
                                                className='flex gap-2 mt-1.5 items-center cursor-pointer'
                                                onClick={() =>
                                                    setSelectedZone(selectedZone === prop ? null : prop)
                                                }>
                                                {selectedZone === prop ? <Ticked /> : <UnTicked />}
                                                {prop}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <p className='text-[13px] text-GrayHomz font-medium'>Filter by:</p>
                                        <div className='mb-2 hidden md:flex gap-2 items-center w-full border border-[#A9A9A9] rounded-[4px] p-2'>
                                            <BlueSearch />
                                            <input
                                                type='text'
                                                className='placeholder:text-[#A9A9A9] w-full outline-none'
                                                placeholder='Search...'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => setOpenZone(true)} className='mt-1 text-sm font-normal text-GrayHomz flex justify-between px-3 py-2 w-full border border-[#4E4E4E] rounded-[4px]'>
                                            {selectedZone || "Zone"} <ArrowDown className="#4E4E4E" />
                                        </button>
                                        <input
                                            type='date'
                                            className="w-full py-2 mt-1 px-3 border border-[#4E4E4E] rounded-[4px] outline-none"
                                            placeholder='Start Date'
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                        />
                                        <input
                                            type='date'
                                            className="w-full py-2 mt-1 px-3 border border-[#4E4E4E] rounded-[4px] outline-none"
                                            placeholder='End Date'
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                        <button onClick={clear} className='mt-1 text-sm font-normal text-BlueHomz bg-whiteblue flex justify-between px-3 py-2 w-full border border-BlueHomz rounded-[4px]'>
                                            <span className='mx-auto flex gap-2 items-center'>Reset <Reset className='#006aff' /></span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div ref={closeAction}>
                        <div
                            onClick={() => {
                                setIsOpenTwo(!isOpenTwo);
                                setIsOpenI(false);
                            }}
                            className='cursor-pointer w-auto text-sm text-BlueHomz font-medium border border-BlueHomz px-3 h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                            <span className='hidden md:block'>Actions</span>
                            <span className='md:hidden'><DotsBlue /></span>
                            <span className='hidden md:block'>
                                {isOpenTwo ? <ArrowUpII className="#006AFF" /> : <ArrowDown className="#006AFF" />}
                            </span>
                        </div>

                        {isOpenTwo && (
                            <div className='absolute z-50 top-10 right-[0px] bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[300px] overflow-y-auto scrollbar-container'>
                                {isOpenI ? (
                                    <div className='font-[500] text-BlackHomz text-[14px]'>
                                        <p className="px-4 text-[13px] text-GrayHomz font-medium">Export as:</p>
                                        {[".CSV", ".XLSX", ".PDF"].map((option, index) => (
                                            <div
                                                key={index}
                                                className="py-2 bg-[#F6F6F6] px-4 cursor-pointer hover:text-white hover:bg-BlueHomz m-2 rounded-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}>
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='text-sm text-GrayHomz font-medium flex flex-col gap-0'>
                                        <div onClick={() => setOpenInvite(true)} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><AddNormal /></span>
                                            <span className="min-w-[80%]">Invite Resident(s)</span>
                                        </div>
                                        <div onClick={() => setOpenManualForm(true)} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><ManualAddIcon className="#4E4E4E" /></span>
                                            <span className="min-w-[80%]">Manually add Resident</span>
                                        </div>
                                        <div className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><BillMiniIcon /></span>
                                            <span className="min-w-[80%]">Add Bills</span>
                                        </div>
                                        <div className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><ShareIcon /></span>
                                            <span className="min-w-[80%]">Share Page</span>
                                        </div>
                                        <div className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><ExportIcon /></span>
                                            <span className="min-w-[80%] flex gap-1 items-center" onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpenI(true);
                                            }}>
                                                Export as <ArrowDown className="#4E4E4E" />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderFilter;
