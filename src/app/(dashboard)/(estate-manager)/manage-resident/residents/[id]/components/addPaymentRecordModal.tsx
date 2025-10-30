"use client"
import React from "react"
import CustomModal from '@/components/general/customModal'
import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import DateIcon from '@/components/icons/dateIcon'
import CloseTransluscentIcon from "@/components/icons/closeTransluscentIcon"
import SuccessModal from '@/app/(dashboard)/components/successModal'
import { toast } from "react-hot-toast"

interface FormData {
    paymentDate: string
    billType: string
    frequency: string
    amount: string
    amountPaid: string
    paymentType: string
    residencyDuration: string
    startDate: string
    dueDate: string
}

interface Props {
    isOpen: boolean
    onRequestClose: () => void
    initialData?: Record<string, unknown>
    setShowData: (show: boolean) => void
    onSave?: (data: FormData) => void
}

const AddPaymentRecordModal: React.FC<Props> = ({ isOpen, onRequestClose, initialData, onSave, setShowData }) => {
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState<FormData>(() => ({
        paymentDate: (initialData?.paymentDate as string) || '',
        billType: (initialData?.billType as string) || '',
        frequency: (initialData?.frequency as string) || '[Auto filled]',
        amount: (initialData?.amount as string) || '[Auto filled]',
        amountPaid: (initialData?.amountPaid as string) || '0.00',
        paymentType: (initialData?.paymentType as string) || '',
        residencyDuration: (initialData?.residencyDuration as string) || '[Auto filled]',
        startDate: (initialData?.startDate as string) || '',
        dueDate: (initialData?.dueDate as string) || ''
    }))

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                paymentDate: (initialData.paymentDate as string) || '',
                billType: (initialData.billType as string) || '',
                frequency: (initialData.frequency as string) || '[Auto filled]',
                amount: (initialData.amount as string) || '[Auto filled]',
                amountPaid: (initialData.amountPaid as string) || '0.00',
                paymentType: (initialData.paymentType as string) || '',
                residencyDuration: (initialData.residencyDuration as string) || '[Auto filled]',
                startDate: (initialData.startDate as string) || '',
                dueDate: (initialData.dueDate as string) || ''
            })
        }
    }, [initialData])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // For now, just call onSave if provided. Real API wiring can replace this.
            await new Promise((r) => setTimeout(r, 500))
            onSave?.(formData)
            // show success modal instead of immediately closing this modal
            setShowSuccess(true)
            onRequestClose()
        } catch {
            toast.error('Unable to save record')
        } finally {
            setLoading(false)
        }
    }

    const canSave = !!formData.paymentDate && !!formData.billType

    // Payment type options for the Dropdown — pulled out so we can compute selectedId
    const paymentOptions = [
        { id: 1, label: "All Bills" },
        { id: 2, label: "Estate Dues" },
        { id: 3, label: "Estate Security" },
        { id: 4, label: "Service Charge" },
    ]

    const selectedPaymentId = paymentOptions.find(o => o.label === formData.paymentType)?.id ?? null
    const [showSuccess, setShowSuccess] = React.useState(false)

    const closeSuccess = () => {
        setShowSuccess(false)
        setShowData(true)
    }

    return (
        <>
        <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className='p-4 rounded-[12px] bg-white w-[350px] md:w-[550px] mb-[50px] md:mb-0 relative'>
                {/* close button top-right like design */}
                <button onClick={onRequestClose} className='absolute right-4 top-4 text-GrayHomz hover:text-BlackHomz'><CloseTransluscentIcon /></button>

                <h2 className='text-[16px] font-medium text-BlackHomz'>Offline Bill Payment Record</h2>
                <p className='mt-1 text-[13px] font-normal text-GrayHomz mr-[10%] md:mr-[20%]'>Manually log payments made outside the platform to keep records up-to-date and complete.</p>

                <div className='mt-6'>
                    <div className='bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Payment Date <span className='text-red-500'>*</span></label>
                            <div className='relative mt-1'>
                                <CustomInput
                                    borderColor='#4E4E4E'
                                    type='date'
                                    className='text-sm h-[45px] px-4 pr-10 input-hide-date-icon'
                                    value={formData.paymentDate}
                                    onChange={(e) => handleChange('paymentDate', e.target.value)}
                                    required
                                />
                                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'>
                                    <DateIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Bill Type <span className='text-red-500'>*</span></label>
                            <CustomInput
                                borderColor='#4E4E4E'
                                placeholder='Select bill type'
                                className='text-sm h-[45px] pl-4'
                                value={formData.billType}
                                onValueChange={(v) => handleChange('billType', v)}
                                required
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Frequency <span className='text-red-500'>*</span></label>

                            <CustomInput
                                borderColor='#4E4E4E'
                                value={formData.frequency}
                                readOnly
                                className='text-sm h-[45px] pl-4'
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Amount <span className='text-red-500'>*</span></label>
                            <CustomInput
                                borderColor='#4E4E4E'
                                value={formData.amount}
                                readOnly
                                className='text-sm h-[45px] pl-4'
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Amount Paid <span className='text-red-500'>*</span></label>
                            <CustomInput
                                borderColor='#4E4E4E'
                                type='number'
                                value={formData.amountPaid}
                                onValueChange={(v) => handleChange('amountPaid', v)}
                                className='text-sm h-[45px] pl-4'
                            />

                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Payment Type <span className='text-red-500'>*</span></label>
                            <Dropdown
                                showSearch
                                className="text-sm w-full h-[45px]"
                                onSelect={(opt) => handleChange('paymentType', opt.label)}
                                borderColor="border-GrayHomz"
                                selectOption={formData.paymentType || "All Bills"}
                                options={paymentOptions}
                                selectedId={selectedPaymentId}
                            />
                        </div>
                    </div>

                    <div className='mt-4 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Residency Duration <span className='text-red-500'>*</span></label>
                            <CustomInput value={formData.residencyDuration} readOnly className='text-sm h-[45px] pl-4' />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Start Date <span className='text-red-500'>*</span></label>
                            <div className='relative'>
                                <CustomInput
                                    borderColor='#4E4E4E'
                                    type='date'
                                    className='text-sm h-[45px] px-4 pr-10 input-hide-date-icon'
                                    value={formData.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                />
                                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'>
                                    <DateIcon />
                                </span>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                            <label className='text-sm text-GrayHomz font-medium'>Due Date <span className='text-red-500'>*</span></label>
                            <div className='relative'>
                                <CustomInput
                                    borderColor='#4E4E4E'
                                    type='date'
                                    className='text-sm h-[45px] px-4 pr-10 input-hide-date-icon'
                                    value={formData.dueDate}
                                    onChange={(e) => handleChange('dueDate', e.target.value)}
                                />
                                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'>
                                    <DateIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                    <button disabled={!canSave || loading} onClick={handleSave} className={`${loading ? 'pointer-events-none flex justify-center h-[48px]' : ''} mt-4 w-full text-white bg-BlueHomz p-3 hover:bg-BlueHomzDark rounded-[4px]`}>{loading ? 'Saving...' : 'Record Transaction'}</button>
                </div>
            </div >
        </CustomModal >
        <SuccessModal
                isOpen={showSuccess}
                title={'Offline Bill Payment Added Successfully'}
                successText={`You have successfully added an offline bill payment record for ${initialData?.fullName || "[Resident's Full Name]"}`}
                closeSuccessModal={closeSuccess}
                handleSubmit={closeSuccess}
                submitText="Close"
            />
        </>
    )
}

export default AddPaymentRecordModal
