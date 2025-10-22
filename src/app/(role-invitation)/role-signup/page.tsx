"use client"
import AuthSlider from '@/components/auth/authSlider'
import React, { Suspense } from 'react'
import ChangePassword from './components/changePassword'
import UpdateResidentAccount from './components/roleData'
import { useRoleSignupForm } from '@/hooks/useRoleSignupForm'
import { useRoleSignupParams } from '@/hooks/useRoleSignupParams'

const ResidentSignup = () => {
  const [active, setActive] = React.useState<number>(0);

  // Handle URL parameters and form state
  const params = useRoleSignupParams();
  const { form, handleInputChange } = useRoleSignupForm({
    email: params.email,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    businessName: '',
    businessAddress: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <div className="flex m-auto max-w-[100%] sm:max-w-[1440px] h-[1024px]">
      <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
        <AuthSlider />
      </div>
      <div className="sm:w-[794px] w-full flex flex-col items-center">
        <div className="h-[85%] md:px-6 w-full py-6 md:py-4 md:mt-[40px]">
          <div className={`flex flex-col gap-6 m-auto max-w-[600px]`}>
            <div className="h-auto  flex justify-center">
              <div className="z-0 absolute w-[360px] sm:w-[540px] pr-[92px] pl-[96px] py-[27px]">
                <div className="border-[1px]"></div>
              </div>
              <div className="z-1 relative flex mt-5 gap-4 justify-between items-center px-8  w-[360px] sm:w-[540px]">
                <div className="flex flex-col items-center gap-2 justify-center">
                  <div
                    className={`flex flex-col items-center p-2 justify-center ${active === 0
                      ? " bg-white rounded-full  w-1 h-1 shadow-md "
                      : "h-1 w-1"
                      }`}
                    onClick={() => setActive(0)}
                  >
                    <div
                      className={`rounded-full w-[1px] h-[1px] cursor-pointer bg-BlueHomz p-1 text-[14px] font-[500] text-center`}
                    ></div>
                  </div>
                  <p className="text-[14px] font-400">Personal Information</p>
                </div>

                <div className="flex flex-col items-center gap-2 justify-center">
                  <div
                    className={`flex flex-col p-2 items-center justify-center ${active === 1
                      ? " bg-white rounded-full  w-1 h-1 shadow-md "
                      : "h-1 w-1"
                      }`}
                    onClick={() => setActive(1)}
                  >
                    <div
                      className={`rounded-full w-[1px] h-[1px] cursor-pointer bg-BlueHomz p-1 text-[14px] font-[500] text-center`}
                    ></div>
                  </div>
                  <p className="text-[14px] font-400">Create password</p>
                </div>
              </div>
            </div>
            <h1 className={`px-8 md:px-0 text-start md:text-center text-[23px] font-[700] text-BlackHomz`}>
              Create Account
            </h1>
            <p className={`px-8 md:px-0 mt-[-20px] text-[18px] font-[400] text-GrayHomz text-start md:text-center`}>
              {active === 0 ? "Enter your correct information to create your account " : "Create a password to secure your account"}
            </p>
            {/* show pages */}
            {
              active === 1 &&
              <ChangePassword
                form={form}
                handleInputChange={handleInputChange}
                params={params}
              />
            }

            {
              active === 0 &&
              <UpdateResidentAccount setActive={setActive} form={form} handleInputChange={handleInputChange} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResidentSignup />
    </Suspense>
  )
}