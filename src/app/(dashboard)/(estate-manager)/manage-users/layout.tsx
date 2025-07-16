import React from 'react'
import Sidebar from '../components/sidebar';
import Header from '../components/header';

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
            </div>
        </div>
    )
}

export default Layout;