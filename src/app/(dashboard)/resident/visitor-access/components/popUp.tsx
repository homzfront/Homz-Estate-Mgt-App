"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ArrowRight from '@/components/icons/arrowRight';
import RevokeIcon from '@/components/icons/revokeIcon';
import useClickOutside from '@/app/utils/useClickOutside';

interface PopUpProps {
    onMoreDetails: () => void;
    fromDefault?: boolean;
    onRevoke: () => void;
    onClose?: () => void;
    anchorRef: React.RefObject<HTMLElement>;
}

function PopUp({ onMoreDetails, fromDefault = true, onRevoke, onClose, anchorRef }: PopUpProps) {
    const [active, setActive] = React.useState(false);
    const [activeTwo, setActiveTwo] = React.useState(false);
    const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    useClickOutside(portalRef as any, () => {
        if (onClose) onClose();
    }, [anchorRef as any]);

    useEffect(() => {
        const updatePosition = () => {
            if (anchorRef.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                setPortalStyle({
                    position: 'absolute',
                    top: rect.bottom + window.scrollY,
                    left: rect.right - 180 + window.scrollX,
                    zIndex: 9999,
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
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
                className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoreDetails();
                        if (onClose) onClose();
                    }}
                    className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                >
                    <ArrowRight className={active ? '#006AFF' : "#4E4E4E"} />
                    <p className={`${active ? 'text-[#006AFF]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                        More Details
                    </p>
                </button>
            </div>
            {/* Revoke Access */}
            <div
                onMouseEnter={() => setActiveTwo(true)}
                onMouseLeave={() => setActiveTwo(false)}
                className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRevoke();
                        if (onClose) onClose();
                    }}
                    className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                >
                    <RevokeIcon className={activeTwo ? '#D92D20' : "#4E4E4E"} />
                    <p className={`${activeTwo ? 'text-[#D92D20]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                        Revoke Access
                    </p>
                </button>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? ReactDOM.createPortal(content, document.body) : null;
}

export default PopUp;
