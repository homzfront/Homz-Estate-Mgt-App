'use client';
import React, { useEffect } from 'react';
import { useNotificationStore, NotificationItem } from '@/store/useNotificationStore';
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon';
import CustomModal from '@/components/general/customModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TYPE_STYLE: Record<string, { bg: string; stroke: string }> = {
    ACCESS_CONTROL:      { bg: '#EEF5FF', stroke: '#006AFF' },
    access_control:      { bg: '#EEF5FF', stroke: '#006AFF' },
    BILLING:             { bg: '#FFF3E0', stroke: '#F57C00' },
    bill:                { bg: '#FFF3E0', stroke: '#F57C00' },
    BILLINGS_PAYMENTS:   { bg: '#E8F5E9', stroke: '#039855' },
    payment:             { bg: '#E8F5E9', stroke: '#039855' },
    WALLET_TRANSACTIONS: { bg: '#E3F2FD', stroke: '#1565C0' },
    wallet:              { bg: '#E3F2FD', stroke: '#1565C0' },
    RESIDENT_ACTIVITY:   { bg: '#F3E5F5', stroke: '#7B1FA2' },
    co_resident:         { bg: '#F3E5F5', stroke: '#7B1FA2' },
    SYSTEM_SECURITY:     { bg: '#F5F5F5', stroke: '#616161' },
    system:              { bg: '#F5F5F5', stroke: '#616161' },
    maintenance:         { bg: '#FCE4EC', stroke: '#C2185B' },
    GENERAL:             { bg: '#EEF5FF', stroke: '#006AFF' },
    general:             { bg: '#EEF5FF', stroke: '#006AFF' },
};

// Backend sends GENERAL for maintenance events — infer visual type from title
function resolveDisplayType(n: NotificationItem): string {
    const t = n.type?.toLowerCase();
    if (t && t !== 'general') return t;
    const title = n.title?.toLowerCase() || '';
    const msg = n.message?.toLowerCase() || '';
    if (title.includes('maintenance') || msg.includes('maintenance')) return 'maintenance';
    if (title.includes('access') || title.includes('code') || msg.includes('access code')) return 'access_control';
    if (title.includes('bill') || title.includes('payment') || msg.includes('bill')) return 'bill';
    if (title.includes('wallet') || msg.includes('wallet')) return 'wallet';
    if (title.includes('resident') || title.includes('join') || msg.includes('join')) return 'co_resident';
    return 'general';
}

function TypeIcon({ type, stroke }: { type: string; stroke: string }) {
    if (type === 'access_control') return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19.79 14.93C17.73 16.98 14.78 17.61 12.12 16.84L7.48 21.47C7.16 21.8 6.53 22 6.07 21.94L3.81 21.64C3.11 21.54 2.46 20.88 2.35 20.18L2.05 17.92C1.99 17.46 2.21 16.83 2.52 16.51L7.15 11.88C6.39 9.21 7.03 6.26 9.08 4.21C12.03 1.26 16.82 1.26 19.78 4.21C22.74 7.16 22.74 11.98 19.79 14.93Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14.5 11C15.33 11 16 10.33 16 9.5C16 8.67 15.33 8 14.5 8C13.67 8 13 8.67 13 9.5C13 10.33 13.67 11 14.5 11Z" stroke={stroke} strokeWidth="1.5"/>
        </svg>
    );
    if (type === 'bill' || type === 'payment') return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M2 8.5H22M6 16.5H8M10.5 16.5H14.5M6.44 3.5H17.55C21.11 3.5 22 4.38 22 7.89V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.51 2 19.63 2 16.12V7.89C2 4.38 2.89 3.5 6.44 3.5Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
    if (type === 'co_resident') return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12ZM20 22C20 18.13 16.42 15 12 15C7.58 15 4 18.13 4 22" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 8V14M16 11H22" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
    if (type === 'maintenance') return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12.9 2.59L10.44 5.05C9.36 6.13 9.05 7.72 9.53 9.14L4.04 14.63C3.34 15.33 3.34 16.46 4.04 17.17L6.82 19.95C7.52 20.65 8.65 20.65 9.36 19.95L14.85 14.46C16.27 14.94 17.86 14.63 18.94 13.55L21.4 11.09C22.2 10.29 22.2 8.97 21.4 8.17L15.83 2.6C15.04 1.8 13.71 1.79 12.9 2.59Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
    if (type === 'wallet') return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5H7C4 20.5 2 19 2 15.5V8.5Z" stroke={stroke} strokeWidth="1.5"/>
            <path d="M15.5 12C15.5 10.62 16.62 9.5 18 9.5H22V14.5H18C16.62 14.5 15.5 13.38 15.5 12Z" stroke={stroke} strokeWidth="1.5"/>
        </svg>
    );
    return <NotiIcon className={stroke} />;
}

