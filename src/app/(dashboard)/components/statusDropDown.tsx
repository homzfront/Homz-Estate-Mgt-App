/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject, useState, useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
// import Image from "next/image";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";
import HourGlassLoader from "@/components/general/hourGlassLoader";
import ArrowDown from "@/components/icons/arrowDown";
import useClickOutside from "@/app/utils/useClickOutside";

// Define status types
type Status = "Pending" | "Signed In" | "Signed Out";

interface StatusDropDownMainProps {
    handleStatusChange: (status: Status) => void;
    isOpen: boolean;
    toggleDropdown: () => void;
    loading: boolean;
    setSelectedStatus: (status: Status) => void;
    selectedStatus: Status | null;
    value: Status;
    dropdownRef?: RefObject<HTMLDivElement>;
}

const getStatusStyles = (status: Status | null): string => {
    switch (status) {
        case "Pending":
            return "bg-warningBg text-warning2";
        case "Signed In":
            return "bg-successBg text-Success";
        case "Signed Out":
            return "bg-error text-white";
        default:
            return "";
    }
};

const StatusDropDown: React.FC<StatusDropDownMainProps> = ({
    handleStatusChange,
    isOpen,
    toggleDropdown,
    loading,
    setSelectedStatus,
    selectedStatus,
    value,
    dropdownRef,
}) => {
    const displayStatus: Status = selectedStatus ?? value;
    const buttonStyle = getStatusStyles(displayStatus);
    const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const portalRef = useRef<HTMLUListElement>(null);

    useClickOutside(buttonRef as any, () => {
        if (isOpen) toggleDropdown();
    }, [portalRef as any]);

    useEffect(() => {
        if (!isOpen || !buttonRef.current) {
            setPortalStyle(null);
            return;
        }
        const rect = buttonRef.current.getBoundingClientRect();
        setPortalStyle({
            position: 'absolute',
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
            zIndex: 9999,
        });
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="dropdown w-full">
            {loading ? (
                <div className="w-[95px] flex justify-center">
                    <HourGlassLoader />
                </div>
            ) : (
                <div>
                    <button
                        ref={buttonRef}
                        onClick={toggleDropdown}
                        className={`relative rounded-md py-1 w-[100px] flex items-center justify-center ${buttonStyle}`}
                    >
                        <div className="flex gap-2 items-center">
                            <p>{capitalizeFirstLetter(displayStatus)}</p>
                            <div className={`${isOpen ? "transform rotate-180 mt-[5px]" : "mb-[5px]"}`}>
                                <ArrowDown size={12} className={displayStatus === "Pending"
                                    ? "#dc6803"
                                    : displayStatus === "Signed In"
                                        ? "#039855"
                                        : "#ffffff"} />
                            </div>
                        </div>

                        {isOpen && portalStyle && ReactDOM.createPortal(
                            <ul
                                ref={portalRef}
                                style={portalStyle}
                                className={`dropdown-menu absolute mt-2 w-[95px] h-[80px] flex flex-col items-start justify-around px-2 py-1 bg-white shadow-md rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none block`}
                            >
                                {["Pending", "Signed In", "Signed Out"].map((status) => (
                                    <li key={status}>
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStatus(status as Status);
                                                handleStatusChange(status as Status);
                                            }}
                                            className={`text-[10px] cursor-pointer dropdown-item text-GrayHomz p-1 text-start w-[80px] rounded-md px-2 h-[20px] ${status === "Pending"
                                                ? "hover:bg-warningBg hover:text-warning2"
                                                : status === "Signed In"
                                                    ? "hover:bg-successBg hover:text-Success"
                                                    : "hover:bg-error hover:text-white"
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </li>
                                ))}
                            </ul>,
                            document.body
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default StatusDropDown;