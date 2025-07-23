"use client";
import React from 'react';
import Link from "next/link";
import ArrowRight from '@/components/icons/arrowRight';

interface PopUpProps {
    setOpenDetails: (data: boolean) => void;
    fromDefault?: boolean;
}

function PopUp({ setOpenDetails, fromDefault = true }: PopUpProps) {
    const [active, setActive] = React.useState(false);

    return (
        <div>
            <div
                className={`drop-down absolute top-11 z-100 w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] right-[67px] border py-2 rounded-md ${fromDefault ? "bg-[#F6F6F6]" : "bg-white"} md:bg-white flex flex-col items-center justify-around `}
            >
                {/* More Details */}
                <div
                    onMouseEnter={() => setActive(true)}
                    onMouseLeave={() => setActive(false)}
                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full ">
                    <div className="w-full">
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenDetails(true)
                            }}
                            className="px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                        >
                            <ArrowRight className={active ? '#006AFF' : "#4E4E4E"} />
                            <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2">
                                More Details
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
