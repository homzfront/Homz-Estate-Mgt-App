"use client";

import AuthSlider from "@/components/auth/authSlider";
import DotLoader from "@/components/general/dotLoader";
import api from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sentEmail, setSentMail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.success === true) {
        setSentMail(true);
        toast.success("Reset password link sent to your email.");
      } else {
        setEmailError(response.data.message || "Failed to send reset link");
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      setEmailError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/forgotpassword", { email });

      if (response.data.statuscode === 200 || response.data.statuscode === 201) {
        toast.success("Reset password link resent to your email.");
      } else {
        toast.error(response.data.message || "Failed to resend reset link");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          duration: 4000,
        }}
      />
      <div className="flex m-auto max-w-[1440px] h-[1024px]">
        <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
          <AuthSlider />
        </div>
        <div className="sm:w-[794px] w-full flex flex-col">
          <div className="m-auto mt-32">
            <div className="h-[85%] px-6 w-320px sm:w-full">
              {!sentEmail ? (
                <div className="flex flex-col max-w-[360px] mt-1">
                  <h1 className="text-[30px] sm:text-[36px] text-start font-[700] text-BlackHomz">
                    Forgot Password?
                  </h1>
                  <p className="mt-1 text-[16px] text-start font-[400] text-GrayHomz">
                    Enter your email and we'll send you a reset link.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex flex-col gap-2 items-start">
                      <label className="text-center text-[14px] font-[500] text-BlackHomz">
                        Email*
                      </label>
                      <input
                        className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${emailError ? "border-red-500" : ""
                          }`}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="Enter your email"
                        required
                      />
                      {emailError && (
                        <p className="mt-1 text-[14px] font-[400] text-red-500">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <button
                      className={`bg-BlueHomz mt-7 text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""
                        }`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <DotLoader /> : "Send Reset Link"}
                    </button>
                  </form>
                  <p className="mt-6 text-center font-[400] text-[14px]">
                    Don't have an account?
                    <Link
                      className="text-center font-[700] text-[14px] text-BlueHomz ml-1"
                      href="/register"
                    >
                      Create Account
                    </Link>
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    <Image
                      src="/arrow-left.png"
                      height={17}
                      width={16}
                      alt="Back arrow"
                    />
                    <Link
                      href="/login"
                      className="text-center text-[14px] font-[700]"
                    >
                      Go back to Log In
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col max-w-[320px] sm:max-w-[360px] mt-2 items-center">
                  <h1 className="text-[36px] font-[700] text-BlackHomz">
                    Reset Password
                  </h1>
                  <p className="mt-1 text-[16px] font-[400] text-center text-GrayHomz">
                    We have sent a reset password to <br /> {email}
                  </p>
                  <Link
                    href="/"
                    className="mt-5 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[48px] text-center py-[10px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz"
                  >
                    Continue
                  </Link>
                  <p className="mt-5 text-center font-[400] text-[14px]">
                    Didn't receive the email?
                    <button
                      className="text-center font-[700] text-[14px] text-BlueHomz ml-1"
                      onClick={handleResend}
                    >
                      Click to resend
                    </button>
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    <Image
                      src="/arrow-left.png"
                      height={17}
                      width={16}
                      alt="Back arrow"
                    />
                    <Link
                      href="/login"
                      className="text-center text-[14px] font-[700]"
                    >
                      Go back to Log In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;