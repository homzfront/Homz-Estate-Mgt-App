/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import EstateAddIcon from '@/components/icons/estateAddIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import ProfileIcon from '@/components/icons/estateManager&Resident/desktop/profileIcon';
import SupportIcon from '@/components/icons/estateManager&Resident/desktop/supportIcon';
import { useUserStore } from '@/store/useUserStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import PickEstate from '../../components/pickEstate';
import useClickOutside from '@/app/utils/useClickOutside';
import VisitorShield from '@/components/icons/estateManager&Resident/desktop/visitorShield';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';

const Data = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: (
            <DashboardIcon className='#FFFFFF' />
        ),
        link: "/resident/dashboard",
        name: "Dashboard",
        active: false,
    },
    {
        id: 2,
        image: <VisitorShield />,
        image2: (
            <VisitorShield className='#FFFFFF' />
        ),
        link: "/resident/visitor-access",
        name: "Visitor Access",
        active: false,
    },
    {
        id: 3,
        image: <DuesAndPaymentIcon />,
        image2: (
            <DuesAndPaymentIcon className='#FFFFFF' />
        ),
        link: "/resident/dues-payments",
        name: "Dues & Payments",
        active: false,
    },
    {
        id: 4,
        image: <SupportIcon />,
        image2: (
            <SupportIcon className='#FFFFFF' />
        ),
        link: "/resident/support",
        name: "Support",
        active: false,
    },
];

const More = [
    {
        id: 1,
        title: "Profile",
        link: "/resident/profile",
        name: "Profile",
        image: <ProfileIcon />,
        image2: <ProfileIcon className='#FFFFFF' />,
        active: false,
    },
    {
        id: 2,
        title: "Logout",
        link: "#",
        name: "Logout",
        image: <LogoutIcon className="#4E4E4E" />,
        image2: <LogoutIcon />,
        active: false,
    },
];


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);
    const closeRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });

    const userData = useUserStore((state) => state.userData);

    const isActive = (data: any, pathname: string) => {
        // 1. First check if the full path matches exactly
        if (data.link === pathname) return true;

        // 2. If no exact match, check the base path (without the last segment)
        const basePath = pathname.split('/').slice(0, -1).join('/');

        if (data.link === basePath) return true;

        // 3. Check submenu items (full path first, then base path)
        if (data.submenu && data.subMenuItems) {
            return data.subMenuItems.some((item: any) =>
                item.link === pathname || item.link === basePath
            );
        }
        return false;
    };
    return (
        <div className="sidebar relative">
            {openEstateList && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-start">
                    <div className="w-full h-fit mt-[12%] ml-[2%] shadow-lg">
                        <PickEstate closeRef={closeRef} />
                    </div>
                </div>
            )}

            <div className="shadow-lg">
                <div className="w-full h-[1024px] px-6 flex flex-col py-10">
                    <Link href={"/"} className='w-full mt-2'>
                        <Image
                            height={27}
                            width={131}
                            src="/Homz-pc-icon.png"
                            alt='homz-pix'
                        />
                    </Link>

                    {userData ?
                        <button onClick={() => setOpenEstateList(true)} className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[48px] rounded-[4px]'>
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
                        : <button onClick={() => router.push("/add-estate")} className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-BlueHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[48px] rounded-[4px]'>
                            <span className='flex gap-4 items-center'><EstateAddIcon /> Add New Estate</span> <AddIcon />
                        </button>
                    }
                    <div className="flex flex-col gap-3 mb-[50px] mt-10">
                        {Data.map((data) =>
                        (
                            <Link
                                key={data.id}
                                href={data.link}
                                className={`h-[40px] px-2 flex justify-center items-center rounded-md gap-[12px] text-GrayHomz text-[16px] font-[500] ${pathname === data.link
                                    ? "bg-BlueHomz text-white"
                                    : " hover:bg-whiteblue"
                                    } `}
                            >
                                {pathname === data.link ? (
                                    <div className={``}>
                                        {data.image2}
                                    </div>
                                ) : (
                                    <div className={``}>
                                        {data.image}
                                    </div>
                                )}
                                <div className="flex items-center w-full">
                                    <span className="w-[150px] text-start">{data.name}
                                        {/* {data?.coming_Soon && <span className='text-xs text-Success italic font-normal'>coming soon!</span>} */}
                                    </span>
                                    <p
                                        className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                            } mt-1 ml-1 h-2 w-2 rounded-full`}
                                    ></p>
                                </div>
                            </Link>
                        )
                        )}
                    </div>
                    <div className='flex flex-col gap-3 mb-[50px] mt-[80%] max-w-[230px]'>
                        {More.map((data) =>
                        (
                            <div key={data.id}>
                                <button className="w-full text-left">
                                    <Link
                                        href={data.link}
                                        className={`h-[40px] px-2 flex items-center rounded-md gap-3 text-[16px] font-[500] 
                                                ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                                `}
                                    >
                                        {/* Icon */}
                                        <span>{isActive(data, pathname) ? data.image2 : data.image}</span>

                                        {/* Name */}
                                        <div className="flex items-center justify-between flex-1">
                                            <span className="text-start">{data.name}</span>
                                            <div />
                                        </div>
                                    </Link>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar