'use client';

import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

type AudienceType = 'ALL' | 'RESIDENTS' | 'COMMUNITY_MANAGERS' | 'ADMINS';
type ChannelType = 'push' | 'email';
type DeliveryMode = 'immediate' | 'scheduled';

type BroadcastDraft = {
    audience: AudienceType | '';
    title: string;
    body: string;
    channels: ChannelType[];
    deliveryMode: DeliveryMode;
    scheduledAt: string;
};

type BroadcastHistoryItem = {
    id: string;
    audience: AudienceType;
    title: string;
    body: string;
    channels: ChannelType[];
    deliveryMode: DeliveryMode;
    scheduledAt: string;
    sentAt: string;
};

const audienceOptions: { value: AudienceType; label: string }[] = [
    { value: 'ALL', label: 'All Users' },
    { value: 'RESIDENTS', label: 'Residents' },
    { value: 'COMMUNITY_MANAGERS', label: 'Community Managers' },
    { value: 'ADMINS', label: 'Admins' },
];

const channelOptions: { value: ChannelType; label: string }[] = [
    { value: 'push', label: 'Push Notification' },
    { value: 'email', label: 'Email' },
];

const initialState: BroadcastDraft = {
    audience: '',
    title: '',
    body: '',
    channels: [],
    deliveryMode: 'immediate',
    scheduledAt: '',
};

const HISTORY_STORAGE_KEY = 'admin-broadcast-history';

