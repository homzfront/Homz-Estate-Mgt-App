'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

type TabType = 'all' | 'BILLINGS_PAYMENTS' | 'ACCESS_CONTROL' | 'WALLET_TRANSACTIONS' | 'SYSTEM_SECURITY' | 'MAINTENANCE' | 'GENERAL';

const TABS: { key: TabType; label: string }[] = [
    { key: 'all',                 label: 'All'          },
    { key: 'BILLINGS_PAYMENTS',   label: 'Billing'      },
    { key: 'WALLET_TRANSACTIONS', label: 'Wallet'       },
    { key: 'ACCESS_CONTROL',      label: 'Access'       },
    { key: 'MAINTENANCE',         label: 'Maintenance'  },
    { key: 'SYSTEM_SECURITY',     label: 'System'       },
    { key: 'GENERAL',             label: 'General'      },
];

const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const groupByDate = (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    notifications.forEach(n => {
        const key = new Date(n.createdAt).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
    });
    return groups;
};

export default function AdminNotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [markingAll, setMarkingAll] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page: p, limit: 20 };
            if (tab !== 'all') params.type = tab;
            const res = await api.get('/notifications', { params });
            const data = res.data?.data;
            setNotifications(data?.results || []);
            setTotalPages(data?.totalPages || 1);
            setPage(data?.currentPage || 1);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [tab]);

    useEffect(() => { fetchNotifications(1); }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch { /* silent */ }
    };

    const markAllAsRead = async () => {
        setMarkingAll(true);
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch { /* silent */ }
        finally { setMarkingAll(false); }
    };

    const grouped = groupByDate(notifications);

    return (
        <div className='p-6 md:p-8 w-full max-w-[860px]'>
            {/* Back */}
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6 hover:text-[#1A1A1A] transition-colors'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                </svg>
                Back
            </button>

            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-bold text-[#1A1A1A]'>Notifications</h1>
                    {unreadCount > 0 && (
                        <p className='text-[13px] text-[#9E9E9E] mt-0.5'>{unreadCount} unread</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        disabled={markingAll}
                        className='text-[13px] text-[#006AFF] font-medium hover:underline disabled:opacity-50'
                    >
                        {markingAll ? 'Marking...' : 'Mark all as read'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className='flex items-center gap-1 mb-6 overflow-x-auto pb-1 scrollbar-none'>
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors flex-shrink-0
                            ${tab === t.key
                                ? 'bg-[#006AFF] text-white'
                                : 'bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#EBEBEB]'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className='flex justify-center py-16'>
                    <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin'/>
                </div>
            ) : notifications.length === 0 ? (
                <div className='text-center py-16 flex flex-col items-center gap-3'>
                    <div className='w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center'>
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                            <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' stroke='#BDBDBD' strokeWidth='1.5' strokeLinecap='round'/>
                        </svg>
                    </div>
                    <p className='text-[13px] text-[#9E9E9E]'>No notifications</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                            <p className='text-[12px] text-[#9E9E9E] font-medium mb-3'>{date}</p>
                            <div className='bg-white rounded-[12px] border border-[#E8E8E8] overflow-hidden'>
                                {items.map((n, i) => (
                                    <div
                                        key={n._id}
                                        onClick={() => !n.isRead && markAsRead(n._id)}
                                        className={`flex items-start gap-4 px-5 py-4 transition-colors
                                            ${!n.isRead ? 'bg-[#F0F5FF] cursor-pointer hover:bg-[#E8F0FF]' : 'hover:bg-[#FAFAFA] cursor-default'}
                                            ${i < items.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
                                    >
                                        {/* Icon */}
                                        <div className='w-9 h-9 rounded-full bg-[#EEF5FF] flex items-center justify-center flex-shrink-0 mt-0.5'>
                                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                                <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' stroke='#006AFF' strokeWidth='1.5'/>
                                                <path d='M13.73 21a2 2 0 0 1-3.46 0' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round'/>
                                            </svg>
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <p className={`text-[13px] text-[#1A1A1A] ${!n.isRead ? 'font-semibold' : 'font-medium'}`}>
                                                {n.title}
                                            </p>
                                            <p className='text-[12px] text-[#9E9E9E] mt-0.5 line-clamp-2'>{n.message}</p>
                                        </div>

                                        <div className='flex flex-col items-end gap-1.5 flex-shrink-0'>
                                            {!n.isRead && (
                                                <span className='w-2 h-2 rounded-full bg-[#006AFF]'/>
                                            )}
                                            <span className='text-[11px] text-[#BDBDBD]'>{timeAgo(n.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex items-center justify-center gap-3 pt-2'>
                            <button
                                onClick={() => fetchNotifications(page - 1)}
                                disabled={page <= 1}
                                className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Previous
                            </button>
                            <span className='text-[13px] text-[#9E9E9E]'>Page {page} of {totalPages}</span>
                            <button
                                onClick={() => fetchNotifications(page + 1)}
                                disabled={page >= totalPages}
                                className='h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}