/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ArrowRight from '@/components/icons/arrowRight';
import RevokeIcon from '@/components/icons/revokeIcon';
import useClickOutside from '@/app/utils/useClickOutside';

interface PopUpProps {
    disabledRevoke?: boolean;
    setOpenDetails: (data: boolean) => void;
    fromDefault?: boolean;
    setOpenRevoke: (val: boolean) => void;
    onClose?: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
}

function PopUp({ setOpenDetails, fromDefault = true, setOpenRevoke, disabledRevoke = false, onClose, anchorRef }: PopUpProps) {
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
            const isMobile = window.innerWidth < 768;
            const width = isMobile ? 150 : 180;
            // Align right side of popup near right side of trigger
            // Reduce offset significantly for mobile to avoid it being "far"
            const offset = isMobile ? 45 : 75;

            setPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY - 20,
                left: rect.right - width + window.scrollX - offset,
                zIndex: 9999,
            });
        }
    }, [anchorRef]);

    const content = (
        <div
            ref={portalRef}
            style={portalStyle || {}}
            className={`drop-down absolute w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md ${fromDefault ? "bg-[#F6F6F6]" : "bg-white"} md:bg-white flex flex-col items-center justify-around shadow-lg`}
        >
            {/* More Details */}
            <div
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                className="md:hidden md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenDetails(true)
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <ArrowRight className={active ? '#006AFF' : "#4E4E4E"} />
                        <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2">
                            More Details
                        </p>
                    </div>
                </div>
            </div>
            {/* Revoke Access */}
            <div
                onMouseEnter={() => setActiveTwo(true)}
                onMouseLeave={() => setActiveTwo(false)}
                title={disabledRevoke ? 'Only the resident who created this code can revoke it' : ''}
                className={`md:h-[30px] h-auto rounded-md flex gap-1 items-center py-1 px-2 w-full ${disabledRevoke ? 'opacity-40 pointer-events-none cursor-not-allowed' : 'text-GrayHomz hover:text-BlueHomz'}`}>
                <div className="w-full">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenRevoke(true);
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <RevokeIcon className={activeTwo ? '#D92D20' : "#4E4E4E"} />
                        <p className={`${activeTwo && !disabledRevoke ? 'text-[#D92D20]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                            Revoke Access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {portalStyle && ReactDOM.createPortal(content, document.body)}
        </>
    );
}

export default PopUp;