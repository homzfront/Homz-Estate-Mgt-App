import React, { useState, RefObject } from 'react'
import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import CustomModal from '@/components/general/customModal'
import UnTicked from '@/components/icons/unTicked'
import Ticked from '@/components/icons/ticked'
import AddIcon from '@/components/icons/addIcon'
import ArrowDown from '@/components/icons/arrowDown'
import useClickOutside from '@/app/utils/useClickOutside'
import CheckedIcon from '@/components/icons/CheckedIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import RemoveIcon from '@/components/icons/removeIcon'
import { useBillStore, BillItem } from '@/store/useBillStore'
import toast from 'react-hot-toast'
import DotLoader from '@/components/general/dotLoader'
import SelectCurrency from './selectCurrency'

const RESIDENCY_TYPES = [
    'All Residency Type',
    'Detached House / Bungalow',
    'Semi-Detached House',
    'Duplex/Two-Storey House',
    'Flat / Apartment',
    'Studio Apartment',
    'Terraced / Row House',
    'Serviced Apartment',
    'Penthouse',
    'Hostel / Lodging Unit',
    'Shop / Store',
    'Shopping Mall',
    'Office Space',
    'Kiosk / Mini-Store',
]

const frequencyOptions = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Biweekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'annually', label: 'Annually' },
]

interface EditBillingProps {
    isOpen?: boolean
    onRequestClose?: () => void
    setOpenSuccessModal?: (open: boolean) => void
    billData?: BillItem | null
    isEditing?: boolean
}

