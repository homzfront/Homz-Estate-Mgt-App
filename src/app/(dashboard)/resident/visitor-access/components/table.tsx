/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PopUp from './popUp'
// import SkeletonTableLoader from '@/components/icons/skeletonTableLoader'
import Image from 'next/image';
// Pagination removed for infinite scroll
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import RevokeAccess from '@/components/icons/revokeAccess';
import { AccessCodeType, useAccessCodeSlice } from '@/store/useAccessCode';
import LoadingSpinner from '@/components/general/loadingSpinner';
import DotLoader from '@/components/general/dotLoader';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { formatDateDisplay, formatExpectedRange } from '@/app/utils/formatDateTime';
import capitalizeFirstLetter from '@/app/utils/capitalizeFirstLetter';

interface TableProps {
    fromDefault?: boolean;
    totalPages: number;
    fetchAccessCode: () => Promise<void>;
}

const Table = ({
    fromDefault = true,
    totalPages,
    fetchAccessCode,
}: TableProps) => {
    const [openDetails, setOpenDetails] = React.useState<boolean>(false);
    const [openRevoke, setOpenRevoke] = React.useState<boolean>(false);
    const [isRevoking, setIsRevoking] = React.useState<boolean>(false);
    // const [loading, setLoading] = React.useState(false);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const [selectedData, setSelectedData] = React.useState<AccessCodeType | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    // const [selectedStatus, setSelectedStatus] = React.useState<"pending" | "expired" | "revoke" | null>("pending");
    const { accessCode, currentPage, initialLoading, pageLoading, isAppending, getAccessCode } = useAccessCodeSlice();
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRefs = React.useRef<{ [key: string]: HTMLElement | null }>({});

    const handleToggleMenu = (data: AccessCodeType) => {
        if (selectedDataId === data._id && popUp) {
            setpopUp(false);
            setSelectedDataId(null);
        } else {
            setSelectedDataId(data._id);
            setSelectedData(data);
            setpopUp(true);
        }
    };

    const currentData = accessCode;
    React.useEffect(() => {
        if (!loaderRef.current) return;
        const el = loaderRef.current;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !pageLoading && (currentPage ?? 1) < totalPages) {
                getAccessCode((currentPage ?? 1) + 1);
            }
        }, { rootMargin: '200px' });
        observer.observe(el);
        return () => observer.unobserve(el);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaderRef.current, pageLoading, currentPage, totalPages]);

    const revokeAccessCode = async () => {
        if (!selectedData) return;
        setIsRevoking(true);
        try {
            const response = await api.patch(`/access-control/residents/revoke-access/${selectedData?._id}/organizations/${selectedData?.associatedIds?.organizationId}/estates/${selectedData.estateId}`)
            if (response.status === 200) {
                setIsRevoking(false);
                setOpenRevoke(false);
                setSelectedData(null);
                await fetchAccessCode();
                toast.success("Visitor access revoked successfully!", {
                    position: "top-center",
                    duration: 2000,
                    style: {
                        background: "#E8F5E9",
                        color: "#2E7D32",
                        fontWeight: 500,
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                });
            }

        }
        catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "Could not revoke access at this time";
            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 2000,
                style: {
                    background: "#FFEBEE",
                    color: "#C62828",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <div className="mt-6 w-full mx-auto">
            {openRevoke &&
                <CustomModal
                    isOpen={openRevoke}
                    onRequestClose={() => setOpenRevoke(false)}
                >
                    <div className="bg-white flex flex-col w-[333px] md:w-[464px] p-[32px] rounded-[12px] gap-[18px]">
                        <div className="flex flex-col gap-6 items-center justify-center">
                            <RevokeAccess />
                            <div className="flex flex-col">
                                <p className="text-[14px] md:text-[20px] font-[700] leading-[17.64px] md:leading-[25.2px] text-center mb-1">
                                    Revoke Visitor Access?
                                </p>
                                <p className=" leading-[19.5px] text-[13px] md:text-[16px] font-[400] md:leading-[24px] text-center">
                                    Are you sure you want to revoke access for this visitor? They will no longer be able to use the access code to enter the estate.
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <button
                                className="w-full flex justify-center items-center border border-BlueHomz text-BlueHomz font-normal text-sm rounded-[4px] h-[48px] p-[12px]"
                                onClick={() => setOpenRevoke(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`w-full flex justify-center items-center font-normal text-sm bg-error text-white cursor-pointer h-[48px] rounded-[4px] ${isRevoking && "flex justify-center items-center"}`}
                                onClick={() => revokeAccessCode()}
                            >
                                {isRevoking ? <DotLoader /> : "Revoke Access"}
                            </button>
                        </div>
                    </div>
                </CustomModal>
            }

            {
                openDetails &&
                <CustomModal isOpen={openDetails} onRequestClose={() => setOpenDetails(false)}>
                    <div className='p-4 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h2 className='text-BlueHomz text-sm font-medium'>Visitor Access Record</h2>
                            </div>
                            <button onClick={() => setOpenDetails(false)}><CloseTransluscentIcon /></button>
                        </div>

                        <div className='mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Resident’s Name
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.resident?.firstName} {selectedData?.resident?.lastName}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Property
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.resident?.estateName || '-'}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Apartment Number
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.resident?.apartment || '-'}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Address
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.resident ? `${selectedData.resident.building}, ${selectedData.resident.streetName}, ${selectedData.resident.zone}` : '-'}
                                </p>
                            </div>
                        </div>


                        <div className='mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Visitor
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.visitor}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Phone number
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.phoneNumber}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Purpose
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.purpose}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    No of visitors
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.numberOfVisitors}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Date of visit
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {formatDateDisplay(selectedData?.arrivalDate)}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Expected time of visit
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {formatExpectedRange(selectedData?.expectedArrivalTime?.from, selectedData?.expectedArrivalTime?.to)}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Access Code
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.accessCode}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Access Status
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium capitalize'>
                                    {selectedData?.accessStatus}
                                </p>
                                {selectedData?.timeIn && (
                                    <>
                                        <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                            Time In
                                        </p>
                                        <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                            {new Date(selectedData.timeIn).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </p>
                                    </>
                                )}
                                {selectedData?.timeOut && (
                                    <>
                                        <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                            Time Out
                                        </p>
                                        <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                            {new Date(selectedData.timeOut).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* 
                        <button
                            onClick={() => {
                                setResidentData(selectedData)
                                router.push(`/access-control/${selectedData?.visitor}`)
                            }}
                            className='mt-4 w-full rounded-[4px] md:w-[518px] h-[45px] bg-BlueHomz flex items-center justify-center gap-2 text-white text-sm font-medium'
                        >
                            <ProfileWhite /> View Resident’s profile
                        </button> */}
                    </div>
                </CustomModal>
            }
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-[100%] md:w-[200%]">
                    <table border={1} className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4 hidden md:table-cell" style={{ width: "40px" }}></th>
                                <th className="text-left pl-4 md:pl-0" style={{ width: "110px" }}>Visitor</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Phone Number</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Purpose</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>No of visitors</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Date of visit</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "110px" }}>Expected arrival time</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Access Code</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Code Type</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Status</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Time In</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Time Out</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "110px" }}>Resident Info</th>
                                <th style={{ width: "50px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(initialLoading || (pageLoading && !isAppending)) && (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="py-[25px]"><span className='w-[8px] h-[8px] rounded-full bg-whiteblue inline-block' /></td>
                                        <td className="py-[15px]"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-20 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-20 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-10 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-28 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"><div className="h-6 w-[100px] bg-whiteblue rounded animate-pulse"></div></td>
                                        <td className="py-[15px]"></td>
                                        <td className="py-[15px]"></td>
                                        <td className="py-[15px]"></td>
                                        <td className="py-[15px]"></td>
                                    </tr>
                                ))
                            )}
                            {!initialLoading && !(pageLoading && !isAppending) && currentData && currentData.map((data) => (
                                <tr
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // setOpenDetails(true)
                                        setSelectedData(data)
                                    }}
                                    key={data?._id}
                                    className="w-2 border-t-[1px] items-center"
                                >
                                    <td className="text-GrayHomz py-[25px] font-[500] text-[11px] md:flex items-center justify-center hidden pl-4 md:pl-0">
                                        <span className='w-[8px] h-[8px] rounded-full bg-error' />
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] pl-4 md:pl-0">
                                        {/* <span style={{ fontFamily: "Arial", }}>₦</span> */}
                                        {data?.visitor}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data?.phoneNumber}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">

                                        {data.purpose}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data.numberOfVisitors}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{formatDateDisplay(data?.arrivalDate)}</td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{formatExpectedRange(data?.expectedArrivalTime?.from, data?.expectedArrivalTime?.to)}</td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data.accessCode}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data?.codeType}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] capitalize">
                                        <span
                                            className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px]
                                                ${data.accessStatus?.toLowerCase() === 'pending' ? 'bg-warningBg text-warning2' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'signed in' ? 'bg-successBg text-Success' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'signed out' ? 'bg-error text-white' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'approved' ? 'bg-successBg text-Success' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'rejected' ? 'bg-error text-white' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'expired' ? 'bg-warningBg text-warning2' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'revoke' ? 'bg-error text-white' : ''}
                                                ${data.accessStatus?.toLowerCase() === 'used' ? 'bg-whiteblue text-GrayHomz' : ''}
                                            `}
                                        >
                                            {capitalizeFirstLetter(data.accessStatus)}
                                        </span>
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data?.timeIn ? new Date(data.timeIn).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        {data?.timeOut ? new Date(data.timeOut).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                        <span className='flex items-center gap-2'>
                                            {data?.resident?.firstName} {data?.resident?.lastName}
                                        </span>
                                        {/* <span className='font-[400]'>
                                            {data?.resident?.ownershipType}
                                        </span> */}
                                    </td>
                                    <td className={`sticky right-[-24px] md:right-0 ${fromDefault && "bg-[#F6F6F6]"} md:bg-white py-[15px] pr-4 z-10`}>
                                        <button
                                            ref={(el) => { buttonRefs.current[data?._id] = el }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleMenu(data);
                                            }}
                                        >
                                            <Image
                                                src="/dots-vertical.png"
                                                alt="Options"
                                                height={21}
                                                width={20}
                                                style={{ height: "auto", width: "auto" }}
                                            />
                                        </button>
                                        {popUp && selectedDataId === data?._id && (
                                            <PopUp
                                                onMoreDetails={() => {
                                                    setSelectedData(data);
                                                    setOpenDetails(true);
                                                    setpopUp(false);
                                                }}
                                                onRevoke={() => {
                                                    setSelectedData(data);
                                                    setOpenRevoke(true);
                                                    setpopUp(false);
                                                }}
                                                fromDefault={fromDefault}
                                                onClose={() => setpopUp(false)}
                                                anchorRef={{ current: buttonRefs.current[data?._id] } as any}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!initialLoading && (!currentData || currentData.length === 0) && (
                                <tr>
                                    <td colSpan={14} className="text-center text-sm text-GrayHomz py-8">No records found</td>
                                </tr>
                            )}
                            {(currentPage ?? 1) < totalPages && (
                                <tr>
                                    <td colSpan={14} className="py-2">
                                        <div ref={loaderRef} className="h-1" />
                                        {isAppending && (
                                            <div className="w-full max-w-[1000px] flex items-center justify-center py-3">
                                                <LoadingSpinner size={24} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination removed in favor of infinite scroll */}
        </div>
    )
}

export default Table