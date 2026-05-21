'use client';
import WalletPage from '@/app/(dashboard)/components/wallet-page';
import KycGuard from '@/app/(dashboard)/components/KycGuard';
import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';

export default function Page() {
    const { residentCommunity } = useResidentCommunity();
    const selectedEstate = useSelectedEsate((s) => s.selectedEstate);
    const active = selectedEstate || residentCommunity?.[0];
    const orgId = active?.associatedIds?.organizationId || '';
    const estateId = active?.estateId || '';

    return (
        <KycGuard role='resident'>
            <WalletPage role='resident' orgId={orgId} estateId={estateId} />
        </KycGuard>
    );
}