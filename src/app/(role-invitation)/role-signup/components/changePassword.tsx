/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import React, { useState } from "react";
import DotLoader from "@/components/general/dotLoader";
import toast from "react-hot-toast";
import { useAuthSlice } from "@/store/authStore";
import api from "@/utils/api";
import { storeToken } from "@/utils/cookies";
import { useSelectedEsate } from "@/store/useSelectedEstate";
import { useResidentCommunity } from "@/store/useResidentCommunity";
import { SignupForm } from "@/hooks/useRoleSignupForm";
import { useRouter } from "next/navigation";

interface PasswordProps {
    form: SignupForm;
    handleInputChange: (field: keyof SignupForm, value: string) => void;
    params: any;
}
const ChangePassword = ({ form, handleInputChange, params }: PasswordProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isSigningUP, setIsSigningUp] = useState(false);
    const router = useRouter();
    const { getResidentProfile, setUserData } = useAuthSlice();
    const setSelectedEstate = useSelectedEsate((state) => state.setSelectedEstate);
    const { setResidentCommunity } = useResidentCommunity();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSigningUp(true);
        setPasswordError("");
        try {
            const payload = {
                auth: {
                    email: form.email,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                },
                communityManager: {
                    personal: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        phoneNumber: form.phoneNumber,
                    },
                    business: {
                        businessName: form.businessName,
                        businessAddress: form.businessAddress,
                    },
                },
            };
            const res = await api.post('/auth/community-member/sign-up', payload);


            // Check if the request was successful
            if (res.status < 200 || res.status >= 300) {
                const errorData = res.data;
                throw new Error(errorData.message || 'Failed to update password');
            }

            const responseData = res.data;

            // Store tokens using the right keys
            await storeToken({
                token: responseData?.data?.accessToken,
                refresh_token: responseData?.data?.refreshToken,
            });
            
            const communityManagerId = responseData.data?.userId;
            if (communityManagerId) {
                const payload = {
                    "validationIds": {
                        "estateId": params.estateId,
                        "organizationId": params.organizationId
                    }
                }
                const res = await api.post(`/estates-roles-permission-invitation/accept/community-manager/${communityManagerId}/tokens/${params.invitation}`, payload);
                toast.success('Account created and invite accepted!');
            } else {
                toast.error('Account creation failed.');
            }

            // Fetch user profile
            const profile = await api.get("/auth/current-user");

            // Store user data
            setUserData(profile.data.data);

            const responseTwo: any = await api.get(`estates/resident/all-estates/users/${profile.data.data?._id}`);
            // console.log("Resident Estate Response:", response);
            setResidentCommunity(responseTwo?.data?.data?.estates?.results)

            await getResidentProfile(responseTwo?.data?.data?.estates?.results?.[0]?.associatedIds?.residentId);

            setSelectedEstate(responseTwo?.data?.data?.estates?.results?.[0] || null);

            router.push('/dashboard');
        } catch (error: any) {
            const majorBackendError = error?.response?.data?.errors?.[0]?.message
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred during account creation";

            // Show toast notification
            toast.error(
                majorBackendError ||
                backendMessage ||
                backendMessageTwo ||
                fallbackMessage,
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } finally {
            setIsSigningUp(false);
        }
    };


    return (
        <div className="p-6 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className={`flex flex-col gap-4 ${isSigningUP ? "pointer-events-none" : ""}`}>
                    <div className="relative flex flex-col gap-2 items-start w-full">
                        <label className="text-center text-[14px] font-[500] text-BlackHomz">
                            Password <span className="text-error">*</span>
                        </label>
                        <input
                            className={`border w-full rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError && passwordError !== "You must agree to the terms and conditions" ? "border-red-500" : ""
                                }`}
                            type={passwordVisible ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => {
                                handleInputChange("password", e.target.value);
                                if (passwordError) setPasswordError("");
                            }}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            className="absolute top-11 right-6"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <BashedEye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className="relative flex flex-col gap-2 items-start w-full">
                        <label className="text-center text-[14px] font-[500] text-BlackHomz">
                            Re-enter Password <span className="text-error">*</span>
                        </label>
                        <input
                            className={`border w-full rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError && passwordError !== "You must agree to the terms and conditions" ? "border-red-500" : ""
                                }`}
                            type={confirmPasswordVisible ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={(e) => {
                                handleInputChange("confirmPassword", e.target.value);
                                if (passwordError) setPasswordError("");
                            }}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            className="absolute top-11 right-6"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {confirmPasswordVisible ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <BashedEye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {(passwordError) && (
                        <span className="mt-[-10px] font[400] text-[13px] text-red-500">
                            {passwordError}
                        </span>
                    )}
                </div>
                <button
                    className={`bg-BlueHomz mt-3 text-white font-[500] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${isSigningUP ? "pointer-events-none w-full flex justify-center" : ""
                        }`}
                    type="submit"
                    disabled={isSigningUP}
                >
                    {isSigningUP ? <DotLoader /> : "Continue"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;