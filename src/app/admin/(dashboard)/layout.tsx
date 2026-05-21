import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen bg-[#F8F9FA] overflow-hidden'>
            <AdminSidebar />
            <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
                <AdminTopbar />
                <main className='flex-1 overflow-y-auto'>
                    {children}
                </main>
            </div>
        </div>
    );
}