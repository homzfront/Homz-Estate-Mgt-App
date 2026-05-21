'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Notification {
    _id?: string;
    user?: string;
    role?: string;
    action?: string;
    message?: string;
    target?: string;
    date?: string;
    time?: string;
    createdAt?: string;
    estateName?: string;
    read?: boolean;
}

const timeAgo = (d?: string) => {
    const diff = Date.now() - new Date(d || Date.now()).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}hrs ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}hrs ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const groupByDate = (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    notifications.forEach(n => {
        const key = new Date(n.date || n.date || n.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
    });
    return groups;
};

type TabType = 'all' | 'users' | 'system';
type FilterType = 'Last 10 days' | 'Last 30 days' | 'Last 7 days';

export default function AdminNotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');
    const [filter, setFilter] = useState<FilterType>('Last 10 days');
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => { fetchNotifications(); }, [tab, filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const days = filter === 'Last 7 days' ? 7 : filter === 'Last 10 days' ? 10 : 30;
            const params: Record<string, string> = { page: '1', limit: '50', days: String(days) };
            if (tab !== 'all') params.type = tab;
            const res = await api.get('/admin/activities', { params });
            const d = res.data?.data || res.data || {};
            setNotifications(Array.isArray(d) ? d : d.data || []);
        } catch {
            /* silent */
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (id: string) => {
        try {
            // mark-read not available
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch { /* silent */ }
    };

    const grouped = groupByDate(notifications);

    return (
        <div className='p-8 w-full max-w-[860px]'>
            {/* Back */}
            <button onClick={() => router.back()} className='flex items-center gap-2 text-[13px] text-[#1A1A1A] mb-6 hover:opacity-70'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M19 12H5M5 12l7 7M5 12l7-7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
                Back
            </button>

            {/* Title */}
            <h1 className='text-[22px] font-bold text-[#1A1A1A] text-center mb-5'>Notifications</h1>

            {/* Tabs + Filter */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-end gap-6'>
                    {(['all', 'users', 'system'] as TabType[]).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`pb-2 text-[14px] font-medium capitalize transition-colors border-b-2 ${tab === t ? 'border-[#006AFF] text-[#006AFF]' : 'border-transparent text-[#9E9E9E] hover:text-[#1A1A1A]'}`}>
                            {t === 'all' ? 'All' : t === 'users' ? 'Users' : 'System'}
                        </button>
                    ))}
                </div>

                <div className='relative'>
                    <span className='text-[13px] text-[#9E9E9E] mr-2'>Filter:</span>
                    <button onClick={() => setShowFilter(v => !v)}
                        className='inline-flex items-center gap-1.5 h-[36px] px-4 border border-[#E8E8E8] rounded-[8px] text-[13px] text-[#1A1A1A] bg-white hover:bg-[#F5F5F5]'>
                        {filter}
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                            <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                        </svg>
                    </button>
                    {showFilter && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-[8px] shadow-lg z-10 min-w-[140px]'>
                            {(['Last 7 days', 'Last 10 days', 'Last 30 days'] as FilterType[]).map(f => (
                                <button key={f} onClick={() => { setFilter(f); setShowFilter(false); }}
                                    className={`block w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F5F5F5] ${filter === f ? 'text-[#006AFF] font-medium' : 'text-[#1A1A1A]'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center py-16'>
                    <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                </div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className='text-center py-16'>
                    <p className='text-[13px] text-[#9E9E9E]'>No notifications</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                            <p className='text-[13px] text-[#9E9E9E] mb-3'>{date}</p>
                            <div className='bg-white rounded-[12px] border border-[#E8E8E8] overflow-hidden'>
                                {items.map((n, i) => (
                                    <div key={n._id}
                                        className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors ${i < items.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
                                        onClick={() => !n.read && n._id && markRead(n._id)}>
                                        {/* Bell icon */}
                                        <div className='w-9 h-9 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0 mt-0.5'>
                                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                                <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' stroke='#006AFF' strokeWidth='1.5' />
                                                <path d='M13.73 21a2 2 0 0 1-3.46 0' stroke='#006AFF' strokeWidth='1.5' strokeLinecap='round' />
                                            </svg>
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <p className={`text-[13px] ${!n.read ? 'font-semibold' : 'font-medium'} text-[#1A1A1A]`}>{n.action}</p>
                                            <p className='text-[12px] text-[#9E9E9E] mt-0.5'>{n.action || n.message}</p>
                                        </div>

                                        <div className='flex items-center gap-3 flex-shrink-0'>
                                            {!n.read && (
                                                <span className='flex items-center gap-1 text-[11px] font-semibold text-[#006AFF]'>
                                                    <span className='w-2 h-2 rounded-full bg-[#006AFF]' />
                                                    Unread
                                                </span>
                                            )}
                                            <span className='text-[12px] text-[#9E9E9E]'>{timeAgo(n.date || n.createdAt || '')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}