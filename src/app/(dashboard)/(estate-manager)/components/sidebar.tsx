/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import EstateAddIcon from '@/components/icons/estateAddIcon';
import AccessControlIcon from '@/components/icons/estateManager&Resident/desktop/accessControlIcon';
import BillAndUtiIcon from '@/components/icons/estateManager&Resident/desktop/billAndUtiIcon';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
// import ExpensesIcon from '@/components/icons/estateManager&Resident/desktop/expensesIcon';
import FinanceIcon from '@/components/icons/estateManager&Resident/desktop/financeIcon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import ManageResidentIcon from '@/components/icons/estateManager&Resident/desktop/manageResidentIcon';
// import ManageUserIcon from '@/components/icons/estateManager&Resident/desktop/manageUserIcon';
import MoreIcon from '@/components/icons/estateManager&Resident/desktop/moreIcon';
// import PaymentIcon from '@/components/icons/estateManager&Resident/desktop/paymentIcon';
// import ProfileIcon from '@/components/icons/estateManager&Resident/desktop/profileIcon';
import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import Image from 'next/image';
import InitialsAvatar from '@/components/general/InitialsAvatar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useAuthSlice } from '@/store/authStore';
import LogoutConfirmationModal from '@/components/general/LogoutConfirmationModal';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import UserTick from '@/components/icons/userTick';
import { useAbility } from '@/contexts/AbilityContext';
import { useSidebarStore } from '@/store/useSidebarStore';
import { Subjects } from '@/utils/ability';
// import FinanceIcon from '@/components/icons/estateManager&Resident/desktop/financeIcon';
// import ExpensesIcon from '@/components/icons/estateManager&Resident/mobile/expensesIcon';
// import PaymentIcon from '@/components/icons/estateManager&Resident/desktop/paymentIcon';

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
    {
        id: 5,
        image: <FinanceIcon />,
        image2: (
            <FinanceIcon className='#FFFFFF' />
        ),
        link: "#",
        name: "Finance",
        coming_Soon: false,
        active: false,
        submenu: true,
        subMenuItems: [
            {
                title: "Estate Billing",
                link: "/finance/bill-utility",
                image: <BillAndUtiIcon className='#4E4E4E' />,
                image2: <BillAndUtiIcon />,
            },
            // {
            //     title: "Payments",
            //     link: "/finance/payment",
            //     image: <PaymentIcon />,
            //     image2: <PaymentIcon className='#006AFF' />,
            // },
        ],
    },
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
            {
                title: "Settings",
                link: "/settings",
                image: <SettingsIcon />,
                image2: <SettingsIcon className='#006AFF' />,
            },
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
    const { openEstateList, setOpenEstateList } = useOpenCommunityListStore();
    const [selectedName, setSelecetedName] = React.useState(null);
    const { clearForm } = useEstateFormStore()
    const { logOutUser, estatesData, communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const ability = useAbility();
    const { isCollapsed, toggleCollapsed } = useSidebarStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    // Breadcrumbs for minimap
    // const breadcrumbs = pathname.split('/').filter(Boolean).map((path) => {
    //     return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    // });

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

    // Filter menu items based on permissions
    const filteredData = Data.filter(item => {
        const subject = item.name.toLowerCase().replace(' ', '-') as Subjects;
        return ability.can('read', subject);
    });

    const filteredMore = More.map(section => ({
        ...section,
        subMenuItems: section.subMenuItems?.filter(subItem => {
            if (subItem.title.toLowerCase() === 'settings') {
                return ability.can('read', 'settings');
            }
            return true; // Always show logout
        })
    })).filter(section =>
        section.subMenuItems && section.subMenuItems.length > 0
    );

    return (
        <div className={`sidebar relative border-r border-[#E6E6E6] bg-white ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`shadow-sm h-full ${openEstateList ? 'overflow-visible' : 'overflow-y-auto scrollbar-container-small'}`}>
                <div className={`w-full min-h-screen ${isCollapsed ? 'px-2' : 'px-6'} flex flex-col py-10 transition-all duration-300`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 mt-2`}>
                        {!isCollapsed && (
                            <Link href={"/"} className='w-full'>
                                <Image
                                    height={27}
                                    width={131}
                                    src="/Homz-pc-icon.png"
                                    alt='homz-pix'
                                />
                            </Link>
                        )}
                        {isCollapsed && (
                            <Link href={"/"} className='flex items-center justify-center'>
                                <Image
                                    height={32}
                                    width={32}
                                    src="/icons/apple-icon-180.png"
                                    alt='homz-icon'
                                />
                            </Link>
                        )}
                        <button
                            onClick={toggleCollapsed}
                            className={`hidden md:flex items-center justify-center p-1.5 rounded-full hover:bg-whiteblue text-GrayHomz transition-colors`}
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            >
                                <polyline points="11 17 6 12 11 7" />
                                <polyline points="18 17 13 12 18 7" />
                            </svg>
                        </button>
                    </div>

                    {estatesData && estatesData?.length > 0 && selectedCommunity &&
                        <button
                            onClick={() => setOpenEstateList(true)}
                            className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}
                        >
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0">
                                    {selectedCommunity?.estate?.coverPhoto ? (
                                        <Image
                                            src={selectedCommunity?.estate?.coverPhoto ? (selectedCommunity?.estate?.coverPhoto?.url as string) : ""}
                                            alt={"estate-img"}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <InitialsAvatar
                                            name={(selectedCommunity?.estate?.basicDetails?.name as string) || 'Estate'}
                                            size={24}
                                        />
                                    )}
                                </div>
                                {!isCollapsed && (selectedCommunity ? selectedCommunity?.estate?.basicDetails?.name : "")}
                            </div>
                            {!isCollapsed && (
                                <div className='mt-1.5'>
                                    <ArrowDown size={20} className='#4E4E4E' />
                                </div>
                            )}
                        </button>
                    }
                    {(communityProfile && estatesData?.length === 0) && ability.can('create', 'estate') &&
                        <button onClick={() => {
                            clearForm()
                            router.push("/add-estate")
                        }} className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-BlueHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}>
                            <span className='flex gap-4 items-center'><EstateAddIcon /> {!isCollapsed && "Add New Estate"}</span> {!isCollapsed && <AddIcon />}
                        </button>
                    }

                    {/* Visual Minimap / Breadcrumbs (Desktop Only) */}
                    {/* {!isCollapsed && breadcrumbs.length > 0 && (
                        <div className="mt-6 px-1 flex flex-wrap items-center gap-1 text-[11px] text-GrayHomz2 overflow-hidden">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <span className={index === breadcrumbs.length - 1 ? "text-BlueHomz font-medium truncate" : "truncate"}>
                                        {crumb}
                                    </span>
                                    {index < breadcrumbs.length - 1 && (
                                        <span className="text-[10px]">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )} */}

                    <div className="flex flex-col gap-3 mb-[50px] mt-10 transition-all duration-300">
                        {filteredData.map((data) =>
                            data.submenu ? (
                                <div key={data.id}>
                                    <button
                                        onClick={() => {
                                            if (!data.coming_Soon && !isCollapsed) {
                                                toggleSub(data.name);
                                            }
                                        }}
                                        className="w-full text-left"
                                        title={isCollapsed ? data.name : ""}
                                    >
                                        <Link
                                            href={(isCollapsed && data.subMenuItems && data.subMenuItems.length > 0) ? data.subMenuItems[0].link : data.link}
                                            className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} relative h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] 
                                                    ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                                    `}
                                        >
                                            {/* Icon */}
                                            <span>{isActive(data, pathname) ? data.image2 : data.image}</span>

                                            {/* Name and Arrow */}
                                            {!isCollapsed && (
                                                <div className="flex items-center justify-between flex-1">
                                                    <span className="text-start">{data.name}  {data?.coming_Soon && <span className='absolute top-3 right-8 text-xs text-Success italic font-normal'>coming soon!</span>}
                                                    </span>

                                                    {/* Arrow - rotates only if this item is open */}
                                                    <div className={`transition-transform ${subOpen && selectedName === data.name ? "rotate-180" : ""}`}>
                                                        {isActive(data, pathname) ? (
                                                            <ArrowDown className="#FFFFFF" />
                                                        ) : (
                                                            <ArrowDown className="#4E4E4E" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    </button>
                                    {subOpen && selectedName === data.name && !isCollapsed && (
                                        <div className="flex items-center space-x-7 ml-[20px]">
                                            <hr
                                                style={{
                                                    width: "1.5px",
                                                    height: "70px",
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
                                    title={isCollapsed ? data.name : ""}
                                    className={`${data.coming_Soon ? "opacity-50 pointer-events-none" : ""} relative h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-[12px]'} text-GrayHomz text-[16px] font-[500] ${pathname === data.link
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
                                    {!isCollapsed && (
                                        <div className="flex items-center w-full">
                                            <span className="w-[150px] text-start">{data.name}
                                                {data?.coming_Soon && <span className='absolute top-3 right-0 text-xs text-Success italic font-normal'>coming soon!</span>}
                                            </span>
                                            <p
                                                className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                                    } mt-1 ml-1 h-2 w-2 rounded-full`}
                                            ></p>
                                        </div>
                                    )}
                                </Link>
                            )
                        )}
                    </div>
                    <div className={`flex flex-col gap-3 mb-[50px] mt-10 transition-all duration-300 ${!isCollapsed ? 'max-w-[230px]' : ''}`}>
                        {filteredMore.map((data) =>
                        (
                            <div key={data.id}>
                                <button onClick={() => !isCollapsed && toggleSubMore(data.name)} className="w-full text-left" title={isCollapsed ? data.name : ""}>
                                    <Link
                                        href={(isCollapsed && data.subMenuItems && data.subMenuItems.length > 0) ? data.subMenuItems[0].link : data.link}
                                        className={`h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] 
                                                    ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                                    `}
                                    >
                                        {/* Icon */}
                                        <span>{isActive(data, pathname) ? data.image2 : data.image}</span>

                                        {/* Name and Arrow */}
                                        {!isCollapsed && (
                                            <div className="flex items-center justify-between flex-1">
                                                <span className="text-start">{data.name}</span>

                                                {/* Arrow - rotates only if this item is open */}
                                                <div className={`transition-transform ${subMoreOpen && selectedMoreName === data.name ? "rotate-180" : ""}`}>
                                                    {isActive(data, pathname) ? (
                                                        <ArrowDown className="#FFFFFF" />
                                                    ) : (
                                                        <ArrowDown className="#4E4E4E" />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                </button>

                                {subMoreOpen && selectedMoreName === data.name && !isCollapsed && (
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
                                                        onClick={async (e) => {
                                                            if (subItem?.title === "Logout") {
                                                                e.preventDefault();
                                                                setIsLogoutModalOpen(true);
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
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onRequestClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logOutUser}
            />
        </div>
    )
}

export default Sidebar