/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthSlider from "@/components/auth/authSlider";
import api from "@/utils/api";
import { storeToken } from "@/utils/cookies";
import { useAuthSlice } from "@/store/authStore";
import toast from "react-hot-toast";
import DotLoader from "@/components/general/dotLoader";
import { useResidentStore } from "@/store/useResidentStore";

const VerifyEmail = () => {
  const router = useRouter();
  const { userData, setUserData } = useAuthSlice();
  const email = userData?.email;
  const [error, setError] = useState(false);
  const [error2, setError2] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otp, setOTP] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(false);
  const [resend, setResend] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const { isResident, token, estateId, organizationId } = useResidentStore()

  const startTimer = () => {
    setSeconds(60);
    setTimer(true);
  };

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (timer) {
      countdownInterval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(countdownInterval);
            setTimer(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [timer]);

  const generateToken = () => {
    // A simple random string token (not cryptographically secure)
    return crypto.randomUUID();
    // or: return Math.random().toString(36).substring(2) + Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerificationSuccess(false);
    setError2("");

    try {
      // Endpoint is public — no token needed
      const response = await api.post("/auth/verify-otp", { email, pincode: otp.join("") });

      // Store token so user can continue without logging in again
      const { data } = response.data;
      if (data?.accessToken) {
        await storeToken({
          token: data.accessToken,
          refresh_token: data.refreshToken,
        });
      }

      // OTP verified — show success screen
      setVerificationSuccess(true);
      setError(false);
      setError2("");
      setLoading(false);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      const backendMes = error?.response?.data?.error;
      const backendMessageTwo = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "An error occurred";
      setError2(backendMessage || backendMessageTwo || backendMes || fallbackMessage);
      setError(true);
      setLoading(false);
    }
  };

  const ResendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setResend(true);
    try {
      // Endpoint is public — no token needed
      await api.post("/auth/resend-otp", { email });
      toast.success('OTP SENT');
      startTimer();
      setResend(false);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      const backendMessageTwo = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "Failed to resend OTP";

      toast.error(backendMessage || backendMessageTwo || fallbackMessage);
      setResend(false);
    }
  };


  useEffect(() => {
    startTimer()
  }, [])


  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResident && organizationId && estateId && token) {
      const params = new URLSearchParams({
        invitation: token as any,
        organizationId: organizationId as any,
        estateId: estateId as any
      }).toString()
      router.push(`/resident/invitations/create?${params}`)
    } else {
      // Token already stored after OTP verification — go straight to profile setup
      router.push("/select-profile");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      setError(false);
      if (value && index < otp.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (value === "" && index >= 0) {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
      setError(false);
      if (index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else {
      setError(true);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData('text');
    if (pastedValue.length === 4 && /^\d+$/.test(pastedValue)) {
      setOTP(pastedValue.split(''));
      setError(false);
    }
  };

  const isOTPComplete = otp.every((digit) => /^\d$/.test(digit));

  // Initialize the refs array in useEffect
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp.length]);



  return (
    <div className="">
      <div className="flex m-auto max-w-[1440px] h-[1024px]">
        <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
          <AuthSlider />
        </div>
        <div className="w-[794px] flex flex-col justify-around items-center">
          <div className="h-[85%] md:x-6 w-[320px] sm:w-full py-4">
            {!verificationSuccess ? (
              <div className="flex flex-col gap-6 m-auto max-w-[320px] sm:max-w-[360px]">
                <h1 className="text-start text-[30px] sm:text-[36px] font-[700] text-BlackHomz">
                  Check Your Email
                </h1>
                <p className="mt-[-10px] text-[16px] font-[400] text-GrayHomz">
                  We sent an OTP to
                  <span className="text-BlackHomz font-[500]"> {email}</span>
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 w-360">
                    <div className="flex w-[320px] sm:w-full gap-2 h-[72px]">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className={`border rounded-md text-[41px] font-[700] text-GrayHomz w-[60px] sm:w-[80px] p-2 text-center ${error ? "border-red-500" : ""}`}
                          ref={(el) => {
                            if (el) {
                              inputRefs.current[index] = el;
                            }
                          }}
                          onPaste={handlePaste}
                        />
                      ))}
                    </div>
                    <p className="mt-[-10px] text-[14px] font-[400] text-GrayHomz2">
                      Enter OTP sent to {email}
                    </p>
                    {error2 && <span className="text-red-500">{error2}</span>}
                    {isOTPComplete ? (
                      <button
                        type="submit"
                        className={`mt-4 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""}`}
                        disabled={loading}
                      >
                        {loading ? <DotLoader /> : "Verify Email"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="mt-4 bg-GrayHomz6 text-GrayHomz5 font-[700] text-[16px] w-full rounded-[4px] h-[47px] opacity-50"
                        disabled
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className={`${timer ? "pointer-events-none" : ""} text-center font-[400] text-[12px] md:text-[14px]`}>
                      Didn&apos;t receive the email?
                    </p>
                    {timer ? (
                      <div className="text-GrayHomz6 pointer-events-none text-center font-[700] text-[12px] md:text-[14px] ml-1">
                        Click to resend
                      </div>
                    ) : (
                      <button
                        onClick={ResendOtp}
                        className={`${resend ? "pointer-events-none" : ""} text-BlueHomz text-center font-[700] text-[12px] md:text-[14px] ml-1`}
                        disabled={resend}
                      >
                        {resend ? "Sending..." : "Click to resend"}
                      </button>
                    )}
                    {timer && (
                      <div className="flex justify-center items-center">
                        <p className="text-[12px] text-BlueHomz font-[400]">{seconds} Seconds</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center gap-1">
                    <Image
                      src={"/arrow-left.png"}
                      className=""
                      height={17}
                      width={16}
                      alt="Back arrow"
                    />
                    <Link
                      href={"/register"}
                      className="text-center text-[14px] font-[700]"
                    >
                      Go back to sign Up
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col m-auto max-w-[360px] mt-2 items-center">
                <h1 className="text-[36px] font-[700] text-BlackHomz">
                  Email Verified
                </h1>
                <p className="mt-4 text-[16px] font-[400] text-GrayHomz">
                  Your email has successfully been verified. Click below to
                  continue with your account setup.
                </p>
                <button
                  onClick={handleEmailVerification}
                  className="mt-4 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz"
                >
                  Continue
                </button>
                <div className="mt-4 flex justify-center gap-1">
                  <Image
                    src={"/arrow-left.png"}
                    className=""
                    height={17}
                    width={16}
                    alt="Back arrow"
                  />
                  <Link
                    href={"/login"}
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
  );
};

export default VerifyEmail;