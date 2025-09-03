/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Image from 'next/image';
import { Resident, allResidents } from './resident';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import ProfileWhite from '@/components/icons/profileWhite';
import { useAccessStore } from '@/store/useAccessStore';
import PopUp from './popUp';
import Pagination from '@/app/(dashboard)/components/pagination';
import useClickOutside from '@/app/utils/useClickOutside';


const Table = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const [openDetails, setOpenDetails] = React.useState<boolean>(false)
    const [totalPages, setTotalPages] = React.useState(1);
    const [selectedData, setSelectedData] = React.useState<Resident | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    const [pageNo, setPageNo] = React.useState<number>(initialPage);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const pageSize = 8;
    const { setResident } = useAccessStore();
    const closeRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(closeRef as any, () => {
        setpopUp(false);
    });


    React.useEffect(() => {
        setTotalPages(Math.ceil(allResidents.length / pageSize));
    }, [allResidents.length]);

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
    const currentData = allResidents.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            {openDetails && selectedData && (
                <CustomModal isOpen={openDetails} onRequestClose={() => setOpenDetails(false)}>
                    <div className='p-4 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-BlueHomz text-[16px] font-medium'>More Information</h2>
                            <button onClick={() => setOpenDetails(false)}><CloseTransluscentIcon /></button>
                        </div>

                        <div className='mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Name</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.name}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Zone</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.zone}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Street</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.street}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Building</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.building}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Apartment</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.apartment}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Email</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.email}</p>

                                <p className='text-[11px] md:text-sm text-GrayHomz font-normal md:font-medium'>Phone</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-normal md:font-medium break-words whitespace-normal'>{selectedData.phone}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setResident(selectedData)
                                router.push(`/access-control/${selectedData.name}`)
                            }}
                            className='mt-4 w-full rounded-[4px] md:w-[518px] h-[45px] bg-BlueHomz flex items-center justify-center gap-2 text-white text-sm font-medium'
                        >
                            <ProfileWhite /> View profile
                        </button>
                    </div>
                </CustomModal>
            )}

            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-[700%] md:w-[150%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4" style={{ width: "250px" }}>Name</th>
                                <th className="text-left" style={{ width: "250px" }}>Zone</th>
                                <th className="text-left" style={{ width: "250px" }}>Street</th>
                                <th className="text-left" style={{ width: "250px" }}>Building</th>
                                <th className="text-left" style={{ width: "250px" }}>Apartment</th>
                                <th className="text-left" style={{ width: "250px" }}>Email</th>
                                <th className="text-left" style={{ width: "250px" }}>Phone</th>
                                <style jsx>{`
                                            th.responsive-th {
                                                width: 70px;
                                            }

                                            @media (min-width: 768px) {
                                                th.responsive-th {
                                                width: 100px;
                                                }
                                            }
                                            `}</style>
                                <th className="responsive-th"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((resident, index) => (
                                <tr
                                    key={index}
                                    className="border-t-[1px] hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={resident.image || '/default-avatar.png'}
                                                    alt={resident.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <span className="text-GrayHomz font-[500] text-[11px]">
                                                {resident.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.zone}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.street}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.building}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.apartment}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.email}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{resident.phone}</td>
                                    <td className="sticky right-[-24px] md:right-0 py-4 pr-4 z-10 bg-white hover:bg-gray-50">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleMenu(index)
                                                setSelectedData(resident);
                                            }}
                                            className="p-1"
                                        >
                                            <Image
                                                src="/dots-vertical.png"
                                                alt="Options"
                                                height={20}
                                                width={20}
                                            />
                                        </button>
                                        {popUp && selectedDataId === index && (
                                            <PopUp
                                                setOpenDetails={setOpenDetails}
                                                closeRef={closeRef}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {currentData.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        firstThreePages={firstThreePages}
                        currentPage={pageNo}
                        totalPages={totalPages}
                        handleNext={handleNext}
                        handlePageClick={handlePageClick}
                        handlePrev={handlePrev}
                        lastThreePages={lastThreePages}
                    />
                </div>
            )}
        </div>
    )
}

export default Table