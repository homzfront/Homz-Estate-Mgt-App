'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscriptionStore, FEATURE_LABELS } from '@/store/useSubscriptionStore';
import type { FeatureKey } from '@/store/useSubscriptionStore';
import { useAuthSlice } from '@/store/authStore';
import CustomModal from '@/components/general/customModal';

type Step = 'prompt' | 'redirecting';

// Standalone modal driven by the store — place once in the EM layout
export default function UpgradeModal() {
    const { showUpgradeModal, upgradeFeature, closeUpgradeModal, plans, initializePayment, getPlanTier } = useSubscriptionStore();
    const { communityProfile } = useAuthSlice();
    const communityManagerId = communityProfile?._id || '';
    const router = useRouter();
    const [step, setStep] = useState<Step>('prompt');

    if (!showUpgradeModal || !upgradeFeature) return null;

    const featureInfo = FEATURE_LABELS[upgradeFeature];
    const requiredPlanName = featureInfo?.requiredPlan || 'Paid';
    const currentTier = getPlanTier();

    // Find the required plan from the plans list
    const requiredPlan = plans.find(
        (p) => p.name.toLowerCase() === requiredPlanName.toLowerCase()
    );

    const handleUpgrade = async () => {
        if (!requiredPlan) {
            // No plan data yet — go to subscription page
            closeUpgradeModal();
            router.push('/subscription');
            return;
        }
        setStep('redirecting');
        try {
            const url = await initializePayment(requiredPlan._id, communityManagerId);
            if (url) {
                window.open(url, '_blank');
            } else {
                closeUpgradeModal();
                router.push('/subscription');
            }
        } catch {
            closeUpgradeModal();
            router.push('/subscription');
        }
    };

    const handleViewPlans = () => {
        closeUpgradeModal();
        router.push('/subscription');
    };

    // Refresh subscription when modal closes after redirect (webhook may have fired)
    const handleCloseAfterRedirect = () => {
        useSubscriptionStore.getState().fetchCurrent();
        closeUpgradeModal();
    };

    return (
        <CustomModal isOpen={showUpgradeModal} onRequestClose={closeUpgradeModal}>
            <div className='w-[480px] max-w-[95vw] bg-white rounded-[16px] p-8'>

                {step === 'redirecting' ? (
                    <div className='flex flex-col items-center gap-5 py-6'>
                        <div className='w-20 h-20 rounded-full border border-[#C7DCFF] flex items-center justify-center'>
                            <svg className='animate-spin' width="40" height="40" viewBox="0 0 48 48" fill="none">
                                {[0,1,2,3,4,5,6,7].map((i) => (
                                    <line key={i} x1="24" y1="6" x2="24" y2="14" stroke="#006AFF" strokeWidth="3" strokeLinecap="round"
                                        transform={`rotate(${i * 45} 24 24)`} strokeOpacity={1 - i * 0.1} />
                                ))}
                            </svg>
                        </div>
                        <p className='text-[16px] font-semibold text-BlackHomz'>Redirecting to secure payment...</p>
                        <button onClick={handleCloseAfterRedirect} className='text-sm text-GrayHomz hover:underline'>Done — I completed payment</button>
                    </div>
                ) : (
                    <>
                        {/* Close */}
                        <div className='flex justify-end mb-2'>
                            <button onClick={closeUpgradeModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className='flex flex-col items-center text-center gap-4'>
                            {/* Lock icon */}
                            <div className='w-20 h-20 rounded-full bg-[#EEF5FF] flex items-center justify-center'>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                                    <circle cx="12" cy="16" r="1.5" fill="#006AFF"/>
                                </svg>
                            </div>

                            {/* Plan badge */}
                            <span className='text-[11px] font-semibold px-3 py-1 rounded-full bg-[#EEF5FF] text-BlueHomz'>
                                {requiredPlanName} Plan Feature
                            </span>

                            <h3 className='text-[20px] font-semibold text-BlackHomz'>
                                Upgrade to {requiredPlanName}
                            </h3>

                            <p className='text-[13px] text-GrayHomz max-w-[340px] leading-relaxed'>
                                <span className='font-medium text-BlackHomz'>{featureInfo?.title}</span> is available on the {requiredPlanName} plan.
                                {' '}{featureInfo?.description}.
                            </p>

                            {/* Current vs required */}
                            <div className='w-full bg-[#F9FBFF] rounded-[10px] p-4 text-left'>
                                <div className='flex items-center justify-between mb-2'>
                                    <span className='text-[12px] text-GrayHomz'>Current Plan</span>
                                    <span className='text-[12px] font-semibold text-BlackHomz capitalize'>{currentTier}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-[12px] text-GrayHomz'>Required Plan</span>
                                    <span className='text-[12px] font-semibold text-BlueHomz'>{requiredPlanName}</span>
                                </div>
                                {requiredPlan && (requiredPlan.price ?? 0) > 0 && (
                                    <div className='flex items-center justify-between mt-2 pt-2 border-t border-[#E6E6E6]'>
                                        <span className='text-[12px] text-GrayHomz'>Price</span>
                                        <span className='text-[12px] font-semibold text-BlackHomz'>
                                            ₦{(requiredPlan.price ?? 0).toLocaleString()}/{requiredPlan.interval}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUpgrade}
                                className='w-full h-[48px] bg-BlueHomz text-white rounded-[8px] font-semibold text-sm hover:opacity-90 mt-2'
                            >
                                Upgrade to {requiredPlanName}
                            </button>
                            <button
                                onClick={handleViewPlans}
                                className='w-full h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[8px] font-medium text-sm hover:border-BlueHomz hover:text-BlueHomz transition-colors'
                            >
                                View All Plans
                            </button>
                        </div>
                    </>
                )}
            </div>
        </CustomModal>
    );
}