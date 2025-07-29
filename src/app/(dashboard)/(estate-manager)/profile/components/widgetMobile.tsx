import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import PersonalInfo from './personalInfo';
import BusinessInfo from './businessInfo';
import ChangePassword from '../(changePassword)/changePassword';

const WidgetMobile = () => {
    const urlParams = useSearchParams();
    const tab = urlParams.get("tab")

    const [active, setActive] = useState(tab ? tab !== 'personal' : false);
    const [activeTwo, setActiveTwo] = useState(false);
    const [activeThree, setActiveThree] = useState(false);

    const handlePageChange = () => {
        setActive(false);
        setActiveTwo(false);
        setActiveThree(false);
    };

    const handlePageChangeTwo = () => {
        setActiveTwo(true);
        setActive(true);
        setActiveThree(false);
    };

    const handlePageChangeThree = () => {
        setActiveThree(true);
        setActiveTwo(false);
        setActive(true);
    };

    return (
        <div>
            <div className="md:hidden flex flex-col gap-2 mt-8 w-full">
                <div className="flex flex-wrap gap-[15px] w-full">
                    <button
                        onClick={handlePageChange}
                        className={`py-[8px] px-[12px] rounded-[4px] text-[11px] ${!active
                            ? "inline-block shadow-md bg-[#006AFF] text-white "
                            : "bg-[#EEF5FF] text-[#006AFF]"
                            }`}
                    >
                        Personal Information
                    </button>
                    <button
                        onClick={handlePageChangeTwo}
                        className={`py-[8px] px-[12px] rounded-[4px] text-[11px] ${activeTwo
                            ? "inline-block shadow-md bg-[#006AFF] text-white "
                            : "bg-[#EEF5FF] text-[#006AFF]"
                            }`}
                    >
                        Business Information
                    </button>
                    <button
                        onClick={handlePageChangeThree}
                        className={`py-[8px] px-[12px] rounded-[4px] text-[11px] ${activeThree
                            ? "inline-block shadow-md bg-[#006AFF] text-white "
                            : "bg-[#EEF5FF] text-[#006AFF]"
                            }`}
                    >
                        Change Password
                    </button>
                </div>
            </div>
            <div className="my-7 rounded-[12px] w-full">
                <div className={`${!active ? "inline" : "hidden"}`}>
                    <PersonalInfo />
                </div>
                <div className={`${activeTwo ? "inline" : "hidden"}`}>
                    <BusinessInfo />
                </div>
                <div className={`${activeThree ? "inline" : "hidden"}`}>
                    <ChangePassword />
                </div>
            </div>
        </div>
    )
}

export default WidgetMobile;