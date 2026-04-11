/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomInput from '@/components/general/customInput'
import AddBlue from '@/components/icons/addBlue'
import useAreaStore from '@/store/useStateAndAreaStore/useAreaStore';
import useStateStore from '@/store/useStateAndAreaStore/useStateStore';
import React from 'react'
import Dropdown from './dropDown';
import AppDropdown from '@/components/general/dropDown';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { EstateFormData, useEstateFormStore } from '@/store/useEstateFormStore';
import api from '@/utils/api';

interface EstateInfoProps {
    handleInputChange: (field: keyof EstateFormData, value: string) => void;
    readOnly?: boolean;
    hideBankDetails?: boolean;
    formData: {
        estateName: string;
        area: string;
        state: string;
        managerPhone: string;
        utilityPhone: string;
        accountNumber: string;
        bankName: string;
        accountName: string;
        emergencyPhone: string;
        securityPhone: string;
        coverPhoto: any;
    };
}

interface NigerianBank {
    name: string;
    code: string;
}

const EstateInfo = ({ handleInputChange, formData, readOnly = false, hideBankDetails = false }: EstateInfoProps) => {
    const { stateList, loading } = useStateStore()
    const {
        setCoverPhoto,
    } = useEstateFormStore();
    const { chooseArea, loading: loadingArea, areaData } = useAreaStore();

    const [banks, setBanks] = React.useState<NigerianBank[]>([]);
    const [selectedBankCode, setSelectedBankCode] = React.useState('');
    const [resolvingAccount, setResolvingAccount] = React.useState(false);

    // Only show loading indicator if there's no data yet (first load)
    const shouldShowStateLoading = loading && (!stateList || stateList.length === 0);
    const shouldShowAreaLoading = loadingArea && (!areaData || areaData.length === 0);

    React.useEffect(() => {
        if (formData?.state) {
            chooseArea(formData?.state)
        }
    }, [formData?.state, chooseArea])

    // Fetch Nigerian bank list from backend (which proxies Paystack securely)
    React.useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await api.get('/state-area/banks');
                const data = res.data;
                if (data.success && data.data) {
                    // Deduplicate by code since Paystack sometimes returns duplicate bank codes
                    const seen = new Set<string>();
                    const unique = data.data.filter((b: any) => {
                        if (seen.has(b.code)) return false;
                        seen.add(b.code);
                        return true;
                    });
                    setBanks(unique.map((b: any) => ({ name: b.name, code: b.code })));
                }
            } catch {
                // Silently fail - bank list is optional
            }
        };
        fetchBanks();
    }, []);

    // Auto-resolve account name when account number (10 digits) + bank are both set
    React.useEffect(() => {
        const acctNum = formData.accountNumber?.replace(/\D/g, '');
        if (acctNum?.length !== 10 || !selectedBankCode) return;

        const resolve = async () => {
            setResolvingAccount(true);
            try {
                const res = await api.get(`/state-area/bank/resolve?account_number=${acctNum}&bank_code=${selectedBankCode}`);
                const data = res.data;
                if (data.success && data.data?.account_name) {
                    handleInputChange('accountName', data.data.account_name);
                } else {
                    handleInputChange('accountName', '');
                    toast.error('Could not verify account. Please check the number and bank.');
                }
            } catch {
                handleInputChange('accountName', '');
                toast.error('Account verification failed. Please try again.');
            } finally {
                setResolvingAccount(false);
            }
        };

        resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.accountNumber, selectedBankCode]);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/png';

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];

                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    setCoverPhoto(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    };

    const handleImageRemove = () => {
        setCoverPhoto(null);
    };

    return (
        <div className="mt-8 space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="space-y-4 bg-[#FCFCFC] rounded-[12px] p-4">
                    <CustomInput
                        label="Estate Name"
                        placeholder="Enter estate name"
                        value={formData.estateName}
                        onValueChange={(value) => handleInputChange('estateName', value)}
                        required
                        className='h-[45px] pl-4'
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estate Location<span className='text-error'>*</span></label>
                        <div className='flex flex-col-reverse md:flex-row-reverse gap-4 '>
                            <Dropdown
                                options={areaData as any}
                                isLoading={shouldShowAreaLoading}
                                onSelect={(option) => handleInputChange('area', option)}
                                selectOption={formData?.area ? formData?.area : "Select Area"}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                            <Dropdown
                                options={stateList as any}
                                isLoading={shouldShowStateLoading}
                                onSelect={(option) => handleInputChange('state', option)}
                                selectOption={formData?.state ? formData?.state : "Select State"}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                    </div>
                </div>
                <div className='space-y-4 bg-[#FCFCFC] rounded-[12px] p-4'>
                    <div className='border-b pb-2 border-[#E6E6E6]'>
                        <h3 className='text-[16px] font-medium text-BlackHomz'>Add Cover Photo <span className='text-GrayHomz'>(optional)</span></h3>
                        <h6 className='text-sm font-normal text-GrayHomz'>Supported formats are .jpg and .png up to 5 mb</h6>
                    </div>

                    <div className='flex items-start gap-2'>
                        {!formData?.coverPhoto ? (
                            <button
                                className='h-[99px] rounded-[7px] w-[99px] bg-[#EEF5FF] flex justify-center items-center cursor-pointer'
                                onClick={handleImageUpload}
                            >
                                <AddBlue />
                            </button>
                        ) : (
                            <div className='relative'>
                                <Image
                                    src={formData?.coverPhoto}
                                    height={99}
                                    width={99}
                                    className="h-[99px] w-[99px] rounded-[7px] object-cover"
                                    alt="Cover photo"
                                />
                            </div>
                        )}

                        {formData?.coverPhoto && (
                            <button
                                onClick={handleImageRemove}
                                className='mt-2'
                            >
                                <Image
                                    src="/trush-square.png"
                                    height={24}
                                    width={24}
                                    className="cursor-pointer"
                                    alt="Delete image"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-[#FCFCFC] p-4">
                <h4 className='text-[#A9A9A9] font-normal text-[16px]'>
                    Contact Information
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <CustomInput
                        label="Manager's Phone Number"
                        placeholder="e.g 0701 234 5678"
                        value={formData.managerPhone}
                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                        required
                        className='h-[45px] pl-4'
                        type='number'
                    />
                    <CustomInput
                        label="Emergency Phone Number (optional)"
                        placeholder="e.g 0701 234 5678"
                        type='number'
                        value={formData.emergencyPhone}
                        onValueChange={(value) => handleInputChange('emergencyPhone', value)}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label="Utility Services Phone Number (Dry cleaning, Waste disposal, etc)"
                        placeholder="e.g 0701 234 5678"
                        value={formData.utilityPhone}
                        onValueChange={(value) => handleInputChange('utilityPhone', value)}
                        className='h-[45px] pl-4'
                        type='number'
                    />
                    <CustomInput
                        label="Security  Phone Number (optional)"
                        placeholder="e.g 0701 234 5678"
                        value={formData.securityPhone}
                        onValueChange={(value) => handleInputChange('securityPhone', value)}
                        className='h-[45px] pl-4'
                        type='number'
                    />
                </div>
            </div>
            <div className="bg-[#FCFCFC] p-4 grid grid-cols-1 md:grid-cols-2">
                <div className='space-y-4'>
                    <h4 className='text-[#A9A9A9] font-normal text-[16px]'>
                        Bank Account Details
                    </h4>
                    {hideBankDetails ? (
                        <div className='flex flex-col gap-2 py-4'>
                            <p className='text-sm text-GrayHomz'>Bank account details are hidden for your role.</p>
                        </div>
                    ) : (
                    <div className='flex flex-col gap-4'>
                        <CustomInput
                            label="Account Number"
                            placeholder="e.g 1524368709"
                            value={formData.accountNumber}
                            onValueChange={(value) => !readOnly && handleInputChange('accountNumber', value)}
                            type='number'
                            required={!readOnly}
                            disabled={readOnly}
                            className='h-[45px] pl-4'
                        />
                        {/* Bank selector — searchable dropdown populated from Paystack bank list */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name {!readOnly && <span className='text-error'>*</span>}</label>
                            {readOnly ? (
                                <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4 text-sm text-GrayHomz'>
                                    {formData.bankName || '—'}
                                </span>
                            ) : (
                                <AppDropdown
                                    options={banks.map(b => ({ id: b.code, label: b.name }))}
                                    onSelect={(option) => {
                                        setSelectedBankCode(String(option.id));
                                        handleInputChange('bankName', option.label);
                                    }}
                                    selectOption={formData.bankName || 'Search or select bank'}
                                    selectedId={selectedBankCode || null}
                                    showSearch={true}
                                    height='h-[45px]'
                                    borderColor='border-[#A9A9A9]'
                                    arrowColor='#A9A9A9'
                                    displayMode='portal'
                                    isLoading={banks.length === 0}
                                />
                            )}
                        </div>
                        {/* Account name */}
                        <div className='relative'>
                            <CustomInput
                                label="Account Name"
                                placeholder={resolvingAccount ? 'Verifying...' : 'Auto-filled after entering account number'}
                                value={formData.accountName}
                                onValueChange={(value) => !readOnly && handleInputChange('accountName', value)}
                                className={`h-[45px] pl-4 ${resolvingAccount ? 'opacity-60' : ''}`}
                                disabled={resolvingAccount || readOnly}
                            />
                            {resolvingAccount && (
                                <span className='absolute right-3 top-[38px] text-xs text-GrayHomz animate-pulse'>
                                    Verifying...
                                </span>
                            )}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EstateInfo