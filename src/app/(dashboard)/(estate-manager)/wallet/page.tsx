'use client';
import WalletPage from '@/app/(dashboard)/components/wallet-page';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    const orgId = selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const estateId = selectedCommunity?.estate?._id || '';
    const { canUse, promptUpgrade, isLoadingCurrent } = useSubscriptionStore();
    const router = useRouter();

    // Show wallet content to all — subscription gate only blocks non-enterprise
    // Sub-users (viewer/security/account_manager) inherit owner's subscription
    const isSubUser = !['owner', 'admin'].includes(selectedCommunity?.role || '');
    const walletAllowed = isSubUser || canUse('wallet');

    if (!isLoadingCurrent && !walletAllowed) {
        return (
            <div className='p-8 w-full flex items-center justify-center min-h-[400px]'>
                <div className='max-w-[420px] w-full bg-white border border-[#E6E6E6] rounded-[16px] p-8 flex flex-col items-center gap-4 text-center'>
                    <div className='w-16 h-16 bg-[#EEF5FF] rounded-full flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" stroke="#006AFF" strokeWidth="1.5"/>
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#006AFF" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="12" cy="16" r="1.5" fill="#006AFF"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className='text-[18px] font-bold text-BlackHomz'>Enterprise Plan Required</h2>
                        <p className='text-[13px] text-GrayHomz mt-2 leading-relaxed'>
                            Wallet features are available on the Enterprise plan and above. Upgrade to collect payments and manage estate funds.
                        </p>
                    </div>
                    <button
                        onClick={() => { promptUpgrade('wallet'); router.push('/subscription'); }}
                        className='w-full h-[48px] bg-BlueHomz text-white rounded-[10px] font-semibold text-sm hover:opacity-90'
                    >
                        Upgrade to Enterprise
                    </button>
                    <button
                        onClick={() => router.back()}
                        className='w-full h-[44px] border border-[#E6E6E6] text-GrayHomz rounded-[10px] text-sm hover:bg-[#F5F5F5]'
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <WalletPage role='em' orgId={orgId} estateId={estateId} />;
}