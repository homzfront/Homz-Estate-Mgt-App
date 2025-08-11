/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthSlider from "@/components/auth/authSlider";
import DotLoader from "@/components/general/dotLoader";
import { useAuthSlice } from "@/store/authStore";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const { createUser, isSigningUP, error, clearError } = useAuthSlice();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (error || passwordError || emailError) {
      clearError();
      setPasswordError("");
      setEmailError("");
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
    setEmailError("");

    // Client-side validation
    if (!formData.email) {
      setEmailError("Email is required");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }

    if (!formData.agreedToTerms) {
      setPasswordError("You must agree to the terms and conditions");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address");
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
      await createUser({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      toast.success("Sign up successful!", {
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
      // On successful registration
      router.push("/verify-email");

    } catch (error: any) {
      // Error is already handled in the store
      console.error("Registration error:", error);
      const backendMessage = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "An error occurred during registration";

      if (error?.response?.data?.message?.includes("email")) {
        setEmailError(backendMessage || fallbackMessage);
      } else {
        setPasswordError(backendMessage || fallbackMessage);
      }
    }
  };

  return (
    <div className="flex m-auto max-w-[100%] sm:max-w-[1440px] h-[1024px]">
      <Toaster
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          duration: 4000,
        }}
      />
      <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
        <AuthSlider />
      </div>
      <div className="sm:w-[794px] w-full flex flex-col justify-around items-center">
        <div className="h-[85%] md:px-6 w-[320px] sm:w-full py-4">
          <div className="flex flex-col gap-6 m-auto max-w-[380px]">
            <h1 className="text-start text-[36px] font-[700] text-BlackHomz">
              Create Account
            </h1>
            <p className="mt-[-10px] text-[16px] font-[400] text-GrayHomz">
              Your All-In-One property portal in just one click!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className={`flex flex-col gap-4 ${isSigningUP ? "pointer-events-none" : ""}`}>
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-center text-[14px] font-[500] text-BlackHomz">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${emailError ? "border-red-500" : ""
                      }`}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                  {emailError && (
                    <span className="text-[13px] text-red-500">
                      {emailError}
                    </span>
                  )}
                </div>
                <div className="relative flex flex-col gap-2 items-start">
                  <label className="text-center text-[14px] font-[500] text-BlackHomz">
                    Password <span className="text-error">*</span>
                  </label>
                  <input
                    className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError && passwordError !== "You must agree to the terms and conditions" ? "border-red-500" : ""
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
                    className="absolute top-11 right-6 sm:right-9"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <BashedEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="relative flex flex-col gap-2 items-start">
                  <label className="text-center text-[14px] font-[500] text-BlackHomz">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <input
                    className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError && passwordError !== "You must agree to the terms and conditions" ? "border-red-500" : ""
                      }`}
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute top-11 right-6 sm:right-9"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <BashedEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className={`mr-2 cursor-pointer ${passwordError === "You must agree to the terms and conditions" ? "border-red-500" : ""
                      }`}
                    checked={formData.agreedToTerms}
                    onChange={() => handleInputChange("agreedToTerms", !formData.agreedToTerms)}
                  />
                  <p className="cursor-pointer text-center text-GrayHomz font-[400] text-[11px]">
                    I agree to the{" "}
                    <Link
                      href={"/terms-and-conditions"}
                      className="text-BlackHomz font-[700] hover:underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={"/privacy-policy"}
                      className="text-BlackHomz font-[700] hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    of HOMZ.
                  </p>
                </div>
                {(passwordError) && (
                  <span className="mt-[-10px] font[400] text-[13px] text-red-500">
                    {passwordError}
                  </span>
                )}
              </div>
              <button
                className={`bg-BlueHomz mt-3 text-white font-[700] text-[16px] w-full sm:w-[360px] rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${isSigningUP ? "pointer-events-none w-full flex justify-center" : ""
                  }`}
                type="submit"
                disabled={isSigningUP}
              >
                {isSigningUP ? <DotLoader /> : "Get Started"}
              </button>
            </form>
            <span className="font-normal w-full text-center text-sm text-GrayHomz">
              OR
            </span>
            <div className="mt-[-5px]">
              <button
                className="border flex justify-center items-center gap-3 font-[700] text-[16px] text-BlueHomz w-full sm:w-[360px] border-BlueHomz hover:border-BlackHomz rounded-[8px] h-[47px] hover:text-BlackHomz"
                type="button"
              >
                <Image
                  src={"/Social icon.png"}
                  alt="google"
                  height={20}
                  width={20}
                />
                Sign Up with Google
              </button>
              <p className="mt-4 text-center font-[400] text-[14px]">
                Already have an account?{" "}
                <Link
                  className="text-center font-[700] text-[14px] text-BlueHomz hover:underline"
                  href={"/login"}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;