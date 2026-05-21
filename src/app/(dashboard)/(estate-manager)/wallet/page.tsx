'use client';
import WalletPage from '@/app/(dashboard)/components/wallet-page';
import KycGuard from '@/app/(dashboard)/components/KycGuard';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';

export default function Page() {
    const selectedCommunity = useSelectedCommunity((s) => s.selectedCommunity);
    const orgId = selectedCommunity?.estate?.associatedIds?.organizationId || '';
    const estateId = selectedCommunity?.estate?._id || '';

    return (
        <KycGuard role='em'>
            <WalletPage role='em' orgId={orgId} estateId={estateId} />
        </KycGuard>
    );
}