/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowRight from '@/components/icons/arrowRight';
import BillNote from '@/components/icons/billNote';
import { useRouter } from 'next/navigation';
import ReceiptBill from '@/components/icons/receiptBill';
import { useResidentBillStore } from '@/store/useResidentBillStore';

const Table = () => {
    const router = useRouter();
    const { bills, isLoading, currentPage, totalPages, loadMoreBills } = useResidentBillStore();
    const loaderRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && !isLoading && currentPage < totalPages) {
                loadMoreBills()
            }
        }, { rootMargin: '200px' })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [loaderRef.current, isLoading, currentPage, totalPages, loadMoreBills])

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {bills.map((bill: any, index: number) => (
                    <div
                        key={bill._id || index}
                        className='rounded-[12px] bg-[#F6F6F6] p-4 md:p-6 flex justify-between items-center'
                    >
                        <div className='flex justify-center items-center gap-4'>
                            <div className='bg-BlueHomz w-[46px] h-[46px] rounded-full flex justify-center items-center'>
                                <ReceiptBill />
                            </div>
                            <div>
                                <p className='text-sm md:text-base font-medium text-GrayHomz'>{bill.billName}</p>
                                <p className='text-[11px] md:text-[13px] text-GrayHomz mt-1'>{bill.frequency}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/resident/bills-payments/${bill._id}`)}
                            className="hidden md:flex items-center gap-2 text-BlueHomz font-semibold text-sm"

                        >
                            <BillNote />  <span className='flex items-center gap-1'>Bill details <ArrowRight className='#006aff' /></span>
                        </button>
                        <button
                            onClick={() => router.push(`/resident/bills-payments/${bill._id}`)}
                            className="md:hidden flex items-center gap-2 text-BlueHomz font-semibold text-sm"
                        >
                            <span><ArrowRight className='#006aff' /></span>
                        </button>
                    </div>
                ))}
            </div>
            <div className="w-full">
                {currentPage < totalPages && (
                    <div className="py-2">
                        <div ref={loaderRef} className="h-1" />
                        {isLoading && (
                            <div className="w-full flex items-center justify-center py-3">
                                <LoadingSpinner size={24} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Table