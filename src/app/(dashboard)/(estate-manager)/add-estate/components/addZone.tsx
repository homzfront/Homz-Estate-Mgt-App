import CustomInput from '@/components/general/customInput';
import AddIcon from '@/components/icons/addIcon';
import MiniClose from '@/components/icons/miniClose';
import React from 'react'

interface AddZoneProps {
    handleInputChange: (field: string, value: string) => void;
    formData: {
        managerPhone: string;
        area: string;
        state: string;
    };
}
const AddZone = ({ handleInputChange, formData }: AddZoneProps) => {
    return (
        <div className="mt-8">
            <div className="space-y-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <CustomInput
                        label="Zone Name (optional)"
                        placeholder="Zone A"
                        type="tel"
                        value={formData.managerPhone}
                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                        className='h-[45px] pl-4'
                    />
                    <div className='relative'>
                        <CustomInput
                            label="Zone Name (optional)"
                            placeholder="Zone B"
                            type="tel"
                            value={formData.managerPhone}
                            onValueChange={(value) => handleInputChange('managerPhone', value)}
                            className='h-[45px] pl-4'
                        />
                        <button className='absolute top-[40px] right-3'>
                            <MiniClose />
                        </button>
                    </div>
                    <div className='relative'>
                        <CustomInput
                            label="Zone Name (optional)"
                            placeholder="Zone C"
                            type="tel"
                            value={formData.managerPhone}
                            onValueChange={(value) => handleInputChange('managerPhone', value)}
                            className='h-[45px] pl-4'
                        />
                        <button className='absolute top-[40px] right-3'>
                            <MiniClose />
                        </button>
                    </div>
                    <div className='relative'>
                        <CustomInput
                            label="Zone Name (optional)"
                            placeholder="Zone D"
                            type="tel"
                            value={formData.managerPhone}
                            onValueChange={(value) => handleInputChange('managerPhone', value)}
                            className='h-[45px] pl-4'
                        />
                        <button className='absolute top-[40px] right-3'>
                            <MiniClose />
                        </button>
                    </div>
                    <div className='relative'>
                        <CustomInput
                            label="Zone Name (optional)"
                            placeholder="Zone E"
                            type="tel"
                            value={formData.managerPhone}
                            onValueChange={(value) => handleInputChange('managerPhone', value)}
                            className='h-[45px] pl-4'
                        />
                        <button className='absolute top-[40px] right-3'>
                            <MiniClose />
                        </button>
                    </div>
                </div>
                <button className='text-sm md:text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Add New Zone</button>
            </div>
        </div>
    )
}

export default AddZone