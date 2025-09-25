/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import React, { useState } from "react";
import DotLoader from "@/components/general/dotLoader";
import toast from "react-hot-toast";
import { useResidentStore } from "@/store/useResidentStore";
import { useAuthSlice } from "@/store/authStore";
import api from "@/utils/api";
import { storeToken } from "@/utils/cookies";



interface PasswordProps {
    setActive: (index: number) => void;
}
const ChangePassword = ({ setActive }: PasswordProps) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isSigningUP, setIsSigningUp] = useState(false);
    const { token, email, estateId, organizationId } = useResidentStore();
    const { setUserData } = useAuthSlice();
    const handleInputChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        if (passwordError) {
            setPasswordError("");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setPasswordError("");

        if (!formData.password || !formData.confirmPassword) {
            setPasswordError("Please fill in all password fields");
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(formData?.password)) {
            setPasswordError("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            setIsSigningUp(true);

            // Prepare the payload
            const payload = {
                email: email || formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                token: token,
                estateId: estateId,
                organizationId: organizationId
            };

            // Make the POST request
            const response = await api.post(`/auth/resident/update-password`, payload);
            const responseData = response.data;

            // Store tokens using the right keys
            await storeToken({
                token: responseData?.data?.accessToken,
                refresh_token: responseData?.data?.refreshToken,
            });

            // Fetch user profile
            const profile = await api.get("/auth/current-user");

            // Store user data
            setUserData(profile.data.data);
            // await getResidentProfile(profile.data.data?._id);
            setActive(1); // Move to the next step on success
            toast.success("Password updated successfully!", {
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

        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred during password update";
            setPasswordError(backendMessage || backendMessageTwo || fallbackMessage);
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className={`flex flex-col gap-4 ${isSigningUP ? "pointer-events-none" : ""}`}>
                    <div className='flex flex-col gap-1 w-full text-sm'>
                        <h3 className='text-sm font-medium text-BlackHomz mb-1'>Email <span className='text-error'>*</span></h3>
                        <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                            {email ? email : ''}
                        </span>
                    </div>

                    <div className="relative flex flex-col gap-2 items-start w-full">
                        <label className="text-center text-[14px] font-[500] text-BlackHomz">
                            Password <span className="text-error">*</span>
                        </label>
                        <input
                            className={`border w-full rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError && passwordError !== "You must agree to the terms and conditions" ? "border-red-500" : ""
                                }`}
                            type={passwordVisible ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
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
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                    {isSigningUP ? <DotLoader /> : "Create Account & Continue"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;