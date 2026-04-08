/* eslint-disable @typescript-eslint/no-explicit-any */
// import CustomInput from '@/components/general/customInput';
import CopyIcon from '@/components/icons/copyIcon';
import { useAuthSlice } from '@/store/authStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useInviteLinkStore } from '@/store/useInviteLink';
import React, { useEffect, useState } from 'react'
import api from '@/utils/api'
import toast from 'react-hot-toast';

interface InviteResidentProps {
    setOpenSuccessModal: (data: boolean) => void;
    setOpenInvite: (data: boolean) => void;
}

const InviteResident = ({ setOpenInvite }: InviteResidentProps) => {
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const communityProfile = useAuthSlice((state) => state.communityProfile);

    const { getInviteLink, setInviteLink } = useInviteLinkStore();

    // const [formData, setFormData] = useState({ sendCode: '' });
    const [inviteLink, setInviteLinkState] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // const handleInputChange = (field: string, value: string) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [field]: value
    //     }));
    // };

    // const handleSubmit = () => {
    //     const payload = formData
    //     console.log(payload)
    //     setOpenInvite(false);
    // }

    useEffect(() => {
        if (!selectedCommunity?.estate?._id) return;

        const fetchInviteLink = async () => {
            setLoading(true);
            try {
                const res = await api.post("/resident-invitation/generate-link", {
                    validationIds: {
                        estateId: selectedCommunity?.estate?._id,
                        organizationId: selectedCommunity?.associatedIds?.organizationId
                    }
                });

                const newLink = res.data?.data?.link?.link || "";
                setInviteLink(selectedCommunity?.estate?._id, newLink);
                setInviteLinkState(newLink);
            } catch (error: any) {
                const majorBackendError = error?.response?.data?.errors?.[0]?.message;
                const backendMessage = error?.response?.data?.message;
                const backendMessageTwo = error?.response?.data?.message?.[0];
                const fallbackMessage = error?.message || "An error occurred during login";

                toast.error(
                    majorBackendError ||
                    backendMessage ||
                    backendMessageTwo ||
                    fallbackMessage,
                    {
                        position: "top-center",
                        duration: 5000,
                    }
                );
            } finally {
                setLoading(false);
            }
        };

        const cached = getInviteLink(selectedCommunity?.estate?._id);
        const isExpired = !cached || Date.now() - cached.fetchedAt > 10 * 60 * 1000;

        if (!cached || isExpired) {
            fetchInviteLink();
        } else {
            setInviteLinkState(cached.link);
        }
    }, [selectedCommunity, communityProfile, getInviteLink, setInviteLink]);

    const handleCopy = async () => {
        if (!inviteLink) return;
        try {
            await navigator.clipboard.writeText(inviteLink);
            toast.success("Link copied to clipboard!", {
                position: "top-center",
                duration: 3000,
            });
        } catch {
            toast.error("Failed to copy link", {
                position: "top-center",
                duration: 3000,
            });
        }
    };

    return (
        <div className='py-4 px-4 md:px-7 md:py-8 rounded-[12px] bg-white w-[350px] md:w-[580px] mb-[50px] md:mb-0'>
            <div>
                <h1 className='text-[16px] md:text-[20px] font-normal md:font-bold text-BlackHomz'>
                    Invite Residents to Your Estate
                </h1>
                <h4 className='mt-1 text-[13px] md:text-[16px] font-normal text-GrayHomz'>
                    Copy and send this code to residents so they can join your estate.
                </h4>

                <div className='mt-4 bg-whiteblue p-4 rounded-[8px] flex items-center justify-between'>
                    {loading ? (
                        <span className="text-GrayHomz text-sm font-medium italic">
                            Loading link...
                        </span>
                    ) : (
                        <>
                            <span className="text-GrayHomz text-sm font-medium truncate max-w-[60%] md:max-w-[70%]">
                                {inviteLink || "No link available"}
                            </span>
                            <button
                                onClick={handleCopy}
                                className='flex gap-2 items-center text-[16px] text-BlueHomz font-normal'
                                disabled={!inviteLink}
                            >
                                <CopyIcon />
                                Copy link
                            </button>
                        </>
                    )}
                </div>

                <div className='mt-6 flex gap-3 justify-end'>
                    <button
                        onClick={() => setOpenInvite(false)}
                        className='px-4 py-2 rounded-[4px] border border-GrayHomz5 text-GrayHomz font-normal text-sm hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                </div>

                {/* <div className='flex justify-between items-center mt-7'>
                    <span className='border border-GrayHomz5 w-[45%]' />
                    <span className="font-normal w-[10%] text-center text-sm md:text-[16px] text-GrayHomz">
                        OR
                    </span>
                    <span className='border border-GrayHomz5 w-[45%]' />
                </div>

                <div className='mt-4'>
                    <h3 className='text-sm md:text-[16px] font-normal text-GrayHomz'>
                        Send an invite link to add a resident to your estate.
                    </h3>
                    <div className='mt-3 flex flex-col gap-4 md:flex-row md:items-center md:gap-2'>
                        <CustomInput
                            type="text"
                            placeholder='Enter Resident’s email'
                            className='h-[45px] px-4'
                            onChange={(e) => handleInputChange('sendCode', e.target.value)}
                        />
                        <button
                            onClick={() => {
                                setOpenSuccessModal(true);
                                handleSubmit()
                            }}
                            className='w-full md:w-[55%] rounded-[4px] bg-BlueHomz text-white text-sm font-normal h-[45px] flex items-center justify-center'
                        >
                            Send Invite
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default InviteResident;
