/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowDown from '@/components/icons/arrowDown'
import CustomModal from '@/components/general/customModal'
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon'
import DocDocuSmall from '@/components/icons/docDocuSmall'

// Sample payment record data
const paymentRecordData = [
    {
        _id: 'record_1',
        period: 'Month 1',
        billAmount: '₦4,000',
        amountPaid: '₦4,000',
        outstandingBalance: '₦1,000',
        status: 'Partially Paid',
        paymentDate: '17 Jan, 2025',
        hasMultiplePayments: false,
        paymentBreakdown: []
    },
    {
        _id: 'record_2',
        period: 'Month 2',
        billAmount: '₦5,000',
        amountPaid: '₦2,500',
        outstandingBalance: '₦0.00',
        status: 'Paid',
        paymentDate: '17 Mar, 2025',
        hasMultiplePayments: true,
        paymentBreakdown: [
            {
                _id: 'sub_1',
                period: 'Month 2',
                billAmount: '₦5,000',
                amountPaid: '₦1,000',
                outstandingBalance: '₦4,000',
                status: 'Partially Paid',
                paymentDate: '17 Sep, 2025'
            },
            {
                _id: 'sub_2',
                period: 'Month 2',
                billAmount: '₦5,000',
                amountPaid: '₦1,500',
                outstandingBalance: '₦2,500',
                status: 'Partially Paid',
                paymentDate: '16 Sep, 2025'
            }
        ]
    },
    {
        _id: 'record_3',
        period: 'Month 3',
        billAmount: '₦6,000',
        amountPaid: '₦6,000',
        outstandingBalance: '₦0.00',
        status: 'Paid',
        paymentDate: '10 Mar, 2025',
        hasMultiplePayments: false,
        paymentBreakdown: []
    },
    {
        _id: 'record_4',
        period: 'Month 4',
        billAmount: '₦6,000',
        amountPaid: '₦0.00',
        outstandingBalance: '₦0.00',
        status: 'Pending',
        paymentDate: '-',
        hasMultiplePayments: true,
        paymentBreakdown: [
            {
                _id: 'sub_3',
                period: 'Month 4',
                billAmount: '₦6,000',
                amountPaid: '₦3,000',
                outstandingBalance: '₦3,000',
                status: 'Partially Paid',
                paymentDate: '18 Aug, 2025'
            },
            {
                _id: 'sub_4',
                period: 'Month 4',
                billAmount: '₦6,000',
                amountPaid: '₦3,000',
                outstandingBalance: '₦0.00',
                status: 'Paid',
                paymentDate: '18 Mar, 2025'
            }
        ]
    },
]


