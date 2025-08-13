import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import AddBlue from '@/components/icons/addBlue'
import React from 'react'

interface EstateInfoProps {
    handleInputChange: (field: string, value: string) => void;
    formData: {
        estateName: string;
        area: string;
        state: string;
    };
}

const EstateInfo = ({ handleInputChange, formData }: EstateInfoProps) => {
    const areaOptions = [
        { id: 1, label: "Lekki Phase 1" },
        { id: 2, label: "Victoria Island" },
        { id: 3, label: "Ikoyi" }
    ];

    const stateOptions = [
        { id: 1, label: "Lagos" },
        { id: 2, label: "Abuja" },
        { id: 3, label: "Rivers" }
    ];


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
                        <div className='flex flex-col md:flex-row gap-4 '>
                            <Dropdown
                                options={areaOptions}
                                onSelect={(option) => handleInputChange('area', option.label)}
                                selectOption="Select Area"
                                showSearch={false}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                            <Dropdown
                                options={stateOptions}
                                onSelect={(option) => handleInputChange('state', option.label)}
                                selectOption="Select State"
                                showSearch={false}
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
                    <button className='h-[99px] rounded-[7px] w-[99px] bg-[#EEF5FF] flex justify-center items-center cursor-pointer'>
                        <AddBlue />
                    </button>
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
                        value={formData.estateName}
                        onValueChange={(value) => handleInputChange('estateName', value)}
                        required
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label="Emergency Phone Number (optional)"
                        placeholder="e.g 0701 234 5678"
                        value={formData.estateName}
                        onValueChange={(value) => handleInputChange('estateName', value)}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label="Utility Services Phone Number (Dry cleaning, Waste disposal, etc)"
                        placeholder="e.g 0701 234 5678"
                        value={formData.estateName}
                        onValueChange={(value) => handleInputChange('estateName', value)}
                        className='h-[45px] pl-4'
                    />
                    <CustomInput
                        label="Security  Phone Number (optional)"
                        placeholder="e.g 0701 234 5678"
                        value={formData.estateName}
                        onValueChange={(value) => handleInputChange('estateName', value)}
                        className='h-[45px] pl-4'
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
                            value={formData.estateName}
                            onValueChange={(value) => handleInputChange('estateName', value)}
                            required
                            className='h-[45px] pl-4'
                        />
                        <div className='flex flex-col gap-1 w-full text-sm'>
                            <div className='mb-1'>Bank Name <span className='text-error'>*</span></div>
                            <Dropdown
                                options={areaOptions}
                                onSelect={(option) => handleInputChange('area', option.label)}
                                selectOption="Access Bank"
                                showSearch={false}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm'>
                            <h3 className='mb-1'>Account Name</h3>
                            <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                Auto-filled
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstateInfo