/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import CustomModal from '@/components/general/customModal'
import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import DateIcon from '@/components/icons/dateIcon'
import CloseTransluscentIcon from "@/components/icons/closeTransluscentIcon"
import SuccessModal from '@/app/(dashboard)/components/successModal'
import { toast } from "react-hot-toast"

import { ManagerResidentItem } from "@/store/useResidentsListStore"
import api from '@/utils/api'
import { PropertyDetailsType } from "./propertyDetails"
import { BillItem, useBillStore } from "@/store/useBillStore"
import { useBillPaymentStore } from "@/store/useBillPaymentStore"
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter"
import formatBillType from "@/app/utils/formatBillType"

interface FormData {
    paymentDate: string
    billType: string
    residencyType: string
    frequency: string
    periodNumber: string
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
    residentData: ManagerResidentItem | null
    selectedProperty?: PropertyDetailsType
}

const AddPaymentRecordModal: React.FC<Props> = ({ isOpen, onRequestClose, initialData, onSave, setShowData, residentData, selectedProperty }) => {
    const [loading, setLoading] = React.useState(false);
    const [selectedBill, setSelectedBill] = React.useState<BillItem | null>(null);
    const { items: bills, fetchBills } = useBillStore();
    const { fetchBillPayments } = useBillPaymentStore();

    const [formData, setFormData] = React.useState<FormData>(() => ({
        paymentDate: (initialData?.paymentDate as string) || '',
        billType: (initialData?.billType as string) || '',
        residencyType: (initialData?.residencyType as string) || '',
        frequency: (initialData?.frequency as string) || '',
        periodNumber: (initialData?.periodNumber as string) || '',
        amount: (initialData?.amount as string) || '',
        amountPaid: (initialData?.amountPaid as string) || '',
        paymentType: (initialData?.paymentType as string) || '',
        residencyDuration: (initialData?.residencyDuration as string) || '',
        startDate: (initialData?.startDate as string) || '',
        dueDate: (initialData?.dueDate as string) || ''
    }))

    const resetForm = () => {
        setFormData({
            paymentDate: '',
            billType: '',
            residencyType: '',
            frequency: '',
            periodNumber: '',
            amount: '',
            amountPaid: '',
            paymentType: '',
            residencyDuration: '',
            startDate: '',
            dueDate: ''
        });
        setSelectedBill(null);
    };

    // Fetch bills when modal opens (only if not already loaded)
    React.useEffect(() => {
        if (isOpen && bills.length === 0 && residentData?.associatedIds?.organizationId && residentData?.associatedIds?.estateId) {
            fetchBills({ limit: 100 })
        }
    }, [isOpen, bills.length, residentData, fetchBills])

    // Reset form when opening for add (no initialData)
    React.useEffect(() => {
        if (isOpen && !initialData) {
            resetForm();
        }
    }, [isOpen, initialData])

    React.useEffect(() => {
        if (initialData) {
            // Helper to format date to YYYY-MM-DD
            const formatDateForInput = (dateValue: unknown): string => {
                if (!dateValue) return ''
                try {
                    const date = new Date(dateValue as string | number | Date)
                    if (isNaN(date.getTime())) return ''
                    return date.toISOString().split('T')[0]
                } catch {
                    return ''
                }
            }

            // Helper to map payment type
            const mapPaymentType = (type: unknown): string => {
                if (!type) return ''
                const t = (type as string).toLowerCase()
                if (t === 'part_payment') return 'Part-Payment'
                if (t === 'full_payment') return 'Full-Payment'
                return type as string
            }

            // Helper to map bill type
            const mapBillType = (type: unknown): string => {
                if (!type) return ''
                return formatBillType(type as string)
            }

            // Helper to capitalize frequency
            const capitalizeFrequency = (freq: unknown): string => {
                if (!freq) return ''
                const f = freq as string
                return f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()
            }

            setFormData({
                paymentDate: formatDateForInput(initialData.paymentDate),
                billType: mapBillType(initialData.billType),
                residencyType: initialData.residencyType?.toString() || '',
                frequency: capitalizeFrequency(initialData.frequency),
                periodNumber: initialData.periodNumber?.toString() || '1',
                amount: initialData.amount?.toString() || '',
                amountPaid: initialData.amountPaid?.toString() || '',
                paymentType: mapPaymentType(initialData.paymentType),
                residencyDuration: initialData.residencyDuration?.toString() || '',
                startDate: formatDateForInput(initialData.startDate),
                dueDate: formatDateForInput(initialData.dueDate)
            })
        }
    }, [initialData])

    React.useEffect(() => {
        if (isOpen && selectedProperty?.details) {
            const { rentStart, rentDue, rentDuration, rentDurationType } = selectedProperty.details

            const formatDate = (dateStr?: string) => {
                if (!dateStr) return ''
                const date = new Date(dateStr)
                if (isNaN(date.getTime())) return ''
                return date.toISOString().split('T')[0]
            }

            const capFirst = (s: string) => {
                if (!s) return ''
                const lower = s.toLowerCase()
                if (lower === 'yearly') return 'Annually'
                return s.charAt(0).toUpperCase() + s.slice(1)
            }

            let durationInMonths = ''
            const rawDuration = rentDuration !== undefined && rentDuration !== null ? rentDuration : ''

            if (rawDuration !== '') {
                const val = typeof rawDuration === 'string' ? parseInt(rawDuration) : rawDuration
                if (!isNaN(val)) {
                    durationInMonths = val.toString()

                    if (rentDurationType) {
                        const type = rentDurationType.toLowerCase()
                        if (type === 'yearly' || type === 'annually') {
                            durationInMonths = (val * 12).toString()
                        } else if (type === 'quarterly') {
                            durationInMonths = (val * 3).toString()
                        }
                    }
                }
            }

            setFormData(prev => ({
                ...prev,
                startDate: formatDate(rentStart) || prev.startDate,
                dueDate: formatDate(rentDue) || prev.dueDate,
                residencyDuration: durationInMonths || prev.residencyDuration,
                frequency: rentDurationType ? capFirst(rentDurationType) : prev.frequency
            }))
        }
    }, [selectedProperty, isOpen])

    // Sync selectedBill with formData.billType to ensure currency is correct
    React.useEffect(() => {
        if (bills.length > 0 && formData.billType) {
            const bill = bills.find(b => b.billName === formData.billType)
            if (bill) {
                setSelectedBill(bill)
            }
        }
    }, [bills, formData.billType])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleBillSelect = (billName: string) => {
        const bill = bills.find(b => b.billName === billName)
        if (bill) {
            let residencyType = ''
            let amount = bill.amount ? bill.amount.toString() : ''

            if (!bill.applyToAllResidencyTypes && bill.residencyAmounts) {
                // Try to match with selectedProperty's residencyType
                const matchingResidency = bill.residencyAmounts.find(ra => ra.residencyType === selectedProperty?.details?.residencyType)
                if (matchingResidency) {
                    residencyType = matchingResidency.residencyType
                    amount = matchingResidency.amount.toString()
                } else if (bill.residencyAmounts.length > 0) {
                    // Default to first one
                    residencyType = bill.residencyAmounts[0].residencyType
                    amount = bill.residencyAmounts[0].amount.toString()
                }
            }

            setFormData(prev => ({
                ...prev,
                billType: bill.billName,
                residencyType,
                frequency: capitalizeFirstLetter(bill.frequency),
                amount,
            }))
            setSelectedBill(bill)
        } else {
            handleChange('billType', billName)
            setSelectedBill(null)
        }
    }

    const handleResidencyTypeSelect = (residencyType: string) => {
        const matchingResidency = selectedBill?.residencyAmounts?.find(ra => ra.residencyType === residencyType)
        if (matchingResidency) {
            setFormData(prev => ({
                ...prev,
                residencyType,
                amount: matchingResidency.amount.toString(),
            }))
        } else {
            handleChange('residencyType', residencyType)
        }
    }

    const calculateDueDate = (start: string, duration: string) => {
        if (!start || !duration) return ''
        const startDate = new Date(start)
        const durationNum = parseInt(duration)
        if (isNaN(startDate.getTime()) || isNaN(durationNum)) return ''

        // Create new date to avoid mutating
        const dueDate = new Date(startDate)
        // Add months
        dueDate.setMonth(dueDate.getMonth() + durationNum)
        // Subtract 1 day
        dueDate.setDate(dueDate.getDate() - 1)

        // Handle edge case where day rollback happens (e.g. at end of months)
        if (dueDate.getDate() !== (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())).getDate()) {
            dueDate.setDate(0);
        }

        return dueDate.toISOString().split('T')[0]
    }

    React.useEffect(() => {
        // Only recalculate if user manually changes start date or duration
        // If it was just auto-filled, it should be consistent.
        if (formData.startDate && formData.residencyDuration && selectedProperty?.details?.ownershipType !== "owned") {
            const newDueDate = calculateDueDate(formData.startDate, formData.residencyDuration)
            if (newDueDate !== formData.dueDate) {
                setFormData(prev => ({ ...prev, dueDate: newDueDate }))
            }
        }
    }, [formData.startDate, formData.residencyDuration, selectedProperty?.details?.ownershipType])

    const handleSave = async () => {
        if (!residentData) {
            toast.error('Resident data missing')
            return
        }

        // Validate required fields
        const requiredFields = [
            { key: 'paymentDate', label: 'Payment Date' },
            { key: 'billType', label: 'Bill Type' },
            { key: 'frequency', label: 'Frequency' },
            { key: 'periodNumber', label: 'Bill Period' },
            { key: 'amount', label: 'Amount' },
            { key: 'amountPaid', label: 'Amount Paid' },
            { key: 'paymentType', label: 'Payment Type' },
            { key: 'startDate', label: 'Start Date' }
        ]

        if (selectedProperty?.details?.ownershipType !== "owned") {
            requiredFields.push(
                { key: 'residencyDuration', label: 'Residency Duration' },
                { key: 'dueDate', label: 'Due Date' }
            )
        }

        if (selectedBill && !selectedBill.applyToAllResidencyTypes) {
            requiredFields.push({ key: 'residencyType', label: 'Residency Type' })
        }

        for (const field of requiredFields) {
            if (!formData[field.key as keyof FormData]) {
                toast.error(`${field.label} is required`, {
                    position: "top-center",
                    duration: 4000,
                    style: {
                        background: "#FFEBEE",
                        color: "#D32F2F",
                        fontWeight: 500,
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                })
                return
            }
        }

        setLoading(true)
        try {
            const orgId = residentData.associatedIds?.organizationId
            const estateId = residentData.associatedIds?.estateId
            const residentId = residentData._id

            // Determine apartmentId:
            // 1. Use selectedProperty.id if available (assuming it maps to residence/apartment ID)
            // 2. Or find residence matching residentData.apartment
            // 3. Or fallback to first residence
            let apartmentId = selectedProperty?.id

            if (!apartmentId) {
                apartmentId = residentData.residences?.find(r => r.apartment === residentData.apartment)?._id || residentData.residences?.[0]?._id
            }

            if (!orgId || !estateId || !residentId || !apartmentId) {
                toast.error('Missing required resident information (ID, Organization, Estate, or Apartment)')
                setLoading(false)
                return
            }

            // Use selected bill's ID if available, otherwise fallback (though user should select a bill)
            const billingId = initialData?.billingId as string || selectedBill?._id

            if (!billingId) {
                toast.error('Please select a valid bill type')
                setLoading(false)
                return
            }

            const isResidencyType = !selectedBill?.applyToAllResidencyTypes

            let residencyTypeDetails = undefined
            if (isResidencyType && formData.residencyType) {
                const matchingResidency = selectedBill?.residencyAmounts?.find(
                    ra => ra.residencyType === formData.residencyType
                )
                if (matchingResidency) {
                    residencyTypeDetails = {
                        residentcyTypeId: matchingResidency._id,
                        residencyType: matchingResidency.residencyType
                    }
                }
            }

            const payload = {
                paymentDate: formData.paymentDate,
                billType: formData.billType === "Estate Security" ? "security" : formData.billType.toLowerCase().replace(' ', '_'),
                frequency: formData.frequency.toLowerCase(),
                periodNumber: parseInt(formData.periodNumber) || 1,
                amount: parseFloat(formData.amount),
                amountPaid: parseFloat(formData.amountPaid),
                paymentType: formData.paymentType,
                startDate: formData.startDate,
                // residencyDuration: selectedProperty?.details?.ownershipType === "owned" ? null : parseInt(formData.residencyDuration),
                // dueDate: selectedProperty?.details?.ownershipType === "owned" ? null : formData.dueDate,
                ...(selectedProperty?.details?.ownershipType !== "owned" && {
                    residencyDuration: parseInt(formData.residencyDuration),
                    dueDate: formData.dueDate,
                }),
                billingStartDate: selectedBill?.billingStartDate,
                billingEndDate: selectedBill?.billingEndDate,
                isResidencyType,
                ...(residencyTypeDetails && { residencyTypeDetails })
            }
            // ...(residencyTypeDetails && { residencyTypeDetails }),

            //     ...(selectedProperty?.details?.ownershipType !== "owned" && {
            //     residencyDuration: parseInt(formData.residencyDuration),
            //     dueDate: formData.dueDate,
            // })
            if (initialData) {
                // Edit: PATCH request
                await api.patch(`/community-manager/bill-payment/${initialData._id}/offine/organizations/${orgId}/estates/${estateId}/residents/${residentId}/apartments/${apartmentId}/billings/${billingId}`, payload)
            } else {
                // Add: POST request
                await api.post(`/community-manager/bill-payment/offine/organizations/${orgId}/estates/${estateId}/residents/${residentId}/apartments/${apartmentId}/billings/${billingId}`, payload)
            }

            // Fetch the data again for the table
            if (residentData?._id && apartmentId) {
                await fetchBillPayments({
                    residentId: residentData._id,
                    apartmentId: String(apartmentId),
                    silent: true
                })
            }
            setShowData(true)

            onSave?.(formData)
            setShowSuccess(true)
            onRequestClose()
        } catch (error: unknown) {
            const err = error as any
            const backendMessage = err?.response?.data?.message;
            const backendMessageTwo = err?.response?.data?.message?.[0];
            const fallbackMessage = err?.message || "An error occurred while creating your profile";

            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 4000,
                style: {
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setLoading(false);
        }
    }

    // Map bills to options
    const billTypeOptions = bills.filter(bill => {
        if (bill.applyToAllResidencyTypes) return true

        const userResidencyType = selectedProperty?.details?.residencyType
        if (userResidencyType) {
            return bill.residencyAmounts?.some(ra => ra.residencyType === userResidencyType)
        }

        return true
    }).map((bill, index) => ({
        id: bill._id || index, // Use _id if available
        label: bill.billName
    }))

    const paymentTypeOptions = [
        { id: 1, label: "Part-Payment" },
        { id: 2, label: "Full-Payment" },
    ]

    const frequencyOptions = [
        { id: 'weekly', label: 'Weekly' },
        { id: 'biweekly', label: 'Biweekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: 'Quarterly' },
        { id: 'annually', label: 'Annually' },
    ]

    const getPeriodOptions = () => {
        const freq = formData.frequency.toLowerCase()
        let count = 12
        let labelPrefix = 'Month'

        switch (freq) {
            case 'weekly':
                count = 52
                labelPrefix = 'Week'
                break
            case 'biweekly':
                count = 26
                labelPrefix = 'Bi-Week'
                break
            case 'quarterly':
                count = 4
                labelPrefix = 'Quarter'
                break
            case 'annually':
            case 'yearly':
                count = 5 // Maybe limit to 5 years? Or keep 12? Let's do 10.
                labelPrefix = 'Year'
                break
            default:
                count = 12
                labelPrefix = 'Month'
        }

        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            label: `${labelPrefix} ${i + 1}`
        }))
    }

    const periodOptions = getPeriodOptions()

    const residencyTypeOptions = selectedBill?.residencyAmounts?.map((ra, index) => ({
        id: ra._id || index,
        label: ra.residencyType
    })) || []

    // Helper to find ID by label for dropdowns
    const getSelectedIdByLabel = (options: { id: string | number, label: string }[], label: string) => {
        return options.find(o => o.label === label)?.id ?? null
    }

    const selectedBillTypeId = getSelectedIdByLabel(billTypeOptions, formData.billType)
    const selectedFrequencyId = getSelectedIdByLabel(frequencyOptions, formData.frequency)
    const selectedPaymentTypeId = getSelectedIdByLabel(paymentTypeOptions, formData.paymentType)
    const selectedResidencyTypeId = getSelectedIdByLabel(residencyTypeOptions, formData.residencyType)
    const selectedPeriodId = periodOptions.find(o => o.id.toString() === formData.periodNumber)?.id ?? null

    const [showSuccess, setShowSuccess] = React.useState(false)

    const closeSuccess = () => {
        setShowSuccess(false)
        setShowData(true)
    }

    // console.log("selectedProperty:", selectedProperty)
    // console.log("selectedBill:", selectedBill)
    // console.log("initialData:", initialData)
    // console.log("residentData:", residentData)

    return (
        <>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                <div className='p-4 rounded-[12px] bg-white w-[350px] md:w-[550px] mb-[50px] md:mb-0 relative'>
                    {/* close button top-right like design */}
                    <button onClick={onRequestClose} className='absolute right-4 top-4 text-GrayHomz hover:text-BlackHomz'><CloseTransluscentIcon /></button>

                    <h2 className='text-[16px] font-medium text-BlackHomz'>{initialData ? 'Edit' : 'Add'} Offline Bill Payment Record</h2>
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
                                <Dropdown
                                    showSearch
                                    className="text-sm w-full h-[45px]"
                                    onSelect={(opt) => handleBillSelect(opt.label)}
                                    borderColor="border-GrayHomz"
                                    selectOption={formData.billType || "Select Bill Type"}
                                    options={billTypeOptions}
                                    selectedId={selectedBillTypeId}
                                />
                            </div>
                            {selectedBill && !selectedBill.applyToAllResidencyTypes && (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                    <label className='text-sm text-GrayHomz font-medium'>Residency Type <span className='text-red-500'>*</span></label>
                                    <Dropdown
                                        showSearch
                                        className="text-sm w-full h-[45px]"
                                        onSelect={(opt) => handleResidencyTypeSelect(opt.label)}
                                        borderColor="border-GrayHomz"
                                        selectOption={formData.residencyType || "Select Residency Type"}
                                        options={residencyTypeOptions}
                                        selectedId={selectedResidencyTypeId}
                                    />
                                </div>
                            )}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                <label className='text-sm text-GrayHomz font-medium'>Frequency <span className='text-red-500'>*</span></label>
                                <Dropdown
                                    showSearch
                                    className="text-sm w-full h-[45px]"
                                    onSelect={(opt) => handleChange('frequency', opt.label)}
                                    borderColor="border-GrayHomz"
                                    selectOption={formData.frequency || "Select Frequency"}
                                    options={frequencyOptions}
                                    selectedId={selectedFrequencyId}
                                />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                <label className='text-sm text-GrayHomz font-medium'>Bill Period <span className='text-red-500'>*</span></label>
                                <Dropdown
                                    showSearch
                                    className="text-sm w-full h-[45px]"
                                    onSelect={(opt) => handleChange('periodNumber', opt.id.toString())}
                                    borderColor="border-GrayHomz"
                                    selectOption={periodOptions.find(p => p.id.toString() === formData.periodNumber)?.label || "Select Period"}
                                    options={periodOptions}
                                    selectedId={selectedPeriodId}
                                />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                <label className='text-sm text-GrayHomz font-medium'>Amount <span className='text-red-500'>*</span></label>
                                <CustomInput
                                    borderColor='#4E4E4E'
                                    value={formData.amount}
                                    type="number"
                                    onValueChange={(v) => handleChange('amount', v)}
                                    className='text-sm h-[45px] pl-4'
                                    placeholder="Enter amount"
                                    rightIcon={[selectedBill?.currency || "₦"]}
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
                                    placeholder="Enter amount paid"
                                    rightIcon={[selectedBill?.currency || "₦"]}
                                />

                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                <label className='text-sm text-GrayHomz font-medium'>Payment Type <span className='text-red-500'>*</span></label>
                                <Dropdown
                                    showSearch
                                    className="text-sm w-full h-[45px]"
                                    onSelect={(opt) => handleChange('paymentType', opt.label)}
                                    borderColor="border-GrayHomz"
                                    selectOption={formData.paymentType || "Select Payment Type"}
                                    options={paymentTypeOptions}
                                    selectedId={selectedPaymentTypeId}
                                />
                            </div>
                        </div>

                        <div className='mt-4 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                            {selectedProperty?.details?.ownershipType === "owned" ? (
                                null
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                    <label className='text-sm text-GrayHomz font-medium'>Residency Duration (Months) <span className='text-red-500'>*</span></label>
                                    <CustomInput
                                        borderColor='#4E4E4E'
                                        value={formData.residencyDuration}
                                        type="number"
                                        onValueChange={(v) => handleChange('residencyDuration', v)}
                                        className='text-sm h-[45px] pl-4'
                                        placeholder="e.g 12"
                                    />
                                </div>
                            )}
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
                            {selectedProperty?.details?.ownershipType === "owned" ? null : (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center'>
                                    <label className='text-sm text-GrayHomz font-medium'>Due Date <span className='text-red-500'>*</span></label>
                                    <div className='relative'>
                                        <CustomInput
                                            borderColor='#4E4E4E'
                                            type='date'
                                            className='text-sm h-[45px] px-4 pr-10 input-hide-date-icon'
                                            value={formData.dueDate}
                                            readOnly
                                        />
                                        <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'>
                                            <DateIcon />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button disabled={loading} onClick={handleSave} className={`${loading ? 'pointer-events-none flex justify-center h-[48px]' : ''} mt-4 w-full text-white bg-BlueHomz p-3 hover:bg-BlueHomzDark rounded-[4px]`}>{loading ? 'Saving...' : 'Record Transaction'}</button>
                    </div>
                </div >
            </CustomModal >
            <SuccessModal
                isOpen={showSuccess}
                title={'Offline Bill Payment Added Successfully'}
                successText={`You have successfully added an offline bill payment record for ${residentData?.firstName + ' ' + residentData?.lastName || "[Resident's Full Name]"}`}
                closeSuccessModal={closeSuccess}
                handleSubmit={closeSuccess}
                submitText="Close"
            />
        </>
    )
}

export default AddPaymentRecordModal
