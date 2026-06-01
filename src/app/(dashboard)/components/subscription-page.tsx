'use client';
import React, { useEffect, useState } from 'react';
import { useSubscriptionStore, SubscriptionPlan } from '@/store/useSubscriptionStore';
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import CustomModal from '@/components/general/customModal';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

// ── Icons ─────────────────────────────────────────────────────────────────────
const FreeIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36v7.41C2 19.92 3.08 21 4.23 21h15.54C20.92 21 22 19.92 22 17.77V10.5c0-1.17-.81-2.7-1.8-3.39l-6.18-4.35c-1.4-.98-3.65-.93-5 .08z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17v-3" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const EnterpriseIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M1 22h22M2.5 22V7.5L9 3l6.5 4.5V22M17 22V11l4.5-3V22" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22v-4.5h3V22" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PremiumIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M2.5 9.5L12 21.5l9.5-12L17 2.5H7L2.5 9.5z" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 2.5l2.5 7h5l2.5-7M2.5 9.5h19" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PlatinumIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M9.5 14.5C9.5 14.5 7.5 12 7.5 9C7.5 6 10 3.5 12 2.5C14 3.5 16.5 6 16.5 9C16.5 12 14.5 14.5 14.5 14.5" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.5 14.5L7 17.5L9 20L12 19L15 20L17 17.5L14.5 14.5" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="1.5" stroke="#006AFF" strokeWidth="1.5"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-[3px]">
        <path d="M5 12l5 5L20 7" stroke="#006AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// ── Static plan meta ──────────────────────────────────────────────────────────
const PLAN_META: Record<string, {
    subtitle: string;
    icon: React.ReactNode;
    cta: 'upgrade' | 'contact';
    features: string[];
    monthlyFallback: number;
    annualFallback: number;
}> = {
    Free: {
        subtitle: 'Adoption & Onboarding',
        icon: <FreeIcon />,
        cta: 'upgrade', // unused — overridden by isCurrent check
        monthlyFallback: 0,
        annualFallback: 0,
        features: [
            'Manage 1-50 residents',
            'Estate & resident authentication',
            'Resident list overview',
            'Basic access control (create & view codes)',
            'Multi-level estate roles',
            'Basic bill viewing and offline record',
            'Core visibility into estate payments',
        ],
    },
    Enterprise: {
        subtitle: 'Operations & Payments',
        icon: <EnterpriseIcon />,
        cta: 'upgrade',
        monthlyFallback: 50000,
        annualFallback: 600000,
        features: [
            'Manage 51-200 resident per estate',
            'Dependent & household accounts (spouse, staff, children)',
            'Bill creation, tracking, and mgt',
            'Internal estate payments',
            'Wallet enabled collections (residents top ups or transfers)',
            'Automated bill tracking & reconciliation',
            'Financial summaries and statement exports',
            'Billing and finance module access',
        ],
    },
    Premium: {
        subtitle: 'Scale, Automation & Integration',
        icon: <PremiumIcon />,
        cta: 'upgrade',
        monthlyFallback: 120000,
        annualFallback: 1440000,
        features: [
            'Manage unlimited resident per estate',
            'Everything in enterprise plan plus',
            'Wallet activation & advanced payment automation',
            'External bill payments (utilities, LAWMA, government, land-use, etc)',
            'Automated estate settlement and paystack payouts',
        ],
    },
    Platinum: {
        subtitle: 'Advanced',
        icon: <PlatinumIcon />,
        cta: 'contact',
        monthlyFallback: 0,
        annualFallback: 0,
        features: [
            'Everything in premium plan plus',
            'Advanced access logs, reports, and exports',
            'Multi estate management and administration',
            'Advanced analytics dashboard',
            'Priority or enterprise support',
            'Training and physical deployment',
        ],
    },
};

