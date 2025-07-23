"use client";
import { Visitor } from "@/app/(dashboard)/components/visitors";
import React from "react";
import RentInfo from "./rentInfo";

interface widgetProps {
    residentData: Visitor | null;
};

const Widget = ({
    residentData,
}: widgetProps) => {
    const [step, setStep] = React.useState(0);

    return (
        <div>
            <div className="inline-block min-w-[620px] w-[100%] h-auto p-4 shadow-md bg-white rounded-[12px]">
                <div className="flex mt-5 gap-4 cursor-pointer w-full pb-8 border-b border-[#E6E6E6]">
                    <div
                        className={`rounded-md h-[37px] w-[auto] px-4 text-[14px] font-[500] py-2 text-center ${step === 0 ? "bg-BlueHomz text-white" : "text-GrayHomz"}`}
                        onClick={() => setStep(0)}
                    >
                        <p>Rent Information</p>
                    </div>
                    <div
                        className={`rounded-md h-[37px] w-[auto] px-4 text-[14px] font-[500] py-2 text-center ${step === 1 ? "bg-BlueHomz text-white" : "text-GrayHomz"}`}
                        onClick={() => setStep(1)}
                    >
                        <p>Bill Payment History</p>
                    </div>
                </div>
                <div className="mt-5 rounded-[12px]">
                    {step === 0 && (
                        <RentInfo />
                    )}
                    {step === 1 && (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Widget;