const EditBilling: React.FC<EditBillingProps> = ({ isOpen, onRequestClose, setOpenSuccessModal, billData, isEditing = false }) => {
    const { selectedCurrency, createBill, updateBill } = useBillStore()
    const [loading, setLoading] = useState(false)
    const [showCurrencyModal, setShowCurrencyModal] = useState(false)

    const modalOpen = typeof isOpen === 'undefined' ? false : isOpen
    const handleClose = () => {
        if (onRequestClose) onRequestClose()
    }

    const [billName, setBillName] = useState(billData?.billName || '')
    const [amount, setAmount] = useState(() => {
        if (billData?.applyToAllResidencyTypes && billData.amount !== undefined) {
            return billData.amount.toString()
        }
        return ''
    })
    const [applyAll, setApplyAll] = useState(billData?.applyToAllResidencyTypes ?? false)
    const [frequency, setFrequency] = useState(billData?.frequency || 'monthly')
    const [startDate, setStartDate] = useState(() => {
        if (billData?.billingStartDate) {
            const date = new Date(billData.billingStartDate)
            return date.toISOString().split('T')[0]
        }
        return ''
    })
    const [showSection, setShowSection] = useState(!!(billData?.residencyAmounts && billData.residencyAmounts.length > 0))
    const [showAssignPanel, setShowAssignPanel] = useState(!!(billData?.residencyAmounts && billData.residencyAmounts.length > 0))
    const [residencyAmounts, setResidencyAmounts] = useState<Array<{ type: string, amount: string }>>(() => {
        if (billData?.residencyAmounts && billData.residencyAmounts.length > 0) {
            return billData.residencyAmounts.map(ra => ({
                type: ra.residencyType,
                amount: ra.amount.toString()
            }))
        }
        return [{ type: '', amount: '' }]
    })
    const [isOpenDropdowns, setIsOpenDropdowns] = useState<boolean[]>(() => {
        if (billData?.residencyAmounts && billData.residencyAmounts.length > 0) {
            return new Array(billData.residencyAmounts.length).fill(false)
        }
        return [false]
    })

    const handleResidencyTypeChange = (index: number, value: string) => {
        setResidencyAmounts(prev => prev.map((item, i) => i === index ? { ...item, type: value } : item))
    }

    const handleResidencyAmountChange = (index: number, value: string) => {
        setResidencyAmounts(prev => prev.map((item, i) => i === index ? { ...item, amount: value } : item))
    }

    const addResidencyAmount = () => {
        setResidencyAmounts(prev => [...prev, { type: '', amount: '' }])
        setIsOpenDropdowns(prev => [...prev, false])
    }

    const removeResidencyAmount = (index: number) => {
        setResidencyAmounts(prev => prev.filter((_, i) => i !== index))
        setIsOpenDropdowns(prev => prev.filter((_, i) => i !== index))
    }

    const handleDropdownToggle = (index: number) => {
        setIsOpenDropdowns(prev => prev.map((open, i) => i === index ? !open : false))
    }

    const handleOptionClick = (option: string, index: number) => {
        handleResidencyTypeChange(index, option)
        setIsOpenDropdowns(prev => prev.map((open, i) => i === index ? false : open))
    }

    const dropdownRef = React.useRef<HTMLDivElement | null>(null)

    useClickOutside(dropdownRef as RefObject<HTMLElement>, () => {
        setIsOpenDropdowns(prev => prev.map(() => false))
    })

    return (
        <CustomModal isOpen={modalOpen} onRequestClose={handleClose}>
            <div className="w-full max-w-[705px] mx-auto">
                <div className="bg-white rounded-[12px] shadow-md px-4 py-6 w-full">
                    <h2 className="text-[18px] font-semibold text-BlackHomz">{isEditing ? 'Edit Bill' : 'Create New Bill'}</h2>
                    <p className="text-base text-GrayHomz">{isEditing ? 'Update the bill information for your estate.' : 'Set up a new bill for your estate.'}</p>

                    <div className="bg-[#F6F6F6] rounded-lg p-3 shadow-sm mt-4">
                        <p className='text-base text-GrayHomz font-medium'>Bill Information</p>
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                                <div className="md:col-span-2">
                                    <CustomInput
                                        label="Bill Name"
                                        value={billName}
                                        onValueChange={(v) => setBillName(v)}
                                        placeholder="e.g. Utility Bill"
                                        required
                                        className='h-[45px] pl-4'
                                    />
                                </div>

                                <div className=''>
                                    <CustomInput
                                        label={`Amount${applyAll ? ' (All Types)' : ''}`}
                                        value={amount}
                                        onValueChange={(v) => setAmount(v)}
                                        placeholder="0.00"
                                        className='h-[45px] pl-4'
                                        type='number'
                                        rightIcon={<span className="text-sm pr-1">[{selectedCurrency}]</span>}
                                        required={applyAll}
                                    />
                                    <div className='w-full flex justify-end '>
                                        <button 
                                            type="button"
                                            onClick={() => setShowCurrencyModal(true)}
                                            className="text-xs mt-1 text-BlueHomz hover:underline"
                                        >
                                            Change currency
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    id="applyAll"
                                    type="button"
                                    onClick={() => {
                                        const newApplyAll = !applyAll
                                        setApplyAll(newApplyAll)

                                        // If unchecking "apply to all", show the section to add residency amounts
                                        if (!newApplyAll) {
                                            setShowSection(true)
                                            setShowAssignPanel(true)
                                        } else {
                                            // If checking "apply to all", hide the section
                                            setShowSection(false)
                                            setShowAssignPanel(false)
                                        }
                                    }}
                                    className="h-4 w-4"
                                >
                                    {applyAll ? <Ticked /> : <UnTicked />}
                                </button>
                                <label htmlFor="applyAll" className="text-sm text-GrayHomz font-medium">Apply amount to all residency type</label>
                            </div>

                            <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-GrayHomz mb-1">Frequency <span className="text-red-500">*</span></label>
                                    <Dropdown
                                        options={frequencyOptions}
                                        onSelect={(opt) => setFrequency(String(opt.id))}
                                        selectOption={frequencyOptions.find(f => f.id === frequency)?.label || 'Select frequency'}
                                        displayMode="push"
                                        className="w-full"
                                        showSearch={false}
                                        openBorder="border-GrayHomz"
                                        borderColor="border-GrayHomz"
                                        textColor="text-BlackHomz"
                                        bgColor="bg-white"
                                        height="h-[45px]"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-GrayHomz mb-1">Billing start date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-[45px] px-3 border rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {showSection && (
                        <div className='mt-6'>
                            <div>
                                <button
                                    type="button"
                                    className="w-full md:text-center text-start flex justify-between items-center text-sm font-medium bg-BlueHomz text-white p-4 rounded-lg"
                                    onClick={() => setShowAssignPanel(!showAssignPanel)}
                                >
                                    <span className="max-w-[220px] md:max-w-sm truncate" title='Assign Different Amount to Specific Residency Types'>Assign Different Amount to Specific Residency Types</span>
                                    <span className={`${showAssignPanel ? "transform rotate-180" : ""}`}>
                                        <ArrowDown className='#ffffff' />
                                    </span>
                                </button>
                            </div>

                            {showAssignPanel && (
                                <div className="mt-2 rounded-lg px-3 py-5 bg-[#F6F6F6]">
                                    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-GrayHomz">Residency Type</label>
                                        </div>
                                        <div className="text-sm text-GrayHomz md:col-span-1">Amount <span className='text-error'>*</span></div>
                                    </div>

                                    <div className="max-h-64 overflow-y-auto scrollbar-container">
                                        {residencyAmounts.map((item, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 mb-2">
                                                <div className={`relative md:col-span-2`} ref={dropdownRef}>
                                                    <label className="md:hidden mb-1 text-sm font-medium text-GrayHomz">Residency Type</label>
                                                    <div>
                                                        <div
                                                            className={`text-BlackHomz px-4 border bg-white h-[45px] text-sm rounded-[4px] cursor-pointer flex items-center justify-between shadow-sm border-GrayHomz`}
                                                            onClick={() => handleDropdownToggle(index)}
                                                        >
                                                            <span className="mr-2 truncate">
                                                                {item.type || 'Select residency type'}
                                                            </span>
                                                            <div className={`w-5 h-5 transition-transform duration-200 ${isOpenDropdowns[index] ? "transform rotate-180" : ""}`}>
                                                                <ArrowDown className='#4e4e4e' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Dropdown Content */}
                                                    {isOpenDropdowns[index] && (
                                                        <div className={`bg-white rounded-[4px] shadow-lg border border-GrayHomz max-h-[240px] flex flex-col`}>

                                                            <div className="overflow-y-auto flex-1 scrollbar-container">
                                                                {RESIDENCY_TYPES.map((option, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className={`m-2 px-4 rounded-[4px] py-3 cursor-pointer hover:bg-whiteblue text-sm flex items-center gap-2 ${(item.type === option) ? "text-BlueHomz" : " hover:text-BlackHomz"
                                                                            }`}
                                                                        onClick={() => handleOptionClick(option, index)}
                                                                    >
                                                                        {item.type === option ? <CheckedIcon /> : <CheckIcon />}   <div className="font-medium flex items-center justify-between">{option} </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="md:col-span-1">
                                                    <div className="md:hidden text-sm text-GrayHomz mb-1">Amount <span className='text-error'>*</span></div>
                                                    <CustomInput
                                                        value={item.amount}
                                                        onValueChange={(v) => handleResidencyAmountChange(index, v)}
                                                        placeholder="0.00"
                                                        className='h-[45px] pl-4'
                                                        type='number'
                                                        rightIcon={<span className="text-sm pr-1">[{selectedCurrency}]</span>}
                                                    />
                                                    <button onClick={() => removeResidencyAmount(index)} className="mt-2 flex items-center justify-start gap-1 text-sm text-error">
                                                        <RemoveIcon /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!applyAll && (
                        <button
                            onClick={() => {
                                if (!showSection) {
                                    setShowSection(true);
                                    setShowAssignPanel(true);
                                } else {
                                    addResidencyAmount();
                                }
                            }}
                            className="mt-3 text-sm text-BlueHomz flex items-center">
                            <AddIcon /> Set amount for other residency types
                        </button>
                    )}
                    <div className="mt-5 flex justify-end gap-3">
                        <button onClick={() => { handleClose(); }} disabled={loading} className="p-3 bg-transparent text-sm text-GrayHomz">Close</button>
                        <button
                            onClick={async () => {
                                // Validation
                                if (!billName.trim()) {
                                    toast.error('Bill name is required', { position: 'top-center' })
                                    return
                                }

                                // Amount is only required when applying to all residency types
                                if (applyAll && (!amount || parseFloat(amount) <= 0)) {
                                    toast.error('Valid amount is required', { position: 'top-center' })
                                    return
                                }

                                if (!startDate) {
                                    toast.error('Billing start date is required', { position: 'top-center' })
                                    return
                                }

                                // Convert date to ISO format with start of day UTC
                                const dateObj = new Date(startDate)
                                const isoDate = new Date(Date.UTC(
                                    dateObj.getFullYear(),
                                    dateObj.getMonth(),
                                    dateObj.getDate(),
                                    0, 0, 0, 0
                                )).toISOString()

                                // Build payload based on applyToAllResidencyTypes
                                let payload: any = {
                                    currency: selectedCurrency,
                                    billName: billName.trim(),
                                    applyToAllResidencyTypes: applyAll,
                                    frequency,
                                    billingStartDate: isoDate,
                                }

                                if (applyAll) {
                                    // If applying to all, include general amount only
                                    payload.amount = parseFloat(amount)
                                } else {
                                    // If NOT applying to all, include residencyAmounts only
                                    const hasValidResidencyAmounts = showSection && showAssignPanel &&
                                        residencyAmounts.length > 0 &&
                                        residencyAmounts.some(ra => ra.type && ra.amount)

                                    if (!hasValidResidencyAmounts) {
                                        toast.error('Please add at least one residency type with amount', { position: 'top-center' })
                                        return
                                    }

                                    payload.residencyAmounts = residencyAmounts
                                        .filter(ra => ra.type && ra.amount)
                                        .map(ra => ({
                                            residencyType: ra.type,
                                            amount: parseFloat(ra.amount),
                                            currency: selectedCurrency
                                        }))
                                }

                                setLoading(true)
                                try {
                                    if (isEditing && billData?._id) {
                                        await updateBill(billData._id, payload)
                                        toast.success('Bill updated successfully!', { position: 'top-center' })
                                    } else {
                                        await createBill(payload)
                                        toast.success('Bill created successfully!', { position: 'top-center' })
                                    }
                                    handleClose()
                                    if (setOpenSuccessModal) setOpenSuccessModal(true)
                                } catch (error: any) {
                                    toast.error(error.message || 'Failed to save bill', { position: 'top-center' })
                                } finally {
                                    setLoading(false)
                                }
                            }}
                            disabled={loading}
                            className="p-3 bg-BlueHomz hover:bg-BlueHomzDark text-white rounded text-sm min-w-[100px] flex justify-center items-center"
                        >
                            {loading ? <DotLoader /> : (isEditing ? 'Update Bill' : 'Add Bill')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Currency Selection Modal */}
            {showCurrencyModal && (
                <SelectCurrency
                    isOpen={showCurrencyModal}
                    onRequestClose={() => setShowCurrencyModal(false)}
                    isChanging={true}
                />
            )}
        </CustomModal>
    )
}

export default EditBilling