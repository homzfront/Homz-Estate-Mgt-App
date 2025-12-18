"use client"
import CustomModal from '@/components/general/customModal';
import DashboardIcon from '@/components/icons/estateManager&Resident/mobile/dashboardIcon';
import ProfileIcon from '@/components/icons/estateManager&Resident/mobile/profileIcon';
import MobileClose from '@/components/icons/estateManager&Resident/mobile/mobileClose';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import LogoutIcon from '@/components/icons/estateManager&Resident/mobile/logout';
import VisitorAccess from '@/components/icons/estateManager&Resident/mobile/visitorAccess';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import MoreIcon from '@/components/icons/estateManager&Resident/mobile/moreIcon'; import { useAuthSlice } from '@/store/authStore';

interface DataType {
    id: number;
    image: React.JSX.Element;
    image2: React.JSX.Element;
    link: string;
    name: string;
    extra: boolean;
}

const Data = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: (
            <DashboardIcon className='#006AFF' />
        ),
        link: "/resident/dashboard",
        name: "Dashboard",
        extra: false,
    },
    {
        id: 2,
        image: <VisitorAccess />,
        image2: (
            <VisitorAccess className='#006AFF' />
        ),
        link: "/resident/visitor-access",
        name: "Visitor Access",
        extra: false,
        comingSoon: false,
    },
    // {
    //     id: 3,
    //         image: <DuesAndPaymentIcon className="#202020" />,
    //         image2: (
    //             <DuesAndPaymentIcon className='#006AFF' />
    //         ),
    //         link: null,
    //         name: "Dues & Payments",
    //         extra: false,
    //         comingSoon: true,
    // },
    {
        id: 3,
        image: <DuesAndPaymentIcon className="#202020" />,
        image2: (
            <DuesAndPaymentIcon className='#006AFF' />
        ),
        link: "/resident/bills-payments",
        name: "Bills & Payments",
        extra: false,
        comingSoon: false,
    },
    {
        id: 4,
        image: <MoreIcon />,
        image2: <MoreIcon className='#006AFF' />,
        link: "",
        name: "More",
        extra: true,
    }
];

const PopUpData = [
    {
        id: 1,
        image: <ProfileIcon />,
        image2: <ProfileIcon className='#006AFF' />,
        link: "/resident/profile",
        name: "Profile"
    },
    {
        id: 2,
        image: <LogoutIcon />,
        image2: <LogoutIcon />,
        link: "",
        name: "Logout"
    }
];

const MobileFooter = () => {
    const pathname = usePathname();
    const [subOpen, setSubOpen] = React.useState<DataType | null>(null);
    const { logOutUser } = useAuthSlice();

    return (
        <>
            {subOpen && (
                <CustomModal onRequestClose={() => setSubOpen(null)} isOpen={subOpen?.extra}>
                    <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm -z-10' />
                    <div className='w-full max-w-[500px] mx-auto bg-white p-6 border border-[#E6E6E6] rounded-[12px] flex flex-col gap-6'>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm font-normal text-BlackHomz'>More</p>
                            <button onClick={() => setSubOpen(null)}>
                                <MobileClose />
                            </button>
                        </div>
                        <div className='grid grid-cols-2 justify-between gap-4 items-center'>
                            {PopUpData.map((data) => (
                                <Link
                                    href={data.link}
                                    key={data.id}
                                    className={`flex justify-center items-center rounded-[8px] p-2 h-[100px] w-[120px] ${data?.name !== "Logout" ? "bg-[#F6F6F6]" : "bg-[#FDF2F2]"
                                        } text-[13px] font-[500] ${pathname === data.link ? "text-BlueHomz" : "text-GrayHomz"
                                        }`}
                                >
                                    <span
                                        className={`flex flex-col gap-1 items-center truncate ${data?.name === "Logout" ? "text-error" : ""
                                            }`}
                                    >
                                        {pathname === data.link ? data.image2 : data.image}
                                        {data.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CustomModal>
            )}

            {/* Footer fixed at bottom */}
            {/* Footer fixed at bottom */}
            <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50 md:hidden'>
                {Data.map((data) => {
                    if (data.comingSoon) {
                        return (
                            <div
                                key={data.id}
                                className="flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] opacity-50 pointer-events-none"
                            >
                                <div>{data.image}</div>
                                <div className={`flex items-center w-full truncate`}>
                                    <span>{data.name}</span>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={data.id}
                            href={data?.link ? data.link : ""}
                            onClick={async  () => {
                                if (data?.extra) {
                                    setSubOpen(data as DataType)
                                } else if (data?.name === "Logout") {
                                    await logOutUser()
                                }
                            }}
                            className={`flex flex-col gap-2 justify-center items-center p-1 text-[11px] font-[400] ${data?.name === "Logout" ? "text-error" : ""
                                } ${pathname === data.link ? "text-BlueHomz" : "text-GrayHomz"}`}
                        >
                            <span className='h-5'>
                                {pathname === data.link ? data.image2 : data.image}
                            </span>
                            <div className={`flex items-center w-full truncate`}>
                                <span>{data.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

        </>
    );
};

export default MobileFooter;
