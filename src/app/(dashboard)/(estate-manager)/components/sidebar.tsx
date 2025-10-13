/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import EstateAddIcon from '@/components/icons/estateAddIcon';
import AccessControlIcon from '@/components/icons/estateManager&Resident/desktop/accessControlIcon';
// import BillAndUtiIcon from '@/components/icons/estateManager&Resident/desktop/billAndUtiIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
// import ExpensesIcon from '@/components/icons/estateManager&Resident/desktop/expensesIcon';
// import FinanceIcon from '@/components/icons/estateManager&Resident/desktop/financeIcon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import ManageResidentIcon from '@/components/icons/estateManager&Resident/desktop/manageResidentIcon';
// import ManageUserIcon from '@/components/icons/estateManager&Resident/desktop/manageUserIcon';
import MoreIcon from '@/components/icons/estateManager&Resident/desktop/moreIcon';
// import PaymentIcon from '@/components/icons/estateManager&Resident/desktop/paymentIcon';
// import ProfileIcon from '@/components/icons/estateManager&Resident/desktop/profileIcon';
// import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import Image from 'next/image';
import InitialsAvatar from '@/components/general/InitialsAvatar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import UserTick from '@/components/icons/userTick';

const Data = [
    {
        id: 1,
        image: <DashboardIcon />,
        image2: (
            <DashboardIcon className='#FFFFFF' />
        ),
        link: "/dashboard",
        name: "Dashboard",
        active: false,
    },
    {
        id: 2,
        image: <ManageResidentIcon />,
        image2: (
            <ManageResidentIcon className='#FFFFFF' classNameII='#FFFFFF' />
        ),
        name: "Residents",
        link: "#",
        active: false,
        submenu: true,
        coming_Soon: false,
        subMenuItems: [
            {
                title: "Manage Residents",
                link: "/manage-resident/residents",
                image: <ManageResidentIcon h='14' w='14' />,
                image2: (
                    <ManageResidentIcon h='14' w='14' className='#006AFF' classNameII='#006AFF' />
                ),
            },
            {
                title: "Join Requests",
                link: "/manage-resident/request",
                image2: <UserTick />,
                image: (
                    <UserTick color='#4E4E4E' />
                ),
            },
        ],
    },
    // {
    //     id: 3,
    //     image: <BillAndUtiIcon />,
    //     image2: (
    //         <BillAndUtiIcon className='#FFFFFF' />
    //     ),
    //     link: "/bill-utility",
    //     name: "Bills & Utilities",
    //     coming_Soon: true,
    //     active: false,
    // },
    {
        id: 4,
        image: <AccessControlIcon />,
        image2: <AccessControlIcon className='#FFFFFF' />,
        link: "/access-control",
        name: "Access Control",
        active: false,
    },
    // {
    //     id: 5,
    //     image: <FinanceIcon />,
    //     image2: (
    //         <FinanceIcon className='#FFFFFF' />
    //     ),
    //     link: "#",
    //     name: "Finance",
    //     coming_Soon: true,
    //     active: false,
    //     submenu: true,
    //     subMenuItems: [
    //         {
    //             title: "Payments",
    //             link: "/finance/payment",
    //             image: <PaymentIcon />,
    //             image2: <PaymentIcon className='#006AFF' />,
    //         },
    //         {
    //             title: "Expenses",
    //             link: "/finance/expense",
    //             image: <ExpensesIcon />,
    //             image2: <ExpensesIcon className='#006AFF' />,
    //         },
    //     ],
    // },
    // {
    //     id: 6,
    //     image: <ManageUserIcon />,
    //     image2: (
    //         <ManageUserIcon className='#FFFFFF' classNameII='#FFFFFF' />
    //     ),
    //     link: "/manage-users",
    //     name: "Manage Users",
    //     active: false,
    //     coming_Soon: true,
    // },
    // {
    //     id: 7,
    //     image: <SupportIcon />,
    //     image2: (
    //         <SupportIcon className='#FFFFFF' />
    //     ),
    //     link: "/support",
    //     name: "Support",
    //     active: false,
    // },
];

