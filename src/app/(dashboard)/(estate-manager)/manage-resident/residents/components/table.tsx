/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Image from 'next/image';
import { Resident } from './resident';
import { useRouter } from 'next/navigation';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import ProfileWhite from '@/components/icons/profileWhite';
import { useAccessStore } from '@/store/useAccessStore';
import PopUp from './popUp';
import useClickOutside from '@/app/utils/useClickOutside';
import { useResidentsListStore } from '@/store/useResidentsListStore';
import LoadingSpinner from '@/components/general/loadingSpinner';
import { LoaderIcon } from 'react-hot-toast';


const Table = () => {
    const router = useRouter();
    // const searchParams = useSearchParams();
    // const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const [openDetails, setOpenDetails] = React.useState<boolean>(false)
    const [selectedData, setSelectedData] = React.useState<Resident | null>(null);
    const [popUp, setpopUp] = React.useState(false);
    const [selectedDataId, setSelectedDataId] = React.useState<any>(null);
    const { setResident } = useAccessStore();
    const closeRef = React.useRef<HTMLDivElement>(null);
    const loaderRef = React.useRef<HTMLDivElement | null>(null);

    const {
        items,
        totalPages,
        currentPage,
        initialLoading,
        pageLoading,
        isAppending,
        fetchResidents,
        // totalCount,
        search,
    } = useResidentsListStore();

    useClickOutside(closeRef as any, () => {
        setpopUp(false);
    });

    // initial fetch handled at page level

    const handleToggleMenu = (id: string | number) => {
        setpopUp(!popUp);
        setSelectedDataId(id);
    };

    React.useEffect(() => {
        if (!loaderRef.current) return;
        const el = loaderRef.current;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !pageLoading && currentPage < totalPages) {
                fetchResidents({ page: currentPage + 1, append: true, search });
            }
        }, { rootMargin: '200px' });
        observer.observe(el);
        return () => observer.unobserve(el);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaderRef.current, pageLoading, currentPage, totalPages, search]);

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
                <div className="w-full  md:w-[150%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4" style={{ width: "250px" }}>Resident</th>
                                <th className="text-left" style={{ width: "250px" }}>Zone</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "250px" }}>Street</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "250px" }}>Building</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "250px" }}>Apartment</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "250px" }}>Email</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "250px" }}>Phone</th>
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
                            {initialLoading && (
                                <tr>
                                    <td colSpan={13} className="py-8">
                                        <div className="w-full flex items-center justify-center"><LoaderIcon /></div>
                                    </td>
                                </tr>
                            )}
                            {pageLoading && !isAppending && !initialLoading && (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="py-[15px] pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-whiteblue animate-pulse" />
                                                <div className="h-3 w-28 bg-whiteblue rounded animate-pulse"></div>
                                            </div>
                                        </td>
                                        <td className="py-[15px]">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-40 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] pr-4"></td>
                                    </tr>
                                ))
                            )}
                            {!initialLoading && items.length === 0 && !search && (
                                <tr>
                                    <td colSpan={13} className="text-center text-sm text-GrayHomz py-8">No residents yet</td>
                                </tr>
                            )}
                            {!initialLoading && items.length === 0 && search && (
                                <tr>
                                    <td colSpan={13} className="text-center text-sm text-GrayHomz py-8">No match found for &quot;{search}&quot;</td>
                                </tr>
                            )}
                            {!pageLoading && items.map((residentItem, index) => {
                                const name = `${residentItem.firstName || ''} ${residentItem.lastName || ''}`.trim() || '-';
                                const zone = residentItem.zone || 'N/A';
                                const street = residentItem.streetName || '-';
                                const building = residentItem.building || '-';
                                const apartment = residentItem.apartment || '-';
                                const email = residentItem.email || '-';
                                const phone = '-';
                                const image = '/AvatarEmpty.png';
                                const rowResident: Resident = { name, zone, street, building, apartment, email, phone, image };
                                return (
                                <tr
                                    key={residentItem._id}
                                    className="border-t-[1px] hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={image}
                                                    alt={name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <span className="text-GrayHomz font-[500] text-[11px]">
                                                {name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px]">{zone}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px] hidden md:table-cell">{street}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px] hidden md:table-cell">{building}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px] hidden md:table-cell">{apartment}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px] hidden md:table-cell">{email}</td>
                                    <td className="text-GrayHomz py-4 font-[500] text-[11px] hidden md:table-cell">{phone}</td>
                                    <td className="sticky right-[-24px] md:right-0 py-4 pr-4 z-10 bg-white hover:bg-gray-50">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleMenu(index)
                                                setSelectedData(rowResident);
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
                                )
                            })}
                            {currentPage < totalPages && (
                                <tr>
                                    <td colSpan={13} className="py-2">
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
        </div>
    )
}

export default Table