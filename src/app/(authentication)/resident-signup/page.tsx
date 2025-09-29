"use client"
import AuthSlider from '@/components/auth/authSlider'
import React from 'react'
import ChangePassword from './components/changePassword'
import UpdateResidentAccount from './components/updateResidentAccount'
// import { useResidentStore } from '@/store/useResidentStore'
import { useResidentParams } from '@/hooks/useResidentParams'
// import { useSelectedCommunity } from '@/store/useSelectedCommunity'
// import api from '@/utils/api'

const pages = ['Create Account', 'Review Property Details']

const ResidentSignup = () => {
  const [active, setActive] = React.useState<number>(0);
  
  // Handle URL parameters
  useResidentParams()

  return (
    <div className="flex m-auto max-w-[100%] sm:max-w-[1440px] h-[1024px]">
      <div className="w-[644px] hidden lg:flex flex-col py-8 justify-around bg-[url('/Background_image2.png')] bg-BlueHomz">
        <AuthSlider />
      </div>
      <div className="sm:w-[794px] w-full flex flex-col items-center">
        <div className="h-[85%] md:px-6 w-[320px] sm:w-full py-6 md:py-4 md:mt-[40px]">
          <div className={`flex flex-col gap-6 m-auto ${active === 0 ? "max-w-[480px]" : "max-w-[650px]"}`}>
            <h1 className={`${active === 0 ? "text-start md:text-center " : "text-start"} text-[23px] font-[700] text-BlackHomz`}>
              {active === 0 ? "Create A Resident Account" : "Review Your Residential Information"}
            </h1>
            <p className={`mt-[-20px] text-[18px] font-[400] text-GrayHomz ${active === 0 ? "text-start md:text-center " : "text-start"}`}>
              {active === 0 ? "Complete your details to unlock your estate dashboard" : "Here are the details of your property and estate. Please confirm to continue."}
            </p>
            <div className='grid grid-cols-2 gap-4 mt-4 w-full'>
              {pages.map((data, index) => (
                <div key={index}>
                  <button onClick={() => setActive(index)} className='flex items-center justify-center gap-2'>
                    <span className={`w-[24px] h-[24px] min-w-[24px] min-h-[24px] rounded-full text-sm font-medium ${active === index ? "bg-successBg text-Success" : "bg-GrayHomz6 text-GrayHomz"}`}>{index + 1}</span>
                    <span className={`text-[11px] text-GrayHomz font-normal truncate`}>{data}</span>
                  </button>
                  <div className={`h-[4px] mt-2 w-full rounded-[8px] ${active === index ? "bg-[#81CBAA]" : "bg-GrayHomz6"}`} />
                </div>
              ))}
            </div>

            {/* show pages */}
            {
              active === 0 &&
              <ChangePassword setActive={setActive}/>
            }

            {
              active === 1 &&
              <UpdateResidentAccount />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResidentSignup