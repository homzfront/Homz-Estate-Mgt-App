import React from 'react'
import Sidebar from '../components/sidebar';
import Header from '../../components/header';
import MobileFooter from '../components/mobileFooter';

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