import CustomInput from '@/components/general/customInput'
import AddBlue from '@/components/icons/addBlue'
import useAreaStore from '@/store/useStateAndAreaStore/useAreaStore';
import useStateStore from '@/store/useStateAndAreaStore/useStateStore';
import React from 'react'
import Dropdown from './dropDown';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { EstateFormData, useEstateFormStore } from '@/store/useEstateFormStore';

interface EstateInfoProps {
    handleInputChange: (field: keyof EstateFormData, value: string) => void;
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

const EstateInfo = ({ handleInputChange, formData }: EstateInfoProps) => {
    const { stateList, loading } = useStateStore()
    const {
        setCoverPhoto,
        clearForm
    } = useEstateFormStore();
    const { chooseArea, loading: loadingArea, areaData } = useAreaStore();

    console.log("formData:", formData)

    React.useEffect(() => {
        if (formData?.state) {
            chooseArea(formData?.state)
        }
    }, [formData?.state])

    const handleImageUpload = () => {
        // Create a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/png';

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];

                // Check file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5MB');
                    return;
                }

                // Create a preview URL
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

    console.log("coverImage:", formData?.coverPhoto)

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
                                isLoading={loadingArea}
                                onSelect={(option) => handleInputChange('area', option)}
                                selectOption="Select Area"
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                            <Dropdown
                                options={stateList as any}
                                isLoading={loading}
                                onSelect={(option) => handleInputChange('state', option)}
                                selectOption="Select State"
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
                        {/* Image upload button or displayed image */}
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

                        {/* Delete button - only shown when image exists */}
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
                        label="Manager’s Phone Number"
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
                        Bank Account Details (Optional)
                    </h4>
                    <div className='flex flex-col gap-4'>
                        <CustomInput
                            label="Account Number"
                            placeholder="e.g 1524368709"
                            value={formData.accountNumber}
                            onValueChange={(value) => handleInputChange('accountNumber', value)}
                            required
                            type='number'
                            className='h-[45px] pl-4'
                        />
                        <CustomInput
                            label="Bank Name"
                            placeholder="e.g Access Bank"
                            value={formData.bankName}
                            onValueChange={(value) => handleInputChange('bankName', value)}
                            required
                            className='h-[45px] pl-4'
                        />
                        <CustomInput
                            label="Account Name"
                            placeholder="e.g Titi Idowu"
                            value={formData.accountName}
                            onValueChange={(value) => handleInputChange('accountName', value)}
                            required
                            className='h-[45px] pl-4'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstateInfo