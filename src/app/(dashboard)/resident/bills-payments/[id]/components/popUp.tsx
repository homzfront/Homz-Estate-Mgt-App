"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DocDocuSmall from '@/components/icons/docDocuSmall';
import PaymentRecordIcon from '@/components/icons/paymentRecordIcon';
import useClickOutside from '@/app/utils/useClickOutside';
import { ResidentBillItem } from '@/store/useResidentBillStore';

interface PopUpProps {
    bill: ResidentBillItem;
    onClose?: () => void;
    anchorRef: React.RefObject<HTMLElement>;
    handleMoreInfo: () => void;
    handlePaymentRecord: () => void;
    isInactive: boolean;
}

function PopUp({ bill, onClose, anchorRef, handleMoreInfo, handlePaymentRecord, isInactive }: PopUpProps) {
    const [active, setActive] = React.useState(false);
    const [activeTwo, setActiveTwo] = React.useState(false);
    const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    useClickOutside(anchorRef as any, () => {
        if (onClose) onClose();
    }, [portalRef as any]);

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY,
                left: rect.right - 180 + window.scrollX, // Width 180
                zIndex: 9999,
            });
        }
    }, [anchorRef]);

    const content = (
        <div
            ref={portalRef}
            style={portalStyle || {}}
            className={`drop-down absolute w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around shadow-lg`}
        >
            {/* More info */}
            <div
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                className="h-[35px] rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            handleMoreInfo()
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <DocDocuSmall />
                        <p className={`${active ? 'text-[#006AFF]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                            More info
                        </p>
                    </div>
                </div>
            </div>
            {/* Payment record */}
            <div
                onMouseEnter={() => setActiveTwo(true)}
                onMouseLeave={() => setActiveTwo(false)}
                className={`h-[35px] rounded-md flex gap-1 items-center ${isInactive ? 'opacity-50 cursor-not-allowed' : 'text-GrayHomz hover:text-BlueHomz'} py-1 px-2 w-full `}>
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            if (!isInactive) {
                                handlePaymentRecord();
                            }
                        }}
                        className={`px-2 flex gap-1 items-center h-full w-full rounded-md ${isInactive ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-whiteblue'}`}
                    >
                        <PaymentRecordIcon color={isInactive ? '#D5D5D5' : (activeTwo ? '#006AFF' : '#4E4E4E')} />
                        <p className={`${isInactive ? 'text-[#D5D5D5]' : (activeTwo ? 'text-[#006AFF]' : "text-[#4E4E4E]")} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                            Payment record
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? ReactDOM.createPortal(content, document.body) : null;
}

export default PopUp;