const More = [
    {
        id: 1,
        image: <MoreIcon />,
        image2: (
            <MoreIcon className='#FFFFFF' classNameII='#FFFFFF' />
        ),
        link: "#",
        name: "More",
        active: false,
        submenu: true,
        subMenuItems: [
            // {
            //     title: "Profile",
            //     link: "/profile",
            //     image: <ProfileIcon />,
            //     image2: <ProfileIcon className='#006AFF' />,
            // },
            // {
            //     title: "Settings",
            //     link: "/settings",
            //     image: <SettingsIcon />,
            //     image2: <SettingsIcon className='#006AFF' />,
            // },
            {
                title: "Logout",
                link: "#",
                image: <LogoutIcon />,
                image2: <LogoutIcon />,
            },
        ],
    },
]


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [subOpen, setSubOpen] = React.useState(false);
    const [subMoreOpen, setSubMoreOpen] = React.useState(false);
    const { setOpenEstateList } = useOpenCommunityListStore();
    const [selectedName, setSelecetedName] = React.useState(null);
    const { clearForm } = useEstateFormStore()
    const { logOutUser, estatesData, communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const setSelectedCommunity = useSelectedCommunity((state) => state.setSelectedCommunity);

    React.useEffect(() => {
        if (!selectedCommunity && estatesData && estatesData.length > 0) {
            setSelectedCommunity(estatesData[0]?.estate); // default first estate
        }
    }, [selectedCommunity, estatesData, setSelectedCommunity]);

    // Note: getEstates() is now called automatically in getCommunityManaProfile()

    const [selectedMoreName, setSelecetedMoreName] = React.useState(null);
    const toggleSub = (name: any) => {
        setSubOpen(!subOpen);
        setSelecetedName(name);
    };

    const toggleSubMore = (name: any) => {
        setSubMoreOpen(!subMoreOpen);
        setSelecetedMoreName(name);
    };

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

                    {estatesData && estatesData?.length > 0 && selectedCommunity &&
                        <button onClick={() => setOpenEstateList(true)} className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[48px] rounded-[4px]'>
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white">
                                    {selectedCommunity?.coverPhoto ? (
                                        <Image
                                            src={selectedCommunity?.coverPhoto ? (selectedCommunity?.coverPhoto?.url as string) : ""}
                                            alt={"estate-img"}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <InitialsAvatar
                                            name={(selectedCommunity?.basicDetails?.name as string) || 'Estate'}
                                            size={24}
                                        />
                                    )}
                                </div>
                                {selectedCommunity ? selectedCommunity?.basicDetails?.name : ""}
                            </div>
                            <div className='mt-1.5'>
                                <ArrowDown size={20} className='#4E4E4E' />
                            </div>
                        </button>
                    }
                    {(communityProfile && estatesData?.length === 0) &&
                        <button onClick={() => {
                            clearForm()
                            router.push("/add-estate")
                        }} className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-BlueHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[48px] rounded-[4px]'>
                            <span className='flex gap-4 items-center'><EstateAddIcon /> Add New Estate</span> <AddIcon />
                        </button>
                    }
                    <div className="flex flex-col gap-3 mb-[50px] mt-10">
                        {Data.map((data) =>
                            data.submenu ? (
                                <div key={data.id}>
                                    <button
                                        onClick={() => {
                                            if (!data.coming_Soon) {
                                                toggleSub(data.name);
                                            }
                                        }}
                                        className="w-full text-left"
                                    >
                                        <Link
                                            href={data.link}
                                            className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} relative h-[40px] px-2 flex items-center rounded-md gap-3 text-[16px] font-[500] 
                                                    ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                                    `}
                                        >
                                            {/* Icon */}
                                            <span>{isActive(data, pathname) ? data.image2 : data.image}</span>

                                            {/* Name and Arrow */}
                                            <div className="flex items-center justify-between flex-1">
                                                <span className="text-start">{data.name}  {data?.coming_Soon && <span className='absolute top-3 right-8 text-xs text-Success italic font-normal'>coming soon!</span>}
                                                </span>

                                                {/* Arrow - rotates only if this item is open */}
                                                <div className={`transition-transform ${subMoreOpen ? "rotate-180" : ""}`}>
                                                    {isActive(data, pathname) ? (
                                                        <ArrowDown className="#FFFFFF" />
                                                    ) : (
                                                        <ArrowDown className="#4E4E4E" />
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </button>
                                    {subOpen && selectedName === data.name && (
                                        <div className="flex items-center space-x-7 ml-[20px]">
                                            <hr
                                                style={{
                                                    width: "1.5px",
                                                    height: "106px",
                                                    borderWidth: "0",
                                                    background: "#4E4E4E",
                                                }}
                                            />
                                            <div className="my-2 flex flex-col space-y-4 w-full">
                                                {data.subMenuItems?.map((subItem, idx) => {
                                                    return (
                                                        <Link
                                                            key={idx}
                                                            href={subItem.link}
                                                            className={`flex flex-row space-x-2 items-center p-1 rounded-md hover:bg-whiteblue px-2 ${subItem.link === pathname
                                                                ? "text-BlueHomz"
                                                                : "text-GrayHomz"
                                                                }`}
                                                        >
                                                            <div
                                                                className={`flex flex-row items-center gap-[12px] 
                                                                         ${subItem.link === "" &&
                                                                    "pointer-events-none opacity-50"
                                                                    }`}
                                                            >
                                                                {subItem.link === pathname ? (
                                                                    <>{subItem.image2}</>
                                                                ) : (
                                                                    <>{subItem.image}</>
                                                                )}
                                                                <span className=" text-[13px] font-[500] leading-[20px] text-left">
                                                                    {subItem.title}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={data.id}
                                    href={data.link}
                                    className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} relative h-[40px] px-2 flex justify-center items-center rounded-md gap-[12px] text-GrayHomz text-[16px] font-[500] ${pathname === data.link
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
                                            {data?.coming_Soon && <span className='absolute top-3 right-0 text-xs text-Success italic font-normal'>coming soon!</span>}
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
                    <div className='flex flex-col gap-3 mb-[50px] mt-10 max-w-[230px]'>
                        {More.map((data) =>
                        (
                            <div key={data.id}>
                                <button onClick={() => toggleSubMore(data.name)} className="w-full text-left">
                                    <Link
                                        href={data.link}
                                        className={`h-[40px] px-2 flex items-center rounded-md gap-3 text-[16px] font-[500] 
                                                    ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                                    `}
                                    >
                                        {/* Icon */}
                                        <span>{isActive(data, pathname) ? data.image2 : data.image}</span>

                                        {/* Name and Arrow */}
                                        <div className="flex items-center justify-between flex-1">
                                            <span className="text-start">{data.name}</span>

                                            {/* Arrow - rotates only if this item is open */}
                                            <div className={`transition-transform ${subMoreOpen ? "rotate-180" : ""}`}>
                                                {isActive(data, pathname) ? (
                                                    <ArrowDown className="#FFFFFF" />
                                                ) : (
                                                    <ArrowDown className="#4E4E4E" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </button>

                                {subMoreOpen && selectedMoreName === data.name && (
                                    <div className="flex items-center space-x-7 ml-[20px]">
                                        <hr
                                            style={{
                                                width: "1.5px",
                                                height: "30px",
                                                borderWidth: "0",
                                                background: "#4E4E4E",
                                            }}
                                        />
                                        <div className="my-2 flex flex-col space-y-4 w-full">
                                            {data.subMenuItems?.map((subItem, idx) => {
                                                return (
                                                    <Link
                                                        key={idx}
                                                        onClick={async () => {
                                                            if (subItem?.title === "Logout") {
                                                                await logOutUser()
                                                            }
                                                        }}
                                                        href={subItem.link}
                                                        className={`flex flex-row space-x-2 items-center p-1 rounded-md hover:bg-whiteblue px-2 ${subItem.link === pathname
                                                            ? "text-BlueHomz" :
                                                            subItem.title === "Logout" ? "text-error" : "text-GrayHomz"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`flex flex-row items-center gap-[12px]`}
                                                        >
                                                            {subItem.link === pathname ? (
                                                                <>{subItem.image2}</>
                                                            ) : (
                                                                <>{subItem.image}</>
                                                            )}
                                                            <span className=" text-[13px] font-[500] leading-[20px] text-left">
                                                                {subItem.title}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar