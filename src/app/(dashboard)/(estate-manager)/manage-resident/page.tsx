"use client"
import CustomModal from '@/components/general/customModal';
import AddWhiteBox from '@/components/icons/addWhiteBox';
import ManageResidentEmptyIcon from '@/components/icons/estateManager/desktop/manageResidentEmptyIcon';
import ManualAddIcon from '@/components/icons/estateManager/desktop/manualAddIcon';
import React from 'react'
import InviteResident from './components/inviteResident';
import SuccessModal from '../../components/successModal';
import HeaderFilter from './components/headerFilter';
import Table from './components/table';
import ManualForm from './components/manualForm';

const ManageResidents = () => {
    const [residentData, setResidentData] = React.useState<boolean>(false);
    const [openInvite, setOpenInvite] = React.useState<boolean>(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState<boolean>(false);
    const [openManualForm, setOpenManualForm] = React.useState<boolean>(false);
    return (
        <div className='p-8'>
            {
                openInvite &&
                <CustomModal isOpen={openInvite} onRequestClose={() => setOpenInvite(false)}>
                    <InviteResident
                        setOpenInvite={setOpenInvite}
                        setOpenSuccessModal={setOpenSuccessModal}
                    />
                </CustomModal>
            }
            {
                openManualForm &&
                <CustomModal isOpen={openManualForm} onRequestClose={() => setOpenManualForm(false)}>
                    <ManualForm
                        setOpenManualForm={setOpenManualForm}
                        setOpenSuccessModal={setOpenSuccessModal}
                    />
                </CustomModal>
            }
            {
                openSuccessModal &&
                <SuccessModal
                    isOpen={openSuccessModal}
                    title="Success! Invitation Sent"
                    successText="Your invitation link has been sent to [Resident's Email]. They can now create an account and join your property directly from the email."
                    color="text-BlueHomz"
                    handleBack={() => {
                        setResidentData(true);
                        setOpenSuccessModal(false);
                    }}
                    closeSuccessModal={() => {
                        setResidentData(true);
                        setOpenSuccessModal(false);
                    }}
                />

            }
            {
                residentData ?
                    <div>
                        <HeaderFilter
                            setOpenInvite={setOpenInvite}
                            setOpenManualForm={setOpenManualForm}
                        />
                        <Table />
                    </div>
                    :
                    <div>
                        <div className='flex items-center gap-2 space-x-1'>
                            <h2 className='font-medium text-[16px] md:text-[20px] text-BlackHomz'>Residents </h2>
                            <p className='text-sm md:text-[18px] text-BlueHomz font-normal py-1 rounded-[8px] bg-[#EEF5FF] px-2'>0</p>
                        </div>
                        <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                    <ManageResidentEmptyIcon />
                                </div>
                                <p className='mt-2 text-BlueHomz font-medium text-[16px] md:text-[20px]'>Get Started</p>
                                <p className='mt-1 text-GrayHomz font-normal text-sm md:text-[16px] text-center'>Share your unique link to invite residents to your estate. </p>
                                <div className='flex flex-col md:flex-row items-center gap-2 mt-2 w-full md:w-auto'>
                                    <button
                                        onClick={() => {
                                            setOpenInvite(true)
                                        }}
                                        className='bg-BlueHomz px-4 py-2 rounded-[4px] cursor-ponter text-sm font-normal text-white flex justify-center items-center gap-1 w-full md:w-auto'
                                    >
                                        <AddWhiteBox /> Invite Resident
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOpenManualForm(true);
                                        }}
                                        className='border border-BlueHomz px-4 py-2 rounded-[4px] cursor-ponter text-sm font-normal text-BlueHomz flex justify-center items-center gap-1 w-full md:w-auto'
                                    >
                                        <ManualAddIcon /> Manually add Resident
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ManageResidents