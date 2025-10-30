import React from 'react'
import FilterHeader from './filterHeader'
import Table from './table'
import ReceiptBillEmpty from '@/components/icons/receiptBillEmpty'
import AddIcon from '@/components/icons/addIcon'

interface Props {
    onOpenPaymentModal?: (data?: unknown) => void
    showData: boolean
}

const Billing: React.FC<Props> = ({ onOpenPaymentModal, showData }) => {
    return (
        <div className='min-w-[300px] w-full'>
            {
                !showData &&
                <div className='text-center md:h-[450px] flex flex-col justify-center items-center gap-2'>
                    <button className='w-[96px] h-[96px] rounded-full bg-[#F6F5F5] flex justify-center items-center'>
                        <ReceiptBillEmpty />
                    </button>
                    <p className='text-GrayHomz mt-4'>Bill payment records will be displayed here when added</p>
                    <button onClick={onOpenPaymentModal} className=' text-BlueHomz flex justify-center items-center gap-2'><AddIcon /> Add Payment Record</button>
                </div>
            }
            {showData &&
                <>
                    <FilterHeader />
                    <div className='w-full flex flex-col gap-4 md:gap-0 md:flex-row justify-between mb-6'>
                        <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-successBg border-Success'>
                            <p className='text-[11px] text-medium text-Success'>Total Expected Payments</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>N19,000,000</p>
                        </div>
                        <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-whiteblue border-BlueHomz'>
                            <p className='text-[11px] text-medium text-BlueHomz'>Total Payment Received</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>N7,000,000</p>
                        </div>
                        <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-warningBg border-warning2'>
                            <p className='text-[11px] text-medium text-warning2'>Pending Payments</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>N12,000,000</p>
                        </div>
                        <div className='border-l-[3px] rounded-[8px] p-3 h-full flex flex-col gap-4 justify-between bg-bgRed border-error'>
                            <p className='text-[11px] text-medium text-error'>Overdue Payments</p>
                            <p className='text-[13px] font-medium text-BlackHomz'>N4,000,000</p>
                        </div>
                    </div>
                    <Table onOpenPaymentModal={onOpenPaymentModal} />
                </>
            }
        </div>
    )
}

export default Billing