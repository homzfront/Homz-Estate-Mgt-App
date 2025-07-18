"use client"
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import EstateAddIcon from '@/components/icons/estateAddIcon';
import AccessControlIcon from '@/components/icons/estateManager/desktop/accessControlIcon';
import BillAndUtiIcon from '@/components/icons/estateManager/desktop/billAndUtiIcon';
import DashboardIcon from '@/components/icons/estateManager/desktop/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager/desktop/expensesIcon';
import FinanceIcon from '@/components/icons/estateManager/desktop/financeIcon';
import LogoutIcon from '@/components/icons/estateManager/desktop/logoutIcon';
import ManageResidentIcon from '@/components/icons/estateManager/desktop/manageResidentIcon';
import ManageUserIcon from '@/components/icons/estateManager/desktop/manageUserIcon';
import MoreIcon from '@/components/icons/estateManager/desktop/moreIcon';
import PaymentIcon from '@/components/icons/estateManager/desktop/paymentIcon';
import ProfileIcon from '@/components/icons/estateManager/desktop/profileIcon';
import SettingsIcon from '@/components/icons/estateManager/desktop/settingsIcon';
import SupportIcon from '@/components/icons/estateManager/desktop/supportIcon';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

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
        link: "/manage-resident",
        name: "Manage Residents",
        active: false,
    },
    {
        id: 3,
        image: <BillAndUtiIcon />,
        image2: (
            <BillAndUtiIcon className='#FFFFFF' />
        ),
        link: "/bill-utility",
        name: "Bills & Utilities",
        active: false,
    },
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
        link: "",
        name: "Finance",
        active: false,
        submenu: true,
        subMenuItems: [
            {
                title: "Payments",
                link: "/finance/payment",
                image: <PaymentIcon />,
                image2: <PaymentIcon className='#006AFF' />,
            },
            {
                title: "Expenses",
                link: "/finance/expense",
                image: <ExpensesIcon />,
                image2: <ExpensesIcon className='#006AFF' />,
            },
        ],
    },
    {
        id: 6,
        image: <ManageUserIcon />,
        image2: (
            <ManageUserIcon className='#FFFFFF' classNameII='#FFFFFF' />
        ),
        link: "/manage-users",
        name: "Manage Users",
        active: false,
    },
    {
        id: 7,
        image: <SupportIcon />,
        image2: (
            <SupportIcon className='#FFFFFF' />
        ),
        link: "/support",
        name: "Support",
        active: false,
    },
];

const More = [
    {
        id: 1,
        image: <MoreIcon />,
        image2: (
            <MoreIcon className='#FFFFFF' classNameII='#FFFFFF' />
        ),
        link: "",
        name: "More",
        active: false,
        submenu: true,
        subMenuItems: [
            {
                title: "Profile",
                link: "/profile",
                image: <ProfileIcon />,
                image2: <ProfileIcon className='#006AFF' />,
            },
            {
                title: "Settings",
                link: "/settings",
                image: <SettingsIcon />,
                image2: <SettingsIcon className='#006AFF' />,
            },
            {
                title: "Logout",
                link: "",
                image: <LogoutIcon />,
                image2: <LogoutIcon />,
            },
        ],
    },
]


const Sidebar = () => {
    const pathname = usePathname();
    const [subOpen, setSubOpen] = React.useState(false);
    const [subMoreOpen, setSubMoreOpen] = React.useState(false);
    const [selectedName, setSelecetedName] = React.useState(null);
    const [selectedMoreName, setSelecetedMoreName] = React.useState(null);
    const toggleSub = (name: any) => {
        setSubOpen(!subOpen);
        setSelecetedName(name)
    };

    const toggleSubMore = (name: any) => {
        setSubMoreOpen(!subMoreOpen);
        setSelecetedMoreName(name)
    };

    const isActive = (data: any, pathname: any) => {
        if (data.link === pathname) return true;
        if (data.submenu && data.subMenuItems) {
            return data.subMenuItems.some((item: any) => item.link === pathname);
        }
        return false;
    };

    return (
        <div className="sidebar">
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

                    <button className='border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-BlueHomz text-sm font-normal py-2 flex items-center justify-between px-4 mt-10 h-[48px] rounded-[4px]'>
                        <span className='flex gap-4 items-center'><EstateAddIcon /> Add New Estate</span> <AddIcon />
                    </button>

                    <div className="flex flex-col gap-3 mb-[50px] mt-10">
                        {Data.map((data) =>
                            data.submenu ? (
                                <>
                                    <button onClick={() => toggleSub(data.name)} key={data.id}>
                                        <Link
                                            href={data.link}
                                            className={`h-[40px] px-2 flex items-center rounded-md gap-[12px] text-[16px] font-[500]
                                            ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                            `}
                                        >
                                            {isActive(data, pathname) ? data.image2 : data.image}
                                            <div className="flex items-center w-full justify-between">
                                                <span className="">{data.name}</span>
                                                <div
                                                    onClick={() => toggleSub(data.name)}
                                                    className={`${subOpen ? "rotate-180" : ""} flex`}
                                                >
                                                    {isActive(data, pathname) ? <ArrowDown className='#FFFFFF' /> : <ArrowDown />}
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
                                </>
                            ) : (
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
                                        <span className={``}>{data.name}</span>
                                        <p
                                            className={`${data?.active === true ? "bg-error" : "bg-transparent"
                                                } mt-1 ml-1 h-2 w-2 rounded-full`}
                                        ></p>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                    <div className='flex flex-col gap-3 mb-[50px] mt-10'>
                        {More.map((data) =>
                        (
                            <>
                                <button onClick={() => toggleSubMore(data.name)} key={data.id}>
                                    <Link
                                        href={data.link}
                                        className={`h-[40px] px-2 flex items-center rounded-md gap-[12px] text-[16px] font-[500]
                                            ${isActive(data, pathname) ? "bg-BlueHomz text-white" : "hover:bg-whiteblue text-GrayHomz"}
                                            `}
                                    >
                                        {isActive(data, pathname) ? data.image2 : data.image}
                                        <div className="flex items-center w-full justify-between">
                                            <span className="">{data.name}</span>
                                            <div
                                                onClick={() => toggleSubMore(data.name)}
                                                className={`${subMoreOpen ? "rotate-180" : ""} flex`}
                                            >
                                                {isActive(data, pathname) ? <ArrowDown className='#FFFFFF' /> : <ArrowDown />}
                                            </div>
                                        </div>
                                    </Link>
                                </button>
                                {subMoreOpen && selectedMoreName === data.name && (
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
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar