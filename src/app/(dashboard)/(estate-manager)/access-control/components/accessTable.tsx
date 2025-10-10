/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAccessStore } from '@/store/useAccessStore';
import LoadingSpinner from '@/components/general/loadingSpinner';
// import Pagination from '@/app/(dashboard)/components/pagination';
import ArrowDown from '@/components/icons/arrowDown';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import ProfileWhite from '@/components/icons/profileWhite';
import RevokeAccess from '@/components/icons/revokeAccess';
import { formatDateDisplay, formatExpectedRange } from '@/app/utils/formatDateTime';
import PopUp from '../../dashboard/components/popUp';
import useClickOutside from '@/app/utils/useClickOutside';
import StatusDropDown from '@/app/(dashboard)/components/statusDropDown';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import DotLoader from '@/components/general/dotLoader';

interface AccessTableProps {
    steps: number;
}

const AccessTable: React.FC<AccessTableProps> = ({ steps }) => {
    const searchParams = useSearchParams();
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const {
        items,
        totalPages,
        currentPage,
        limit,
        pageLoading,
        isAppending,
        fetchManagerAccess,
        updateManagerAccessStatus,
    } = useAccessStore();
    const [isRevoking, setIsRevoking] = React.useState<boolean>(false);
    const [openDetails, setOpenDetails] = React.useState(false);
    const [openRevoke, setOpenRevoke] = React.useState(false);
    const [revokeId, setRevokeId] = React.useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const [openPopIndex, setOpenPopIndex] = React.useState<number | null>(null);
    const popupRef = React.useRef<HTMLTableCellElement | null>(null);
    const [openStatusIndex, setOpenStatusIndex] = React.useState<number | null>(null);
    const statusDropdownRef = React.useRef<HTMLDivElement | null>(null);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);

    useClickOutside(popupRef as React.RefObject<HTMLTableCellElement>, () => {
        if (openPopIndex !== null) setOpenPopIndex(null);
    });
    useClickOutside(statusDropdownRef as React.RefObject<HTMLDivElement>, () => {
        if (openStatusIndex !== null) setOpenStatusIndex(null);
    });

    React.useEffect(() => {
        if (currentPage !== initialPage) {
            fetchManagerAccess({ page: initialPage, limit, silent: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const revokeAccessCode = async () => {
        if (!selectedCommunity) return;
        setIsRevoking(true);
        try {
            const response = await api.patch(`/access-control/community-manager/revoke-access/${revokeId}/organizations/${selectedCommunity?.associatedIds?.organizationId}/estates/${selectedCommunity?._id}`)
            if (response.status === 200) {
                setIsRevoking(false);
                setOpenRevoke(false);
                setRevokeId(null);
                await fetchManagerAccess({ page: 1, limit: 8, manualOnly: steps === 1 });
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

    const selected = selectedIndex !== null ? items[selectedIndex] : null;
    const loaderRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!loaderRef.current) return;
        const el = loaderRef.current;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !pageLoading && currentPage < totalPages) {
                fetchManagerAccess({ page: currentPage + 1, append: true });
            }
        }, { rootMargin: '200px' });
        observer.observe(el);
        return () => observer.unobserve(el);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaderRef.current, pageLoading, currentPage, totalPages]);

    return (
        <div className="mt-6 w-full mx-auto">
            {openRevoke && (
                <CustomModal isOpen={openRevoke} onRequestClose={() => setOpenRevoke(false)}>
                    <div className="bg-white flex flex-col w-[333px] md:w-[464px] p-[32px] rounded-[12px] gap-[18px]">
                        <div className="flex flex-col gap-6 items-center justify-center">
                            <RevokeAccess />
                            <div className="flex flex-col">
                                <p className="text-[14px] md:text-[20px] font-[700] text-center mb-1">Revoke Visitor Access?</p>
                                <p className="text-[13px] md:text-[16px] font-[400] text-center">Are you sure you want to revoke access for this visitor? They will no longer be able to use the access code to enter the estate.</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <button className="w-full border border-BlueHomz text-BlueHomz text-sm rounded-[4px] h-[48px]" onClick={() => setOpenRevoke(false)}>Cancel</button>
                            <button className={`w-full bg-error text-white text-sm h-[48px] rounded-[4px] min-w-[140px] ${isRevoking && "flex items-center justify-center"}`} onClick={() => revokeAccessCode()}>{isRevoking ? <DotLoader color='#fff' /> : 'Revoke Access'}</button>
                        </div>
                    </div>
                </CustomModal>
            )}

            {openDetails && selected && (
                <CustomModal isOpen={openDetails} onRequestClose={() => setOpenDetails(false)}>
                    <div className='p-4 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h2 className='text-BlueHomz text-[16px] font-medium hidden md:block'>Resident Information</h2>
                                <h2 className='text-BlueHomz text-sm font-medium md:hidden'>Visitor Access Record</h2>
                            </div>
                            <button onClick={() => setOpenDetails(false)}><CloseTransluscentIcon /></button>
                        </div>

                        <div className='mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Resident’s Name</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected?.resident ? `${selected.resident.firstName} ${selected.resident.lastName}` : '-'}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Property</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected?.resident?.estateName || '-'}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Apartment Number</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected?.resident?.apartment || '-'}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Address</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected?.resident ? `${selected.resident.building}, ${selected.resident.streetName}, ${selected.resident.zone}` : '-'}</p>
                            </div>
                        </div>

                        <div className='md:hidden mt-4 py-7 px-5 bg-inputBg rounded-[12px]'>
                            <div className='grid grid-cols-2 gap-4'>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Visitor</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected.visitor}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Phone number</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected.phoneNumber}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Purpose</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected.purpose}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>No of visitors</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected.numberOfVisitors}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Date of visit</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{formatDateDisplay(selected.arrivalDate)}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Expected time of visit</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{formatExpectedRange(selected.expectedArrivalTime?.from, selected.expectedArrivalTime?.to)}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Access Code</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium'>{selected.accessCode}</p>
                                <p className='text-[11px] md:text-sm text-GrayHomz font-medium'>Access Status</p>
                                <p className='text-[11px] md:text-sm text-BlackHomz font-medium capitalize'>{selected.accessStatus}</p>
                            </div>
                        </div>

                        <button disabled={true} onClick={() => setOpenDetails(false)} className='pointer-events-none opacity-50 mt-4 w-full rounded-[4px] md:w-[518px] h-[45px] bg-BlueHomz flex items-center justify-center gap-2 text-white text-sm font-medium'>
                            <ProfileWhite /> View Resident’s profile
                        </button>
                    </div>
                </CustomModal>
            )}

            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-[100%] md:w-[200%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                                <th className="text-left pl-4 hidden md:table-cell" style={{ width: "40px" }}></th>
                                <th className="text-left hidden md:table-cell" style={{ width: "110px" }}>Resident Info</th>
                                <th className="text-left pl-4 md:pl-0" style={{ width: "110px" }}>Visitor</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Phone Number</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Purpose</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>No of Visitors</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Date of Visit</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "110px" }}>Expected Arrival Time</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Access Code</th>
                                <th className="text-left" style={{ width: "90px" }}>Access Status</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Time In</th>
                                <th className="text-left hidden md:table-cell" style={{ width: "90px" }}>Time Out</th>
                                <th style={{ width: "50px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageLoading && !isAppending ? (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="hidden md:table-cell py-[20px]"></td>
                                        <td className="hidden md:table-cell py-[20px]"></td>
                                        <td className="py-[15px] pl-4 md:pl-0">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-20 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-20 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-10 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-28 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td>
                                            <div className="h-6 w-[100px] bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] pr-4"></td>
                                    </tr>
                                ))
                            ) : (
                                items.map((row, idx) => (
                                    <tr key={row._id} className="w-2 border-t-[1px] items-center">
                                        <td className="text-GrayHomz py-[25px] font-[500] text-[11px] hidden md:table-cell text-center">
                                            <span className='inline-block w-[8px] h-[8px] rounded-full bg-error' />
                                        </td>
                                        <td className="text-BlueHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">
                                            <span onClick={(e) => {
                                                e.stopPropagation();
                                                if (row?.resident?.firstName) {
                                                    setSelectedIndex(idx);
                                                    setOpenDetails(true);
                                                }
                                            }}
                                                className='flex items-center gap-2'>
                                                {row.resident ? `${row.resident.firstName} ${row.resident.lastName}` : '-'} <ArrowDown />
                                            </span>
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] pl-4 md:pl-0">{row.visitor}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.phoneNumber}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.purpose}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.numberOfVisitors}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{formatDateDisplay(row.arrivalDate)}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{formatExpectedRange(row.expectedArrivalTime?.from, row.expectedArrivalTime?.to)}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.accessCode}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] capitalize">
                                            {['pending', 'signed in', 'signed out'].includes((row.accessStatus || '').toLowerCase()) ? (
                                                <div className="flex items-center gap-2">
                                                    <StatusDropDown
                                                        value={(row.accessStatus === 'pending' ? 'Pending' : row.accessStatus === 'signed in' ? 'Signed In' : 'Signed Out') as any}
                                                        loading={false}
                                                        isOpen={openStatusIndex === idx}
                                                        toggleDropdown={() => setOpenStatusIndex((prev) => (prev === idx ? null : idx))}
                                                        selectedStatus={null}
                                                        setSelectedStatus={() => { }}
                                                        dropdownRef={openStatusIndex === idx ? (statusDropdownRef as any) : undefined}
                                                        handleStatusChange={(status) => {
                                                            const next = status === 'Pending' ? 'pending' : status === 'Signed In' ? 'signed in' : 'signed out';
                                                            updateManagerAccessStatus(row._id, next as any);
                                                            setOpenStatusIndex(null);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px]
                                                ${row.accessStatus?.toLowerCase() === 'approved' ? 'bg-successBg text-Success' : ''}
                                                ${row.accessStatus?.toLowerCase() === 'rejected' ? 'bg-error text-white' : ''}
                                                ${row.accessStatus?.toLowerCase() === 'expired' ? 'bg-warningBg text-warning2' : ''}
                                                ${row.accessStatus?.toLowerCase() === 'revoke' ? 'bg-error text-white' : ''}
                                                ${row.accessStatus?.toLowerCase() === 'used' ? 'bg-whiteblue text-GrayHomz' : ''}
                                            `}
                                                >
                                                    {row.accessStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.timeIn ? new Date(row.timeIn).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-'}</td>
                                        <td className="text-GrayHomz py-[15px] font-[500] text-[11px] hidden md:table-cell">{row.timeOut ? new Date(row.timeOut).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-'}</td>
                                        <td ref={openPopIndex === idx ? popupRef : undefined} className={`sticky right-0 bg-white py-[15px] pr-4 z-10`}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedIndex(idx);
                                                    setRevokeId(row._id);
                                                    setOpenPopIndex((prev) => (prev === idx ? null : idx));
                                                }}
                                            >
                                                <Image src="/dots-vertical.png" alt="Options" height={21} width={20} style={{ height: 'auto', width: 'auto' }} />
                                            </button>
                                            {openPopIndex === idx && (
                                                <PopUp
                                                    disabledRevoke={!!row?.resident?.firstName}
                                                    setOpenDetails={(val) => { setOpenDetails(val); setOpenPopIndex(null); }}
                                                    fromDefault={false}
                                                    setOpenRevoke={(val) => { setOpenRevoke(val); setOpenPopIndex(null); }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                )
                                ))}
                            {items.length === 0 && !pageLoading && (
                                <tr>
                                    <td colSpan={13} className="text-center text-sm text-GrayHomz py-8">{pageLoading ? 'Loading...' : 'No records found'}</td>
                                </tr>
                            )}
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


            {/* {items.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        firstThreePages={[1, 2, 3]}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handleNext={handleNext}
                        handlePageClick={handlePageClick}
                        handlePrev={handlePrev}
                        lastThreePages={[Math.max(1, totalPages - 2), Math.max(1, totalPages - 1), Math.max(1, totalPages)]}
                    />
                </div>
            )} */}
        </div>
    );
};

export default AccessTable;
