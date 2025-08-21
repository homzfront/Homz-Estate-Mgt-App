"use client";
import React from 'react';
import MoreDetails from '@/components/icons/moreDetails';
import DeleteIcon from '@/components/icons/deleteIcon';

interface PopUpProps {
    setOpenDetails: (data: boolean) => void;
    fromDefault?: boolean;
    setOpenPopUp: (val: boolean) => void;
    dropdownRef?: React.RefObject<HTMLDivElement>;
}

function PopUp({ setOpenDetails, fromDefault = true, setOpenPopUp, dropdownRef }: PopUpProps) {
    const [active, setActive] = React.useState(false);
    const [activeTwo, setActiveTwo] = React.useState(false);
    return (
        <div ref={dropdownRef}>
            <div
                className={`drop-down absolute top-11 z-[9999999] w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] right-[27px] border py-2 rounded-md ${fromDefault ? "bg-[#F6F6F6]" : "bg-white"} md:bg-white flex flex-col items-center justify-around `}
            >
                {/* More Details */}
                <div
                    onMouseEnter={() => setActive(true)}
                    onMouseLeave={() => setActive(false)}
                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                    <div className="w-full ">
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenDetails(true)
                                setOpenPopUp(false);
                            }}
                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                        >
                            <MoreDetails className={active ? '#006AFF' : "#4E4E4E"} />
                            <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2">
                                More Details
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delete */}
                <div
                    onMouseEnter={() => setActiveTwo(true)}
                    onMouseLeave={() => setActiveTwo(false)}
                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                    <div className="w-full ">
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                // setOpenDetails(true)
                                setOpenPopUp(false);
                            }}
                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                        >
                            <DeleteIcon className={activeTwo ? '#D92D20' : "#4E4E4E"} />
                            <p className={`${activeTwo ? 'text-[#D92D20]' : "text-[#4E4E4E]"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                Remove
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
