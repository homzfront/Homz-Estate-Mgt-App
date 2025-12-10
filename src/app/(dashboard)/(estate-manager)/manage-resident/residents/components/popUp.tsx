import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ArrowRight from '@/components/icons/arrowRight';
import DeleteIcon from '@/components/icons/deleteIcon';
import ProfileWhite from '@/components/icons/profileWhite';
import VisitorAccessMiniIcon from '@/components/icons/estateManager&Resident/desktop/visitorAccessMiniIcon';
import { useRouter } from 'next/navigation';
import { ManagerResidentItem } from '@/store/useResidentsListStore';
import { useAccessStore } from '@/store/useAccessStore';
import useClickOutside from '@/app/utils/useClickOutside';

interface PopUpProps {
    setOpenDetails: (data: boolean) => void;
    resident: ManagerResidentItem;
    onClose?: () => void;
    anchorRef: React.RefObject<HTMLElement>;
}

function PopUp({ setOpenDetails, resident, onClose, anchorRef }: PopUpProps) {
    const router = useRouter();
    const [active, setActive] = React.useState(false);
    const [activeTwo, setActiveTwo] = React.useState(false);
    const [activeThree, setActiveThree] = React.useState(false);
    const [activeFour, setActiveFour] = React.useState(false);
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
                left: rect.right - 220 - 17 + window.scrollX, // Width 220 + offset 67
                zIndex: 9999,
            });
        }
    }, [anchorRef]);

    const content = (
        <div
            ref={portalRef}
            style={portalStyle || {}}
            className={`drop-down absolute w-[220px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col gap-2 items-center justify-around shadow-lg`}
        >
            {/* More information */}
            <div
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                className="md:h-[30px] h-auto rounded-md md:hidden flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenDetails(true)
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <ArrowRight className={active ? '#006AFF' : "#4E4E4E"} />
                        <p className={`${active ? 'text-[#006AFF]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2 `}>
                            More Info
                        </p>
                    </div>
                </div>
            </div>

            {/* View Profile */}
            <div
                onMouseEnter={() => setActiveTwo(true)}
                onMouseLeave={() => setActiveTwo(false)}
                className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            const { setResident } = useAccessStore.getState();
                            setResident(resident);
                            router.push(`/manage-resident/residents/${resident._id}`)
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <ProfileWhite className={activeTwo ? '#006AFF' : "#4E4E4E"} />
                        <p className={`${activeTwo ? 'text-[#006AFF]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2 `}>
                            View Profile
                        </p>
                    </div>
                </div>
            </div>

            {/* Visitor Access Record */}
            <div
                onMouseEnter={() => setActiveThree(true)}
                onMouseLeave={() => setActiveThree(false)}
                className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <VisitorAccessMiniIcon className={activeThree ? '#006AFF' : "#4E4E4E"} />
                        <p className={`${activeThree ? 'text-[#006AFF]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2 `}>
                            Visitor Access Record
                        </p>
                    </div>
                </div>
            </div>

            {/* Remove Resident */}
            <div
                onMouseEnter={() => setActiveFour(true)}
                onMouseLeave={() => setActiveFour(false)}
                className=" md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                <div className="w-full ">
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                    >
                        <DeleteIcon className={activeFour ? '#D92D20' : "#4E4E4E"} />
                        <p className={`${activeFour ? 'text-[#D92D20]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2 `}>
                            Remove Resident
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