function groupByDate(items: NotificationItem[]) {
    const groups: Record<string, NotificationItem[]> = {};
    items.forEach((n) => {
        const d = new Date(n.createdAt);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const label = d.toDateString() === today.toDateString() ? 'Today'
            : d.toDateString() === yesterday.toDateString() ? 'Yesterday'
            : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    });
    return groups;
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `~${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `~${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return `~${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
}

const NotificationsPage = () => {
    const {
        notifications, isLoading, unreadCount,
        markAsRead, markAllAsRead,
        fetchNotifications, fetchSettings,
        startPolling, stopPolling,
        hasMore, currentPage,
    } = useNotificationStore();
    const [selected, setSelected] = React.useState<NotificationItem | null>(null);
    const pathname = usePathname();
    const isResident = pathname?.startsWith('/resident');
    const settingsPath = isResident ? '/resident/notifications/settings' : '/notifications/settings';
    const grouped = groupByDate(notifications);

    useEffect(() => {
        fetchNotifications(1, false);
        fetchSettings();
        startPolling(30000); // poll every 30s for new notifications

        return () => {
            stopPolling();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpen = (n: NotificationItem) => {
        setSelected(n);
        if (!n.isRead) markAsRead(n._id);
    };

    return (
        <div className='p-6 md:p-8 w-full'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-[20px] font-semibold text-BlackHomz'>Notifications</h1>
                    {unreadCount > 0 && (
                        <p className='text-[13px] text-GrayHomz mt-0.5'>{unreadCount} unread</p>
                    )}
                </div>
                <div className='flex items-center gap-3'>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className='text-[12px] font-medium text-BlueHomz hover:underline'
                        >
                            Mark all as read
                        </button>
                    )}
                    <Link href={settingsPath} className='text-[12px] font-medium text-GrayHomz hover:text-BlueHomz'>
                        Settings
                    </Link>
                </div>
            </div>

            {/* Content */}
            {isLoading && notifications.length === 0 ? (
                <div className='flex justify-center py-20'>
                    <div className='w-8 h-8 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
                </div>
            ) : notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 gap-3'>
                    <div className='w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                        <NotiIcon className='#006AFF' />
                    </div>
                    <p className='text-base font-semibold text-BlackHomz'>No notifications yet</p>
                    <p className='text-sm text-GrayHomz text-center'>You&apos;ll see notifications about activity in your estate here.</p>
                </div>
            ) : (
                <div className='flex flex-col gap-6'>
                    {Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                            <p className='text-[12px] font-semibold text-GrayHomz2 mb-2 uppercase tracking-wide'>{date}</p>
                            <div className='bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden'>
                                {items.map((n, idx) => {
                                    const style = TYPE_STYLE[resolveDisplayType(n)] || TYPE_STYLE.general;
                                    return (
                                        <button
                                            key={n._id}
                                            onClick={() => handleOpen(n)}
                                            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F9FBFF] ${
                                                !n.isRead ? 'bg-[#F5F9FF]' : ''
                                            } ${idx !== 0 ? 'border-t border-[#F5F5F5]' : ''}`}
                                        >
                                            <div
                                                className='w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5'
                                                style={{ backgroundColor: style.bg }}
                                            >
                                                <TypeIcon type={resolveDisplayType(n)} stroke={style.stroke} />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className={`text-[13px] truncate ${!n.isRead ? 'font-semibold text-BlackHomz' : 'font-medium text-GrayHomz'}`}>
                                                    {n.title}
                                                </p>
                                                <p className='text-[12px] text-GrayHomz mt-0.5 truncate'>{n.message}</p>
                                            </div>
                                            <div className='flex items-center gap-2 flex-shrink-0'>
                                                <span className='text-[11px] text-GrayHomz2 whitespace-nowrap'>{timeAgo(n.createdAt)}</span>
                                                {!n.isRead && <span className='w-2 h-2 bg-BlueHomz rounded-full' />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <div className='flex justify-center pt-2 pb-4'>
                            <button
                                onClick={() => fetchNotifications(currentPage + 1, true)}
                                disabled={isLoading}
                                className='text-sm font-medium text-BlueHomz hover:underline disabled:opacity-50'
                            >
                                {isLoading ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            <CustomModal isOpen={!!selected} onRequestClose={() => setSelected(null)}>
                {selected && (
                    <div className='w-[480px] max-w-[95vw] bg-white rounded-[16px] p-6'>
                        <div className='flex items-start justify-between mb-5'>
                            <div className='flex items-center gap-3'>
                                {(() => {
                                    const style = TYPE_STYLE[resolveDisplayType(selected)] || TYPE_STYLE.general;
                                    return (
                                        <div className='w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center' style={{ backgroundColor: style.bg }}>
                                            <TypeIcon type={resolveDisplayType(selected)} stroke={style.stroke} />
                                        </div>
                                    );
                                })()}
                                <div>
                                    <h2 className='text-[16px] font-semibold text-BlackHomz'>{selected.title}</h2>
                                    <p className='text-[11px] text-GrayHomz mt-0.5'>{timeAgo(selected.createdAt)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className='bg-[#F9FBFF] rounded-[10px] p-4 mb-5'>
                            <p className='text-[13px] text-BlackHomz leading-relaxed'>{selected.message}</p>
                        </div>

                        <div className='flex flex-col gap-2.5 mb-5'>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Type</span>
                                <span className='text-[12px] font-medium text-BlackHomz capitalize'>{selected.type?.replace(/_/g, ' ')}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Date</span>
                                <span className='text-[12px] font-medium text-BlackHomz'>
                                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] text-GrayHomz'>Status</span>
                                <span className={`text-[12px] font-medium ${selected.isRead ? 'text-GrayHomz' : 'text-BlueHomz'}`}>
                                    {selected.isRead ? 'Read' : 'Unread'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelected(null)}
                            className='w-full h-[44px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90'
                        >
                            Close
                        </button>
                    </div>
                )}
            </CustomModal>
        </div>
    );
};

export default NotificationsPage;