"use client"
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long'
import { useRouter } from 'next/navigation'
import React from 'react'
import InputVisible from '../../(estate-manager)/profile/(changePassword)/components/inputVisible'

const Security = () => {
    const router = useRouter()
    const [password, setPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [reEnterPassword, setReEnterPassword] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");


    return (
        <div className='p-8 mb-[150px]'>
            <div onClick={() => router.back()} className='flex gap-2 items-center cursor-pointer'>
                <div><ArrowLeft16Long /></div>
                <h1 className='text-[16px] md:text-[20px] text-BlackHomz font-normal md:font-medium'>
                    Security
                </h1>
            </div>

            <button className='mt-8 ext-sm font-medium text-white bg-BlueHomz rounded-[4px] px-3 py-2'>
                Change Password
            </button>

            <div className='bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] w-full p-8 mt-4'>
                <div className="w-full md:w-[498px] flex flex-col gap-4">
                    <InputVisible
                        password={password}
                        setPassword={setPassword}
                        label={"Current Password"}
                        placeholder={"Enter your current password"}
                        setError={setPasswordError}
                        autoComplete="current-password"  // For current password field
                    />

                    <InputVisible
                        password={newPassword}
                        setPassword={setNewPassword}
                        label={"New Password"}
                        placeholder={"Enter New password"}
                        setError={setPasswordError}
                        autoComplete="new-password"  // For new password fields
                    />
                    <div>
                        <p className="mt-[-5px] text-GrayHomz2 text-[13px] font-[400]">
                            Must be at least 8 characters <br />
                            New password must be different from the previous password
                        </p>
                    </div>
                    <InputVisible
                        password={reEnterPassword}
                        setPassword={setReEnterPassword}
                        label={"Re-enter Password"}
                        placeholder={"Re-enter password"}
                        setError={setPasswordError}
                        autoComplete="new-password"  // For confirmation field
                    />
                    {passwordError && (
                        <div className="text-error italic text-[11px]">{passwordError}</div>
                    )}
                </div>
                <button
                    className={`text-white bg-BlueHomz md:bg-transparent md:text-BlueHomz md:border md:border-BlueHomz rounded-[4px] mt-8 md:text-[16px] text-sm font-normal h-[48px] w-full md:w-auto flex justify-center items-center px-3`}
                >
                    Change Password
                </button>
            </div>

        </div>
    )
}

export default Security