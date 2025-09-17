"use client"
import React from 'react'
import { useAccessStore } from '@/store/useAccessStore'
import EmptyAccess from '@/components/icons/estateManager&Resident/desktop/emptyAccess'
import AddWhiteBox from '@/components/icons/addWhiteBox'
import Dropdown from '@/components/general/dropDown'
import ResetIcon from '@/components/icons/resetIcon'
import AddIcon from '@/components/icons/addIcon'
import CustomModal from '@/components/general/customModal'
import AddManualForm from './components/addManualForm'
import SuccessModal from '../../components/successModal'
import AccessTable from './components/accessTable'
import { useSelectedCommunity } from '@/store/useSelectedCommunity'
import toast, { LoaderIcon } from 'react-hot-toast'
import LoadingSpinner from '@/components/general/loadingSpinner'

const AccessControl = () => {
    const [steps, setSteps] = React.useState<number>(0);
    const [openSuccessModal, setOpenSuccessModal] = React.useState<boolean>(false);
    const { error, accessData, setAccessData, fetchManagerAccess, initialLoading, setAccessStatusFilter, accessStatusFilter } = useAccessStore();
    const [openAddManual, setOpenAddManual] = React.useState<boolean>(false);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const pages = [
        "All Records", "Manually Added Records"
    ];
    const optionData = [
        { id: 'pending', label: "Pending" },
        { id: 'approved', label: "Approved" },
        { id: 'rejected', label: "Rejected" },
        { id: 'expired', label: "Expired" },
        { id: 'revoke', label: "Revoke" },
        { id: 'used', label: "Used" },
        { id: 'signed in', label: "Signed In" },
        { id: 'signed out', label: "Signed Out" },
    ];


    React.useEffect(() => {
        // On first mount or when community changes, fetch based on current tab
        if (selectedCommunity) {
            fetchManagerAccess({ page: 1, limit: 8, manualOnly: steps === 1 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCommunity?._id])

    const mountedRef = React.useRef(false);
    React.useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }
        // Refetch when switching tabs between All Records and Manually Added
        if (selectedCommunity) {
            fetchManagerAccess({ page: 1, limit: 8, manualOnly: steps === 1, accessStatus: accessStatusFilter ?? null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps])

    React.useEffect(() => {
        // Clear error after 5 seconds
        if (error) {
            toast.error(error, { duration: 5000 });
        }
    }, [error])

    return (
        <div className='mb-[150px]'>
            {
                openAddManual &&
                <CustomModal isOpen={openAddManual} onRequestClose={() => setOpenAddManual(false)}>
                    <AddManualForm
                        setOpenAddManual={setOpenAddManual}
                        setOpenSuccessModal={setOpenSuccessModal}
                    />
                </CustomModal>
            }
            {
                openSuccessModal &&
                <SuccessModal
                    isOpen={openSuccessModal}
                    title='Success! Access Code Sent'
                    color='text-BlueHomz'
                    handleBack={() => {
                        setOpenSuccessModal(false)
                        setSteps(1)
                        fetchManagerAccess({ page: 1, limit: 8, manualOnly: true });
                        setAccessData(true)
                    }}
                    closeSuccessModal={() => setOpenSuccessModal(false)}
                />
            }
            {initialLoading ? (
                <div className='p-8'>
                    <h1 className='text-BlackHomz font-normal md:font-bold text-[16px] md:text-[23px]'>Visitor Access Control</h1>
                    <div className='h-[60vh] w-full flex items-center justify-center text-GrayHomz'><LoaderIcon /></div>
                </div>
            ) : accessData ?
                <div className='p-8'>
                    <div className='flex justify-between items-center border-b border-[#E6E6E6] pb-8'>
                        <div>
                            <h1 className='text-BlackHomz font-normal md:font-bold text-[16px] md:text-[23px] flex items-center gap-4'>Visitor Access Control <span onClick={() => setOpenAddManual(true)} className='md:hidden bg-whiteblue h-[36px] w-[36px] rounded-[8px] flex items-center justify-center'><AddIcon /></span></h1>
                            <h3 className='text-GrayHomz font-normal hidden md:block text-[16px]'>Click on access status to change visitor’s access status</h3>
                            <h3 className='text-GrayHomz2 font-normal text-sm md:hidden mt-2'>Tap on access status to change visitor’s access status</h3>
                        </div>
                        <button onClick={() => setOpenAddManual(true)} className='hidden bg-BlueHomz px-3 h-[37px] rounded-[4px] cursor-pointer text-sm font-normal text-white md:flex items-center gap-1'>
                            <AddWhiteBox /> Register Visitor
                        </button>
                    </div>
                    <div className='mt-8'>
                        <div className='flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between md:items-center'>
                            <div className='flex items-center gap-2'>
                                {
                                    pages.map((data, index) => (
                                        <div
                                            onClick={() => setSteps(index)}
                                            key={index}
                                            className={`${index === steps ? "text-white bg-BlueHomz" : "bg-whiteblue text-BlueHomz"} text-sm flex items-center px-3 h-[37px] rounded-[4px] cursor-pointer`}
                                        >
                                            {data}
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Dropdown
                                    options={optionData}
                                    onSelect={(opt) => {
                                        setAccessStatusFilter(String(opt.id));
                                        fetchManagerAccess({ page: 1, accessStatus: String(opt.id), manualOnly: steps === 1 });
                                    }}
                                    selectOption={"Access Status"}
                                    height='h-[37px]'
                                    borderColor='border-[#A9A9A9]'
                                    showSearch={false}
                                    selectedId={accessStatusFilter}
                                    className='md:min-w-[150px]'
                                />
                                <button
                                    onClick={() => {
                                        setAccessStatusFilter(null);
                                        fetchManagerAccess({ page: 1, accessStatus: null, manualOnly: steps === 1 });
                                    }}
                                    className='px-3 h-[37px] border border-BlueHomz rounded-[4px] flex items-center gap-1 text-BlueHomz text-sm'>
                                    <ResetIcon />Reset
                                </button>
                            </div>
                        </div>
                        <div>
                            {initialLoading ? (
                                <div className='h-[300px] w-full flex items-center justify-center text-GrayHomz'><LoadingSpinner /></div>
                            ) : (
                                <AccessTable
                                    steps={steps}
                                />
                            )}
                        </div>
                    </div>
                </div>
                :
                <div className='p-8'>
                    <h1 className='text-BlackHomz font-bold text-[16px] md:text-[23px]'>Visitor Access Control</h1>
                    <h3 className='text-GrayHomz font-normal text-sm md:text-[16px]'>Visitor records of all your Residents will be displayed here</h3>
                    <div className='h-[80vh] md:h-[500px] w-full flex justify-center items-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <div className='flex w-[120px] h-[120px] rounded-full bg-[#EEF5FF] justify-center items-center'>
                                <EmptyAccess />
                            </div>
                            <p className='mt-2 text-[#141313] font-medium text-sm md:text-[16px]'>Add New Estate to Get Started</p>
                            <button
                                onClick={() => {
                                    setOpenAddManual(true)
                                }}
                                className='bg-BlueHomz px-4 py-2 rounded-[4px] cursor-ponter text-sm font-normal text-white flex items-center gap-1'
                            >
                                <AddWhiteBox /> Register Visitor
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AccessControl