const Table = () => {
    const [displayedRecords, setDisplayedRecords] = React.useState(paymentRecordData.slice(0, 8))
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [openBreakdown, setOpenBreakdown] = React.useState<number | null>(null)
    const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)
    const [selectedRecord, setSelectedRecord] = React.useState<any>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const breakdownRef = React.useRef<HTMLDivElement | null>(null)
    const dropdownRef = React.useRef<HTMLDivElement | null>(null)

    // Close breakdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (breakdownRef.current && !breakdownRef.current.contains(event.target as Node)) {
                setOpenBreakdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

    const itemsPerPage = 8
    const totalPages = Math.ceil(paymentRecordData.length / itemsPerPage)

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

    const loadMore = () => {
        setIsLoading(true)
        setTimeout(() => {
            const nextPage = currentPage + 1
            const startIndex = nextPage * itemsPerPage
            const endIndex = startIndex + itemsPerPage
            const newRecords = paymentRecordData.slice(startIndex, endIndex)
            setDisplayedRecords(prev => [...prev, ...newRecords])
            setCurrentPage(nextPage)
            setIsLoading(false)
        }, 500)
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending':
                return { backgroundColor: '#FCF3EB', color: '#DC6803' }
            case 'Partially Paid':
                return { backgroundColor: '#EEF5FF', color: '#006AFF' }
            case 'Overdue':
                return { backgroundColor: '#FDF2F2', color: '#D92D20' }
            case 'Paid':
                return { backgroundColor: '#CDEADD', color: '#039855' }
            default:
                return { backgroundColor: '#F6F6F6', color: '#333' }
        }
    }

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id)
    }

    const handleMoreInfo = (record: any) => {
        setSelectedRecord(record)
        setIsModalOpen(true)
        setOpenDropdownId(null)
    }

    return (
        <>
            <CustomModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                    <div className='flex justify-between items-start pb-4'>
                        <div className='max-w-[80%] text-sm font-medium text-BlueHomz'>
                            [Bill Name] - [Period]
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>
                            <CloseTransluscentIcon />
                        </button>
                    </div>

                    {selectedRecord && (
                        <div className="min-w-[300px]">
                            <div className="space-y-3 bg-[#F6F6F6] rounded-[12px] p-4">
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Period</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedRecord.period}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Bill Amount</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedRecord.billAmount}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Amount Paid</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedRecord.amountPaid}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Outstanding Balance</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedRecord.outstandingBalance}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Payment Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{selectedRecord.paymentDate}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Status</span>
                                    <span>
                                        <span
                                            className={'py-1 px-3 rounded-[4px] text-xs font-medium'}
                                            style={{
                                                ...getStatusStyle(selectedRecord.status)
                                            }}
                                        >
                                            {selectedRecord.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CustomModal>
            <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
                <div className="border overflow-x-auto scrollbar-container">
                    <div className="w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                    <th className="text-left pl-4" style={{ width: "200px" }}>
                                        Period
                                    </th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "200px" }}>Bill Amount</th>
                                    <th className="text-left" style={{ width: "200px" }}>Amount Paid</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "190px" }}>Outstanding Balance</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "180px" }}>Status</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "200px" }}>Payment Date</th>
                                    <th className="text-left md:hidden pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedRecords.length === 0 && (
                                    Array.from({ length: 6 }).map((_, sk) => (
                                        <tr key={`sk-${sk}`} className="border-t-[1px]">
                                            <td className="py-[15px] pl-4">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px]">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-20 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] pr-4">
                                                <div className="h-3 w-24 bg-whiteblue animate-pulse"></div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {displayedRecords.map((row, idx) => {
                                    const statusStyle = getStatusStyle(row.status)
                                    return (
                                        <>
                                            <tr
                                                key={row._id}
                                                className="border-t min-h-[60px] bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px]">
                                                    {row.hasMultiplePayments ? (
                                                        <div
                                                            className="text-BlueHomz text-[12px] flex items-center gap-1 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setTimeout(() => setOpenBreakdown(prev => prev === idx ? null : idx), 0)
                                                            }}
                                                        >
                                                            <span>{row.period}</span>
                                                            <span style={{ display: 'inline-flex', transition: 'transform 0.18s', transform: openBreakdown === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                                <ArrowDown className={'#006AFF'} />
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        row.period
                                                    )}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {row.billAmount}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">
                                                    {row.amountPaid}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {row.outstandingBalance}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    <div className="flex justify-start">
                                                        <span
                                                            className="py-2 px-3 rounded-[4px] inline-block text-center"
                                                            style={{
                                                                ...statusStyle,
                                                                fontWeight: 600,
                                                                minWidth: '120px',
                                                                fontSize: '12px',
                                                            }}
                                                        >
                                                            {row.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {row.paymentDate}
                                                </td>
                                                <td className="py-[15px] md:hidden"  onClick={(e) => e.stopPropagation()}>
                                                    {/* Mobile/Desktop view - 3-dot menu */}
                                                    <div className="relative" ref={openDropdownId === row._id ? dropdownRef : null}>
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
                                                            <div className="absolute right-10 md:right-0 top-8 bg-white border rounded-lg shadow-lg z-10 w-48 py-1">
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
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {openBreakdown === idx && row.hasMultiplePayments && (
                                                <tr>
                                                    <td colSpan={7} className="">
                                                        <div ref={breakdownRef} className="w-full bg-inputBg pl-2">
                                                            <table className="w-full">
                                                                <tbody>
                                                                    {row.paymentBreakdown.map((payment: any) => {
                                                                        const subStatusStyle = getStatusStyle(payment.status)
                                                                        return (
                                                                            <tr key={payment._id} className="border-t bg-transparent">
                                                                                <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px]" style={{ width: "200px" }}>
                                                                                    {payment.period}
                                                                                </td>
                                                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell" style={{ width: "200px" }}>
                                                                                    {payment.billAmount}
                                                                                </td>
                                                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px]" style={{ width: "200px" }}>
                                                                                    {payment.amountPaid}
                                                                                </td>
                                                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell" style={{ width: "190px" }}>
                                                                                    {payment.outstandingBalance}
                                                                                </td>
                                                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell" style={{ width: "180px" }}>
                                                                                    <div className="flex justify-start">
                                                                                        <span
                                                                                            className="py-2 px-3 rounded-[4px] inline-block text-center"
                                                                                            style={{
                                                                                                ...subStatusStyle,
                                                                                                fontWeight: 600,
                                                                                                minWidth: '120px',
                                                                                                fontSize: '12px',
                                                                                            }}
                                                                                        >
                                                                                            {payment.status}
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell" style={{ width: "200px" }}>
                                                                                    {payment.paymentDate}
                                                                                </td>
                                                                                <td className="py-[15px] md:hidden" style={{ width: "100px" }}>
                                                                                    {/* Empty actions cell for alignment */}
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )
                                })}
                                {currentPage < totalPages && (
                                    <tr>
                                        <td colSpan={7} className="py-2">
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
