import Close from '@/components/icons/Close';
import CloseIcon from '@/components/icons/closeIcon';
import WarningIcon from '@/components/icons/warningIcon';
import WarningIconTwo from '@/components/icons/warningIconTwo';
import React from 'react'
interface PendingProps {
    setOpenPendingModal?: (data: boolean) => void;
}
const PendingEstateRequest = ({ setOpenPendingModal }: PendingProps) => {
    return (
        <div className="flex flex-col items-center p-4 md:p-8 rounded-[12px] bg-white w-full md:w-[600px]">
            <div className='flex justify-end w-full'>
                <button onClick={() => { if (setOpenPendingModal) setOpenPendingModal(false) }} className='border border-GrayHomz rounded-[6px] h-[24px] w-[24px] flex justify-center items-center'><Close /></button>
            </div>
            {/* Left Circle with Icon */}
            <WarningIconTwo />

            {/* Right Content */}
            <div className="flex-1">
                <h2 className="mt-2 text-[20px] font-bold text-BlackHomz text-center mb-3 md:mb-5">
                    Join Request is Pending
                </h2>
                <p className="text-sm text-GrayHomz font-normal mb-3">
                    Your request to join <span className="font-medium">[Building name]</span>,{" "}
                    <span className="font-medium">[Apartment name]</span> under <span className="font-medium">[Estate Name]</span> was reviewed and unfortunately not
                    approved by the estate manager. If this was unexpected or you believe it may have been a mistake, you can contact them for clarification or reach out to our support team.
                </p>
                <ul className="list-disc list-inside text-sm text-GrayHomz font-normal space-y-1 mb-3">
                    <li className="">
                        View estate and property details
                    </li>
                    <li>Request visitor access</li>
                    <li>Make payments</li>
                    <li>Receive estate announcement</li>
                </ul>
                <p className="text-sm text-GrayHomz font-normal">
                    We&apos;ll notify you as soon as your request is accepted.
                </p>
            </div>
        </div>
    )
}

export default PendingEstateRequest