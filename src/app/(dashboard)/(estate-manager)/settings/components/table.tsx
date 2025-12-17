/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Image from 'next/image';
import Dropdown from '@/components/general/dropDown';
import DeleteIcon from '@/components/icons/deleteIcon';
import PopUp from './popUp';
import useClickOutside from '@/app/utils/useClickOutside';
import { MemberItem, useMembersStore } from '@/store/useMembersStore';
import toast from 'react-hot-toast';
import HourGlassLoader from '@/components/general/hourGlassLoader';
import capitalizeFirstLetter from '@/app/utils/capitalizeFirstLetter';

type TableProps = {
    currentData: MemberItem[];
    setOpenDetails: (val: boolean) => void;
    setSelectedData: (data: MemberItem | null) => void;
    onRoleChange?: (member: MemberItem, selectedOption: { id: number | string; label: string }) => void;
    updatingRoleId?: string | null;
};

const Table: React.FC<TableProps> = ({
    currentData,
    setOpenDetails,
    setSelectedData,
    onRoleChange,
    updatingRoleId,
}) => {
    const [popUpIndex, setPopUpIndex] = React.useState<number | null>(null);
    const [openPopUp, setOpenPopUp] = React.useState(false);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const { deleteMember } = useMembersStore();

    const options = [
        { id: 1, label: 'Admin', value: 'admin' },
        // { id: 2, label: 'Account Manager', value: 'account_manager' },
        { id: 4, label: 'Security', value: 'security' },
        { id: 5, label: 'Viewer', value: 'viewer' },
    ];
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef as any, () => {
        setOpenPopUp(false);
    });

    const handleTogglePopUp = () => {
        setOpenPopUp(!openPopUp);
    };

    // Helper function to get display label for role
    const getRoleLabel = (roleValue: string) => {
        const roleOption = options.find(opt => opt.value === roleValue);
        return roleOption ? roleOption.label : capitalizeFirstLetter(roleValue);
    };

    const handleDelete = async (member: MemberItem) => {
        setDeletingId(member._id);
        try {
            await deleteMember(member._id);
            toast.success("Member removed successfully!", {
                position: "top-center",
                duration: 2000,
                style: {
                    background: "#E8F5E9",
                    color: "#2E7D32",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to remove member", {
                position: "top-center",
                duration: 2000,
                style: {
                    background: "#FFEBEE",
                    color: "#C62828",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setDeletingId(null);
        }
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
                                {data.firstName && data.lastName
                                    ? `${data.firstName} ${data.lastName}`
                                    : data.email}
                            </td>

                            {/* Web cells */}
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.firstName || <span className="text-GrayHomz5 italic">Pending</span>}
                            </td>
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.lastName || <span className="text-GrayHomz5 italic">Pending</span>}
                            </td>
                            <td className="px-4 py-4 text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                {data.email}
                            </td>

                            {/* Role dropdown */}
                            <td className="px-4 py-4">
                                {updatingRoleId === data._id ? (
                                    <div className="w-[130px] md:w-full flex justify-center items-center">
                                        <HourGlassLoader />
                                    </div>
                                ) : (
                                    <div className='w-[130px] md:w-full'>
                                        <Dropdown
                                            options={options}
                                            onSelect={(option) => onRoleChange && onRoleChange(data, option)}
                                            selectOption={getRoleLabel(data.role)}
                                            showSearch={false}
                                            borderColor="border-[#A9A9A9]"
                                            arrowColor="#A9A9A9"
                                            bgColor="bg-transparent"
                                            displayMode="portal"
                                        />
                                    </div>
                                )}
                            </td>

                            {/* Remove (web only) */}
                            <td className="px-4 py-4 hidden md:table-cell">
                                {deletingId === data._id ? (
                                    <div className="flex items-center justify-center w-full">
                                        <HourGlassLoader />
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(data);
                                        }}
                                        className="flex items-center gap-2 text-error font-[500] text-[11px] hover:opacity-70 transition-opacity"
                                    >
                                        <DeleteIcon /> Remove
                                    </button>
                                )}
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
                                    <PopUp
                                        dropdownRef={dropdownRef as any}
                                        setOpenPopUp={setOpenPopUp}
                                        setOpenDetails={setOpenDetails}
                                        memberData={data}
                                        onDelete={handleDelete}
                                        deletingId={deletingId}
                                    />
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