const PLAN_ORDER = ['Free', 'Enterprise', 'Premium', 'Platinum'];
type BillingCycle = 'monthly' | 'annually';
type ModalStep = 'confirm' | 'redirecting' | 'failed';

function formatNaira(n: number | undefined | null) {
    if (!n || isNaN(n)) return '₦0';
    return `₦${n.toLocaleString('en-NG')}`;
}

function isValidObjectId(id: string) {
    return /^[a-f0-9]{24}$/i.test(id);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
    const { plans, current, isLoadingPlans, fetchPlans, fetchCurrent, initializePayment, getPlanTier } = useSubscriptionStore();
    const { communityProfile } = useAuthSlice();
    const selectedCommunity = useSelectedCommunity(s => s.selectedCommunity);
    const searchParams = useSearchParams();

    const [billing, setBilling] = useState<BillingCycle>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [modalStep, setModalStep] = useState<ModalStep>('confirm');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchPlans();
        // Always fetch current subscription on mount to ensure fresh tier detection
        // (persisted planId can lose populated shape after localStorage serialization)
        const estId = selectedCommunity?.estateId || selectedCommunity?.estate?._id || undefined;
        fetchCurrent(estId).catch(() => {});
        if (searchParams?.get('ref') === 'paystack') {
            // After payment redirect, wait 2.5s then re-fetch to catch activation delay
            const t = setTimeout(() => fetchCurrent(estId), 2500);
            return () => clearTimeout(t);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentTier = getPlanTier();

    // communityProfile._id is the definitive community manager ID
    // It comes from /community-manager/current-profile which is always loaded at login
    // selectedCommunity.associatedIds.communityManagerId is a backup (same value, persisted)
    const organizationId: string = selectedCommunity?.associatedIds?.organizationId || '';
    const estateId: string = selectedCommunity?.estateId || selectedCommunity?.estate?._id || '';
    const communityManagerId: string =
        (communityProfile?._id as string) ||
        (selectedCommunity?.associatedIds?.communityManagerId as string) ||
        '';

    const currentTierIndex = PLAN_ORDER.findIndex(p => p.toLowerCase() === currentTier);

    const isCurrentPlan = (name: string) => {
        if (!current || current.status !== 'active') return name === 'Free';
        return currentTier === name.toLowerCase();
    };

    // Plans below the current tier are already included — disable their buttons
    const isBelowCurrent = (name: string) => {
        const idx = PLAN_ORDER.findIndex(p => p.toLowerCase() === name.toLowerCase());
        return idx < currentTierIndex;
    };

    const getPrice = (name: string, apiPlan: SubscriptionPlan | null) => {
        const meta = PLAN_META[name];
        if (!meta) return 0;
        if (apiPlan) return billing === 'annually' ? apiPlan.annualPrice : apiPlan.monthlyPrice;
        return billing === 'annually' ? meta.annualFallback : meta.monthlyFallback;
    };

    const handleClickUpgrade = (name: string) => {
        // Find real plan from API
        const apiPlan = plans.find(p => p.name === name);

        if (!apiPlan) {
            toast.error('Plans are still loading. Please wait a moment.');
            return;
        }

        if (!isValidObjectId(apiPlan._id)) {
            toast.error('Invalid plan ID. Please refresh the page.');
            return;
        }

        if (!communityManagerId) {
            toast.error('Account not fully loaded. Please refresh the page.');
            return;
        }

        setSelectedPlan(apiPlan);
        setModalStep('confirm');
        setErrorMsg('');
    };

    const handleConfirmPayment = async () => {
        if (!selectedPlan) return;

        // Final safety checks before API call
        if (!communityManagerId) {
            setModalStep('failed');
            setErrorMsg('Could not identify your account. Please refresh the page and try again.');
            return;
        }
        if (!isValidObjectId(selectedPlan._id)) {
            setModalStep('failed');
            setErrorMsg('Invalid plan data. Please refresh the page and try again.');
            return;
        }

        setModalStep('redirecting');
        try {
            const url = await initializePayment(selectedPlan._id, communityManagerId, billing, organizationId, estateId);
            if (url) {
                window.location.href = url;
            } else {
                setModalStep('failed');
                setErrorMsg('Could not get payment URL. Please try again.');
            }
        } catch (err: any) {
            setModalStep('failed');
            const msg = err?.response?.data?.message;
            setErrorMsg(Array.isArray(msg) ? msg[0] : (msg || err?.message || 'Payment initialization failed.'));
        }
    };

    const activePlanName = currentTier !== 'free'
        ? currentTier.charAt(0).toUpperCase() + currentTier.slice(1)
        : null;

    return (
        <div className="p-6 w-full">

            {/* Active plan banner */}
            {activePlanName && current && (
                <div className="mb-6 bg-[#EEF5FF] border border-[#C8DEFF] rounded-[12px] px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-BlueHomz rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-BlueHomz">Active Plan: {activePlanName}</p>
                            <p className="text-[11px] text-GrayHomz mt-0.5">
                                {current.authorizationCode ? 'Auto-renews' : 'Renews'} on {new Date(current.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-BlueHomz bg-white border border-[#C8DEFF] px-3 py-1 rounded-full">Active</span>
                </div>
            )}

            {/* Billing toggle */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-[#1A1A1A] rounded-full p-1">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`min-w-[120px] h-[44px] px-6 rounded-full text-[15px] font-medium transition-all whitespace-nowrap ${billing === 'monthly' ? 'bg-white text-BlueHomz shadow-sm' : 'text-[#9E9E9E] hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('annually')}
                        className={`min-w-[120px] h-[44px] px-6 rounded-full text-[15px] font-medium transition-all whitespace-nowrap ${billing === 'annually' ? 'bg-white text-BlueHomz shadow-sm' : 'text-[#9E9E9E] hover:text-white'}`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Plan cards */}
            <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {PLAN_ORDER.map(name => {
                    const meta = PLAN_META[name];
                    const apiPlan = plans.find(p => p.name === name) ?? null;
                    const isCurrent = isCurrentPlan(name);
                    const price = getPrice(name, apiPlan);
                    const period = billing === 'monthly' ? 'month' : 'year';

                    return (
                        <div
                            key={name}
                            className="bg-white rounded-[16px] flex flex-col border border-[#E0E0E0] hover:border-BlueHomz hover:shadow-[0_4px_20px_rgba(0,106,255,0.12)] transition-all duration-200 flex-shrink-0"
                            style={{ width: 'calc(25% - 15px)', minWidth: '240px' }}
                        >
                            {/* Header */}
                            <div className="px-5 pt-5 pb-3">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-11 h-11 bg-[#EEF5FF] rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {meta.icon}
                                    </div>
                                    <div>
                                        <p className="text-[16px] font-bold text-BlackHomz leading-tight">{name}</p>
                                        <p className="text-[12px] text-GrayHomz leading-snug mt-0.5">{meta.subtitle}</p>
                                    </div>
                                </div>
                                <div className="h-[2px] bg-BlueHomz rounded-full mb-4" />
                                <div className="min-h-[44px] flex items-end">
                                    {isLoadingPlans ? (
                                        <div className="h-8 w-32 bg-[#F0F0F0] rounded animate-pulse" />
                                    ) : price > 0 ? (
                                        <p className="leading-none">
                                            <span className="text-[26px] font-bold text-BlueHomz">{formatNaira(price)}</span>
                                            <span className="text-[13px] font-normal text-GrayHomz">/{period}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="px-5 flex-1 pt-2">
                                <ul className="flex flex-col gap-3">
                                    {meta.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <CheckIcon />
                                            <span className="text-[13px] text-GrayHomz leading-snug">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="px-5 pb-5 pt-6">
                                {isCurrent ? (
                                    <button disabled className="w-full h-[46px] rounded-[8px] text-[13px] font-semibold bg-[#EEF5FF] text-BlueHomz cursor-default">
                                        Current Plan
                                    </button>
                                ) : isBelowCurrent(name) ? (
                                    <button disabled className="w-full h-[46px] rounded-[8px] text-[13px] font-semibold bg-[#F5F5F5] text-GrayHomz cursor-default">
                                        Included in your plan
                                    </button>
                                ) : meta.cta === 'contact' ? (
                                    <button
                                        onClick={() => {
                                            toast('Opening your email client...', {
                                                icon: '✉️',
                                                position: 'top-center',
                                                duration: 3000,
                                            });
                                            setTimeout(() => window.open('mailto:sales@homz.ng?subject=Enterprise Plan Enquiry', '_blank'), 300);
                                        }}
                                        className="w-full h-[46px] rounded-[8px] text-[13px] font-semibold bg-BlueHomz text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Contact Sales
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleClickUpgrade(name)}
                                        className="w-full h-[46px] rounded-[8px] text-[13px] font-semibold bg-BlueHomz text-white hover:opacity-90 transition-opacity"
                                    >
                                        Upgrade Plan
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment modal */}
            <CustomModal
                isOpen={!!selectedPlan}
                onRequestClose={() => {
                    if (modalStep !== 'redirecting') {
                        setSelectedPlan(null);
                        setModalStep('confirm');
                    }
                }}
            >
                {selectedPlan && (
                    <div className="w-[420px] max-w-[95vw] bg-white rounded-[20px] p-8 flex flex-col items-center gap-5">

                        {modalStep === 'confirm' && (
                            <>
                                <div className="w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center">
                                    {PLAN_META[selectedPlan.name]?.icon}
                                </div>
                                <div className="text-center">
                                    <h2 className="text-[20px] font-bold text-BlackHomz">Upgrade to {selectedPlan.name}</h2>
                                    <p className="text-[13px] text-GrayHomz mt-1">
                                        {formatNaira(billing === 'annually' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)}/{billing === 'monthly' ? 'month' : 'year'}
                                    </p>
                                    <p className="text-[12px] text-GrayHomz mt-0.5 capitalize">Billed {billing}</p>
                                </div>
                                <p className="text-[13px] text-GrayHomz text-center">
                                    You&apos;ll be redirected to Paystack to complete your payment securely.
                                </p>
                                <button onClick={handleConfirmPayment} className="w-full h-[50px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90">
                                    Proceed to Payment
                                </button>
                                <button onClick={() => setSelectedPlan(null)} className="w-full h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[10px] text-sm font-medium hover:bg-[#F5F5F5]">
                                    Cancel
                                </button>
                            </>
                        )}

                        {modalStep === 'redirecting' && (
                            <>
                                <div className="w-14 h-14 bg-[#EEF5FF] rounded-full flex items-center justify-center">
                                    <div className="w-7 h-7 border-[3px] border-BlueHomz border-t-transparent rounded-full animate-spin" />
                                </div>
                                <h2 className="text-[18px] font-bold text-BlackHomz text-center">Redirecting to payment...</h2>
                                <p className="text-sm text-GrayHomz text-center">Please wait while we redirect you to Paystack.</p>
                            </>
                        )}

                        {modalStep === 'failed' && (
                            <>
                                <div className="w-16 h-16 rounded-full border-[3px] border-red-400 flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <h2 className="text-[20px] font-bold text-BlackHomz text-center">Payment Failed</h2>
                                <p className="text-sm text-GrayHomz text-center">{errorMsg}</p>
                                <button onClick={() => setModalStep('confirm')} className="w-full h-[50px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90">
                                    Retry
                                </button>
                                <button onClick={() => { setSelectedPlan(null); setModalStep('confirm'); }} className="w-full h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[10px] text-sm font-medium hover:bg-[#F5F5F5]">
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                )}
            </CustomModal>
        </div>
    );
}