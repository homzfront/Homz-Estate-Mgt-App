import React from 'react'
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowRight from '@/components/icons/arrowRight';
import BillNote from '@/components/icons/billNote';
import { useRouter } from 'next/navigation';
import ReceiptBill from '@/components/icons/receiptBill';
import { useResidentBillStore, ResidentBillItem } from '@/store/useResidentBillStore';

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

    const uniqueBills = React.useMemo(() => {
        const seen = new Set();
        return bills.filter((bill: ResidentBillItem) => {
            if (seen.has(bill.billingId)) return false;
            seen.add(bill.billingId);
            return true;
        });
    }, [bills]);

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {uniqueBills.map((bill: ResidentBillItem, index: number) => (
                    <div
                        key={bill._id || index}
                        className='rounded-[12px] bg-[#F6F6F6] p-4 md:p-6 flex justify-between items-center'
                    >
                        <div className='flex justify-center items-center gap-4'>
                            <div className='bg-BlueHomz w-[46px] h-[46px] rounded-full flex justify-center items-center'>
                                <ReceiptBill />
                            </div>
                            <div>
                                <p className='text-sm md:text-base font-medium text-GrayHomz capitalize'>
                                    {bill.billType?.replace(/_/g, ' ')}
                                </p>
                                <p className='text-[11px] md:text-[13px] text-GrayHomz mt-1 capitalize'>{bill.frequency}</p>
                                {bill.periodStatus && (
                                    <span className={`mt-1 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full capitalize
                                        ${bill.periodStatus?.toLowerCase() === 'paid' ? 'bg-[#CDEADD] text-[#039855]' :
                                          bill.periodStatus?.toLowerCase() === 'overdue' ? 'bg-[#FDF2F2] text-[#D92D20]' :
                                          bill.periodStatus?.toLowerCase() === 'partialpaid' ? 'bg-[#EEF5FF] text-[#006AFF]' :
                                          'bg-[#FCF3EB] text-[#DC6803]'}`}>
                                        {bill.periodStatus?.toLowerCase() === 'partialpaid' ? 'Partially Paid' : bill.periodStatus}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/resident/bills-payments/${bill.billingId}`)}
                            className="hidden md:flex items-center gap-2 text-BlueHomz font-semibold text-sm"

                        >
                            <BillNote /> <span className='flex items-center gap-1'>Bill details <ArrowRight className='#006aff' /></span>
                        </button>
                        <button
                            onClick={() => router.push(`/resident/bills-payments/${bill.billingId}`)}
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