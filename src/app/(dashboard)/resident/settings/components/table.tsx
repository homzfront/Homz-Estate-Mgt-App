/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Image from 'next/image';
import Dropdown from '@/components/general/dropDown';
import DeleteIcon from '@/components/icons/deleteIcon';
import PopUp from './popUp';
import useClickOutside from '@/app/utils/useClickOutside';

type User = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    relationship: string;
    phone: string;
};

type TableProps = {
    currentData: User[];
    setOpenDetails: (val: boolean) => void;
    setSelectedData: (data: User) => void;
};

const Table: React.FC<TableProps> = ({
    currentData,
    setOpenDetails,
    setSelectedData,
}) => {
    const [popUpIndex, setPopUpIndex] = React.useState<number | null>(null);
    const [openPopUp, setOpenPopUp] = React.useState(false);
    const options = [
        { id: 1, label: 'Admin' },
        { id: 2, label: 'Account Officer' },
        { id: 3, label: 'Landlord' },
        { id: 4, label: 'Security' },
    ];

    const relationshipOptions = [
        { id: 1, label: "None" },
        { id: 2, label: "Spouse" },
        { id: 3, label: "Housemate" },
        { id: 4, label: "Sibling" },
        { id: 5, label: "Parent" },
        { id: 6, label: "Other" },
    ];

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef as any, () => {
        setOpenPopUp(false);
    });
    const handleTogglePopUp = () => {
        setOpenPopUp(!openPopUp);
    };

    return (
        <div className="mt-8 w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-whiteblue h-[50px] text-[13px] font-[500] text-BlackHomz">
                        {/* Full Name (mobile only) */}
                        <th className="px-4 text-left md:hidden">Full Name</th>

                        {/* Web columns */}
                        <th className="px-4 text-left hidden md:table-cell">First Name</th>
                        <th className="px-4 text-left hidden md:table-cell">Last Name</th>
                        <th className="px-4 text-left hidden md:table-cell">Email</th>

                        {/* Role and Action (always visible) */}
                        <th className="px-4 text-left">Role</th>
                        <th className="px-4 text-left hidden md:table-cell">Relationship</th>
                        <th className="px-4 text-left hidden md:table-cell">Action</th>

                        {/* Dots (mobile only) */}
                        <th style={{ width: "50px" }} className="px-4 md:hidden"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData?.map((data, index) => (
                        <tr
                            key={index}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     setOpenDetails(true);
                            //     setSelectedData(data);
                            // }}
                            className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                            {/* Full Name (mobile only) */}
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] md:hidden">
                                {data.firstName} {data.lastName}
                            </td>

                            {/* Web cells */}
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.firstName}
                            </td>
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.lastName}
                            </td>
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.email}
                            </td>

                            {/* Role dropdown */}
                            <td className="px-4 py-4">
                                <div className='w-[130px] md:w-full'>
                                    <Dropdown
                                        options={options}
                                        onSelect={(option) =>
                                            setSelectedData({ ...data, role: option.label })
                                        }
                                        selectOption={data.role || 'Select role'}
                                        showSearch={false}
                                        borderColor="border-[#A9A9A9]"
                                        arrowColor="#A9A9A9"
                                        bgColor="bg-transparent"
                                    />
                                </div>
                            </td>


                            {/* Relationship dropdown */}
                            <td className="px-4 py-4  hidden md:table-cell">
                                <div className='w-[130px] md:w-full'>
                                    <Dropdown
                                        options={relationshipOptions}
                                        onSelect={(option) =>
                                            setSelectedData({ ...data, relationship: option.label })
                                        }
                                        selectOption={data.relationship || 'Select role'}
                                        showSearch={false}
                                        borderColor="border-[#A9A9A9]"
                                        arrowColor="#A9A9A9"
                                        bgColor="bg-transparent"
                                    />
                                </div>
                            </td>

                            {/* Remove (web only) */}
                            <td className="px-4 py-4 hidden md:table-cell">
                                <div className="flex items-center gap-2 text-error font-[500] text-[11px]">
                                    <DeleteIcon /> Remove
                                </div>
                            </td>

                            {/* Dots icon (mobile only) */}
                            <td className="px-4 py-4 md:hidden relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedData(data);
                                        handleTogglePopUp()
                                        setPopUpIndex(index);
                                    }}
                                    className="flex items-center justify-center w-full"
                                >
                                    <Image
                                        src="/dots-vertical.png"
                                        alt="Options"
                                        height={21}
                                        width={20}
                                        style={{ height: 'auto', width: 'auto' }}
                                    />
                                </button>
                                {openPopUp && popUpIndex === index && (
                                    <PopUp dropdownRef={dropdownRef as any} setOpenPopUp={setOpenPopUp} setOpenDetails={setOpenDetails} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;