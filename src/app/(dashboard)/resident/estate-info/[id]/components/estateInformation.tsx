'use client';
import CopyIcon from '@/components/icons/copyIcon';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import api from '@/utils/api';
import React from 'react';
import toast from 'react-hot-toast';

interface EstateDetails {
    basicDetails?: {
        name?: string;
        location?: { area?: string; state?: string };
    };
    contactInformation?: {
        managerPhone?: string;
        emergencyPhone?: string;
        utilityServicesPhone?: string;
        securityPhone?: string;
    };
    bankDetails?: {
        accountNumber?: string;
        accountName?: string;
        bankName?: string;
    };
}

const CopyButton = ({ value }: { value: string | undefined }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Copied!', { duration: 1500, position: 'bottom-center' });
        } catch {
            toast.error('Failed to copy');
        }
    };

    if (!value) return null;

    return (
        <button
            onClick={handleCopy}
            className={`ml-2 transition-all duration-150 ${copied ? 'text-Success' : 'text-GrayHomz hover:text-BlueHomz'}`}
            title='Copy to clipboard'
        >
            {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ) : (
                <CopyIcon className='#A9A9A9' />
            )}
        </button>
    );
};

const Row = ({ label, value }: { label: string; value?: string }) => (
    <>
        <p className='text-sm text-BlackHomz font-medium md:font-normal'>{label}</p>
        <p className='text-sm text-GrayHomz font-normal flex flex-row md:items-center justify-between md:justify-normal gap-0 md:gap-2'>
            <span>{value || '—'}</span>
            <CopyButton value={value} />
        </p>
    </>
);

const EstateInformation = () => {
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const [estate, setEstate] = React.useState<EstateDetails | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const orgId = selectedEstate?.associatedIds?.organizationId;
        const estateId = selectedEstate?.estateId;
        if (!orgId || !estateId) { setLoading(false); return; }

        const fetchEstate = async () => {
            try {
                const res = await api.get(`/estates/public/single-estate/organizations/${orgId}/estates/${estateId}`);
                setEstate(res?.data?.data);
            } catch {
                // silent — show dashes
            } finally {
                setLoading(false);
            }
        };
        fetchEstate();
    }, [selectedEstate?.estateId, selectedEstate?.associatedIds?.organizationId]);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-40'>
                <div className='w-6 h-6 border-2 border-BlueHomz border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    const contact = estate?.contactInformation;
    const bank = estate?.bankDetails;
    const location = estate?.basicDetails?.location;

    return (
        <div>
            <div className='bg-[#FCFCFC] rounded-[12px] p-4'>
                <p className='text-sm md:text-[16px] font-normal text-GrayHomz mb-2'>Estate Information</p>
                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className='grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]'>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal'>Estate Name</p>
                        <p className='text-sm text-GrayHomz font-normal'>
                            {selectedEstate?.estateName || estate?.basicDetails?.name || '—'}
                        </p>
                        <p className='text-sm text-BlackHomz font-medium md:font-normal'>Location</p>
                        <p className='text-sm text-GrayHomz font-normal'>
                            {location?.area && location?.state
                                ? `${location.area}, ${location.state}`
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className='grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]'>
                        <Row label='Emergency Phone Number' value={contact?.emergencyPhone} />
                        <Row label='Utility Services Number' value={contact?.utilityServicesPhone} />
                        <Row label='Security Phone Number' value={contact?.securityPhone} />
                    </div>
                </div>
            </div>

            <div className='bg-[#FCFCFC] rounded-[12px] p-4 mt-5'>
                <p className='text-sm md:text-[16px] font-normal text-GrayHomz mb-2'>Community Manager Information</p>
                <div className='mt-4 p-6 bg-inputBg rounded-[8px]'>
                    <div className='grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]'>
                        <Row label="Manager's Phone Number" value={contact?.managerPhone} />
                        <Row label='Account Number' value={bank?.accountNumber} />
                        <Row label='Account Name' value={bank?.accountName} />
                        <Row label='Bank Name' value={bank?.bankName} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstateInformation;