import React from 'react'
import Header from '@/app/(dashboard)/components/header';
import MobileFooter from '@/app/(dashboard)/components/mobileFooter';
import Sidebar from '@/app/(dashboard)/components/sidebar';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='dashboard_main'>
            <Sidebar />
            <div className='main w-full' >
                <Header />
                {children}
                <MobileFooter />
            </div>
        </div>
    )
}

export default Layout;