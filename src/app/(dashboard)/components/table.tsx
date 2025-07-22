import React from 'react'
import PopUp from '../(estate-manager)/dashboard/components/popUp'
import SkeletonTableLoader from '@/components/icons/skeletonTableLoader'
import Image from 'next/image';
import { Visitor, Visitors } from './visitors';
import Pagination from './pagination';
import StatusDropDown from './statusDropDown';
import { useRouter, useSearchParams } from 'next/navigation';

const Table = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const [selectedData, setSelectedData] = React.useState<Visitor | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const [pageNo, setPageNo] = React.useState<number>(initialPage);
    const [selectedStatus, setSelectedStatus] = React.useState<"Pending" | "Signed In" | "Signed Out" | null>("Pending");
    const [openDropdownIndex, setOpenDropdownIndex] = React.useState<number | null>(null);
    const pageSize = 8; 

    React.useEffect(() => {
        setTotalPages(Math.ceil(Visitors.length / pageSize));
    }, [Visitors.length]);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNo.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [pageNo, router, searchParams]);

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex((prev) => (prev === index ? null : index));
    };

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
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-[700%] md:w-[150%]">
                    <table border={1} className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4" style={{ width: "40px" }}></th>
                                <th className="text-left" style={{ width: "110px" }}>Resident Info</th>
                                <th className="text-left" style={{ width: "110px" }}>Visitor</th>
                                <th className="text-left" style={{ width: "90px" }}>Phone Number</th>
                                <th className="text-left" style={{ width: "90px" }}>Purpose</th>
                                <th className="text-left" style={{ width: "90px" }}>No of vis   itors</th>
                                <th className="text-left" style={{ width: "90px" }}>Date of visit</th>
                                <th className="text-left" style={{ width: "110px" }}>Expected arrival time</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Code</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Status</th>
                                <th className="text-left" style={{ width: "90px" }}>Time In</th>
                                <th className="text-left" style={{ width: "90px" }}>Time Out</th>
                                <th style={{ width: "50px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    // Show skeleton loaders when loading
                                    <>
                                        <SkeletonTableLoader />
                                        <SkeletonTableLoader />
                                        <SkeletonTableLoader />
                                        <SkeletonTableLoader />
                                        <SkeletonTableLoader />
                                        <SkeletonTableLoader />
                                    </>
                                ) :
                                    currentData &&
                                    currentData.map((data, index) => (
                                        <tr
                                            key={index}
                                            className="w-2 border-t-[1px] items-center"
                                        >
                                            <td className="text-GrayHomz py-[25px] font-[500] text-[11px] flex items-center justify-center">
                                                <span className='w-[8px] h-[8px] rounded-full bg-error' />
                                            </td>

                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">{data?.residentName}</td>
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
                                                {data?.dateOfVisit}
                                            </td>
                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                                {data.expectedArrivalTime}
                                            </td>
                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                                {data.accessCode}
                                            </td>
                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                                <StatusDropDown
                                                    value={data.accessStatus as any}
                                                    loading={false}
                                                    isOpen={openDropdownIndex === index}
                                                    toggleDropdown={() => toggleDropdown(index)}
                                                    selectedStatus={selectedStatus}
                                                    setSelectedStatus={setSelectedStatus}
                                                    handleStatusChange={(status) => {
                                                        console.log("Selected:", status);
                                                    }}
                                                />
                                            </td>
                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                                {data.expectedArrivalTime}
                                            </td>
                                            <td className="text-GrayHomz py-[15px] font-[500] text-[11px]">
                                                {data.accessCode}
                                            </td>
                                            <td className="sticky right-[-24px] md:right-0 bg-[#F6F6F6] md:bg-white py-[15px] pr-4 z-10">
                                                <button onClick={() => {
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