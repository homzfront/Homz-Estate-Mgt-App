/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { estateBillingData } from '@/constant/index';
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowRight from '@/components/icons/arrowRight';
import { useRouter } from 'next/navigation';
import PaymentRecordIcon from '@/components/icons/paymentRecordIcon';
import CustomModal from '@/components/general/customModal';
import DocDocuSmall from '@/components/icons/docDocuSmall';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';

const Table = () => {
    const router = useRouter();
    const [displayedBills, setDisplayedBills] = React.useState(estateBillingData.slice(0, 8))
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)
    const [selectedBill, setSelectedBill] = React.useState<any>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const dropdownRef = React.useRef<HTMLDivElement | null>(null)
    const [disabledPaymentRecord, setDisabledPaymentRecord] = React.useState(true);

    const itemsPerPage = 8
    const totalPages = Math.ceil(estateBillingData.length / itemsPerPage)

    React.useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && !isLoading && currentPage < totalPages) {
                loadMore()
            }
        }, { rootMargin: '200px' })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [loaderRef.current, isLoading, currentPage, totalPages])

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadMore = () => {
        setIsLoading(true)
        setTimeout(() => {
            const nextPage = currentPage + 1
            const startIndex = nextPage * itemsPerPage
            const endIndex = startIndex + itemsPerPage
            const newBills = estateBillingData.slice(startIndex, endIndex)
            setDisplayedBills(prev => [...prev, ...newBills])
            setCurrentPage(nextPage)
            setIsLoading(false)
        }, 500) // Simulate loading delay
    };

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id)
    }

    const handleMoreInfo = (bill: any) => {
        setSelectedBill(bill)
        const isInactive = bill.residentStatus === 'Pending' || bill.residentStatus === 'Overdue'
        setDisabledPaymentRecord(isInactive)
        setIsModalOpen(true)
        setOpenDropdownId(null)
    }

    const handlePaymentRecord = (idx: number, status: string) => {
        const isInactive = status === 'Pending' || status === 'Overdue'
        if (!isInactive) {
            router.push(`/resident/bills-payments/${idx}/payment-record/${idx}`)
        }
        setOpenDropdownId(null)
    }

    return (
        <>
            <CustomModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                    <div className='flex justify-between items-start pb-4'>
                        <div onClick={() => setDisabledPaymentRecord(false)} className='max-w-[80%] text-sm font-medium text-BlueHomz'>
                            [Bill Name] - [Period]
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>
                            <CloseTransluscentIcon />
                        </button>
                    </div>

                    {selectedBill && (
                        <div className="min-w-[300px]">
                            <div className="space-y-3 bg-[#F6F6F6] rounded-[12px] p-4">
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Period</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedBill.frequency}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Amount</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedBill.amount}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Start Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedBill.startDate}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Due Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedBill.dueDate}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Status</span>
                                    <span >
                                        <span
                                            className={'py-1 px-3 rounded-[4px] text-xs font-medium'}
                                            style={{
                                                backgroundColor:
                                                    selectedBill.residentStatus === 'Pending' ? '#FCF3EB'
                                                        : selectedBill.residentStatus === 'Partially Paid' ? '#EEF5FF'
                                                            : selectedBill.residentStatus === 'Overdue' ? '#FDF2F2'
                                                                : selectedBill.residentStatus === 'Paid' ? '#CDEADD'
                                                                    : '#F6F6F6',
                                                color:
                                                    selectedBill.residentStatus === 'Pending' ? '#DC6803'
                                                        : selectedBill.residentStatus === 'Partially Paid' ? '#006AFF'
                                                            : selectedBill.residentStatus === 'Overdue' ? '#D92D20'
                                                                : selectedBill.residentStatus === 'Paid' ? '#039855'
                                                                    : '#333',
                                            }}
                                        >
                                            {selectedBill.residentStatus}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!disabledPaymentRecord && selectedBill) {
                                        const billIndex = displayedBills.findIndex(b => b._id === selectedBill._id)
                                        router.push(`/resident/bills-payments/${billIndex}/payment-record/${billIndex}`)
                                    }
                                    setIsModalOpen(false);
                                }}
                                disabled={disabledPaymentRecord}
                                className={`${disabledPaymentRecord ? "bg-[#E6E6E6] text-[#D5D5D5] cursor-not-allowed" : "bg-BlueHomz text-white cursor-pointer"} mt-2 h-[48px] rounded-[4px] w-full px-4 py-2 flex justify-center items-center gap-2 text-base font-medium`}>
                                <PaymentRecordIcon color={disabledPaymentRecord ? "#D5D5D5" : "#ffffff"} />
                                <span>Payment record</span>
                            </button>
                        </div>
                    )}
                </div>
            </CustomModal>

            <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
                <div className="border overflow-x-auto scrollbar-container">
                    <div className="w-full md:w-[100%]">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                    <th className="pl-4 text-left w-auto"><span className="hidden md:inline">Period</span><span className="md:hidden">Bill Period</span></th>
                                    <th className="text-left w-auto hidden md:table-cell">Amount</th>
                                    <th className="text-left w-auto hidden md:table-cell">Start Date</th>
                                    <th className="text-left w-auto hidden md:table-cell">Due Date</th>
                                    <th className="text-start w-[150px]">Status</th>
                                    <th className="text-left md:w-[180px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedBills.length === 0 && (
                                    Array.from({ length: 6 }).map((_, sk) => (
                                        <tr key={`sk-${sk}`} className="border-t-[1px]">
                                            <td className="py-[15px] pl-4">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px]">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] pr-4"></td>
                                        </tr>
                                    ))
                                )}
                                {displayedBills.map((row, idx) => {
                                    const isInactive = row.residentStatus === 'Pending' || row.residentStatus === 'Overdue';
                                    return (
                                        <tr
                                            key={row._id}
                                            className="border-t min-h-[60px] bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => router.push(`/resident/bills-payments/${idx}`)}
                                        >
                                            <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px]">{row.frequency}</td>
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">{row.amount}</td>
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">{row.startDate}</td>
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">{row.dueDate}</td>
                                            <td className="py-[15px] text-GrayHomz font-[500] text-[11px] min-w-[180px]">
                                                <div className="flex justify-start">
                                                    <span
                                                        className={'py-2 px-3 rounded-[4px] inline-block text-center'}
                                                        style={{
                                                            backgroundColor:
                                                                row.residentStatus === 'Pending' ? '#FCF3EB'
                                                                    : row.residentStatus === 'Partially Paid' ? '#EEF5FF'
                                                                        : row.residentStatus === 'Overdue' ? '#FDF2F2'
                                                                            : row.residentStatus === 'Paid' ? '#CDEADD'
                                                                                : '#F6F6F6',
                                                            color:
                                                                row.residentStatus === 'Pending' ? '#DC6803'
                                                                    : row.residentStatus === 'Partially Paid' ? '#006AFF'
                                                                        : row.residentStatus === 'Overdue' ? '#D92D20'
                                                                            : row.residentStatus === 'Paid' ? '#039855'
                                                                                : '#333',
                                                            fontWeight: 600,
                                                            width: '120px',
                                                            fontSize: '12px',
                                                        }}
                                                    >
                                                        {row.residentStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-[15px] md:w-[180px]" onClick={(e) => e.stopPropagation()}>
                                                {/* Desktop view - full button */}
                                                <button
                                                    onClick={() => !isInactive && router.push(`/resident/bills-payments/${idx}/payment-record/${idx}`)}
                                                    className={`hidden md:flex items-center gap-2 font-semibold text-sm ${isInactive
                                                        ? 'text-gray-400 cursor-not-allowed opacity-50'
                                                        : 'text-BlueHomz cursor-pointer hover:underline'
                                                        }`}
                                                    disabled={isInactive}
                                                >
                                                    <PaymentRecordIcon />  <span className='flex items-center gap-1'>Payment record <ArrowRight className='#006aff' /></span>
                                                </button>

                                                {/* Mobile view - 3-dot menu */}
                                                <div className="md:hidden relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown(row._id);
                                                        }}
                                                        className="p-1"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <circle cx="12" cy="6" r="1.5" fill="#666" />
                                                            <circle cx="12" cy="12" r="1.5" fill="#666" />
                                                            <circle cx="12" cy="18" r="1.5" fill="#666" />
                                                        </svg>
                                                    </button>
                                                    {openDropdownId === row._id && (
                                                        <div className="absolute right-10 top-8 bg-white border rounded-lg shadow-lg z-10 w-48 py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMoreInfo(row);
                                                                }}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-GrayHomz"
                                                            >
                                                                <DocDocuSmall />
                                                                <span>More info</span>
                                                            </button>
                                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePaymentRecord(idx, row.residentStatus);
                                                                }}
                                                                className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm font-medium ${
                                                                    isInactive 
                                                                        ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                                                        : 'text-GrayHomz hover:bg-gray-50'
                                                                }`}
                                                                disabled={isInactive}
                                                            >
                                                                <PaymentRecordIcon color={isInactive ? '#D5D5D5' : '#4e4e4e'} />
                                                                <span>Payment record</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {currentPage < totalPages && (
                                    <tr>
                                        <td colSpan={8} className="py-2">
                                            <div ref={loaderRef} className="h-1" />
                                            {isLoading && (
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
        </>
    )
}

export default Table