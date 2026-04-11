/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import AddNormal from "@/components/icons/addNormal";
import ArrowDown from "@/components/icons/arrowDown";
import ArrowUpII from "@/components/icons/arrowUpII";
import BlueSearch from "@/components/icons/blueSearch";
import useClickOutside from '@/app/utils/useClickOutside';
import ManualAddIcon from "@/components/icons/estateManager&Resident/desktop/manualAddIcon";
import ShareIcon from "@/components/icons/estateManager&Resident/desktop/shareIcon";
import BillMiniIcon from "@/components/icons/estateManager&Resident/desktop/billMiniIcon";
import ExportIcon from "@/components/icons/estateManager&Resident/desktop/exportIcon";
import AddIcon from "@/components/icons/addIcon";
import { useResidentsListStore } from "@/store/useResidentsListStore";
import useDebounce from "@/app/utils/useDebounce";
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import toast from 'react-hot-toast';

interface HeaderFilterProps {
    setOpenInvite: (data: boolean) => void;
    setOpenManualForm: (data: boolean) => void;
}

const HeaderFilter: React.FC<HeaderFilterProps> = ({ setOpenInvite, setOpenManualForm }) => {
    const [isOpenTwo, setIsOpenTwo] = useState(false);
    const [isOpenI, setIsOpenI] = useState(false);
    const [search, setSearch] = useState("");
    const closeAction = useRef<HTMLDivElement>(null);
    const { totalCount, setSearch: setStoreSearch, fetchResidents, items: residents } = useResidentsListStore();
    const ability = useAbility();
    const router = useRouter();
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const debounced = useDebounce(search, 2000);

    useClickOutside(closeAction as any, () => {
        setIsOpenTwo(false);
        setIsOpenI(false);
    });

    useEffect(() => {
        setStoreSearch(search);
    }, [search, setStoreSearch]);

    useEffect(() => {
        fetchResidents({ page: 1, search: debounced });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const handleSharePage = () => {
        const estateId = selectedCommunity?.estate?._id;
        const orgId = selectedCommunity?.estate?.associatedIds?.organizationId;
        if (!estateId || !orgId) { toast.error('No estate selected'); return; }
        const url = `${window.location.origin}/resident/invitations/signup?organizationId=${orgId}&estateId=${estateId}`;
        navigator.clipboard.writeText(url)
            .then(() => toast.success('Invite link copied to clipboard!', { position: 'top-center', duration: 2000 }))
            .catch(() => toast.error('Could not copy link'));
        setIsOpenTwo(false);
    };

    const buildRows = () => {
        const data = residents || [];
        return data.map((r: any) => [
            r.firstName || '',
            r.lastName || '',
            r.email || '',
            r.phoneNumber || '',
            r.building || '',
            r.apartment || '',
            r.streetName || '',
            r.residencyType || '',
            r.status || '',
        ]);
    };

    const handleExportCSV = () => {
        const rows = buildRows();
        if (!rows.length) { toast.error('No residents to export'); return; }
        const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Building', 'Apartment', 'Street', 'Residency Type', 'Status'];
        const csv = [headers, ...rows]
            .map(row => row.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `residents-${selectedCommunity?.estate?.basicDetails?.name || 'estate'}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Exported as CSV', { position: 'top-center' });
        setIsOpenTwo(false);
        setIsOpenI(false);
    };

    const handleExportXLSX = async () => {
        const rows = buildRows();
        if (!rows.length) { toast.error('No residents to export'); return; }
        try {
            const XLSX = await import('xlsx');
            const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Building', 'Apartment', 'Street', 'Residency Type', 'Status'];
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Residents');
            XLSX.writeFile(wb, `residents-${selectedCommunity?.estate?.basicDetails?.name || 'estate'}-${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Exported as XLSX', { position: 'top-center' });
        } catch {
            toast.error('XLSX export failed. Please try CSV instead.');
        }
        setIsOpenTwo(false);
        setIsOpenI(false);
    };

    const handleExport = (format: string) => {
        if (format === '.CSV') return handleExportCSV();
        if (format === '.XLSX') return handleExportXLSX();
        toast.error('.PDF export coming soon', { position: 'top-center' });
        setIsOpenTwo(false);
        setIsOpenI(false);
    };

    return (
        <div>
            <div className="md:hidden flex items-center gap-4 mb-4">
                <div className='flex items-center gap-2 space-x-1'>
                    <h2 className='font-medium text-[16px] text-BlackHomz'>Residents </h2>
                    <p className='text-sm text-BlueHomz font-normal py-1 rounded-[8px] bg-[#EEF5FF] px-2'>{totalCount}</p>
                </div>
                {ability.can('create', 'residents') && (
                    <button onClick={() => setOpenInvite(true)} className="py-2 rounded-[8px] bg-BlueHomz px-3 flex justify-center items-center">
                        <AddIcon className="#ffffff" />
                    </button>
                )}
            </div>
            <div className='flex w-full gap-4 justify-between'>
                <div className="hidden md:flex items-center gap-4">
                    <div className='flex items-center gap-2 space-x-1'>
                        <h2 className='font-medium text-[20px] text-BlackHomz'>Residents </h2>
                        <p className='text-[18px] text-BlueHomz font-normal py-1 rounded-[8px] bg-[#EEF5FF] px-2'>{totalCount}</p>
                    </div>
                    {ability.can('create', 'residents') && (
                        <button onClick={() => setOpenInvite(true)} className="py-2 rounded-[8px] bg-BlueHomz px-3 flex justify-center items-center">
                            <AddIcon className="#ffffff" />
                        </button>
                    )}
                </div>

                <div className='relative flex flex-1 md:flex-none items-center gap-2'>
                    <div className='h-[38px] w-full md:w-[350px] border border-[#A9A9A9] rounded-[4px] px-3 flex items-center justify-center gap-2'>
                        <BlueSearch />
                        <input
                            type='text'
                            className='placeholder:text-[#A9A9A9] w-full outline-none placeholder:text-[13px] text-[13px]'
                            placeholder='Resident name, email, zone, street, phone...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                    <div ref={closeAction}>
                        <div
                            onClick={() => {
                                setIsOpenTwo(!isOpenTwo);
                                setIsOpenI(false);
                            }}
                            className='cursor-pointer w-auto text-sm text-BlueHomz font-medium border border-BlueHomz px-3 h-[38px] flex justify-center items-center rounded-[4px] gap-1'>
                            <span className=''>Actions</span>
                            <span className=''>
                                {isOpenTwo ? <ArrowUpII className="#006AFF" /> : <ArrowDown className="#006AFF" />}
                            </span>
                        </div>

                        {isOpenTwo && (
                            <div className='absolute z-50 top-10 right-[0px] bg-white min-w-[220px] p-2 border border-[#A9A9A9] rounded-[12px] max-h-[300px] overflow-y-auto scrollbar-container'>
                                {isOpenI ? (
                                    <div className='font-[500] text-BlackHomz text-[14px]'>
                                        <button
                                            onClick={() => { setIsOpenI(false); }}
                                            className="px-4 text-[12px] text-BlueHomz font-medium mb-1 flex items-center gap-1"
                                        >
                                            ← Back
                                        </button>
                                        <p className="px-4 text-[13px] text-GrayHomz font-medium">Export as:</p>
                                        {[".CSV", ".XLSX", ".PDF"].map((option, index) => (
                                            <div
                                                key={index}
                                                className="py-2 bg-[#F6F6F6] px-4 cursor-pointer hover:text-white hover:bg-BlueHomz m-2 rounded-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleExport(option);
                                                }}>
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='text-sm text-GrayHomz font-medium flex flex-col gap-0'>
                                        {ability.can('create', 'residents') && (
                                            <>
                                                <div onClick={() => { setOpenInvite(true); setIsOpenTwo(false); }} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                                    <span className="w-4"><AddNormal /></span>
                                                    <span className="min-w-[80%]">Invite Resident(s)</span>
                                                </div>
                                                <div onClick={() => { setOpenManualForm(true); setIsOpenTwo(false); }} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                                    <span className="w-4"><ManualAddIcon className="#4E4E4E" /></span>
                                                    <span className="min-w-[80%]">Add Resident by Mail</span>
                                                </div>
                                            </>
                                        )}
                                        {ability.can('read', 'finance') && (
                                            <div onClick={() => { router.push('/finance/bill-utility'); setIsOpenTwo(false); }} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                                <span className="w-4"><BillMiniIcon /></span>
                                                <span className="min-w-[80%]">Add Bills</span>
                                            </div>
                                        )}
                                        <div onClick={handleSharePage} className="flex gap-2 items-center hover:bg-whiteblue p-2 cursor-pointer">
                                            <span className="w-4"><ShareIcon /></span>
                                            <span className="min-w-[80%]">Share Invite Link</span>
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