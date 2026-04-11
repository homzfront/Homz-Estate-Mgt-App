/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Pagination from '@/app/(dashboard)/components/pagination';
import useClickOutside from '@/app/utils/useClickOutside';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import AddRound from '@/components/icons/addRound';
import ApproveIcon from '@/components/icons/approveIcon';
import ArrowDown from '@/components/icons/arrowDown';
import Close from '@/components/icons/Close';
import DeclineIcon from '@/components/icons/declineIcon';
import ExportIcon from '@/components/icons/estateManager&Resident/desktop/exportIcon';
import Eye from '@/components/icons/Eye';
import MinusRound from '@/components/icons/minusRound';
import Ticked from '@/components/icons/ticked';
import UnTicked from '@/components/icons/unTicked';
import UserAdd from '@/components/icons/userAdd';
import { ResidentData, useRequestSlice } from '@/store/useRequestStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import api from '@/utils/api';
import { getToken } from '@/utils/cookies';
import Image from 'next/image';
import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import EmptyEstateState from '../../components/emptyEstateState';

const Request = () => {
    const router = useRouter();
    const ability = useAbility();

    // Redirect if user doesn't have access to residents
    React.useEffect(() => {
        if (!ability.can('read', 'residents')) {
            router.push('/dashboard');
        }
    }, [ability, router]);

    const { requestResponse, isLoading, getRequest, clearRequest } = useRequestSlice();
    // Track whether we've completed at least one fetch so we don't flash empty state
    const [hasFetched, setHasFetched] = React.useState(false);

    // Clear stale data when component mounts so navigating back shows fresh state
    React.useEffect(() => {
        clearRequest();
        setHasFetched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const [popUpMenu, setPopUpMenu] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [pageNo, setPageNo] = React.useState<number>(1);
    const pageSize = 6; // match your API default
    const menuRef = useRef<HTMLElement>(null);
    const [modelOpen, setModelOpen] = React.useState(''); // 'approve' | 'decline' | ''
    const [selectedData, setSelectedData] = React.useState<null | ResidentData>(null);
    const [isRequesting, setIsRequesting] = React.useState<boolean>(false);
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [search, setSearch] = React.useState<string>("");
    const [activeStatus, setActiveStatus] = React.useState<string>('pending');
    const [actionsMenuOpen, setActionsMenuOpen] = React.useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const actionsMenuRef = useRef<HTMLDivElement>(null);
    // Add a new state to track if search is in progress
    const [isSearching, setIsSearching] = React.useState(false);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    useClickOutside(actionsMenuRef as any, () => setActionsMenuOpen(false));
    const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    const [menuPortalStyle, setMenuPortalStyle] = React.useState<React.CSSProperties | null>(null);

    // Reposition portal dropdown on scroll
    React.useEffect(() => {
        if (!popUpMenu || !selectedId || !actionButtonRefs.current[selectedId]) {
            setMenuPortalStyle(null);
            return;
        }
        const updatePos = () => {
            const btn = actionButtonRefs.current[selectedId];
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            setMenuPortalStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.right - 180,
                zIndex: 99999,
            });
        };
        updatePos();
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [popUpMenu, selectedId]);

    // Close pop-up menu when clicking outside
    useClickOutside(menuRef as any, () => {
        setPopUpMenu(false);
    });

    // Debounced search function
    const debouncedSearch = useCallback((searchValue: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);

        searchTimeoutRef.current = setTimeout(() => {
            getRequest(pageNo, pageSize, searchValue);
            setIsSearching(false);
        }, 2000); // 2 seconds delay
    }, [pageNo, pageSize, getRequest]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    // Clean up timeout on unmount
    React.useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // fetch requests when page or status filter changes
    React.useEffect(() => {
        if (selectedCommunity?.estate?._id) {
            getRequest(pageNo, pageSize, activeStatus).finally(() => setHasFetched(true));
        };
    }, [pageNo, selectedCommunity, activeStatus]);


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
        setPopUpMenu(!popUpMenu);
    };


    // Approve/Decline actions (stub)
    const handleApprove = async () => {
        try {
            const payload = {
                "validationIds": {
                    "estateId": selectedData?.associatedIds?.estateId,
                    "organizationId": selectedData?.associatedIds?.organizationId
                }
            }
            setIsRequesting(true);
            const response = await api.post(`/resident-invitation/residents/${selectedData?._id}/accept/tokens/${selectedData?.invitationToken}`, payload)
            toast.success("Invitation approved");
            setActiveStatus('accepted');
            setPageNo(1);
            getRequest(1, pageSize, 'accepted');
            setPopUpMenu(false);
            setModelOpen('');
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while creating your profile";

            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 4000,
                style: {
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setIsRequesting(false);
        }
    };

    const handleDecline = async () => {
        try {
            const payload = {
                "validationIds": {
                    "estateId": selectedData?.associatedIds?.estateId,
                    "organizationId": selectedData?.associatedIds?.organizationId
                }
            }
            setIsRequesting(true);
            const response = await api.post(`/resident-invitation/residents/${selectedData?._id}/reject/tokens/${selectedData?.invitationToken}`, payload)
            toast.success("Invitation declined successfully");
            setActiveStatus('rejected');
            setPageNo(1);
            getRequest(1, pageSize, 'rejected');
            setPopUpMenu(false);
            setModelOpen('');
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while creating your profile";

            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 4000,
                style: {
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setIsRequesting(false);
        }
    };


    // Bulk Approve/Decline
    const handleBulkAction = async (type: 'approve' | 'decline') => {
        if (!selectedRows.length) {
            toast.error("No requests selected");
            return;
        }
        setIsRequesting(true);
        for (const id of selectedRows) {
            const data = requestResponse?.results.find(r => r._id === id);
            if (!data) continue;
            setSelectedData(data);
            try {
                const payload = {
                    "validationIds": {
                        "estateId": data.associatedIds?.estateId,
                        "organizationId": data.associatedIds?.organizationId
                    }
                };
                // Use the resident's invitationToken — NOT the manager's JWT auth token
                if (type === 'approve') {
                    await api.post(`/resident-invitation/residents/${data._id}/accept/tokens/${data.invitationToken}`, payload);
                    toast.success(`Approved ${data.firstName} ${data.lastName}`);
                } else {
                    await api.post(`/resident-invitation/residents/${data._id}/reject/tokens/${data.invitationToken}`, payload);
                    toast.success(`Declined ${data.firstName} ${data.lastName}`);
                }
            } catch (error: any) {
                const backendMessage = error?.response?.data?.message;
                const backendMessageTwo = error?.response?.data?.message?.[0];
                const fallbackMessage = error?.message || "An error occurred";
                toast.error(backendMessage || backendMessageTwo || fallbackMessage);
            }
        }
        setIsRequesting(false);
        setActionsMenuOpen(false);
        getRequest(pageNo, pageSize, activeStatus);
    };


    // Pagination handlers
    const handlePageClick = (page: number) => setPageNo(page);
    const handleNext = () => {
        if (requestResponse && pageNo < requestResponse.totalPages) setPageNo(pageNo + 1);
    };
    const handlePrev = () => {
        if (pageNo > 1) setPageNo(pageNo - 1);
    };

    // Skeleton Loader
    // const SkeletonLoader = () => (
    //     <tr>
    //         <td colSpan={9}>
    //             <div className="flex items-center min-h-[60px]">
    //                 <div className="py-[15px] pl-4 " style={{ width: "40px" }}><div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "150px" }}><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "40px" }}><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></div>
    //                 <div className="" style={{ width: "40px" }}><div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div></div>
    //             </div>
    //         </td>
    //     </tr>
    // );

    return (
        <div className='p-8'>
            <CustomModal isOpen={modelOpen !== ''} onRequestClose={() => setModelOpen('')}>
                <div className='p-6 min-w-[340px] w-full md:w-[600px] bg-white rounded-[12px]'>
                    <div className="flex flex-col gap-6 items-center justify-center">
                        <Image
                            src={modelOpen === 'approve' ? '/success_icon.svg' : '/decline.png'}
                            height={48}
                            width={46}
                            alt=""
                        />
                        <div className="flex flex-col">
                            <p className="text-[14px] md:text-[20px] font-[700] leading-[17.64px] md:leading-[25.2px] text-center mb-1">
                                {modelOpen === 'approve' ? 'Approve Request?' : 'Decline Request?'}
                            </p>
                            <p className=" leading-[19.5px] text-[13px] md:text-[16px] font-[400] md:leading-[24px] text-center">
                                {modelOpen === 'approve' ?
                                    <>
                                        {`Are you sure you want to approve this request? ${selectedData?.firstName} will be added as a resident to ${selectedData?.estateName}.`}
                                    </>
                                    : "This action will notify the resident that their request was declined."}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center mt-4 gap-4'>
                        <button
                            className={`flex-1 ${modelOpen === 'approve' ? 'bg-BlueHomz' : 'bg-error'} text-white rounded-[4px] h-[48px] p-[12px] ${isRequesting && "pointer-events-none flex justify-center items-center"}`}
                            onClick={() => {
                                if (modelOpen === 'approve' && selectedData) handleApprove();
                                if (modelOpen === 'decline' && selectedData) handleDecline();
                            }}
                        >
                            {isRequesting ? <DotLoader /> : modelOpen === 'approve' ? "Yes, Approve" : "Decline Request"}
                        </button>

                        <button
                            disabled={isRequesting}
                            className={`flex-1 text-BlackHomz border border-BlackHomz rounded-[4px] font-normal text-sm hover:text-GrayHomz cursor-pointer h-[48px]`}
                            onClick={() => {
                                setModelOpen('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </CustomModal >

            {!selectedCommunity ? (
                <div>
                    <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px] mb-6'>Join Requests</h1>
                    <EmptyEstateState />
                </div>
            ) : isLoading ? (
                <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                    <LoaderIcon />
                </div>
            ) : (!hasFetched || !requestResponse || requestResponse?.results?.length === 0) && search?.length === 0 && !isSearching && !isLoading ? (
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
            ) : (search?.length > 0 || (requestResponse?.results && requestResponse?.results.length > 0)) && (
                <div className=''>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div>
                            <h1 className='text-BlackHomz font-medium text-[16px] md:text-[20px]'>Join Requests</h1>
                            <h3 className='mt-2 text-GrayHomz font-normal text-sm md:text-[16px] w-full'>
                                View and manage pending requests from residents who want to join the estate.
                            </h3>
                            <span className='hidden md:block text-GrayHomz font-normal text-[16px]'>You can approve or decline each request.</span>
                        </div>
                        {/* Mobile: Search + Actions */}
                        <div className="flex gap-2 mt-4 md:mt-0 md:justify-end md:items-center relative">
                            <div className="md:hidden flex-1">
                                <div className="flex items-center h-[40px] rounded-[4px] border border-GrayHomz2 px-2 py-1">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" className="text-GrayHomz2 mr-2">
                                        <circle cx="7" cy="7" r="6" strokeWidth="2" />
                                        <line x1="11" y1="11" x2="15" y2="15" strokeWidth="2" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleSearchChange}
                                        placeholder="Search"
                                        className="bg-transparent h-[40px] rounded-[4px] outline-none text-GrayHomz2 text-sm w-full"
                                    />
                                </div>
                            </div>
                            {/* Actions Button */}
                            {ability.can('update', 'residents') && (
                                <button
                                    onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                                    className="flex items-center gap-1 border border-BlueHomz text-BlueHomz px-3 py-2 rounded font-medium text-sm">
                                    Actions
                                    <ArrowDown />
                                </button>
                            )}
                            {actionsMenuOpen && (
                                <div
                                    ref={actionsMenuRef}
                                    className="absolute top-12 right-0 z-50 w-[240px] bg-white border rounded shadow-lg flex flex-col p-2"
                                >
                                    {ability.can('update', 'residents') && (
                                        <>
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left"
                                                onClick={() => handleBulkAction('approve')}
                                                disabled={isRequesting}
                                            >
                                                <AddRound /> Approve selected requests
                                            </button>
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left"
                                                onClick={() => handleBulkAction('decline')}
                                                disabled={isRequesting}
                                            >
                                                <MinusRound /> Decline selected requests
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="flex items-center gap-2 p-2 hover:bg-whiteblue text-GrayHomz text-sm text-left"
                                        onClick={() => toast('Export coming soon')}
                                    >
                                        <ExportIcon />
                                        Export as <ArrowDown className='#4E4E4E' />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex gap-2 mt-4 mb-2">
                        {[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Approved', value: 'accepted' },
                            { label: 'Declined', value: 'rejected' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => {
                                    setActiveStatus(tab.value);
                                    setPageNo(1);
                                }}
                                className={`px-4 h-[34px] rounded-[4px] text-sm font-medium transition-all ${
                                    activeStatus === tab.value
                                        ? 'bg-BlueHomz text-white'
                                        : 'bg-whiteblue text-BlueHomz'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Table Section */}
                    <div className="mt-2 border overflow-x-auto scrollbar-container">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                    {/* Select All */}
                                    {ability.can('update', 'residents') && (
                                        <th
                                            className="cursor-pointer text-left pl-4 w-[40px]"
                                            onClick={handleSelectAll}
                                        >
                                            {selectAll ? <Ticked /> : <UnTicked />}
                                        </th>
                                    )}

                                    {/* Resident Name */}
                                    <th className="text-left w-auto md:w-[150px]">Resident Name</th>

                                    {/* Hidden on mobile */}
                                    <th className="hidden md:table-cell text-left w-[150px]">Email</th>
                                    <th className="hidden md:table-cell text-left w-[150px]">Street</th>
                                    <th className="hidden md:table-cell text-left w-[150px]">Building</th>
                                    <th className="hidden md:table-cell text-left w-[150px]">Apartment</th>
                                    <th className="hidden md:table-cell text-left w-[150px]">Requested On</th>

                                    {/* Always visible */}
                                        <th className="text-left w-auto md:w-[110px]">Status</th>
                                        {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                            <th className="text-left w-auto md:w-[80px]">Action</th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {requestResponse?.results.map((data) => (
                                        <tr key={data._id} className="border-t min-h-[60px] bg-white">
                                            {/* Checkbox */}
                                            {ability.can('update', 'residents') && (
                                                <td
                                                    onClick={() => handleRowSelect(data._id)}
                                                    className="cursor-pointer pr-2 py-[15px] pl-4 font-[500] text-[11px] w-[40px]"
                                                >
                                                    {selectedRows.includes(data._id) ? <Ticked /> : <UnTicked />}
                                                </td>
                                            )}

                                            {/* Resident Name */}
                                            <td className="py-[15px] text-GrayHomz4 font-[500] text-[11px] w-auto md:w-[150px]">
                                                {data.firstName} {data.lastName}
                                            </td>

                                            {/* Hidden on mobile */}
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[150px]">
                                                {data.email}
                                            </td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[150px]">
                                                {data.streetName}
                                            </td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[150px]">
                                                {data.building}
                                            </td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[150px]">
                                                {data.apartment}
                                            </td>
                                            <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[150px]">
                                                {new Date(data.createdAt).toLocaleDateString()}
                                            </td>

                                            {/* Status */}
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px] w-auto md:w-[110px]">
                                                <span className={`max-w-[90px] rounded-md py-1 px-3 flex items-center justify-center capitalize text-[10px] ${
                                                    data.status === 'accepted'
                                                        ? 'bg-[#CDEADD] text-[#039855]'
                                                        : data.status === 'rejected'
                                                        ? 'bg-[#FDF2F2] text-error'
                                                        : 'bg-warningBg text-warning'
                                                }`}>
                                                    {data.status}
                                                </span>
                                            </td>

                                            {/* Action — only show for pending requests */}
                                            {ability.can('update', 'residents') && activeStatus === 'pending' && (
                                                <td className="py-[15px] w-auto md:w-[80px]">
                                                    <button
                                                        ref={(el) => { actionButtonRefs.current[data._id] = el; }}
                                                        className="ml-4"
                                                        onClick={(e) => handleToggleMenu(data._id, e)}
                                                    >
                                                        ⋮
                                                    </button>

                                                    {/* Pop-up menu rendered in portal so it never moves with the table */}
                                                    {popUpMenu && selectedId === data._id && menuPortalStyle && ReactDOM.createPortal(
                                                        <div
                                                            ref={menuRef as any}
                                                            style={menuPortalStyle}
                                                            className="drop-down w-[180px] text-GrayHomz font-[500] text-[13px] border p-2 rounded-md bg-white flex flex-col items-center justify-around shadow-lg"
                                                        >
                                                            <button
                                                                className="flex md:hidden gap-2 items-center w-full text-left px-4 py-2 text-GrayHomz hover:bg-whiteblue"
                                                                onClick={() => {
                                                                    setSelectedData(data);
                                                                    setDetailsOpen(true);
                                                                    setPopUpMenu(false);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" /> View
                                                            </button>
                                                            {ability.can('update', 'residents') && (
                                                                <>
                                                                    <button
                                                                        className="flex gap-2 items-center w-full text-left px-4 py-2 text-Success hover:bg-whiteblue"
                                                                        onClick={() => {
                                                                            setSelectedData(data);
                                                                            setModelOpen("approve");
                                                                            setPopUpMenu(false);
                                                                        }}
                                                                    >
                                                                        <ApproveIcon /> Approve
                                                                    </button>
                                                                    <button
                                                                        className="flex gap-2 items-center w-full text-left px-4 py-2 text-error hover:bg-whiteblue"
                                                                        onClick={() => {
                                                                            setSelectedData(data);
                                                                            setModelOpen("decline");
                                                                            setPopUpMenu(false);
                                                                        }}
                                                                    >
                                                                        <DeclineIcon /> Decline
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>,
                                                        document.body
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* Details Modal/Card */}
                        {detailsOpen && selectedData && (
                            <CustomModal isOpen={detailsOpen} onRequestClose={() => setDetailsOpen(false)}>
                                <div className="p-6 min-w-[340px] w-full md:w-[400px] bg-white rounded-[12px]">
                                    <div className="flex flex-col gap-2">
                                        <div className='flex justify-between items-center'>
                                            <h2 className="text-[16px] text-BlueHomz font-bold mb-2">Join Request Details</h2>
                                            <button onClick={() => setDetailsOpen(false)} className='border border-GrayHomz h-6 w-6 rounded-[8px] flex justify-center items-center'>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] bg-inputBg py-2 px-3 rounded-[12px] text-GrayHomz font-normal">
                                            <span className="">Resident Name:</span>
                                            <span className='text-BlackHomz'>{selectedData.firstName} {selectedData.lastName}</span>
                                            <span className="">Estate:</span>
                                            <span className='text-BlackHomz'>{selectedData.estateName}</span>
                                            <span className="">Zone:</span>
                                            <span className='text-BlackHomz'>{selectedData.zone || '-'}</span>
                                            <span className="">Street:</span>
                                            <span className='text-BlackHomz'>{selectedData.streetName}</span>
                                            <span className="">Building:</span>
                                            <span className='text-BlackHomz'>{selectedData.building}</span>
                                            <span className="">Apartment:</span>
                                            <span className='text-BlackHomz'>{selectedData.apartment}</span>
                                            <span className="">Requested On:</span>
                                            <span className='text-BlackHomz'>{new Date(selectedData.createdAt).toLocaleDateString()}</span>
                                            <span className="">Status:</span>
                                            <span className='text-BlackHomz'>{selectedData.status}</span>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {ability.can('update', 'residents') && (
                                                <>
                                                    <button
                                                        className="flex-1 bg-Success text-white text-base rounded h-[40px] font-medium flex items-center gap-1 justify-center"
                                                        onClick={() => {
                                                            setDetailsOpen(false);
                                                            setModelOpen('approve');
                                                        }}
                                                    >
                                                        <AddRound color='#FFFFFF' />   Approve
                                                    </button>
                                                    <button
                                                        className="flex-1 bg-white border border-error text-error text-base rounded h-[40px] font-medium flex items-center gap-1 justify-center"
                                                        onClick={() => {
                                                            setDetailsOpen(false);
                                                            setModelOpen('decline');
                                                        }}
                                                    >
                                                        <MinusRound color='#D92D20' colorTwo='#D92D20' />   Decline
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CustomModal>
                        )}

                        {/* Pagination */}
                        {requestResponse && requestResponse.totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    firstThreePages={[1, 2, 3]}
                                    currentPage={pageNo}
                                    totalPages={requestResponse.totalPages}
                                    handleNext={handleNext}
                                    handlePageClick={handlePageClick}
                                    handlePrev={handlePrev}
                                    lastThreePages={[
                                        requestResponse.totalPages - 2,
                                        requestResponse.totalPages - 1,
                                        requestResponse.totalPages,
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default Request;