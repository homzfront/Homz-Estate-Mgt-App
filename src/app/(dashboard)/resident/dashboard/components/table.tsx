/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PopUp from './popUp'
import Image from 'next/image';
import { Visitor, Visitors } from '../../../components/visitors';
import Pagination from '../../../components/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import RevokeAccess from '@/components/icons/revokeAccess';
import StatusDropDown from './statusDropDown';

interface TableProps {
    fromDefault?: boolean
}

const Table = ({ fromDefault = true }: TableProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const [openDetails, setOpenDetails] = React.useState<boolean>(false);
    const [openRevoke, setOpenRevoke] = React.useState<boolean>(false);
    const [totalPages, setTotalPages] = React.useState(1);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const [selectedData, setSelectedData] = React.useState<Visitor | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    const [pageNo, setPageNo] = React.useState<number>(initialPage);
    const pageSize = 8;
    React.useEffect(() => {
        setTotalPages(Math.ceil(Visitors.length / pageSize));
    }, [Visitors.length]);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNo.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [pageNo, router, searchParams]);

    const handleToggleMenu = (id: string | number) => {
        setpopUp(!popUp);
        setSelectedDataId(id);
    };

    const handlePageClick = (page: number) => {
        setPageNo(page);
    };

    const handleNext = () => {
        if (pageNo < totalPages) {
            setPageNo(pageNo + 1);
        }
    };

    const handlePrev = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const firstThreePages = [1, 2, 3];
    const lastThreePages = [totalPages - 2, totalPages - 1, totalPages];

    const indexOfLastItem = pageNo * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentData = Visitors.slice(indexOfFirstItem, indexOfLastItem);

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
                                className={`w-full flex justify-center items-center font-normal text-sm bg-error text-white cursor-pointer h-[48px] rounded-[4px]`}
                                onClick={() => setOpenRevoke(false)}
                            >
                                Revoke Access
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
                            <h2 className='text-BlueHomz text-sm font-medium'>Visitor Access Information</h2>
                            <button onClick={() => setOpenDetails(false)}><CloseTransluscentIcon /></button>
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
                                    {selectedData?.dateOfVisit}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Expected time
                                    of visit
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.expectedArrivalTime}
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
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.accessStatus}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Time In
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.timeIn}
                                </p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>
                                    Time Out
                                </p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium'>
                                    {selectedData?.timeOut}
                                </p>
                            </div>
                        </div>
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
                                <th className="text-left" style={{ width: "90px" }}>No of vis   itors</th>
                                <th className="text-left" style={{ width: "90px" }}>Date of visit</th>
                                <th className="text-left" style={{ width: "110px" }}>Expected arrival time</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Code</th>
                                <th className="text-left" style={{ width: "90px" }}>Code Type</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Status</th>
                                <th className="text-left" style={{ width: "90px" }}>Time In</th>
                                <th className="text-left" style={{ width: "90px" }}>Time Out</th>
                                <th style={{ width: "50px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData &&
                                currentData.map((data, index) => (
                                    <tr
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedData(data);
                                        }}
                                        key={index}
                                        className="w-2 border-t-[1px] items-center bg-white"
                                    >
                                        <td className="text-GrayHomz py-[25px] font-[500] text-[11px] flex items-center justify-center">
                                            <span className='w-[8px] h-[8px] rounded-full bg-error' />
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
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
                                            {data?.dateOfVisit}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.expectedArrivalTime}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.accessCode}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.codeType}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            <StatusDropDown
                                                selectedStatus={data.accessStatus}
                                            />
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.expectedArrivalTime}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                            {data.accessCode}
                                        </td>
                                        <td className={`sticky right-[-24px] md:right-0 ${fromDefault && "bg-[#F6F6F6]"} bg-white py-[15px] pr-4 z-10`}>
                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleMenu(index)
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
                                            {popUp && selectedDataId === index && (
                                                <PopUp
                                                    setOpenDetails={setOpenDetails}
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