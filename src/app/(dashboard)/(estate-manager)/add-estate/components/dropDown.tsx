"use client";
import React, { useState, useRef } from "react";
import useClickOutside from "@/app/utils/useClickOutside";
import ArrowDown from "@/components/icons/arrowDown";
import BlueTick from "@/components/icons/blueTick";

interface DropdownProps {
    options: string[];
    onSelect: (option: string) => void;
    selectOption: string;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
    borderColor?: string;
    arrowColor?: string;
    height?: string;
    textColor?: string;
    bgColor?: string;
    openBorder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    borderColor = "border-GrayHomz",
    onSelect,
    selectOption,
    className = "",
    disabled = false,
    isLoading = false,
    arrowColor = "#4E4E4E",
    bgColor = "bg-white",
    height = "h-[45px]",
    textColor = "text-BlackHomz",
    openBorder = "border-GrayHomz",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef as any, () => {
        setIsOpen(false);
    });


    const filteredOptions = options?.filter((option) =>
        option?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const handleDropdownToggle = () => {
        if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {/* Trigger */}
            <div
                className={`${textColor} px-4 border ${bgColor} ${height} text-sm p-3 rounded-[4px] cursor-pointer flex items-center justify-between shadow-sm ${isOpen ? "border-BlueHomz border-2" : `${borderColor}`
                    } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onClick={handleDropdownToggle}
            >
                <span className="mr-2 truncate">
                    {selectedOption || selectOption}
                </span>
                <div
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    <ArrowDown className={arrowColor} />
                </div>
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div
                    className={`absolute z-50 mt-1 w-full bg-white rounded-[4px] shadow-lg border ${openBorder} max-h-[240px] flex flex-col`}
                >
                    <div className="overflow-y-auto flex-1 scrollbar-container">
                        {isLoading ? (
                            <div className="p-4 text-center text-GrayHomz">Loading...</div>
                        ) : filteredOptions?.length === 0 || !filteredOptions ? (
                            <div className="p-4 text-center text-GrayHomz">
                                No options found
                            </div>
                        ) : (
                            filteredOptions?.map((option, index) => (
                                <div
                                    key={index}
                                    className={`m-2 px-4 rounded-[4px] py-3 cursor-pointer hover:bg-whiteblue text-sm ${selectedOption === option
                                            ? "text-BlueHomz"
                                            : "hover:text-BlackHomz"
                                        }`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <div className="font-medium flex items-center justify-between">
                                        {option}
                                        {selectedOption === option && <BlueTick />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
