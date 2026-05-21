'use client'
import React, { useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Table from './components/table'
import Filters from './components/filters'
import ArrowLeft from '@/components/icons/arrowLeft'
import { useResidentBillStore, ResidentBillItem } from '@/store/useResidentBillStore'
import { useResidentCommunity } from '@/store/useResidentCommunity'
import LoadingSpinner from '@/components/general/loadingSpinner'
import MakePaymentModal from '@/app/(dashboard)/components/make-payment-modal'

const PaymentRecordPage = () => {
    const router = useRouter()
    const params = useParams()
    const billingId = Array.isArray(params.id) ? params.id[0] : params.id
    const recordId = Array.isArray(params.recordId) ? params.recordId[0] : params.recordId
    const { fullBillsHistory, fetchResidentBills, isLoading } = useResidentBillStore()
    const { residentCommunity } = useResidentCommunity()
    const [showPayment, setShowPayment] = React.useState(false)
    const activeCommunity = residentCommunity?.[0]

    useEffect(() => {
        if (activeCommunity && billingId && fullBillsHistory.length === 0) {
            const { estateId, associatedIds } = activeCommunity
            fetchResidentBills({
                estateId,
                organizationId: associatedIds.organizationId,
                residentId: associatedIds.residentId,
                billingId: billingId || ''
            })
        }
    }, [activeCommunity, billingId, fetchResidentBills, fullBillsHistory.length])

    const selectedBillInstance = useMemo(() => {
        return fullBillsHistory.find(b => b._id === recordId)
    }, [fullBillsHistory, recordId])

    const periodHistory = useMemo(() => {
        if (!selectedBillInstance) return []
        return fullBillsHistory.filter(b => b.period === selectedBillInstance.period)
    }, [fullBillsHistory, selectedBillInstance])

    const billName = selectedBillInstance?.billType?.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Bill Record'
    const periodName = selectedBillInstance?.period?.replace(/_/g, ' ') || ''
    const isPaid = (selectedBillInstance?.periodStatus || selectedBillInstance?.status)?.toLowerCase() === 'paid'
    // Always compute remaining from the freshest instance in fullBillsHistory
    // fullBillsHistory has ALL records including payment updates (not just the deduped detailedBills)
    const freshInstance = (fullBillsHistory.find(b => b._id === recordId) || selectedBillInstance) as ResidentBillItem | undefined
    const remainingAmount = freshInstance
        ? Math.max(0, freshInstance.amount - freshInstance.amountPaid)
        : 0

    const refreshBills = () => {
        if (activeCommunity) {
            fetchResidentBills({
                estateId: activeCommunity.estateId,
                organizationId: activeCommunity.associatedIds.organizationId,
                residentId: activeCommunity.associatedIds.residentId,
                billingId: billingId || '',
                silent: false,
                bustCache: true,
            })
        }
    }

    return (
        <div className="w-full p-8">
            <div className='flex justify-between items-start w-full mb-6'>
                <div className='flex flex-col gap-1 w-full'>
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className='mb-4 flex justify-center items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                            <ArrowLeft /> Back
                        </button>
                    </div>
                    <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold capitalize'>
                        {billName} {periodName && `- ${periodName}`}
                    </h2>
                    <p className='text-base text-GrayHomz font-normal w-full'>
                        Here are your payment records for this billing period.
                    </p>
                </div>
                <span className='block -mt-3 md:mt-0'><Filters /></span>
            </div>

            {/* Tabs + Pay button */}
            <div className="mb-6 flex items-center justify-between">
                <button className="px-3 py-2 text-white font-medium text-sm bg-BlueHomz rounded-[4px]">
                    All Records
                </button>
                {selectedBillInstance && !isPaid && remainingAmount > 0 && (
                    <button
                        onClick={() => setShowPayment(true)}
                        className='h-[40px] px-6 bg-BlueHomz text-white text-sm font-semibold rounded-[8px] hover:opacity-90 transition-opacity'
                    >
                        {(selectedBillInstance.periodStatus || selectedBillInstance.status)?.toLowerCase() === 'partialpaid'
                            ? `Pay Remaining ₦${remainingAmount.toLocaleString()}`
                            : 'Pay with Wallet'}
                    </button>
                )}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className='h-[300px] flex justify-center items-center'>
                    <LoadingSpinner size={40} />
                </div>
            ) : (
                <Table history={periodHistory} />
            )}

            {/* Payment modal */}
            {selectedBillInstance && (
                <MakePaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    bill={{
                        billingPaymentId: selectedBillInstance._id,
                        billName: billName,
                        amount: remainingAmount,
                        dueDate: selectedBillInstance.dueDate,
                        frequency: selectedBillInstance.frequency,
                    }}
                    onSuccess={() => {
                        setShowPayment(false)
                        refreshBills()
                    }}
                />
            )}
        </div>
    )
}

export default PaymentRecordPage