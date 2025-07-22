"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthSlider from "@/components/auth/authSlider";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreedToTerms: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // const handleGoogleSignIn = () => {
  //   localStorage.setItem("fromGoogle", "true");
  //   signIn("google", { callbackUrl: "/login" });
  // };

  // const handleCaptchaChange = () => {
  //   setVerified(true);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!verified) {
  //     setPasswordError("Please complete the CAPTCHA");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!formData.password || !formData.email) {
  //     setPasswordError("Please fill in all fields and agree to terms.");
  //     return;
  //   }
  //   if (!formData.agreedToTerms) {
  //     setPasswordError("Agree to terms.");
  //     return;
  //   }
  //   if (formData.password.length < 8) {
  //     setPasswordError("Passowrd must be at least 8 characters");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await api.post("/auth/register", {
  //       email: formData.email,
  //       password: formData.password,
  //     });

  //     if (response.data.statuscode === 201) {
  //       const data = response?.data?.data?.token;
  //       localStorage.setItem("jwt", data);
  //       router.push(`/verify-email`);
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("email", formData.email);
  //       }
  //       setTimeout(() => {
  //         setFormData({ email: "", password: "", agreedToTerms: false });
  //         setLoading(false);
  //       }, 5000);
  //     } else {
  //       const errorw = response.data.message;
  //       setPasswordError(errorw);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setPasswordError(error.response?.data?.message);
  //     setLoading(false);
  //   }
  // };

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const Visible = () => {
    setVisible(!visible);
  };

  return (
    <div className="flex m-auto max-w-[100%] sm:max-w-[1440px] h-[1024px]">
      <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
        <AuthSlider />
      </div>
      <div className="sm:w-[794px] w-full flex flex-col justify-around items-center">
        <div className="h-[85%] px-6 w-[320px] sm:w-full py-4">
          <div className="flex flex-col gap-6 m-auto max-w-[380px]">
            <h1 className="text-start text-[36px] font-[700] text-BlackHomz">
              Create Account
            </h1>
            <p className="mt-[-10px] text-[16px] font-[400] text-GrayHomz">
              Your All-In-One property portal in just one click!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                router.push("/select-profile")
              }}
              className="flex flex-col gap-4">
              <div
                className={`flex flex-col gap-4 ${loading ? "pointer-events-none" : ""
                  }`}
              >
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-center text-[14px] font-[500] text-BlackHomz">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError &&
                      passwordError !== "Agree to terms." &&
                      passwordError !== "Please complete the CAPTCHA"
                      ? "border-red-500"
                      : ""
                      }`}
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setPasswordError("");
                      handleInputChange("email", e.target.value);
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                <div className="relative flex flex-col gap-2 items-start">
                  <label className="text-center text-[14px] font-[500] text-BlackHomz">
                    Password <span className="text-error">*</span>
                  </label>
                  <input
                    className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError &&
                      passwordError !== "Agree to terms." &&
                      passwordError !== "Please complete the CAPTCHA"
                      ? "border-red-500"
                      : ""
                      }`}
                    type={visible ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setPasswordError("");
                      handleInputChange("password", e.target.value);
                    }}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <div className="absolute top-11 right-8" onClick={Visible}>
                    {visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <BashedEye className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className={`mr-2 cursor-pointer ${passwordError == "Agree to terms." ? "border-red-500" : ""
                      }`}
                    checked={formData.agreedToTerms}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        agreedToTerms: !formData.agreedToTerms,
                      });
                      setPasswordError("");
                    }}
                  />
                  <p className="cursor-pointer text-center text-GrayHomz font-[400] text-[11px]">
                    <span
                      onClick={() => {
                        setFormData({
                          ...formData,
                          agreedToTerms: !formData.agreedToTerms,
                        });
                        setPasswordError("");
                      }}
                    >
                      I agree to the
                    </span>
                    <Link
                      href={"/terms-and-conditions"}
                      className={`text-BlackHomz font-[700]`}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    <span
                      onClick={() => {
                        setFormData({
                          ...formData,
                          agreedToTerms: !formData.agreedToTerms,
                        });
                        setPasswordError("");
                      }}
                    >
                      and
                    </span>{" "}
                    <Link
                      href={"/privacy-policy"}
                      className={`text-BlackHomz font-[700]`}
                    >
                      Privacy Policy
                    </Link>{" "}
                    <span
                      onClick={() => {
                        setFormData({
                          ...formData,
                          agreedToTerms: !formData.agreedToTerms,
                        });
                        setPasswordError("");
                      }}
                    >
                      of HOMZ.
                    </span>
                  </p>
                </div>
                {passwordError && (
                  <span className="mt-[-10px] font[400] text-[13px] text-red-500">
                    {passwordError}
                  </span>
                )}
              </div>
              <button
                className={`bg-BlueHomz mt-3 text-white font-[700] text-[16px] w-full sm:w-[360px] rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""
                  }`}

                type="submit"
              >
                {loading ? "Loading..." : "Get Started"}
              </button>
            </form>
            <span className="font-normal w-full text-center text-sm text-GrayHomz">
              OR
            </span>
            <div className="mt-[-5px]">
              <button
                // onClick={() => handleGoogleSignIn()} 
                className={`border flex justify-center items-center gap-3 font-[700] text-[16px] text-BlueHomz w-full sm:w-[360px] border-BlueHomz hover:border-BlackHomz  rounded-[8px] h-[47px] hover:text-BlackHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""}`}>
                <Image
                  className=""
                  src={"/Social icon.png"}
                  alt="google"
                  height={"20"}
                  width={"20"}
                />
                Login In with google
              </button>
              <p className="mt-4 text-center font-[400] text-[14px]">
                Already have an account?
                <Link
                  className="text-center font-[700] text-[14px] text-BlueHomz ml-1"
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