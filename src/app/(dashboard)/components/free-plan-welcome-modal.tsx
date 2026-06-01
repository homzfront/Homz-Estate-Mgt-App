'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import CustomModal from '@/components/general/customModal';

const FREE_FEATURES = [
    'Manage up to 50 residents',
    'Estate & resident authentication',
    'Basic access control (create & view codes)',
    'Basic bill viewing & offline records',
    'Resident list overview',
];

const LOCKED_FEATURES = [
    'Bill creation & management',
    'Internal estate payments',
    'Wallet collections',
    'Financial exports',
];

function FreePlanWelcomeModalInner() {
    const router = useRouter();
    const pathname = usePathname();
    const { getPlanTier, plans, fetchPlans, isLoadingCurrent, current } = useSubscriptionStore();
    const { communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    const [show, setShow] = useState(false);
    // Track whether we've attempted a subscription fetch at least once
    const [subChecked, setSubChecked] = useState(false);

    const role = selectedCommunity?.role || 'owner';
    const canSeeModal = ['owner', 'admin'].includes(role);
    const STORAGE_KEY = `homz-free-welcome-${communityProfile?._id || 'em'}`;

    // Mark as checked once loading finishes
    useEffect(() => {
        if (!isLoadingCurrent && selectedCommunity?.estate?._id) {
            setSubChecked(true);
        }
    }, [isLoadingCurrent, selectedCommunity?.estate?._id]);

    useEffect(() => {
        // Don't evaluate until subscription fetch has completed at least once
        if (!subChecked || isLoadingCurrent) return;
        // Don't evaluate until we have the real community profile ID
        // Without it, STORAGE_KEY uses 'em' as fallback and the seen check is wrong
        if (!communityProfile?._id) return;

        const tier = getPlanTier();
        const hasEstate = !!selectedCommunity?.estate?._id;

        // If they've upgraded, clear any stale "seen" flag so logic stays clean
        if (tier !== 'free') {
            localStorage.removeItem(STORAGE_KEY);
            setShow(false);
            return;
        }

        const seen = localStorage.getItem(STORAGE_KEY);

        // Only show on clean /dashboard with no query params
        const isCleanDashboard = pathname === '/dashboard' &&
            (typeof window === 'undefined' || !window.location.search);

        if (!seen && tier === 'free' && communityProfile?._id && canSeeModal && hasEstate && isCleanDashboard) {
            setShow(true);
            if (plans.length === 0) fetchPlans();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subChecked, isLoadingCurrent, communityProfile?._id, selectedCommunity?.estate?._id, pathname]);

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'seen');
        setShow(false);
    };

    const handleUpgrade = () => {
        handleDismiss();
        router.push('/subscription');
    };

    if (!show) return null;

    return (
        <CustomModal isOpen={show} onRequestClose={handleDismiss}>
            <div className='w-[520px] max-w-[95vw] bg-white rounded-[16px] p-8'>
                <div className='flex items-start justify-between mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full bg-[#EEF5FF] flex items-center justify-center flex-shrink-0'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36v7.41C2 19.92 3.08 21 4.23 21h15.54C20.92 21 22 19.92 22 17.77V10.5c0-1.17-.81-2.7-1.8-3.39l-6.18-4.35c-1.4-.98-3.65-.93-5 .08z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 17v-3" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className='text-[18px] font-semibold text-BlackHomz'>Welcome to Homz! 🎉</h2>
                            <p className='text-[12px] text-GrayHomz mt-0.5'>You&apos;re on the <span className='font-semibold text-BlueHomz'>Free Plan</span></p>
                        </div>
                    </div>
                    <button onClick={handleDismiss}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <p className='text-[13px] text-GrayHomz mb-5 leading-relaxed'>
                    Your estate is set up and ready to go. Here&apos;s what&apos;s included in your current plan and what you can unlock by upgrading.
                </p>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-[#F6FFF8] border border-[#B2DFDB] rounded-[10px] p-4'>
                        <p className='text-[12px] font-semibold text-[#2E7D32] mb-3'>✓ Included in Free</p>
                        <div className='flex flex-col gap-2'>
                            {FREE_FEATURES.map((f) => (
                                <div key={f} className='flex items-start gap-2'>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className='mt-0.5 flex-shrink-0'>
                                        <path d="M5 12l5 5L20 7" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className='text-[11px] text-[#2E7D32] leading-snug'>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-[#FFF8F0] border border-[#FFCC80] rounded-[10px] p-4'>
                        <p className='text-[12px] font-semibold text-[#E65100] mb-3'>🔒 Unlock with Paid Plan</p>
                        <div className='flex flex-col gap-2'>
                            {LOCKED_FEATURES.map((f) => (
                                <div key={f} className='flex items-start gap-2'>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className='mt-0.5 flex-shrink-0'>
                                        <path d="M12 2C9.24 2 7 4.24 7 7v4H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-2V7c0-2.76-2.24-5-5-5z" stroke="#E65100" strokeWidth="1.5"/>
                                    </svg>
                                    <span className='text-[11px] text-[#E65100] leading-snug'>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleUpgrade}
                    className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity mb-3'
                >
                    Upgrade Plan — from ₦50,000/month
                </button>
                <button
                    onClick={handleDismiss}
                    className='w-full h-[44px] bg-[#F5F5F5] text-GrayHomz rounded-[8px] font-medium text-sm hover:bg-[#EBEBEB]'
                >
                    Continue with Free Plan
                </button>
            </div>
        </CustomModal>
    );
}

export default function FreePlanWelcomeModal() {
    return (
        <Suspense fallback={null}>
            <FreePlanWelcomeModalInner />
        </Suspense>
    );
}