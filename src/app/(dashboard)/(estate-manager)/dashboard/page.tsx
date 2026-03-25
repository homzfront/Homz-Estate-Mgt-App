/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddBlue from '@/components/icons/addBlue';
import AddIcon from '@/components/icons/addIcon';
import ArrowRight from '@/components/icons/arrowRight';
import EmptyEstateIcon from '@/components/icons/estateManager&Resident/desktop/emptyEstateIcon';
import RegisterTenantIcon from '@/components/icons/estateManager&Resident/desktop/registerTenantIcon';
import RegisterTenantIconMobile from '@/components/icons/estateManager&Resident/mobile/registerTenantIcon';
import EmptyEstateIconMobile from '@/components/icons/estateManager&Resident/mobile/emptyEstateIconMobile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import EmptyEstateState from '../components/emptyEstateState';
import ArrowDown from '@/components/icons/arrowDown';
import Image from 'next/image';
import CustomModal from '@/components/general/customModal';
import PickEstate from '../components/pickEstate';
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { LoaderIcon } from 'react-hot-toast';
import { useAccessStore } from '@/store/useAccessStore';
import AccessTable from '../access-control/components/accessTable';
import LoadingSpinner from '@/components/general/loadingSpinner';
import { useResidentsListStore } from '@/store/useResidentsListStore';
import { useAbility } from '@/contexts/AbilityContext';
import { PermissionGuard } from '@/components/PermissionGuard';
// import { useAuthSlice } from '@/store/authStore';

const Dashboard = () => {
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
    const router = useRouter();
    const { pageLoading, initialLoading: accessInitialLoading, fetchManagerAccess, items } = useAccessStore();
    const { isCommunityManager, estateLoading, estatesData, communityProfile, getCommunityManaProfile } = useAuthSlice();
    const { fetchResidents, totalCount } = useResidentsListStore();
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
    const ability = useAbility();

    // Load CM profile + estates on mount if not already loaded
    // Covers: first-time users, page refreshes, and returning users from landing page
    React.useEffect(() => {
        if (!communityProfile?._id || estatesData === null) {
            getCommunityManaProfile().catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // On first mount or when community changes, fetch based on current tab
        if (selectedCommunity && ability.can('read', 'access-control')) {
            fetchManagerAccess({ page: 1, limit: 8, manualOnly: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCommunity?.estate?._id, ability])

    React.useEffect(() => {
        if (selectedCommunity && ability.can('read', 'residents')) {
            fetchResidents({ page: 1, limit: 8 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCommunity, ability]);

    // Mark as loaded once we have estates data
    React.useEffect(() => {
        if (estatesData !== null && !isCommunityManager && !estateLoading) {
            setHasLoadedOnce(true);
        }
    }, [estatesData, isCommunityManager, estateLoading]);

    // Show loading only on initial load or when switching estates (not on navigation back)
    if (!hasLoadedOnce && (isCommunityManager || estateLoading || estatesData === null)) {
        return <div className='h-screen w-full flex justify-center items-center'><LoaderIcon /></div>;
    };
    // If no estates, prompt to add one
    if (!estatesData || estatesData.length === 0) {
        return (
            <div className='p-8'>
                <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px] text-center md:text-start mb-6'>Welcome, {communityProfile?.personal.firstName}</h1>
                <EmptyEstateState />
            </div>
        );
    }
    return (
        <div className='mb-[150px]'>
            {openEstateList &&
                <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
                    <PickEstate />
                </CustomModal>
            }
            {estatesData && estatesData?.length > 0 && selectedCommunity ?
                <div className='p-8'>
                    <button onClick={() => setOpenEstateList(true)} className='md:hidden border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between w-full h-[48px] rounded-[4px] px-4 mb-4'>
                        <div className='flex gap-2 items-center'>
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                {selectedCommunity?.estate?.coverPhoto ?
                                    <Image
                                        src={selectedCommunity?.estate?.coverPhoto ? selectedCommunity?.estate?.coverPhoto?.url as string : ''}
                                        alt={"estate-img"}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    /> :
                                    <Image
                                        src={"/houses.jpg"}
                                        alt={"estate-img"}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                }
                            </div>
                            {selectedCommunity ? selectedCommunity?.estate?.basicDetails?.name : ''}
                        </div>
                        <div className='mt-1.5'>
                            <ArrowDown size={20} className='#4E4E4E' />
                        </div>
                    </button>
                    <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Welcome, {communityProfile?.personal.firstName}</h1>
                    <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Here’s what’s happening across your estate today.</h3>
                    <PermissionGuard action="read" subject="residents">
                        <div className='mt-8 bg-warningBg p-4 w-full max-w-[320px] rounded-[12px] border-l-[4px] border-[#DC6803] flex flex-col gap-10'>
                            <div className="flex justify-between">
                                <h3 className="font-[500] text-[14px] text-BlackHomz">Total Residents</h3>
                                <Link
                                    href={"/manage-resident/residents"}
                                    className="flex items-center"
                                >
                                    <h3 className=" text-[11px] font-[400] text-warning">
                                        view all
                                    </h3>
                                    <ArrowRight className='#DC6803' />
                                </Link>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className='flex flex-col'>
                                    <h1 className="text-BlackHomz font-[700] text-[36px]">
                                        {totalCount || 0}
                                    </h1>
                                    <h3 className="text-GrayHomz font-[500] text-[13px]">
                                        Residents
                                    </h3>
                                </div>
                                <div className="cursor-pointer flex flex-col items-end gap-2">
                                    <div onClick={() => router.push("/manage-resident/residents")}>
                                        <AddBlue className='#DC6803' />
                                    </div>
                                    <h3 className="text-[11px] font-[400] text-warning">
                                        Add Resident
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </PermissionGuard>
                    <PermissionGuard action="read" subject="access-control">
                        <div className={`mt-8 rounded-[12px] bg-[#F6F6F6] md:bg-white md:border md:border-[#E6E6E6] p-4 ${items ? "h-auto" : "h-[450px] md:h-[600px]"}`}>
                            <h3 className='text-sm font-medium text-GrayHomz'>Access Control</h3>
                            <div>
                                {pageLoading || accessInitialLoading ? (
                                    <div className='h-[300px] w-full flex items-center justify-center text-GrayHomz'><LoadingSpinner /></div>
                                ) : items.length > 0 ? (
                                    <AccessTable steps={0}
                                    />
                                ) :
                                    <div className='h-[90%] flex flex-col w-full items-center justify-center mt-10 md:mt-0'>
                                        <div className='bg-[#EEF5FF] hidden md:flex items-center justify-center h-[144px] w-[144px] rounded-full'>
                                            <RegisterTenantIcon />
                                        </div>
                                        <div className='bg-[#FFFFFF] md:hidden flex items-center justify-center h-[112px] w-[112px] rounded-full'>
                                            <RegisterTenantIconMobile />
                                        </div>
                                        <div className='flex flex-col gap-3 items-center mt-4'>
                                            <h1 className='text-[#141313] font-normal text-[16px]'>No Access Request</h1>
                                            <h3 className='text-[#141313] font-normal text-sm text-center'>There are currently no access requests across your estate. </h3>
                                            <button onClick={() => router.push("/access-control")} className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Register Visitor</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </PermissionGuard>
                </div> : null
            }
        </div>
    )
}

export default Dashboard