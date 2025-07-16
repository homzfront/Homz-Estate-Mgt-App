"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthSlider from "@/components/auth/authSlider";


const VerifyEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otp, setOTP] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(false);
  const [resend, setResend] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false);

  const startTimer = () => {
    setSeconds(60)
    setTimer(true)
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      setEmail(storedEmail || '' as any);
      startTimer();
    }
  }, []);

  // useEffect(() => {
  //   if (email !== null && profile?.isVerified === false) {
  //     (async () => {
  //       const response = await api.get("/user/profile");
  //       if (response?.data?.user?.isVerified === false) {
  //         await api.post("/auth/requestnewopt", { email, pincode: otp.join("") });
  //         startTimer();
  //       }
  //     })();
  //   }
  // }, [email])

  // useEffect(() => {
  //   let countdownInterval;

  //   if (timer) {
  //     countdownInterval = setInterval(() => {
  //       setSeconds(prevSeconds => {
  //         if (prevSeconds <= 1) {
  //           clearInterval(countdownInterval);
  //           setTimer(false);
  //           return 0;
  //         }
  //         return prevSeconds - 1;
  //       });
  //     }, 1000);
  //   }

  //   return () => clearInterval(countdownInterval);
  // }, [timer]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setLoading(true);
    // try {
    //   await api.post("/auth/verification", { email, pincode: otp.join("") });
    //   setVerificationSuccess(true);
    //   setError(false);
    //   setError2("");
    //   setLoading(false);
    // } catch (error) {
    //   setError2(error.response.data.error);
    //   setError(true);
    //   setLoading(false);

    //   if (error.response) {
    //     setError2(error.response.data.error);
    //   } else if (error.request) {
    //     setError2("No response received from the server");
    //   } else {
    //     setError2("Error occurred while making the request");
    //   }
    // }
  };

  const ResendOtp = async (e: any) => {
    e.preventDefault();
    setResend(true);
    // try {
    //   await api.post("/auth/requestnewopt", { email, pincode: otp.join("") });
    //   toast.success('OTP SENT');
    //   startTimer();
    //   setResend(false);
    // } catch (error) {
    //   toast.error(error.response?.data?.message);
    //   setResend(false);
    // } finally {
    //   setResend(false);
    // }
  };

  const handleEmailVerification = (e: any) => {
    e.preventDefault();
    router.push("/select-plan");
  };

  const handleInputChange = (index: any, value: any) => {
    // if (/^\d$/.test(value)) {
    //   const newOTP = [...otp];
    //   newOTP[index] = value;
    //   setOTP(newOTP);
    //   setError(false);
    //   if (value && index < otp.length - 1) {
    //     inputRefs.current[index + 1].focus();
    //   }
    // } else if (value === "" && index >= 0) {
    //   const newOTP = [...otp];
    //   newOTP[index] = "";
    //   setOTP(newOTP);
    //   setError(false);
    //   if (index === 0) {
    //     setError(false);
    //   } else {
    //     inputRefs.current[index - 1].focus();
    //   }
    // } else {
    //   setError(true);
    // }
  };

  const handlePaste = (event: any) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData('text');
    if (pastedValue.length === 4 && /^\d+$/.test(pastedValue)) {
      setOTP(pastedValue.split(''));
      setError(false);
    }
  };

  const isOTPComplete = otp.every((digit) => /^\d$/.test(digit));

  // useEffect(() => {
  //   let timer;

  //   if (loading) {
  //     // Set a timer to show the long loading message after 3 seconds
  //     timer = setTimeout(() => {
  //       setShowLongLoadingMessage(true);
  //     }, 20000); // 20 seconds
  //   } else {
  //     // Reset when loading is false
  //     setShowLongLoadingMessage(false);
  //   }

  //   // Cleanup the timer on component unmount or when loading changes
  //   return () => clearTimeout(timer);
  // }, [loading]);

  const closeModal = () => {
    setShowLongLoadingMessage(false);
  };

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
                          // maxLength="1"
                          value={digit}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className={`border rounded-md text-[41px] font-[700] text-GrayHomz w-[60px] sm:w-[80px] p-2 text-center ${error ? "border-red-500" : ""}`}
                          // ref={(el) => (inputRefs.current[index] = el)}
                          onPaste={handlePaste} // Add onPaste event handler
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
                        onClick={handleSubmit}
                        className={`mt-4 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""}`}
                      >
                     
                     Verify Email
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="mt-4 bg-GrayHomz6 text-GrayHomz5 font-[700] text-[16px] w-full rounded-[4px] h-[47px] opacity-50 "
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className={`${timer ? "pointer-events-none" : ""} text-center font-[400] text-[12px] md:text-[14px]`}>
                      Didn't receive the email?
                    </p>
                    {
                      timer ?
                        <div
                          className={`text-GrayHomz6 pointer-events-none text-center font-[700] text-[12px] md:text-[14px] ml-1`}
                        >
                          Click to resend
                        </div> :
                        <button
                          onClick={ResendOtp}
                          className={`${resend ? "pointer-events-none" : ""} text-BlueHomz text-center font-[700] text-[12px] md:text-[14px] ml-1`}
                          // href={""}
                        >
                          Click to resend
                        </button>
                    }
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
                      alt="img"
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
                    alt="img"
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