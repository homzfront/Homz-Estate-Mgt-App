/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";

// Define status types
type Status = "Pending" | "Signed In" | "Signed Out";

interface StatusDropDownMainProps {
    selectedStatus: Status | null;
}

const getStatusStyles = (status: Status | null): string => {
    switch (status) {
        case "Pending":
            return "bg-warningBg text-warning2";
        case "Signed In":
            return "bg-successBg text-Success";
        case "Signed Out":
            return "bg-[#FDF2F2] text-error";
        default:
            return "";
    }
};

const StatusDropDown: React.FC<StatusDropDownMainProps> = ({
    selectedStatus,
}) => {
    const buttonStyle = getStatusStyles(selectedStatus);
    return (
        <div className="w-full">
            <button
                className={`rounded-md py-1.5 w-[100px] flex items-center justify-center ${buttonStyle}`}
            >
                <p>{capitalizeFirstLetter(selectedStatus)}</p>
            </button>
        </div>
    );
};

export default StatusDropDown;
