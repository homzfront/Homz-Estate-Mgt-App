import AccessControlIcon from '@/components/icons/estateManager/accessControlIcon';
import BillAndUtiIcon from '@/components/icons/estateManager/billAndUtiIcon';
import DashboardIcon from '@/components/icons/estateManager/dashboardIcon';
import ExpensesIcon from '@/components/icons/estateManager/expensesIcon';
import FinanceIcon from '@/components/icons/estateManager/financeIcon';
import ManageResidentIcon from '@/components/icons/estateManager/manageResidentIcon';
import ManageUserIcon from '@/components/icons/estateManager/manageUserIcon';
import PaymentIcon from '@/components/icons/estateManager/paymentIcon';
import SupportIcon from '@/components/icons/estateManager/supportIcon';
import React from 'react'

const Sidebar = () => {
    const Data = [
        {
            id: 1,
            image: <DashboardIcon />,
            image2: (
                <DashboardIcon />
            ),
            link: "/dashboard",
            name: "Dashboard",
            active: false,
        },
        {
            id: 2,
            image: <ManageResidentIcon />,
            image2: (
                <ManageResidentIcon />
            ),
            link: "/manage-resident",
            name: "Manage Residents",
            active: false,
        },
        {
            id: 3,
            image: <BillAndUtiIcon />,
            image2: (
                <BillAndUtiIcon />
            ),
            link: "/bill-utility",
            name: "Bills & Utilities",
            active: false,
        },
        {
            id: 4,
            image: <AccessControlIcon />,
            image2: <AccessControlIcon />,
            link: "/access-control",
            name: "Access Control",
            active: false,
        },
        {
            id: 5,
            image: <FinanceIcon />,
            image2: (
                <FinanceIcon />
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
                    image2: <PaymentIcon />,
                },
                {
                    title: "Expenses",
                    link: "/finance/expense",
                    image: <ExpensesIcon />,
                    image2: <ExpensesIcon />,
                },
            ],
        },
        {
            id: 6,
            image: <ManageUserIcon />,
            image2: (
                <ManageUserIcon />
            ),
            link: "/manage-users",
            name: "Manage Users",
            active: false,
        },
        {
            id: 7,
            image: <SupportIcon />,
            image2: (
                <SupportIcon />
            ),
            link: "/support",
            name: "Support",
            active: false,
        },
    ];
    return (
        <div className="sidebar">
            <div className="shadow-lg">
                <div className="w-full h-[1024px] px-6 flex flex-col py-10">
                    Sidebar
                </div>
            </div>
        </div>
    )
}

export default Sidebar