import React, { RefObject } from "react";
// import Image from "next/image";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";
import HourGlassLoader from "@/components/general/hourGlassLoader";
import ArrowDown from "@/components/icons/arrowDown";

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
    
    return (
        <div ref={dropdownRef} className="dropdown w-full">
            {loading ? (
                <div className="w-[95px] flex justify-center">
                    <HourGlassLoader />
                </div>
            ) : (
                <div>
                    <button
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

                        <ul
                            className={`dropdown-menu absolute top-[17px] left-0 z-50 mt-2 w-[95px] h-[80px] flex flex-col items-start justify-around px-2 py-1 bg-white shadow-md rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? "block" : "hidden"
                                }`}
                        >
                            {["Pending", "Signed In", "Signed Out"].map((status) => (
                                <li key={status}>
                                    <button
                                        onClick={() => {
                                            setSelectedStatus(status as Status);
                                            handleStatusChange(status as Status);
                                        }}
                                        className={`dropdown-item text-GrayHomz text-start w-[80px] rounded-md px-2 h-[20px] ${status === "Pending"
                                            ? "hover:bg-warningBg hover:text-warning2"
                                            : status === "Signed In"
                                                ? "hover:bg-successBg hover:text-Success"
                                                : "hover:bg-error hover:text-white"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </button>
                </div>
            )}
        </div>
    );
};

export default StatusDropDown;
