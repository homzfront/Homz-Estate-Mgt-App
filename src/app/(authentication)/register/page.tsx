/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import AuthSlider from "@/components/auth/authSlider";
import DotLoader from "@/components/general/dotLoader";
import { useAuthSlice } from "@/store/authStore";
import toast from "react-hot-toast";

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

  const allowedSpecialCharacters = "@ $ ! % * ? & #";

  // Password requirements checker
  const getPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password),
    };
  };

  const passwordRequirements = getPasswordRequirements(formData.password);

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(formData?.password)) {
      setPasswordError("Password does not meet requirements. Use at least 8 characters, including uppercase, lowercase, number, and one special character from @$!%*?&#.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const result = await createUser({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      // If user exists but unverified, backend returns account_not_verified with success: false
      if (result?.message === "account_not_verified") {
        toast.success("OTP sent! Please verify your email.", {
          position: "top-center",
          duration: 3000,
        });
        router.push("/verify-email");
        return;
      }

      toast.success("Account created! Please check your email for the OTP.", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "#E8F5E9",
          color: "#2E7D32",
          fontWeight: 500,
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
      // Redirect to OTP verification page instead of login
      router.push("/verify-email");

    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      const backendMessageTwo = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "An error occurred during registration";

      if (backendMessage === "email already in use") {
        setEmailError(backendMessage || fallbackMessage);
      } else if (backendMessage?.includes("email")) {
        setEmailError(backendMessage || fallbackMessage);
      } else {
        setPasswordError(backendMessage || backendMessageTwo || fallbackMessage);
      }
    }
  };

  return (
    <div className="flex m-auto max-w-[100%] sm:max-w-[1440px] h-[1024px]">
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

                {/* Password Requirements Display */}
                <div className="w-full sm:w-[360px] bg-gray-50 rounded-md p-3 border">
                  <p className="text-[12px] font-[600] text-BlackHomz mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordRequirements.length ? '✓' : '○'}
                      </span>
                      <span className="text-[11px] text-gray-600">At least 8 characters long</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordRequirements.uppercase ? '✓' : '○'}
                      </span>
                      <span className="text-[11px] text-gray-600">One uppercase letter (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordRequirements.lowercase ? '✓' : '○'}
                      </span>
                      <span className="text-[11px] text-gray-600">One lowercase letter (a-z)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordRequirements.number ? '✓' : '○'}
                      </span>
                      <span className="text-[11px] text-gray-600">One number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordRequirements.special ? '✓' : '○'}
                      </span>
                      <span className="text-[11px] text-gray-600">One special character</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-[10px] text-gray-500 mb-1">Allowed special characters:</p>
                    <p className="text-[10px] text-gray-500 font-mono">{allowedSpecialCharacters}</p>
                  </div>
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
                    className={`mr-2 cursor-pointer bg-BlueHomz ${passwordError === "You must agree to the terms and conditions" ? "border-red-500" : ""
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
            {/* <span className="font-normal w-full text-center text-sm text-GrayHomz">
              OR
            </span> */}
            <div className="mt-4">
              <p className="text-center font-[400] text-[14px]">
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