import Image from "next/image";
import React from "react";
import { ManagerResidentItem } from "@/store/useResidentsListStore";

interface ProfileCardProps {
    residentData: ManagerResidentItem | null
}

const ProfileCard = ({ residentData }: ProfileCardProps) => {
    return (
        <div className="w-[350px] h-auto py-4 px-6 shadow-md bg-white rounded-[12px]">
            <div className="w-full ">
                <div className="w-[198px] h-[198px] bg-GrayHomz5 rounded-full flex items-center justify-center">
                    <Image
                        src="/user.png"
                        height={52}
                        width={52}
                        alt="img"
                    />
                </div>
            </div>
            <h1 className="font-[700] my-4 text-[20px] text-GrayHomz">
                {residentData ? `${residentData.firstName} ${residentData.lastName}` : ''}
            </h1>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-3">
                    <p className="text-[13px] font-[400] text-GrayHomz">Phone No</p>
                    <p className="text-[13px] font-[500] text-BlackHomz w-[62%]">
                        -
                    </p>
                </div>
                <div className="flex justify-between gap-3">
                    <p className="text-[13px] font-[400] text-GrayHomz">Email</p>
                    <p className="text-[13px] font-[500] break-words text-BlackHomz w-[62%]">
                        {residentData?.email || ''}
                    </p>
                </div>
                <div className="flex justify-between gap-3">
                    <p className="text-[13px] font-[400] text-GrayHomz">Home Address</p>
                    <p className="text-[13px] font-[500] text-BlackHomz w-[62%]">
                        {residentData ? `${residentData.building}, ${residentData.apartment}, ${residentData.streetName}, ${residentData.zone}` : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
