import CustomInput from '@/components/general/customInput';
import CopyIcon from '@/components/icons/copyIcon';
import React from 'react'

interface InviteResidentProps {
    setOpenSuccessModal: (data: boolean) => void;
    setOpenInvite:(data: boolean) => void;
}

const InviteResident = ({ setOpenInvite,setOpenSuccessModal }: InviteResidentProps) => {
    const [formData, setFormData] = React.useState({
        sendCode: '',
    });
        const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        const payload = formData
        console.log(payload)
        setOpenInvite(false);
    }

    return (
        <div className='py-4 px-4 md:px-7 md:py-8 rounded-[12px] bg-white w-[350px] md:w-[580px] mb-[50px] md:mb-0'>
            <div className=''>
                <h1 className='text-[16px] md:text-[20px] font-normal md:font-bold text-BlackHomz'>Invite Residents to Your Estate</h1>
                <h4 className='mt-1 text-[13px] md:text-[16px] font-normal text-GrayHomz'>Copy and send this code to residents so they can join your estate.</h4>
                <div className='mt-4 bg-whiteblue p-4 rounded-[8px] flex items-center justify-between'>
                    <span className="text-GrayHomz text-sm font-medium space-y-4">
                        www.homz.ng/share-link
                    </span>
                    <button className='flex gap-2 items-center text-[16px] text-BlueHomz font-normal'>
                        <CopyIcon />
                        Copy link
                    </button>
                </div>
                <div className='flex justify-between items-center mt-7'>
                    <span className='border border-GrayHomz5 w-[45%]' />
                    <span className="font-normal w-[10%] text-center text-sm md:text-[16px] text-GrayHomz">
                        OR
                    </span>
                    <span className='border border-GrayHomz5 w-[45%]' />
                </div>

                <div className='mt-4'>
                    <h3 className='text-sm md:text-[16px] font-normal text-GrayHomz'>Send an invite link to add a resident to your estate.</h3>
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
                </div>
            </div>
        </div>
    )
}

export default InviteResident