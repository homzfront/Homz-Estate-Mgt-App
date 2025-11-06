import React, { useState } from 'react'
import CoinGreen from '@/components/icons/coinGreen'
import Dropdown from '@/components/general/dropDown'
import CustomModal from '@/components/general/customModal'
import { useBillStore } from '@/store/useBillStore'

type CurrencyOption = {
    label: string
    value: string
    symbol: string
}

const OPTIONS: CurrencyOption[] = [
    { label: 'Naira (₦)', value: 'NGN', symbol: '₦' },
    { label: 'Dollar ($)', value: 'USD', symbol: '$' },
    { label: 'Pound (£)', value: 'GBP', symbol: '£' },
    { label: 'Euro (€)', value: 'EUR', symbol: '€' },
]

interface SelectCurrencyProps {
    isOpen?: boolean
    onRequestClose?: () => void
    setOpenEditBillingModal?: (open: boolean) => void
    isChanging?: boolean
}

const SelectCurrency: React.FC<SelectCurrencyProps> = ({ isOpen, onRequestClose, setOpenEditBillingModal, isChanging = false }) => {
    const { selectedCurrency, setSelectedCurrency } = useBillStore()
    const [selected, setSelected] = useState<CurrencyOption>(() => {
        return OPTIONS.find(opt => opt.symbol === selectedCurrency) || OPTIONS[0]
    })
    const modalOpen = typeof isOpen === 'undefined' ? false : isOpen

    const handleClose = () => {
        if (onRequestClose) onRequestClose()
    }


    return (
        <CustomModal isOpen={modalOpen} onRequestClose={handleClose}>
            <div className="max-w-xl mx-auto bg-white px-4 py-6 rounded-[12px]">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-50 rounded-full p-3">
                        <CoinGreen />
                    </div>
                </div>

                <h3 className="text-center text-base font-bold text-BlackHomz">
                    {isChanging ? 'Change Currency' : 'Currency Setup'}
                </h3>
                <p className="text-center text-sm text-GrayHomz mt-2 mb-6 px-8">
                    {isChanging 
                        ? 'Select the currency in which this bill will be charged and paid.'
                        : 'Before creating your first bill, please set the default currency in which all bills will be charged and paid. You can change this later.'
                    }
                </p>

                <div className="bg-[#F6F6F6] rounded-lg p-3 shadow-sm">
                    <label className="block text-sm font-medium text-GrayHomz mb-2">
                        Currency <span className="text-error">*</span>
                    </label>

                    {/* Use shared Dropdown component with search enabled */}
                    <div>
                        <Dropdown
                            options={OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
                            onSelect={(opt) => {
                                const found = OPTIONS.find(o => o.value === String(opt.id))
                                if (found) setSelected(found)
                            }}
                            selectOption={selected.label}
                            displayMode="push"
                            className="w-full"
                            showSearch={false}
                            openBorder="border-GrayHomz"
                            borderColor="border-GrayHomz"
                            textColor="text-BlackHomz"
                            bgColor="bg-white"
                            height="h-[45px]"
                            selectedId={selected.value}
                        />
                    </div>

                </div>
                <div className="mt-6 flex justify-end gap-3">
                    {isChanging && (
                        <button
                            type="button"
                            className="px-4 py-2 text-GrayHomz hover:bg-gray-100 rounded text-sm"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="button"
                        className="px-4 py-2 text-white bg-BlueHomz hover:bg-BlueHomzDark rounded text-sm"
                        onClick={() => {
                            setSelectedCurrency(selected.symbol);
                            if (setOpenEditBillingModal && !isChanging) setOpenEditBillingModal(true);
                            handleClose();
                        }}
                    >
                        {isChanging ? 'Update Currency' : 'Save & Continue'}
                    </button>
                </div>
            </div>
        </CustomModal>
    )
}

export default SelectCurrency