export default function BroadcastForm() {
    const [formData, setFormData] = useState<BroadcastDraft>(initialState);
    const [errors, setErrors] = useState<Partial<Record<keyof BroadcastDraft, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
    const [history, setHistory] = useState<BroadcastHistoryItem[]>([]);
    const [historyReady, setHistoryReady] = useState(false);

    const persistHistory = (nextHistory: BroadcastHistoryItem[]) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
        } catch {
            // Ignore storage issues
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as BroadcastHistoryItem[];
                setHistory(parsed);
                persistHistory(parsed);
            }
        } catch {
            // Ignore storage issues
        } finally {
            setHistoryReady(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !historyReady) return;
        if (history.length > 0) {
            persistHistory(history);
        }
    }, [history, historyReady]);

    const updateField = <K extends keyof BroadcastDraft>(field: K, value: BroadcastDraft[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const toggleChannel = (channel: ChannelType) => {
        setFormData((prev) => ({
            ...prev,
            channels: prev.channels.includes(channel)
                ? prev.channels.filter((item) => item !== channel)
                : [...prev.channels, channel],
        }));
    };

    const resetForm = () => {
        setFormData({ ...initialState, channels: [] });
        setErrors({});
        setPendingPayload(null);
    };

    const validate = () => {
        const nextErrors: Partial<Record<keyof BroadcastDraft, string>> = {};

        if (!formData.audience) {
            nextErrors.audience = 'Please select an audience.';
        }

        if (!formData.title.trim()) {
            nextErrors.title = 'A title is required.';
        }

        if (!formData.body.trim()) {
            nextErrors.body = 'A message is required.';
        }

        if (formData.deliveryMode === 'scheduled' && !formData.scheduledAt.trim()) {
            nextErrors.scheduledAt = 'Please choose a date and time.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const getAudienceLabel = (value: AudienceType) => {
        return audienceOptions.find((option) => option.value === value)?.label || value;
    };

    const formatHistoryDate = (value: string) => {
        return new Date(value).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const buildPayload = () => {
        const payload: Record<string, unknown> = {
            audience: formData.audience,
            title: formData.title.trim(),
            body: formData.body.trim(),
            channels: formData.channels,
        };

        if (formData.deliveryMode === 'scheduled') {
            payload.scheduledAt = new Date(formData.scheduledAt).toISOString();
        }

        return payload;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = buildPayload();
        setPendingPayload(payload);
        setConfirmationOpen(true);
    };

    const confirmSend = async () => {
        if (!pendingPayload) {
            return;
        }

        setSubmitting(true);
        setConfirmationOpen(false);
        const loadingToast = toast.loading('Sending broadcast...');

        try {
            await api.post('/admin/notifications/broadcast', pendingPayload);
            const newHistoryItem: BroadcastHistoryItem = {
                id: `${Date.now()}`,
                audience: formData.audience as AudienceType,
                title: formData.title.trim(),
                body: formData.body.trim(),
                channels: formData.channels,
                deliveryMode: formData.deliveryMode,
                scheduledAt: formData.scheduledAt,
                sentAt: new Date().toISOString(),
            };

            setHistory((prev) => {
                const nextHistory = [newHistoryItem, ...prev].slice(0, 5);
                persistHistory(nextHistory);
                return nextHistory;
            });
            toast.success('Broadcast sent successfully.', { id: loadingToast });
            resetForm();
        } catch (error: unknown) {
            const message = error instanceof Error && error.message
                ? error.message
                : 'Unable to send broadcast right now.';
            toast.error(message, { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const useHistoryItem = (item: BroadcastHistoryItem) => {
        setFormData({
            audience: item.audience,
            title: item.title,
            body: item.body,
            channels: item.channels,
            deliveryMode: item.deliveryMode,
            scheduledAt: item.scheduledAt,
        });
        setErrors({});
        setPendingPayload(null);
        setConfirmationOpen(false);
        toast.success('Broadcast details loaded. Review and send again when ready.');
    };

    return (
        <div className='rounded-[16px] border border-[#E8E8E8] bg-white p-4 sm:p-6 shadow-sm'>
            <div className='mb-6'>
                <h2 className='text-[16px] font-semibold text-[#1A1A1A]'>Send a broadcast message</h2>
                <p className='mt-1 text-[13px] text-[#6B6B6B]'>Reach selected users instantly and optionally add push or email delivery.</p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
                <div className='grid gap-5 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <label className='text-[13px] font-medium text-[#1A1A1A]'>Audience</label>
                        <select
                            value={formData.audience}
                            onChange={(event) => updateField('audience', event.target.value as AudienceType)}
                            className='h-[44px] w-full rounded-[10px] border border-[#E8E8E8] bg-[#FCFCFC] px-3 text-[13px] text-[#1A1A1A] outline-none focus:border-[#006AFF] focus:ring-2 focus:ring-[#006AFF]/15'
                        >
                            <option value=''>Select audience</option>
                            {audienceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.audience ? <p className='text-[12px] text-[#D14343]'>{errors.audience}</p> : null}
                    </div>

                    <div className='space-y-2'>
                        <label className='text-[13px] font-medium text-[#1A1A1A]'>Title</label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(event) => updateField('title', event.target.value)}
                            placeholder='Enter a clear title'
                            className='h-[44px] w-full rounded-[10px] border border-[#E8E8E8] bg-[#FCFCFC] px-3 text-[13px] text-[#1A1A1A] outline-none focus:border-[#006AFF] focus:ring-2 focus:ring-[#006AFF]/15'
                        />
                        {errors.title ? <p className='text-[12px] text-[#D14343]'>{errors.title}</p> : null}
                    </div>
                </div>

                <div className='space-y-2'>
                    <label className='text-[13px] font-medium text-[#1A1A1A]'>Message</label>
                    <textarea
                        rows={6}
                        value={formData.body}
                        onChange={(event) => updateField('body', event.target.value)}
                        placeholder='Write the broadcast message here'
                        className='min-h-[140px] w-full rounded-[10px] border border-[#E8E8E8] bg-[#FCFCFC] px-3 py-3 text-[13px] text-[#1A1A1A] outline-none focus:border-[#006AFF] focus:ring-2 focus:ring-[#006AFF]/15'
                    />
                    {errors.body ? <p className='text-[12px] text-[#D14343]'>{errors.body}</p> : null}
                </div>

                <div className='grid gap-4 lg:grid-cols-[1.1fr_0.9fr]'>
                    <div className='rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] p-4'>
                        <div className='flex items-start gap-2 rounded-[10px] bg-[#F1F7FF] px-3 py-2'>
                            <span className='mt-0.5 text-[14px] text-[#006AFF]'>✓</span>
                            <p className='text-[13px] text-[#31538B]'>In-App notifications are always enabled.</p>
                        </div>

                        <div className='mt-4'>
                            <p className='text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9E9E9E]'>Optional channels</p>
                            <div className='mt-3 space-y-2'>
                                {channelOptions.map((option) => {
                                    const checked = formData.channels.includes(option.value);
                                    return (
                                        <label key={option.value} className='flex items-center gap-2 text-[13px] text-[#1A1A1A]'>
                                            <input
                                                type='checkbox'
                                                checked={checked}
                                                onChange={() => toggleChannel(option.value)}
                                                className='h-4 w-4 rounded border-[#C8D4E6] text-[#006AFF] focus:ring-[#006AFF]'
                                            />
                                            {option.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className='rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] p-4'>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9E9E9E]'>Delivery option</p>

                        <div className='mt-3 space-y-2'>
                            <label className='flex items-center gap-2 text-[13px] text-[#1A1A1A]'>
                                <input
                                    type='radio'
                                    name='deliveryMode'
                                    checked={formData.deliveryMode === 'immediate'}
                                    onChange={() => updateField('deliveryMode', 'immediate')}
                                    className='h-4 w-4 border-[#C8D4E6] text-[#006AFF] focus:ring-[#006AFF]'
                                />
                                Send Immediately
                            </label>
                            <label className='flex items-center gap-2 text-[13px] text-[#1A1A1A]'>
                                <input
                                    type='radio'
                                    name='deliveryMode'
                                    checked={formData.deliveryMode === 'scheduled'}
                                    onChange={() => updateField('deliveryMode', 'scheduled')}
                                    className='h-4 w-4 border-[#C8D4E6] text-[#006AFF] focus:ring-[#006AFF]'
                                />
                                Schedule for Later
                            </label>
                        </div>

                        {formData.deliveryMode === 'scheduled' ? (
                            <div className='mt-4 space-y-2'>
                                <label className='text-[13px] font-medium text-[#1A1A1A]'>Schedule</label>
                                <input
                                    type='datetime-local'
                                    value={formData.scheduledAt}
                                    onChange={(event) => updateField('scheduledAt', event.target.value)}
                                    className='h-[44px] w-full rounded-[10px] border border-[#E8E8E8] bg-[#FCFCFC] px-3 text-[13px] text-[#1A1A1A] outline-none focus:border-[#006AFF] focus:ring-2 focus:ring-[#006AFF]/15'
                                />
                                {errors.scheduledAt ? <p className='text-[12px] text-[#D14343]'>{errors.scheduledAt}</p> : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t border-[#F0F0F0] pt-4 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-[12px] text-[#6B6B6B]'>The broadcast will be sent to the selected audience and stored as an in-app notification.</p>
                    <button
                        type='submit'
                        disabled={submitting}
                        className='inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#006AFF] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0058D6] disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {submitting ? 'Sending...' : 'Send Broadcast'}
                    </button>
                </div>
            </form>

            <div className='mt-6 rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] p-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                        <h3 className='text-[14px] font-semibold text-[#1A1A1A]'>Recent broadcasts</h3>
                        <p className='text-[12px] text-[#6B6B6B]'>Previous messages you can reuse and send again.</p>
                    </div>
                    <span className='inline-flex w-fit items-center rounded-full bg-[#F1F7FF] px-2.5 py-1 text-[11px] font-medium text-[#2769CC]'>Ready to resend</span>
                </div>

                {!historyReady ? (
                    <p className='mt-4 text-[12px] text-[#9E9E9E]'>Loading recent broadcasts...</p>
                ) : history.length === 0 ? (
                    <p className='mt-4 text-[12px] text-[#9E9E9E]'>No previous broadcasts yet. Once you send one, it will show up here.</p>
                ) : (
                    <div className='mt-4 space-y-3'>
                        {history.map((item) => (
                            <div key={item.id} className='rounded-[10px] border border-[#E8E8E8] bg-white p-3'>
                                <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                                    <div className='min-w-0'>
                                        <p className='text-[13px] font-semibold text-[#1A1A1A]'>{item.title}</p>
                                        <p className='mt-1 text-[12px] text-[#6B6B6B] line-clamp-2'>{item.body}</p>
                                    </div>
                                    <span className='inline-flex w-fit items-center rounded-full bg-[#F1F7FF] px-2.5 py-1 text-[11px] font-medium text-[#2769CC]'>Can send again</span>
                                </div>
                                <div className='mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#9E9E9E]'>
                                    <span>{getAudienceLabel(item.audience)}</span>
                                    <span>•</span>
                                    <span>{item.channels.length > 0 ? item.channels.join(', ') : 'In-app only'}</span>
                                    <span>•</span>
                                    <span>{formatHistoryDate(item.sentAt)}</span>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => useHistoryItem(item)}
                                    className='mt-3 inline-flex h-[36px] items-center justify-center rounded-[8px] border border-[#E8E8E8] px-3 text-[12px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]'
                                >
                                    Use again
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {confirmationOpen ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6'>
                    <div className='w-full max-w-[440px] rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-xl'>
                        <h3 className='text-[16px] font-semibold text-[#1A1A1A]'>Are you sure you want to send this broadcast?</h3>
                        <p className='mt-2 text-[13px] text-[#6B6B6B]'>This will send the message to the selected audience and create a new in-app notification entry.</p>

                        <div className='mt-4 rounded-[10px] border border-[#E8E8E8] bg-[#FAFAFA] p-3'>
                            <p className='text-[13px] font-semibold text-[#1A1A1A]'>{formData.title || 'Untitled broadcast'}</p>
                            <p className='mt-1 text-[12px] text-[#6B6B6B]'>{formData.body || 'No message provided yet.'}</p>
                            <p className='mt-2 text-[12px] text-[#9E9E9E]'>{formData.audience ? getAudienceLabel(formData.audience as AudienceType) : 'Audience not selected'}</p>
                        </div>

                        <div className='mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
                            <button
                                type='button'
                                onClick={() => setConfirmationOpen(false)}
                                className='h-[40px] rounded-[8px] border border-[#E8E8E8] px-4 text-[13px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={confirmSend}
                                disabled={submitting}
                                className='h-[40px] rounded-[8px] bg-[#006AFF] px-4 text-[13px] font-semibold text-white hover:bg-[#0058D6] disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                {submitting ? 'Sending...' : 'Confirm send'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
