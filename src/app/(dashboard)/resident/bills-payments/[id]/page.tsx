"use client";
import React, { useEffect, useMemo } from 'react';
import Filters from '../components/filters';
import Table from './components/table';
import ArrowLeft from '@/components/icons/arrowLeft';
import { useRouter, useParams } from 'next/navigation';
import { useResidentBillStore, ResidentBillItem } from '@/store/useResidentBillStore';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import LoadingSpinner from '@/components/general/loadingSpinner';

const DetailedPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const {
        detailedBills: bills, // Renamed to detailedBills but kept local name if preferred
        detailedMetrics: metrics,
        fetchResidentBills,
        isLoading,
        search,
        frequency
    } = useResidentBillStore();

    const { residentCommunity } = useResidentCommunity();
    const activeCommunity = residentCommunity?.[0];

    // Always fetch fresh on mount and when id/filters change — picks up EM status changes
    useEffect(() => {
        if (activeCommunity && id) {
            const { estateId, associatedIds } = activeCommunity;
            fetchResidentBills({
                estateId,
                organizationId: associatedIds.organizationId,
                residentId: associatedIds.residentId,
                billingId: id as string,
                silent: false,
            });
        }
    }, [activeCommunity?.estateId, id, fetchResidentBills, search, frequency]);

    const groupedBills = useMemo(() => {
        const uniquePeriods: Record<string, ResidentBillItem> = {};

        bills.forEach(bill => {
            const periodKey = bill.period || 'Other';
            const billDate = new Date(bill.updatedAt || bill.createdAt).getTime();

            if (!uniquePeriods[periodKey]) {
                uniquePeriods[periodKey] = bill;
            } else {
                const currentLatestDate = new Date(uniquePeriods[periodKey].updatedAt || uniquePeriods[periodKey].createdAt).getTime();
                if (billDate > currentLatestDate) {
                    uniquePeriods[periodKey] = bill;
                }
            }
        });

        // The Table expects Record<string, ResidentBillItem[]> where each period group has its bills
        const result: Record<string, ResidentBillItem[]> = {};
        Object.entries(uniquePeriods).forEach(([key, value]) => {
            result[key] = [value];
        });
        return result;
    }, [bills]);

    const boxData = [
        {
            id: 1,
            title: 'Total Bill Amount',
            amount: `₦${metrics?.totalExpectedBillAmount?.toLocaleString() || '0'}`,
            textColor: '#039855',
            bgColor: '#CDEADD',
        },
        {
            id: 2,
            title: 'Pending Payments',
            amount: `₦${metrics?.totalPendingBillAmount?.toLocaleString() || '0'}`,
            textColor: '#DC6803',
            bgColor: '#F6F6F6',
        },
        {
            id: 4,
            title: 'Total Amount Paid',
            amount: `₦${metrics?.totalPaidBillAmount?.toLocaleString() || '0'}`,
            textColor: '#006AFF',
            bgColor: '#F6F6F6',
        },
        {
            id: 5,
            title: 'Overdue Payments',
            amount: `₦${metrics?.totalOverdueBillAmount?.toLocaleString() || '0'}`,
            textColor: '#D92D20',
            bgColor: '#F6F6F6',
        },
    ];

    const billName = bills?.[0]?.billType?.replace(/_/g, ' ') || 'Bill details';

    return (
        <div className='w-full p-8'>
            <button onClick={() => router.back()} className='mb-4 flex justify-center items-center gap-2 text-[11px] text-GrayHomz2 font-medium'>
                <ArrowLeft /> Back
            </button>
            <div className='flex justify-between items-start w-full'>
                <div className='flex flex-col gap-1 w-full'>
                    <h2 className='text-base md:text-[20px] text-BlackHomz font-semibold capitalize'>{billName}</h2>
                    <p className='block text-base text-GrayHomz font-normal w-full'>
                        Here’s a breakdown of your <span className="capitalize">{billName}</span> for each billing period.
                    </p>
                </div>
                <span className='block -mt-3 sm:mt-0'><Filters /></span>
            </div>
            {isLoading ? (
                <div className='h-[400px] flex justify-center items-center'>
                    <LoadingSpinner size={48} />
                </div>
            ) : (
                <>
                    <div className='my-4'>
                        <div className='w-full hidden md:flex flex-col gap-4 md:flex-row justify-between mb-6'>
                            {boxData.map((box) => (
                                <div
                                    key={box.id}
                                    className={`border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 md:gap-2 justify-between w-full min-w-[180px] ${box.id === 1 ? 'md:w-[180px] mr-4' : ''}`}
                                    style={{ backgroundColor: box.bgColor, borderLeftColor: box.textColor }}
                                >
                                    <p className='text-[11px] font-medium' style={{ color: box.textColor }}>{box.title}</p>
                                    <p className='text-[13px] font-semibold'>{box.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full'>
                        <Table groupedBills={groupedBills} />
                    </div>
                </>
            )}
        </div>
    )
}

export default DetailedPage