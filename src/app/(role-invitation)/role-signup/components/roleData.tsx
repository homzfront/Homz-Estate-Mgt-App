/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignupForm } from '@/hooks/useRoleSignupForm';
import React from 'react';


const RoleData = ({ setActive, form, handleInputChange }: { setActive: (n: number) => void; form: SignupForm; handleInputChange: (field: keyof SignupForm, value: string) => void }) => {
    const [errors, setErrors] = React.useState({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        businessName: false,
        businessAddress: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            firstName: !form.firstName.trim(),
            lastName: !form.lastName.trim(),
            phoneNumber: !form.phoneNumber.trim(),
            businessName: !form.businessName.trim(),
            businessAddress: !form.businessAddress.trim(),
        };
        setErrors(newErrors);
        const hasError = Object.values(newErrors).some(Boolean);
        if (!hasError) {
            setActive(1);
        }
    };

    return (
        <div className="p-6 w-full">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1 w-full text-sm'>
                    <h3 className='text-sm font-medium text-BlackHomz mb-1'>Email <span className='text-error'>*</span></h3>
                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                        {form.email ? form.email : ''}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <input className={`border rounded px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} type="text" value={form.firstName} onChange={e => handleInputChange('firstName', e.target.value)} required />
                        {errors.firstName && <span className="text-xs text-red-500">First name is required</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <input className={`border rounded px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} type="text" value={form.lastName} onChange={e => handleInputChange('lastName', e.target.value)} required />
                        {errors.lastName && <span className="text-xs text-red-500">Last name is required</span>}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <input className={`border rounded px-3 py-2 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} type="text" value={form.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} required />
                    {errors.phoneNumber && <span className="text-xs text-red-500">Phone number is required</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Business Name <span className="text-red-500">*</span></label>
                        <input className={`border rounded px-3 py-2 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`} type="text" value={form.businessName} onChange={e => handleInputChange('businessName', e.target.value)} required />
                        {errors.businessName && <span className="text-xs text-red-500">Business name is required</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Business Address <span className="text-red-500">*</span></label>
                        <input className={`border rounded px-3 py-2 ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'}`} type="text" value={form.businessAddress} onChange={e => handleInputChange('businessAddress', e.target.value)} required />
                        {errors.businessAddress && <span className="text-xs text-red-500">Business address is required</span>}
                    </div>
                </div>
                <div className="w-full">
                    <button type="submit" className="bg-BlueHomz text-white py-3 w-full text-[16px] rounded font-medium hover:bg-blue-700 transition-colors mt-4">Continue</button>
                </div>
            </form>
        </div>
    );
};

export default RoleData;