/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import ArrowDown from '@/components/icons/arrowDown';
import DashboardIcon from '@/components/icons/estateManager&Resident/desktop/dashboardIcon';
// import SupportIcon from '@/components/icons/estateManager&Resident/desktop/supportIcon';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import VisitorShield from '@/components/icons/estateManager&Resident/desktop/visitorShield';
// import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
// import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import Profile16Icon from '@/components/icons/estateManager&Resident/desktop/profile16Icon';
import MoreIcon from '@/components/icons/estateManager&Resident/desktop/moreIcon';
import LogoutIcon from '@/components/icons/estateManager&Resident/desktop/logoutIcon';
import LogoutConfirmationModal from '@/components/general/LogoutConfirmationModal';
// import SettingsIcon from '@/components/icons/estateManager&Resident/desktop/settingsIcon';
import { useOpenCommunityListStore } from '@/store/useOpenCommunityListStore';
import api from '@/utils/api';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useAuthSlice } from '@/store/authStore';
import InitialsAvatar from '@/components/general/InitialsAvatar';
import DuesAndPaymentIcon from '@/components/icons/estateManager&Resident/desktop/duesAndPaymentIcon';
import { useSidebarStore } from '@/store/useSidebarStore';

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
        comingSoon: false,
    },
    {
        id: 3,
        image: <DuesAndPaymentIcon />,
        image2: (
            <DuesAndPaymentIcon className='#FFFFFF' />
        ),
        link: "/resident/bills-payments",
        name: "Bills & Payments",
        active: false,
        comingSoon: false,
    },
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
            {
                title: "Profile",
                link: "/resident/profile",
                image: <Profile16Icon />,
                image2: <Profile16Icon className='#006AFF' />,
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
    const pathname = usePathname();
    const { openEstateList, setOpenEstateList, setOpenPendingModal } = useOpenCommunityListStore();
    const { userData, getResidentProfile } = useAuthSlice();
    const userID = userData?._id;
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
    const { residentCommunity, setResidentCommunity } = useResidentCommunity();
    const { isCollapsed, toggleCollapsed } = useSidebarStore();
    const [subMoreOpen, setSubMoreOpen] = React.useState(false);
    const [selectedMoreName, setSelecetedMoreName] = React.useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
    const { logOutUser } = useAuthSlice();

    const toggleSubMore = (name: any) => {
        setSubMoreOpen(!subMoreOpen);
        setSelecetedMoreName(name);
    };

    // // Breadcrumbs for minimap
    // const breadcrumbs = pathname.split('/').filter(Boolean).map((path) => {
    //     return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    // });

    const fetchResidentEstate = async () => {
        try {
            const response: any = await api.get(`estates/resident/all-estates/users/${userID}`);
            // console.log("Resident Estate Response:", response);
            setResidentCommunity(response?.data?.data?.estates?.results)
        } catch (error) {
            console.error("Error fetching resident estates:", error);
        }
    }

    React.useEffect(() => {
        if (userData && !residentCommunity) {
            fetchResidentEstate();
        }
    }, [userData]);

    React.useEffect(() => {
        if (selectedEstate) {
            getResidentProfile(selectedEstate?.associatedIds?.residentId);
        }
    }, [getResidentProfile, selectedEstate]);

    React.useEffect(() => {
        if (!selectedEstate && residentCommunity && residentCommunity.length > 0) {
            setSelectedEstate(residentCommunity?.[0]);
        }
    }, [selectedEstate, residentCommunity, setSelectedEstate]);

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

                    <div className="relative">
                        <button
                            onClick={() => setOpenEstateList(true)}
                            className={`border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'justify-between px-4 h-[48px] w-full'} rounded-[4px] mt-6 transition-all duration-300`}
                        >
                            <div className='flex gap-2 items-center'>
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0">
                                    <InitialsAvatar
                                        name={(selectedEstate?.estateName) || 'Estate'}
                                        size={24}
                                    />
                                </div>
                                {!isCollapsed && (
                                    <div className='flex flex-col items-start'>
                                        <p className="truncate max-w-[140px]">{selectedEstate ? selectedEstate?.estateName : ""}</p>
                                    </div>
                                )}
                            </div>
                            {!isCollapsed && (
                                <div className='mt-1.5'>
                                    <ArrowDown size={20} className='#4E4E4E' />
                                </div>
                            )}
                        </button>
                    </div>

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

                    <div className='flex flex-col gap-10 mt-10'>
                        <div className="flex flex-col gap-3">
                            {Data?.slice(0, 3).map((data) => {
                                if (data.comingSoon) {
                                    return (
                                        <div
                                            key={data.id}
                                            title={isCollapsed ? data.name : ""}
                                            className={`${data.comingSoon ? "opacity-50 pointer-events-none" : ""} relative h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] text-GrayHomz`}
                                        >
                                            <div>{data.image}</div>
                                            {!isCollapsed && (
                                                <div className="flex items-center w-full">
                                                    <span className="text-start">
                                                        {data.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={data.id}
                                        href={data.link}
                                        title={isCollapsed ? data.name : ""}
                                        className={`relative h-[40px] flex items-center rounded-md ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-2 gap-3'} text-[16px] font-[500] transition-all duration-200 ${isActive(data, pathname)
                                            ? "bg-BlueHomz text-white"
                                            : "text-GrayHomz hover:bg-whiteblue"
                                            } `}
                                    >
                                        {isActive(data, pathname) ? (
                                            <div>{data.image2}</div>
                                        ) : (
                                            <div>{data.image}</div>
                                        )}
                                        {!isCollapsed && (
                                            <div className="flex items-center w-full">
                                                <span className="text-start">
                                                    {data.name}
                                                </span>
                                                <p
                                                    className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                                        } mt-1 ml-1 h-2 w-2 rounded-full`}
                                                ></p>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className={`flex flex-col gap-3 mb-[50px] mt-10 transition-all duration-300 ${!isCollapsed ? 'max-w-[230px]' : ''}`}>
                            {More.map((data) =>
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