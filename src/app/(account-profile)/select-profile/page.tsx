/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import CustomModal from '@/components/general/customModal';
import ArrowRightSolid from '@/components/icons/arrowRightSolid';
import EstateManagement from '@/components/icons/estateManagement';
import LockIcon from '@/components/icons/lockIcon';
import Resident from '@/components/icons/resident';
import { useRouter } from 'next/navigation';
import React from 'react'

const SelectProfile = () => {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    const data = [
        {
            id: 1,
            text: "Monitor community-wide activities, handle visitor access for residents, & more.",
            header: "Community Manager",
            image: <EstateManagement />,
            imageII: ({ hover }: any) => <EstateManagement className={hover ? "#FF8C00" : "#DC6803"} classNameII={hover ? "#FFFAF0" : "white"} />,
            link: "/estate-form",
            hoverBorderColor: "#DC6803", // Orange for Community Manager
            hoverBgColor: "bg-orange-50"
        },
        {
            id: 2,  // Changed id to be unique
            text: "As a resident, pay community dues, and request visitor access in one place.",
            header: "Resident",
            image: <Resident />,
            imageII: ({ hover }: any) => <Resident className={hover ? "#df2b1eff" : "#D92D20"} classNameII={hover ? "#FFF5F5" : "white"} />,
            hoverBorderColor: "#D92D20", // Red for Resident
            hoverBgColor: "bg-red-50" // Light red background on hover
        }
    ];

    return (
        <div className="min-h-screen">
            <CustomModal isOpen={openModal} onRequestClose={() => setOpenModal(false)}>
                <div className={`p-5 rounded-[12px] bg-white flex flex-col justify-center items-center gap-3`}>
                    <LockIcon />
                    <h1 className='text-BlackHomz text-[20px] font-semibold text-center'>An invitation is required to continue</h1>
                    <p className='text-GrayHomz text-[16px] font-normal text-center'>
                        Please notify your community manager to send you an invite link. Once you receive the invite, click the link to resume your onboarding
                    </p>
                </div>
            </CustomModal>
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[60px] px-[24px]'>
                <div className='w-full flex justify-center items-center'>
                    <span className='text-[23px] text-center md:text-auto md:text-[36px] font-semibold text-[#FFFFFF]'> How Would You Like To Use Homz?</span>
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-6 py-8 mt-14 w-full">
                <div className="w-full">
                    <div className="mb-8 w-full">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.map((data) => (
                                <div
                                    key={data.id}
                                    onMouseEnter={() => setHoveredCard(data.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`w-full flex gap-4 items-center rounded-[8px] p-8 transition-all duration-300 border`}
                                    style={{
                                        borderColor: hoveredCard === data.id ? data.hoverBorderColor : 'transparent',
                                        borderWidth: hoveredCard === data.id ? '2px' : '1px',
                                        backgroundColor: hoveredCard === data.id ? (data.hoverBgColor || 'inherit') : 'inherit'
                                    }}
                                >
                                    <div>
                                        <div className="group relative">
                                            {data ? (
                                                <div className="group-hover:hidden">
                                                    {data.image}
                                                </div>
                                            ) : null}
                                            {data.imageII && (
                                                <div className="hidden group-hover:block">
                                                    {data.imageII({ hover: true })}
                                                </div>
                                            )}
                                        </div>
                                        <h1 className='mt-4 text-BlackHomz font-semibold text-[20px]'>{data.header}</h1>
                                        <p className='mt-1 text-[#4E4E4E] font-normal text-[16px]'>{data.text}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (data.link) { router.push(`${data.link}`) }
                                            else {
                                                setOpenModal(true);
                                            }
                                        }}
                                        className='cursor-pointer'
                                    >
                                        <ArrowRightSolid />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectProfile