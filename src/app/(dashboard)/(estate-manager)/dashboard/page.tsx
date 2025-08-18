"use client"
import AddBlue from '@/components/icons/addBlue';
import AddIcon from '@/components/icons/addIcon';
import ArrowRight from '@/components/icons/arrowRight';
import EmptyEstateIcon from '@/components/icons/estateManager&Resident/desktop/emptyEstateIcon';
import RegisterTenantIcon from '@/components/icons/estateManager&Resident/desktop/registerTenantIcon';
import RegisterTenantIconMobile from '@/components/icons/estateManager&Resident/mobile/registerTenantIcon';
import EmptyEstateIconMobile from '@/components/icons/estateManager&Resident/mobile/emptyEstateIconMobile';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import Table from './components/table';
import ArrowDown from '@/components/icons/arrowDown';
import Image from 'next/image';
import CustomModal from '@/components/general/customModal';
import PickEstate from '../components/pickEstate';
import { useAuthSlice } from '@/store/authStore';
import api from '@/utils/api';
// import { useAuthSlice } from '@/store/authStore';

const Dashboard = () => {
    const [data, setData] = React.useState<boolean>(false)
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const router = useRouter();
    const { setEstatesData, estatesData, communityProfile, getCommunityManaProfile } = useAuthSlice();

    const getEstates = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/estates/all-estates/${communityProfile?.organization
                ?._id}/${communityProfile?._id}`)
            setEstatesData(response?.data?.data?.estates);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    // Load state 
    React.useEffect(() => {
        getCommunityManaProfile()
    }, []);


    React.useEffect(() => {
        getEstates()
    }, [communityProfile]);

    console.log(communityProfile);
    console.log(estatesData)
    return (
        <div className='mb-[150px]'>
            {openEstateList &&
                <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
                    <PickEstate />
                </CustomModal>
            }
            {loading ?
                <div>Loading...</div> :
                estatesData ?
                    <div className='p-8'>
                        <button onClick={() => setOpenEstateList(true)} className='md:hidden border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between w-full h-[48px] rounded-[4px] px-4 mb-4 onClick={()=> setOpenEsateList(true)}'>
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                        src={"/houses.jpg"}
                                        alt={"estate-img"}
                                        width={24}
                                        height={24}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                Golden Palms Estate
                            </div>
                            <div className='mt-1.5'>
                                <ArrowDown size={20} className='#4E4E4E' />
                            </div>
                        </button>
                        <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Welcome, Victor</h1>
                        <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Here’s what’s happening across your estate today.</h3>
                        <div className='mt-8 bg-warningBg p-4 w-full max-w-[320px] rounded-[12px] border-l-[4px] border-[#DC6803] flex flex-col gap-10'>
                            <div className="flex justify-between">
                                <h3 className="font-[500] text-[14px] text-BlackHomz">Total Residents</h3>
                                <Link
                                    href={"/"}
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
                                        0
                                    </h1>
                                    <h3 className="text-GrayHomz font-[500] text-[13px]">
                                        Residents
                                    </h3>
                                </div>
                                <div className="cursor-pointer flex flex-col items-end gap-2">
                                    <div>
                                        <AddBlue className='#DC6803' />
                                    </div>
                                    <h3 className="text-[11px] font-[400] text-warning">
                                        Add Resident
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-8 rounded-[12px] bg-[#F6F6F6] md:bg-white md:border md:border-[#E6E6E6] p-4 ${data ? "h-auto" : "h-[450px] md:h-[600px]"}`}>
                            <h3 className='text-sm font-medium text-GrayHomz'>Access Control</h3>
                            {
                                data ?
                                    <div>
                                        <Table />
                                    </div>
                                    :
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
                                            <button onClick={() => setData(true)} className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Register Visitor</button>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    :
                    <div className='p-8'>
                        <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Welcome, Victor</h1>
                        <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Add a new estate to get started</h3>
                        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='hidden md:flex w-[144px] h-[144px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                    <EmptyEstateIcon />
                                </div>
                                <div className='md:hidden w-[112px] h-[112px] rounded-full bg-[#EEF5FF] flex justify-center items-center'>
                                    <EmptyEstateIconMobile />
                                </div>
                                <p className='text-[#141313] font-medium text-sm md:text-[16px]'>Add New Estate to Get Started</p>
                                <button onClick={() => router.push("/add-estate")} className='text-BlueHomz cursor-ponter text-sm font-normal flex items-center gap-1'>
                                    <AddIcon /> Add Estate
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Dashboard