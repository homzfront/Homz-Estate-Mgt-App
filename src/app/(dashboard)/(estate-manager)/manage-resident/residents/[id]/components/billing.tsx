import React from 'react'
import FilterHeader from './filterHeader'
import Table from './table'
import ReceiptBillEmpty from '@/components/icons/receiptBillEmpty'
import AddIcon from '@/components/icons/addIcon'
import { useBillPaymentStore } from '@/store/useBillPaymentStore'
import LoadingSpinner from '@/components/general/loadingSpinner'

interface Props {
    onOpenPaymentModal?: (data?: unknown) => void
    showData: boolean
    residentId?: string
    apartmentId?: string
    openAddModal?: () => void
}

const Billing: React.FC<Props> = ({ openAddModal, onOpenPaymentModal, showData, residentId, apartmentId }) => {
    const { initialLoading, hasAnyData, items, lastApartmentId, fetchBillPayments, stats, isFilterActive } = useBillPaymentStore()

    // Fetch data when component mounts or when apartmentId or residentId changes
    React.useEffect(() => {
        if (residentId && apartmentId) {
            const state = useBillPaymentStore.getState()
            const cacheKey = apartmentId
            const cachedData = state.apartmentCache[cacheKey]

            if (cachedData) {
                // Immediately load cached data to prevent empty state flash
                useBillPaymentStore.setState({
                    items: cachedData.items,
                    totalCount: cachedData.totalCount,
                    totalPages: cachedData.totalPages,
                    currentPage: cachedData.currentPage,
                    hasAnyData: cachedData.items.length > 0,
                    hasEverHadData: true,
                    lastApartmentId: apartmentId,
                    lastResidentId: residentId,
                    stats: cachedData.stats,
                    initialLoading: false,
                    pageLoading: false,
                    isAppending: false,
                })
                // Don't fetch for cached data to avoid overwriting with potentially empty response
            } else {
                fetchBillPayments({ residentId, apartmentId })
            }
        }
    }, [apartmentId, residentId, fetchBillPayments])

    // Only show data if it's for the current apartment
    const isDataForCurrentApartment = lastApartmentId === apartmentId
    const currentItems = isDataForCurrentApartment ? items : []
    const currentHasAnyData = isDataForCurrentApartment && hasAnyData && currentItems.length > 0

    // Show skeleton only when truly loading for the current apartment without any data
    const showSkeleton = initialLoading && (!isDataForCurrentApartment || currentItems.length === 0)
    // Determine if we should show the data view
    const shouldShowData = showData || currentHasAnyData

    return (
        <div className='min-w-[300px] w-full'>
            {
                showSkeleton ? (
                    <div className='text-center h-[350px] flex flex-col justify-center items-center gap-4'>
                        <LoadingSpinner size={48} />
                        <p className='text-GrayHomz text-sm'>Loading bill payment records...</p>
                    </div>
                ) : !shouldShowData ? (
                    <div className='text-center md:h-[350px] flex flex-col justify-center items-center gap-2'>
                        <button className='w-[96px] h-[96px] rounded-full bg-[#F6F5F5] flex justify-center items-center'>
                            <ReceiptBillEmpty />
                        </button>
                        <p className='text-GrayHomz mt-4'>Bill payment records will be displayed here when added</p>
                        <button onClick={openAddModal} className=' text-BlueHomz flex justify-center items-center gap-2'><AddIcon /> Add Payment Record</button>
                    </div>
                ) : (
                    <>
                        {currentItems.length > 0 && <FilterHeader />}
                        {currentItems.length > 0 && (
                            <div className='w-full flex flex-col gap-4 md:gap-0 md:flex-row justify-between mb-6'>
                                <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-successBg border-Success'>
                                    <p className='text-[11px] text-medium text-Success'>Total Expected Payments</p>
                                    {initialLoading && !stats ? (
                                        <div className='h-4 w-24 bg-gray-300 rounded animate-pulse'></div>
                                    ) : (
                                        <p className='text-[13px] font-medium text-BlackHomz'>₦{stats?.totalExpectedBillAmount?.toLocaleString() || '0'}</p>
                                    )}
                                </div>
                                <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-whiteblue border-BlueHomz'>
                                    <p className='text-[11px] text-medium text-BlueHomz'>Total Payment Received</p>
                                    {initialLoading && !stats ? (
                                        <div className='h-4 w-24 bg-gray-300 rounded animate-pulse'></div>
                                    ) : (
                                        <p className='text-[13px] font-medium text-BlackHomz'>₦{stats?.totalPaidBillAmount?.toLocaleString() || '0'}</p>
                                    )}
                                </div>
                                <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-warningBg border-warning2'>
                                    <p className='text-[11px] text-medium text-warning2'>Pending Payments</p>
                                    {initialLoading && !stats ? (
                                        <div className='h-4 w-24 bg-gray-300 rounded animate-pulse'></div>
                                    ) : (
                                        <p className='text-[13px] font-medium text-BlackHomz'>₦{stats?.totalPendingBillAmount?.toLocaleString() || '0'}</p>
                                    )}
                                </div>
                                <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-bgRed border-error'>
                                    <p className='text-[11px] text-medium text-error'>Overdue Payments</p>
                                    {initialLoading && !stats ? (
                                        <div className='h-4 w-24 bg-gray-300 rounded animate-pulse'></div>
                                    ) : (
                                        <p className='text-[13px] font-medium text-BlackHomz'>₦{stats?.totalOverdueBillAmount?.toLocaleString() || '0'}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {currentItems.length > 0 ? (
                            <Table onOpenPaymentModal={onOpenPaymentModal} residentId={residentId || ""} apartmentId={apartmentId} />
                        ) : isFilterActive ? (
                            // No results found with active filters
                            <div className='text-center md:h-[350px] flex flex-col justify-center items-center gap-2 mt-6'>
                                <button className='w-[96px] h-[96px] rounded-full bg-[#F6F5F5] flex justify-center items-center'>
                                    <ReceiptBillEmpty />
                                </button>
                                <p className='text-GrayHomz mt-4'>No bill payment records found matching your filters</p>
                                <p className='text-sm text-GrayHomz2 mb-2'>Try adjusting your filter criteria or clearing filters to see all records</p>
                                <button onClick={() => {
                                    // Clear filters and refetch
                                    const store = useBillPaymentStore.getState();
                                    store.clearFilters();
                                    if (store.lastResidentId && store.lastApartmentId) {
                                        store.fetchBillPayments({ residentId: store.lastResidentId, apartmentId: store.lastApartmentId, page: 1 });
                                    }
                                }} className='text-BlueHomz flex justify-center items-center gap-2'>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            // No data for this apartment (no filters applied)
                            <div className='text-center md:h-[350px] flex flex-col justify-center items-center gap-2 mt-6'>
                                <button className='w-[96px] h-[96px] rounded-full bg-[#F6F5F5] flex justify-center items-center'>
                                    <ReceiptBillEmpty />
                                </button>
                                <p className='text-GrayHomz mt-4'>No bill payment records found for this apartment</p>
                                <button onClick={openAddModal} className=' text-BlueHomz flex justify-center items-center gap-2'><AddIcon /> Add Payment Record</button>
                            </div>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Billing