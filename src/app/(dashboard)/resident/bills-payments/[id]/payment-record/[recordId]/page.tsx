'use client'
import React, { useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Table from './components/table'
import Filters from './components/filters'
import ArrowLeft from '@/components/icons/arrowLeft'
import { useResidentBillStore } from '@/store/useResidentBillStore'
import { useResidentCommunity } from '@/store/useResidentCommunity'
import LoadingSpinner from '@/components/general/loadingSpinner'

const PaymentRecordPage = () => {
    const router = useRouter()
    const { id: billingId, recordId } = useParams()
    const {
        fullBillsHistory,
        fetchResidentBills,
        isLoading
    } = useResidentBillStore()

    const { residentCommunity } = useResidentCommunity()
    const activeCommunity = residentCommunity?.[0]

    useEffect(() => {
        if (activeCommunity && billingId && fullBillsHistory.length === 0) {
            const { estateId, associatedIds } = activeCommunity;
            fetchResidentBills({
                estateId,
                organizationId: associatedIds.organizationId,
                residentId: associatedIds.residentId,
                billingId: billingId as string
            });
        }
    }, [activeCommunity, billingId, fetchResidentBills, fullBillsHistory.length])

    const selectedBillInstance = useMemo(() => {
        return fullBillsHistory.find(b => b._id === recordId);
    }, [fullBillsHistory, recordId]);

    const periodHistory = useMemo(() => {
        if (!selectedBillInstance) return [];
        return fullBillsHistory.filter(b => b.period === selectedBillInstance.period);
    }, [fullBillsHistory, selectedBillInstance]);

    const billName = selectedBillInstance?.billType?.replace(/_/g, ' ') || 'Bill Record';
    const periodName = selectedBillInstance?.period?.replace(/_/g, ' ') || '';

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

            {/* Tabs */}
            <div className="mb-6">
                <button className="px-3 py-2 text-white font-medium text-sm bg-BlueHomz rounded-[4px]">
                    All Records
                </button>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className='h-[300px] flex justify-center items-center'>
                    <LoadingSpinner size={40} />
                </div>
            ) : (
                <Table history={periodHistory} />
            )}
        </div>
    )
}

export default PaymentRecordPage
