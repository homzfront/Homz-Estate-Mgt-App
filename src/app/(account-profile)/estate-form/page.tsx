/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { removeEmptyFields } from '@/app/utils/removeEmptyFields';
import DotLoader from '@/components/general/dotLoader';
import ArrowLeft from '@/components/icons/arrowRight';
import { useAuthSlice } from '@/store/authStore';
import api from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { getErrorMessage } from '@/utils/errorMessage';

type FormValues = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    businessName?: string;
    businessAddress?: string;
};

const EstateManagerRegistration = () => {
    const [loading, setLoading] = React.useState(false);
    const { setUserAccountDetails } = useAuthSlice()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValues>();

    const router = useRouter();

    // Function to normalize phone numbers to consistent format
    const normalizePhoneNumber = (phone: string): string => {
        // Remove all spaces and non-digit characters except +
        let cleaned = phone.replace(/[^\d+]/g, '');

        // If starts with +234, convert to 0 format
        if (cleaned.startsWith('+234')) {
            return '0' + cleaned.substring(4);
        }

        // If starts with 234 (without +), convert to 0 format
        if (cleaned.startsWith('234')) {
            return '0' + cleaned.substring(3);
        }

        // If already starts with 0, return as is
        if (cleaned.startsWith('0')) {
            return cleaned;
        }

        // If it's just the local number, add 0 prefix
        return '0' + cleaned;
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            // Normalize phone number before sending
            const normalizedPhone = normalizePhoneNumber(data.phoneNumber);

            // Prepare the payload in the required format
            const payload: any = {
                personal: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: normalizedPhone
                }
            };

            if (data.businessName || data.businessAddress) {
                payload.business = {
                    businessName: data.businessName || '',
                    businessAddress: data.businessAddress || ''
                };
            }


            // POST request to create profile
            await api.post("/community-manager/create-profile", removeEmptyFields(payload));

            // Show success toast
            toast.success("Profile created successfully!", {
                position: "top-center",
                duration: 2000,
                style: {
                    background: "#E8F5E9",
                    color: "#2E7D32",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });

            // GET request to fetch current profile
            const currentProfileResponse = await api.get('/community-manager/current-profile');
            setUserAccountDetails(currentProfileResponse?.data?.data)

            // Redirect to add-estate — user must create an estate before accessing the dashboard
            router.push("/add-estate");
        } catch (error: any) {
            const message = getErrorMessage(error, "An error occurred during registration.");

            toast.error(message, {
                position: "top-center",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Community Manager Registration</h1>
                    <p className="text-gray-600">
                        Monitor community-wide activities, handle visitor access for Residents, manage bill payments,
                        and generate reports covering all properties in the community.
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
                                        value: /^(\+234|0)[7-9][0-9]{9}$/,
                                        message: "Invalid phone number format. Use +234XXXXXXXXXX or 0XXXXXXXXXX"
                                    }
                                })}
                                placeholder="e.g 070 0000 0000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-BlueHomz"
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Phone numbers will be normalized to standard format (e.g., +234XXXXXXXXXX → 0XXXXXXXXXX)</p>
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
                            className={`w-full md:w-auto md:min-w-[225px] items-center text-center bg-BlueHomz text-white py-3 rounded-[4px] hover:bg-BlueHomzDark transition duration-200 focus:outline-none focus:ring-2 focus:ring-BlueHomz focus:ring-offset-2
                            ${loading ? "pointer-events-none flex justify-center h-[48px]" : ""}
                            `}
                        >
                            <span className='flex gap-1 items-center justify-center px-4 text-center'> {loading ? <DotLoader /> : <>Proceed to Dashboard <ArrowLeft /></>}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EstateManagerRegistration;