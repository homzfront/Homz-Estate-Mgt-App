/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import InitialsAvatar from '@/components/general/InitialsAvatar'
import ArrowRight from '@/components/icons/arrowRight'
import BlueSearch from '@/components/icons/blueSearch'
import EstateInfoIcon from '@/components/icons/estateInfoIcon'
// import ContactIcon from '@/components/icons/estateManager&Resident/desktop/contactIcon'
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon'
// import SecurityIcon from '@/components/icons/estateManager&Resident/desktop/securityIcon'
import { useAuthSlice } from '@/store/authStore'
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore'
import { useResidentCommunity } from '@/store/useResidentCommunity'
import { useSelectedEsate } from '@/store/useSelectedEstate'
// import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PickEstateProps {
    closeRef?: any;
    setOpenPendingModal?: (data: boolean) => void;
}

const PickEstate = ({ closeRef, setOpenPendingModal }: PickEstateProps) => {
    const router = useRouter();
    const { logOutUser } = useAuthSlice();
    const [hoverEstate, setHoverEstate] = React.useState<boolean>(false);
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
    const [searchEstate, setSearchEstate] = React.useState<string>('');
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const [hoverLogout, setHoverLogout] = React.useState<boolean>(false);
    // const [hoverContactSupport, setHoverContactSupport] = React.useState<boolean>(false);
    // const [hoverSecurity, setHoverSecurity] = React.useState<boolean>(false);
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
    const residentCommunity = useResidentCommunity((state) => state.residentCommunity);
    const { setOpenEstateList: closeSideBar } = useOpenCommunityListStore();
    return (
        <div ref={closeRef} className={`p-4 rounded-[12px] bg-white ${openEstateList ? "md:w-[320px]" : "md:w-[270px]"}  min-w-[260px] mt-[120px] mb-[50px] md:mt-0 md:mb-0`}>
            {!openEstateList ?
                <div>
                    <div className='bg-inputBg rounded-[12px] p-3'>
                        <div className='flex gap-2 items-start w-full'>
                            <div className="min-w-[40px] w-10 h-10 rounded-full overflow-hidden">
                                <InitialsAvatar
                                    name={(selectedEstate?.estateName) || 'Estate'}
                                />
                            </div>
                            <div className='flex flex-col gap-1 w-full'>
                                <span className='text-sm font-medium text-GrayHomz truncate'>{selectedEstate ? selectedEstate?.estateName : ''}</span>
                                {/* <span className='text-[11px] font-normal text-GrayHomz truncate'>{selectedEstate ? `${selectedEstate.building}, ${selectedEstate.apartmentName}` : `${option?.[0].building}, ${option?.[0].apartmentName}`}</span> */}
                                <div className='mt-2 flex items-center justify-between w-full'>
                                    <button onClick={() => router.push(`/resident/estate-info/${selectedEstate ? selectedEstate?.estateName : ''}`)} className='text-[13px] font-normal text-BlueHomz flex items-center gap-2'><EstateInfoIcon /> Estate Information </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col mt-4'>
                        <button onClick={() => setOpenEstateList(true)} onMouseEnter={() => setHoverEstate(true)} onMouseLeave={() => setHoverEstate(false)} className='text-GrayHomz text-sm font-normal px-4 py-2 hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start flex w-full justify-between items-center'>Estate {hoverEstate ? <ArrowRight className='#006AFF' /> : <ArrowRight className='#4E4E4E' />}</button>
                        {/* <button onClick={() => router.push("/resident/profile")} className='text-GrayHomz text-sm font-normal px-4 py-2 hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start'>Profile</button> */}
                        <div className='my-1 border-b border-[#E6E6E6]' />


                        <div className='text-sm font-normal text-GrayHomz w-full'>
                            {/* <button
                                onClick={() => {
                                    router.push("/resident/security")
                                }}
                                onMouseLeave={() => setHoverSecurity(false)}
                                onMouseEnter={() => setHoverSecurity(true)}
                                className='text-GrayHomz text-sm font-normal px-4 py-2 w-full hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start flex items-center gap-4'
                            >
                                {hoverSecurity ? <SecurityIcon className='#006aff' /> : <SecurityIcon className='#4e4e4e' />} Security
                            </button>
                            <button onMouseLeave={() => setHoverContactSupport(false)} onMouseEnter={() => setHoverContactSupport(true)} className='text-GrayHomz text-sm font-normal px-4 py-2 w-full hover:bg-whiteblue hover:text-BlueHomz hover:rounded-[4px] text-start flex items-center gap-4'>{hoverContactSupport ? <ContactIcon className='#006aff' /> : <ContactIcon className='#4e4e4e' />} Contact Support</button> */}
                            <button
                                onClick={async () => {
                                    await logOutUser()
                                }}
                                onMouseLeave={() => setHoverLogout(false)}
                                onMouseEnter={() => setHoverLogout(true)}
                                className='text-GrayHomz text-sm font-normal px-4 py-2 w-full hover:bg-whiteblue hover:text-error hover:rounded-[4px] text-start flex items-center gap-4'
                            >{hoverLogout ? <LogoutIcon /> : <LogoutIcon className='#4e4e4e' />}
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search estate"
                            className="w-full h-[45px] pl-10 pr-4 outline-none border border-GrayHomz2 rounded-md text-sm placeholder:text-GrayHomz2 placeholder:text-xs"
                            value={searchEstate}
                            onChange={(e) => setSearchEstate(e.target.value)}
                            autoFocus
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <BlueSearch />
                        </div>
                    </div>
                    <div className='max-h-[50vh] scrollbar-container overflow-y-auto pr-1'>
                        {residentCommunity && residentCommunity?.filter((item) => item.estateName.toLowerCase().includes(searchEstate.toLowerCase())).map((item) => (
                            <div key={item._id} className='flex items-center justify-between gap-2 py-3'>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-BlackHpmz'>{item.estateName}</span>
                                    {/* <span className='text-[11px] font-normal text-GrayHomz'>{item.building}, {item.apartmentName}</span> */}
                                </div>
                                <div
                                    onClick={() => {
                                        if (item?.status === "pending" && setOpenPendingModal) {
                                            setOpenPendingModal(true)
                                            closeSideBar(false);
                                        }
                                        else if (selectedEstate?._id === item._id) {
                                            setOpenEstateList(false);
                                        } else {
                                            setSelectedEstate(item);
                                            setOpenEstateList(false);
                                        }
                                    }}
                                    className={`px-2 py-1 text-xs flex gap-2 items-center rounded-[4px] cursor-pointer
                                               ${item?.status === "pending" ? "text-warning2 bg-warningBg" : selectedEstate?._id === item._id ? "text-GrayHomz2 bg-GrayHomz6" : "text-BlueHomz bg-whiteblue"}`}
                                >
                                    {item?.status === "pending" ? "Pending Approval" : selectedEstate?._id === item._id ? "Selected" : "Switch"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default PickEstate