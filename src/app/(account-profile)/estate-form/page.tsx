'use client';

import ArrowLeft from '@/components/icons/arrowRight';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    businessName?: string;
    businessAddress?: string;
};

const EstateManagerRegistration = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const router = useRouter();

    const onSubmit = async () => {
        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className='w-full bg-gradient-to-r from-BlueHomz2 to-BlueHomzDark py-[24px]'>
                <div className='w-full flex justify-center items-center'>
                    <Image
                        src={"/Homz_colorless.png"}
                        className="ml-2 cursor-pointer"
                        height={27}
                        width={131}
                        alt="img"
                        onClick={() => {
                            router.back()
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 w-full md:w-[60%]">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Estate Manager Registration</h1>
                    <p className="text-gray-600">
                        Monitor estate-wide activities, handle visitor access for Residents, manage bill payments,
                        and generate reports covering all properties in the estate.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="">
                    {/* Personal Information Section */}
                    <div className="mb-8 bg-[#FCFCFC] rounded-lg p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First name is required" })}
                                    placeholder="e.g Daniel"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    placeholder="e.g David"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^((\+234)+|0)[7-9]{1}[0-9]{9}$/,
                                        message: "Invalid phone number format"
                                    }
                                })}
                                placeholder="e.g 070 0000 0000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Business Information Section */}
                    <div className='bg-[#FCFCFC] rounded-lg p-6 sm:p-8'>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    {...register("businessName")}
                                    placeholder="e.g Builders Group Ltd"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Address
                                </label>
                                <input
                                    type="text"
                                    {...register("businessAddress")}
                                    placeholder="e.g 29 Shomolu estate, Lagos"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-10 w-full flex justify-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto items-center text-center bg-BlueHomz text-white py-3 rounded-[4px] hover:bg-BlueHomzDark transition duration-200 focus:outline-none focus:ring-2 focus:ring-BlueHomz focus:ring-offset-2"
                        >
                            <span className='flex gap-1 items-center justify-center px-4 text-center'>Proceed to Dashboard <ArrowLeft /></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EstateManagerRegistration