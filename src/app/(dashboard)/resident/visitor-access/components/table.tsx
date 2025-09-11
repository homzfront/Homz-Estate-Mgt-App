/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PopUp from './popUp'
// import SkeletonTableLoader from '@/components/icons/skeletonTableLoader'
import Image from 'next/image';
import { Visitor, Visitors } from '../../../components/visitors';
import Pagination from '../../../components/pagination';
import StatusDropDown from '../../../components/statusDropDown';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import RevokeAccess from '@/components/icons/revokeAccess';
import { AccessCodeType, useAccessCodeSlice } from '@/store/useAccessCode';
import DotLoader from '@/components/general/dotLoader';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface TableProps {
    fromDefault?: boolean;
    pageNo: number;
    handlePageClick: (page: number) => void;
    handleNext: () => void;
    handlePrev: () => void;
    totalPages: number;
    pageSize: number;
    fetchAccessCode: () => Promise<void>;
}

const Table = ({
    fromDefault = true,
    pageNo,
    totalPages,
    pageSize,
    fetchAccessCode,
    handlePageClick,
    handleNext,
    handlePrev,
}: TableProps) => {
    const [openDetails, setOpenDetails] = React.useState<boolean>(false);
    const [openRevoke, setOpenRevoke] = React.useState<boolean>(false);
    const [isRevoking, setIsRevoking] = React.useState<boolean>(false);
    // const [loading, setLoading] = React.useState(false);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const [selectedData, setSelectedData] = React.useState<AccessCodeType | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState<"pending" | "expired" | "revoke" | null>("pending");
    const [openDropdownIndex, setOpenDropdownIndex] = React.useState<string | null>(null);
    const { accessCode } = useAccessCodeSlice();

    const toggleDropdown = (index: string) => {
        setOpenDropdownIndex((prev) => (prev === index ? null : index));
    };

    const handleToggleMenu = (id: string | number) => {
        setpopUp(!popUp);
        setSelectedDataId(id);
    };

    const firstThreePages = [1, 2, 3];
    const lastThreePages = [totalPages - 2, totalPages - 1, totalPages];

    const currentData = accessCode;

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
                                <h2 className='text-BlueHomz text-sm font-medium'>Visitor Access Information</h2>
                            </div>
                            <button onClick={() => setOpenDetails(false)}><CloseTransluscentIcon /></button>
                        </div>

                        <div className='mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Resident’s Name
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.resident?.firstName}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Role
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {/* [Resident’s Role] */}
                                    {selectedData?.resident?.ownershipType}
                                </p>
                            </div>
                        </div>


                        <div className='md:hidden mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
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
                                    {selectedData?.arrivalDate}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Expected time
                                    of visit
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.expectedArrivalTime?.from}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Access Code
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.accessCode}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Code Type
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.codeType}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Access Status
                                </p>
                                {/* <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    <button
                                        className={`rounded-md py-2 px-4 flex items-center justify-center ${buttonStyle}`}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <p>{selectedData?.accessStatus}</p>
                                            <div className={`mb-[3px]`}>
                                                <ArrowDown size={12} className={selectedData?.accessStatus === "Pending"
                                                    ? "#dc6803"
                                                    : selectedData?.accessStatus === "Signed In"
                                                        ? "#039855"
                                                        : "#ffffff"} />
                                            </div>
                                        </div>
                                    </button>
                                </p> */}
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    [Pending]
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Time In
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.expectedArrivalTime?.from}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Time Out
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.expectedArrivalTime?.to}
                                </p>
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
                <div className="w-[700%] md:w-[150%]">
                    <table border={1} className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4" style={{ width: "40px" }}></th>
                                <th className="text-left" style={{ width: "110px" }}>Visitor</th>
                                <th className="text-left" style={{ width: "90px" }}>Phone Number</th>
                                <th className="text-left" style={{ width: "90px" }}>Purpose</th>
                                <th className="text-left" style={{ width: "90px" }}>No of visitors</th>
                                <th className="text-left" style={{ width: "90px" }}>Date of visit</th>
                                <th className="text-left" style={{ width: "110px" }}>Expected arrival time</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Code</th>
                                <th className="text-left" style={{ width: "90px" }}>Code Type</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Status</th>
                                <th className="text-left" style={{ width: "90px" }}>Time In</th>
                                <th className="text-left" style={{ width: "90px" }}>Time Out</th>
                                <th className="text-left" style={{ width: "110px" }}>Resident Info</th>
                                <th style={{ width: "50px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // loading ? (
                                //     // Show skeleton loaders when loading
                                //     <>
                                //         <SkeletonTableLoader />
                                //         <SkeletonTableLoader />
                                //         <SkeletonTableLoader />
                                //         <SkeletonTableLoader />
                                //         <SkeletonTableLoader />
                                //         <SkeletonTableLoader />
                                //     </>
                                // ) :
                                currentData &&
                                currentData.map((data) => (
                                    <tr
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // setOpenDetails(true)
                                            setSelectedData(data)
                                        }}
                                        key={data?._id}
                                        className="w-2 border-t-[1px] items-center"
                                    >
                                        <td className="text-GrayHomz py-[25px] font-[500] text-[11px] flex items-center justify-center">
                                            <span className='w-[8px] h-[8px] rounded-full bg-error' />
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {/* <span style={{ fontFamily: "Arial", }}>₦</span> */}
                                            {data?.visitor}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.phoneNumber}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">

                                            {data.purpose}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.numberOfVisitors}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.arrivalDate}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.expectedArrivalTime?.from}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.accessCode}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.codeType}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            <StatusDropDown
                                                value={data?.accessStatus as any}
                                                loading={false}
                                                isOpen={openDropdownIndex === data?._id}
                                                toggleDropdown={() => toggleDropdown(data?._id)}
                                                selectedStatus={data?.accessStatus as any}
                                                setSelectedStatus={setSelectedStatus}
                                                handleStatusChange={(status) => {
                                                    console.log("Selected:", status);
                                                }}
                                            />
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.expectedArrivalTime?.from}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data?.expectedArrivalTime?.to}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            <span className='flex items-center gap-2'>
                                                {data?.resident?.firstName}
                                            </span>
                                            <span className='font-[400]'>
                                                {data?.resident?.ownershipType}
                                            </span>
                                        </td>
                                        <td className={`sticky right-[-24px] md:right-0 ${fromDefault && "bg-[#F6F6F6]"} md:bg-white py-[15px] pr-4 z-10`}>
                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleMenu(data?._id)
                                                setSelectedData(data)
                                            }}>
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
                                                    setOpenDetails={setOpenDetails}
                                                    fromDefault={fromDefault}
                                                    setOpenRevoke={setOpenRevoke}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {currentData && currentData.length >= 1 && <div className="mt-6">
                <Pagination
                    firstThreePages={firstThreePages}
                    currentPage={pageNo}
                    totalPages={totalPages}
                    handleNext={handleNext}
                    handlePageClick={handlePageClick}
                    handlePrev={handlePrev}
                    lastThreePages={lastThreePages}
                />
            </div>}
        </div>
    )
}

export default Table