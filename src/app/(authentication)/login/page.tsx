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
import { storeToken } from "@/utils/cookies";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useAuthSlice } from "@/store/authStore";
import { useResidentStore } from "@/store/useResidentStore";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUserData } = useAuthSlice();
  const { isResident, token, estateId, organizationId, clearResidentData } = useResidentStore()
  // const handleGoogleSignIn = () => {
  //   // Empty function as requested
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Basic validation
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLoginError("Please enter a valid email address");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      setLoginError(
        "Invalid password format. Passwords must be at least 8 characters long and include uppercase, lowercase, number, and one special character from @$!%*?&#."
      );
      return;
    };

    setLoading(true);

    try {
      const response = await api.post("/auth/log-in", {
        email,
        password
      });

      const { message, success, data } = response.data;
      if (!success) {
        throw new Error(message || "Login failed");
      }

      // Store user email
      setUserData({
        email: email
      })


      // Store tokens using the right keys
      await storeToken({
        token: data.accessToken,
        refresh_token: data.refreshToken,
      });

      // Fetch user profile
      const profile = await api.get("/auth/current-user");

      // Store user data
      setUserData(profile.data.data);
      // console.log("profile data:", profile.data.data);
      // setUserID(profile.data.data?._id);

      // console.log("profile:", profile)
      if (profile?.data?.data?.accounts?.length === 0) {
        if (isResident && organizationId && estateId && token) {
          // User logged in but hasn't completed resident profile yet
          // Send them back to the invite link to complete signup
          const params = new URLSearchParams({
            invitation: token as any,
            organizationId: organizationId as any,
            estateId: estateId as any
          }).toString()

          router.push(`/resident/invitations/create?${params}`)
        } else {
          clearResidentData();
          router.push("/select-profile");
        }

      } else {
        // User has accounts — check if they have a pending resident invite to complete
        if (isResident && organizationId && estateId && token) {
          const params = new URLSearchParams({
            invitation: token as any,
            organizationId: organizationId as any,
            estateId: estateId as any
          }).toString()
          router.push(`/resident/invitations/create?${params}`)
          return;
        }

        clearResidentData();
        const response = await api.get("/community-manager/current-profile");
        if (!response) {
          router.push("/resident/dashboard")
        } else {
          toast.success("Login successful!", {
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
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      const backendMessageTwo = error?.response?.data?.message?.[0];
      const fallbackMessage = error?.message || "An error occurred during login";

      if (backendMessage === "account_not_verified" || backendMessage === "Account is not verified. Please verify your account.") {
        // Store email so the verify-email page knows who to verify
        setUserData({ email });
        router.push("/verify-email")
      } else if (backendMessage === `Account "COMMUNITY_MANAGER" does not exist in user's profiles`) {
        router.push("/resident/dashboard")
        toast.success("Login successful!", {
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
      } else {
        setLoginError(backendMessage || backendMessageTwo || fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="">
      <div className="flex m-auto max-w-full sm:max-w-[1440px] h-[1024px]">
        <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
          <AuthSlider />
        </div>
        <div className="sm:w-[794px] w-full px-6 flex flex-col justify-around items-center">
          <div className="h-[85%] px-6 W-[320px] sm:w-full py-4">
            <div className="flex flex-col gap-6 m-auto max-w-[360px]">
              <h1 className="text-start text-[36px] font-[700] text-BlackHomz">
                Welcome Back
              </h1>
              <p className="mt-[-10px] text-[16px] font-[400] text-GrayHomz">
                Welcome back, please enter your details.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div
                  className={`flex flex-col gap-4 ${loading ? "pointer-events-none" : ""
                    }`}
                >
                  <div className="flex flex-col gap-2 items-start">
                    <label className="text-center text-[14px] font-[500] text-BlackHomz">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      className="border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px]"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="relative flex flex-col gap-2 items-start">
                    <label className="text-center text-[14px] font-[500] text-BlackHomz">
                      Password <span className="text-error">*</span>
                    </label>
                    <input
                      className="border w-full sm:w-[360px] rounded-[4px] h-[47px] px-2 placeholder:text-[14px]"
                      type={visible ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      minLength={8}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Allowed special characters: @$!%*?&#</p>
                    <button
                      type="button"
                      className="absolute top-11 right-4"
                      onClick={toggleVisibility}
                    >
                      {visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <BashedEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {loginError && (
                    <span className="mt-[-10px] font[400] text-[13px] text-red-500">
                      {loginError}
                    </span>
                  )}
                  <Link
                    href={"/forgetpassword"}
                    className="font-[700] text-BlueHomz text-[13px]"
                  >
                    Forgot Password
                  </Link>
                </div>
                <button
                  className={`bg-BlueHomz mt-3 text-white font-[700] text-[16px] w-full sm:w-[360px] rounded-[4px] h-[47px] hover:bg-white hover:text-BlueHomz hover:border hover:border-BlueHomz ${loading ? "pointer-events-none w-full flex justify-center" : ""
                    }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <DotLoader /> : "Log In"}
                </button>
              </form>

              {/* <span className="font-normal w-full text-center text-sm text-GrayHomz">
                OR
              </span> */}
              <div className="mt-4">
                <p className="text-center font-[400] text-[14px]">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="text-center font-[700] text-[14px] text-BlueHomz hover:underline"
                    href={"/register"}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;