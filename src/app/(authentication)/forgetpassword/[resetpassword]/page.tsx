/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AuthSlider from "@/components/auth/authSlider";

const ResetPassword = () => {
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);
  const [formData, setFormData] = useState({
    password: "",
    repassword: "",
  });
  const [visible, setVisible] = useState(false);
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [succPass, setSuccPass] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { routeTo } = useLandlordLogin();
  const isValidPassword = (password: any) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear the password error when the user interacts with the input fields
    if (field === "password" || field === "repassword") {
      setPasswordError("");
    }
  };

  const Visible = () => {
    setVisible(!visible);
  };

  const VisibleTwo = () => {
    setVisibleTwo(!visibleTwo);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isValidPassword(formData.password)) {
      setPasswordError("Password should be at least 8 characters");
      return;
    }

    if (formData.password !== formData.repassword) {
      setPasswordError("Passwords doesn't match");
      return;
    }
    
    setLoading(true);
        setSuccPass(true);

    // try {
    //   const response = await api.patch(
    //     `auth/resetPassword/${token}`,
    //     {
    //       newPassword: formData.password,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   if (routeTo && response.data.message) {
    //     // Remove `url` from `routeTo` and convert to query string
    //     const { url, ...queryParams } = routeTo; // Destructure to remove `url`
    //     const urlParams = new URLSearchParams(queryParams).toString();
    //     // Redirect using the specified URL path and query parameters
    //     router.push(`/${url}?${urlParams}`);

    //     toast.success("Password changed. Redirecting to complete landlord's invitation.");
    //     useLandlordLogin.getState().clearRouteTo()
    //   } else {
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   setPasswordError("error", error.response?.data?.message);
    //   setLoading(false)
    // } finally {
    //   setLoading(false);
    // }
  };



  return (
    <div className={`${loading && ""}`}>
      <div className="flex m-auto  max-w-[1440px] h-[1024px]">
        <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
          <AuthSlider />
        </div>
        <div className="sm:w-[794px] w-full px-3 flex flex-col justify-around items-center">
          <div className="m-auto mt-16 sm:mt-32 ">
            <div className="h-[85%] px-6 w-[320px] sm:w-full py-4">
              {!succPass ? (
                <div className="flex flex-col max-w-[360px] mt-1">
                  <h1 className="text-[30px] sm:text-[36px] text-start font-[700] text-BlackHomz">
                    Forgot Password?
                  </h1>
                  <p className="mt-1 text-[16px] text-start font-[400] text-GrayHomz">
                    Enter new password. Password must be different from
                    previously used passwords.
                  </p>
                  <form className="flex flex-col gap-4 mt-6">
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
                      />
                      <div
                        className="absolute top-11 right-4"
                        onClick={Visible}
                      >
                        {visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <BashedEye className="w-4 h-4" />
                        )}
                      </div>
                      <div className="relative flex flex-col gap-2 items-start">
                        <label className="text-center text-[14px] font-[500] text-BlackHomz">
                          Re-enter password
                        </label>
                        <input
                          className={`border w-[270px] sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px] ${passwordError ? "border-red-500" : ""
                            }`}
                          type={visibleTwo ? "text" : "password"}
                          value={formData.repassword}
                          onChange={(e) =>
                            handleInputChange("repassword", e.target.value)
                          }
                          placeholder="Re-enter password"
                        />
                        <div
                          className="absolute top-11 right-4"
                          onClick={VisibleTwo}
                        >
                          {visibleTwo ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <BashedEye className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-[14px] font-[400] text-red-500">
                        {passwordError}
                      </p>
                    )}
                  </form>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-7 bg-BlueHomz text-white font-[700] text-[16px] w-full rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz"
                  >
                    Reset Password
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
                    href={"/login"}
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
