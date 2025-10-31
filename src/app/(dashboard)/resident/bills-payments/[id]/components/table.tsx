/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { estateBillingData } from '@/constant/index';
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowRight from '@/components/icons/arrowRight';
import { useRouter } from 'next/navigation';
import PaymentRecordIcon from '@/components/icons/paymentRecordIcon';

const Table = () => {
    const router = useRouter();
    const [displayedBills, setDisplayedBills] = React.useState(estateBillingData.slice(0, 8))
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)

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

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-full md:w-[100%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                <th className="pl-4 text-left w-auto">Period</th>
                                <th className="text-left w-auto">Amount</th>
                                <th className="text-left w-auto">Start Date</th>
                                <th className="text-left w-auto">Due Date</th>
                                <th className="text-left w-[150px]">Status</th>
                                <th className="text-left w-[180px]">Actions</th>
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
                            {displayedBills.map((row, idx) => (
                                <tr key={row._id} className="border-t min-h-[60px] bg-white">
                                    <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px]">{row.frequency}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">{row.amount}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">{row.startDate}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">{row.dueDate}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px] min-w-[150px]">
                                        <span
                                            className={'py-2 px-3 rounded-[4px]'}
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
                                    </td>
                                    <td className="py-[15px] w-[180px]">
                                        <button
                                            onClick={() => router.push(`/resident/bills-payments/${idx}`)}
                                            className="flex items-center gap-2 text-BlueHomz font-semibold text-sm"

                                        >
                                            <PaymentRecordIcon />  <span className='flex items-center gap-1'>Payment record <ArrowRight className='#006aff' /></span>
                                        </button>

                                    </td>
                                </tr>
                            ))}
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
    )
}

export default Table