"use client";
import React from "react";
import Image from "next/image";
import MobileWidget from "./components/mobileWidget";
import Widget from "./components/widget";
import ProfileCard from "./components/profileCard";
import { useAccessStore } from "@/store/useAccessStore";
import LongLeftArrow from "@/components/icons/longLeftArrow";
import { useRouter } from "next/navigation";

// interface ResidentProfileType {
//     id: string
// }

const ResidentProfile = () => {
    const router = useRouter();
    const { resident } = useAccessStore();
    return (
        <div className="w-full">
            <div className="w-full min-h-screen">
                <div className="hidden md:block">
                    <button onClick={() => router.back()} className="text-sm text-GrayHomz font-normal flex items-center gap-2 p-8">
                        <LongLeftArrow /> Go Back <span className="text-[20px] font-medium text-BlackHomz">Resident Profile</span>
                    </button>
                    <div className="w-full">
                        <Image
                            alt=""
                            src={"/Header.png"}
                            height={204}
                            width={1172}
                            layout="responsive"
                            style={{ height: "auto", width: "auto" }}
                        />
                    </div>
                    <div className="w-full flex gap-6 mt-[-20px] px-8 mb-6">
                        <div className="w-[35%]">
                            <ProfileCard residentData={resident} />
                        </div>
                        <div className="w-[65%]">
                            <Widget
                                residentData={resident}
                            />
                        </div>
                    </div>
                </div>
                <div className="md:hidden">
                    <MobileWidget
                        residentData={resident}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResidentProfile;
