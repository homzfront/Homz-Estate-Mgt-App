/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react";
import useClickOutside from "@/app/utils/useClickOutside";
import BlueSearch from "../icons/blueSearch";
import ArrowDown from "../icons/arrowDown";
import BlueTick from "../icons/blueTick";

interface Option {
    id: string | number;
    label: string;
    zoneName?: string;
}

interface DropdownProps {
    options: Option[];
    onSelect: (option: Option) => void;
    selectOption: string;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
    showSearch?: boolean;
    borderColor?: string;
    arrowColor?: string
    height?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    borderColor = "border-GrayHomz",
    onSelect,
    selectOption,
    className = "",
    disabled = false,
    isLoading = false,
    showSearch = true,
    arrowColor = "#4E4E4E",
    height = "h-[45px]"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef as any, () => {
        setIsOpen(false);
    });

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.zoneName && option.zoneName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDropdownToggle = () => {
        if (!disabled) {
            setIsOpen(prev => !prev);
        }
    };

    const handleOptionClick = (option: Option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {/* Trigger */}
            <div
                className={`text-BlackHomz px-4 border bg-white ${height} text-sm p-3 rounded-[4px] cursor-pointer flex items-center justify-between shadow-sm ${isOpen ? "border-BlueHomz border-2" : `${borderColor}`
                    } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onClick={handleDropdownToggle}
            >
                <span className="mr-2 truncate">
                    {selectedOption?.label || selectOption}
                </span>
                <div className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}>
                    <ArrowDown className={arrowColor} />
                </div>
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-[4px] shadow-lg border border-GrayHomz max-h-[240px] flex flex-col">
                    {/* Search input - now properly positioned */}
                    {showSearch &&
                        <div className="p-2 sticky top-0 bg-white">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-[45px] pl-4 pr-10 border rounded-md text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <BlueSearch />
                                </div>
                            </div>
                        </div>
                    }
                    {/* Options list - with proper scrolling */}
                    <div className="overflow-y-auto flex-1 scrollbar-container">
                        {isLoading ? (
                            <div className="p-4 text-center text-GrayHomz">Loading...</div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-GrayHomz">No options found</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`m-2 px-4 rounded-[4px] py-3 cursor-pointer hover:bg-whiteblue text-sm ${selectedOption?.id === option.id ? "text-BlueHomz" : " hover:text-BlackHomz"
                                        }`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <div className="font-medium flex items-center justify-between">{option.label}  {selectedOption?.id === option.id && <BlueTick />}</div>
                                    {option.zoneName && (
                                        <div className="text-sm text-GrayHomz font-normal mt-1">{option.zoneName}</div>
                                    )}
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