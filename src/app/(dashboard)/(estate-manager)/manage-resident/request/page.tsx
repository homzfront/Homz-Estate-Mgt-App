"use client";
import Ticked from '@/components/icons/ticked';
import UnTicked from '@/components/icons/unTicked';
import UserAdd from '@/components/icons/userAdd';
import { useRequestSlice } from '@/store/useRequestStore';
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const Request = () => {
    const { requestResponse, isLoading, getRequest } = useRequestSlice();
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const [popUpMenu, setPopUpMenu] = React.useState(false);
    const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const popUpRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        getRequest();
    }, []);

    // Virtualizer setup
    const rowCount = requestResponse ? requestResponse?.results.length : 0;
    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => tableRef.current,
        estimateSize: () => 60,
        overscan: 5,
    });

    // Select all rows
    const handleSelectAll = () => {
        if (!requestResponse) return;
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(requestResponse?.results.map(r => r._id));
        }
        setSelectAll(!selectAll);
    };

    // Select single row
    const handleRowSelect = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // Pop-up menu logic
    const handleToggleMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSelectedId(id);
        setPopUpMenu(true);
        // Position menu below button
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    };

    // Close pop-up on outside click
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popUpRef.current &&
                !popUpRef.current.contains(event.target as Node)
            ) {
                setPopUpMenu(false);
                setSelectedId(null);
            }
        }
        if (popUpMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popUpMenu]);

    // Approve/Decline actions (stub)
    const handleApprove = (id: string) => {
        alert(`Approved request for ${id}`);
        setPopUpMenu(false);
    };
    const handleDecline = (id: string) => {
        alert(`Declined request for ${id}`);
        setPopUpMenu(false);
    };
console.log(requestResponse);
    // Skeleton Loader
    const SkeletonLoader = () => (
        <div className="w-full border-t-[1px] flex items-center min-h-[60px]">
            <div className="py-[15px] pl-4 w-[8%]"><div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[12%]"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[8%]"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
            <div className="w-[8%]"><div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div></div>
        </div>
    );

    return (
        <div className='p-8'>
            {(!requestResponse || requestResponse?.results?.length === 0) && !isLoading && (
                <div>
                    <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px]'>Join Requests</h1>
                    <h3 className='mt-2 text-GrayHomz font-normal text-sm md:text-[16px] max-w-[600px]'>View and manage pending requests from residents who want to join the estate. You can approve or decline each request.</h3>
                    <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                <UserAdd />
                            </div>
                            <p className='mt-2 text-BlueHomz font-medium text-[16px] md:text-[20px]'>No join requests at the moment</p>
                            <p className='text-center text-sm md:text-[16px] font-normal text-GrayHomz'>
                                You’ll see requests here when residents respond to invitations.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                    <p className='text-GrayHomz font-normal text-sm md:text-[16px]'>Loading...</p>
                </div>
            )}
            {requestResponse?.results && requestResponse?.results.length > 0 && !isLoading && (
                <div>
                    <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px]'>Join Requests</h1>
                    <h3 className='mt-2 text-GrayHomz font-normal text-sm md:text-[16px] max-w-[600px]'>View and manage pending requests from residents who want to join the estate. You can approve or decline each request.</h3>
                    <div className="mt-6 w-full mx-auto flex flex-col" style={{ height: '70vh' }}>
                        {/* Table Header */}
                        <div className="bg-whiteblue min-h-[50px] text-[13px] font-semibold text-BlackHomz flex items-center border rounded-t-[8px]">
                            <div onClick={handleSelectAll} className="cursor-pointer text-left pl-4 flex-shrink-0 w-[8%]">
                                {selectAll ? <Ticked /> : <UnTicked />}
                            </div>
                            <div className="text-left flex-shrink-0 w-[12%]">Resident Name</div>
                            <div className="text-left flex-shrink-0 w-[12%]">Email</div>
                            <div className="text-left flex-shrink-0 w-[12%]">Street</div>
                            <div className="text-left flex-shrink-0 w-[12%]">Building</div>
                            <div className="text-left flex-shrink-0 w-[12%]">Apartment</div>
                            <div className="text-left flex-shrink-0 w-[12%]">Requested On</div>
                            <div className="text-left flex-shrink-0 w-[8%]">Status</div>
                            <div className="flex-shrink-0 w-[8%]">Action</div>
                        </div>
                        {/* Virtualized Table Body */}
                        <div
                            ref={tableRef}
                            className="w-full border border-t-0 rounded-b-[8px] overflow-y-auto"
                            style={{ height: 'calc(70vh - 50px)', position: 'relative' }}
                        >
                            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                position: 'absolute',
                                                top: `${i * 60}px`,
                                                left: 0,
                                                width: '100%',
                                                height: '60px',
                                                zIndex: '-20',
                                            }}
                                        >
                                            <SkeletonLoader />
                                        </div>
                                    ))
                                    : rowVirtualizer.getVirtualItems().map(virtualRow => {
                                        const data = requestResponse?.results[virtualRow.index];
                                        return (
                                            <div
                                                key={data._id}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${virtualRow.size}px`,
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                                className="w-full border-t-[1px] flex items-center min-h-[60px] bg-white"
                                            >
                                                <div onClick={() => handleRowSelect(data._id)} className="cursor-pointer pr-2 py-[15px] pl-4 font-[400] text-[13px] flex-shrink-0 w-[8%]">
                                                    {selectedRows.includes(data._id) ? <Ticked /> : <UnTicked />}
                                                </div>
                                                <div className="flex items-center gap-1 py-[15px] text-GrayHomz4 font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    <span>{data.firstName} {data.lastName}</span>
                                                </div>
                                                <div className="text-GrayHomz py-[15px] break-words font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    {data.email}
                                                </div>
                                                <div className="text-GrayHomz py-[15px] font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    {data.streetName}
                                                </div>
                                                <div className="text-GrayHomz py-[15px] font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    {data.building}
                                                </div>
                                                <div className="text-GrayHomz py-[15px] font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    {data.apartment}
                                                </div>
                                                <div className="text-GrayHomz py-[15px] font-[400] text-[13px] flex-shrink-0 w-[12%]">
                                                    {new Date(data.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-GrayHomz py-[15px] font-[400] text-[13px] flex-shrink-0 w-[8%]">
                                                    <span className="bg-warningBg text-warning rounded-md py-1 px-3 flex items-center justify-center">
                                                        {data.status}
                                                    </span>
                                                </div>
                                                <div className="py-[15px] z-10 w-[8%] flex gap-2 relative">
                                                    <button
                                                        className="ml-2 md:ml-8"
                                                        onClick={e => handleToggleMenu(data._id, e)}
                                                    >
                                                        ⋮
                                                    </button>
                                                    {/* Pop-up menu */}
                                                    {popUpMenu && selectedId === data._id && (
                                                        <div
                                                            ref={popUpRef}
                                                            style={{
                                                                position: 'fixed',
                                                                top: menuPosition.top + 5,
                                                                left: menuPosition.left,
                                                                zIndex: 1000,
                                                                background: 'white',
                                                                border: '1px solid #eee',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                                                minWidth: '120px',
                                                                padding: '8px 0',
                                                            }}
                                                        >
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                                                                onClick={() => handleApprove(data._id)}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                                                onClick={() => handleDecline(data._id)}
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Request;