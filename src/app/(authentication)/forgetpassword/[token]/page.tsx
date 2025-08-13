"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AuthSlider from "@/components/auth/authSlider";
import { useSearchParams } from "next/navigation";
import { storeToken } from "@/utils/cookies";
import toast from "react-hot-toast";
import api from "@/utils/api";
import DotLoader from "@/components/general/dotLoader";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    password: "",
    repassword: "",
  });
  const [visible, setVisible] = useState(false);
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [succPass, setSuccPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (field === "password" || field === "repassword") {
      setPasswordError("");
    }
  };

  const toggleVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setVisible(!visible);
    } else {
      setVisibleTwo(!visibleTwo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword(formData.password)) {
      setPasswordError("Password should be at least 8 characters");
      return;
    }

    if (formData.password !== formData.repassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {

      await storeToken({
        token: token as any,
      });

      await api.put("/auth/reset-password", {
        token,
        newPassword: formData.password,
        confirmPassword: formData.repassword
      });
      toast.success("Password reset successfully!");
      setSuccPass(true);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      const backendMessageTwo = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "Failed to reset password.";
      toast.error(backendMessage || backendMessageTwo || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${loading ? "pointer-events-none" : ""}`}>
      <div className="flex m-auto max-w-[1440px] h-[1024px]">
        <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
          <AuthSlider />
        </div>
        <div className="sm:w-[794px] w-full px-3 flex flex-col justify-around items-center">
          <div className="m-auto mt-16 sm:mt-32">
            <div className="h-[85%] px-6 w-[320px] sm:w-full py-4">
              {!succPass ? (
                <div className="flex flex-col max-w-[360px] mt-1">
                  <h1 className="text-[30px] sm:text-[36px] text-start font-[700] text-BlackHomz">
                    Reset Password
                  </h1>
                  <p className="mt-1 text-[16px] text-start font-[400] text-GrayHomz">
                    Enter new password. Password must be different from
                    previously used passwords.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                    <div className="relative flex flex-col gap-2 items-start">
                      <label className="text-center text-[14px] font-[500] text-BlackHomz">
                        Password
                      </label>
                      <input
                        className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError ? "border-red-500" : ""
                          }`}
                        type={visible ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="Enter a new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute top-11 right-4"
                        onClick={() => toggleVisibility('password')}
                      >
                        {visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <BashedEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="relative flex flex-col gap-2 items-start">
                      <label className="text-center text-[14px] font-[500] text-BlackHomz">
                        Re-enter password
                      </label>
                      <input
                        className={`border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError ? "border-red-500" : ""
                          }`}
                        type={visibleTwo ? "text" : "password"}
                        value={formData.repassword}
                        onChange={(e) =>
                          handleInputChange("repassword", e.target.value)
                        }
                        placeholder="Re-enter password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute top-11 right-4"
                        onClick={() => toggleVisibility('confirm')}
                      >
                        {visibleTwo ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <BashedEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-[14px] font-[400] text-red-500">
                        {passwordError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-BlueHomz mt-7 text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""
                        }`}
                    >
                      {loading ? <DotLoader /> : "Reset Password"}
                    </button>
                  </form>
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
                <div className="flex flex-col max-w-[360px] mt-2 items-center">
                  <h1 className="text-[36px] font-[700] text-BlackHomz">
                    Password Reset
                  </h1>
                  <p className="mt-1 text-[16px] font-[400] text-center text-GrayHomz">
                    Your password has successfully been reset. Click on the
                    button to securely login.
                  </p>
                  <Link
                    href="/login"
                    className="mt-5 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[48px] text-center py-[10px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;