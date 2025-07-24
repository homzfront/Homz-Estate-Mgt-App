import { Visitor } from "@/app/(dashboard)/components/visitors";
import ArrowRight from "@/components/icons/arrowRight";
import MobileBackButton from "@/components/icons/estateManager/mobile/mobileBackButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import RentInfo from "./rentInfo";


interface widgetMobileProps {
    residentData: Visitor | null;
};

const WidgetMobile = ({
    residentData,
}: widgetMobileProps) => {
    const [active, setActive] = React.useState(true);
    const [activeTwo, setActiveTwo] = React.useState(false);
    const [showWidget, setShowWidget] = React.useState(false);
    const route = useRouter()

    const goBack = () => {
        route.back();
    };

    const handleRent = () => {
        setActiveTwo(false);
        setActive(true);
    };

    const handleBillPaymentHistory = () => {
        setActiveTwo(true);
        setActive(false);
    };

    return (
        <div className='p-8 flex flex-col gap-2'>
            <div className='flex gap-4 items-center'>
                <div onClick={goBack} className='cursor-pointer'>
                    <div className='w-[28px] h-[28px] bg-walletBg rounded-[8px] flex justify-center items-center'>
                        <MobileBackButton />
                    </div>
                </div>
                <p className='text-[16px] font-[400] text-BlackHomz'>
                    Tenant Profile
                </p>
            </div>
            {showWidget
                ?
                <div>
                    <div className="flex flex-col gap-2 mt-8 w-full">
                        <div className="flex flex-wrap gap-[15px] w-full">
                            <button
                                onClick={handleRent}
                                className={`py-[8px] px-[12px] rounded-[4px] text-[11px] ${active
                                    ? "inline-block shadow-md bg-[#006AFF] text-white "
                                    : "bg-[#EEF5FF] text-[#006AFF]"
                                    }`}
                            >
                                Rent Information
                            </button>
                            <button
                                onClick={handleBillPaymentHistory}
                                className={`py-[8px] px-[12px] rounded-[4px] text-[11px] ${activeTwo
                                    ? "inline-block shadow-md bg-[#006AFF] text-white "
                                    : "bg-[#EEF5FF] text-[#006AFF]"
                                    }`}
                            >
                                Bill Payment History
                            </button>
                        </div>
                    </div>
                    <div className="my-7 rounded-[12px] w-full">
                        <div className={`${active ? "inline" : "hidden"}`}>
                             <RentInfo />
                        </div>
                        <div className={`${activeTwo ? "inline" : "hidden"}`}>
        
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className='mt-4 bg-inputBg rounded-[12px] px-4 py-6'>
                        <div className='flex flex-col justify-center items-center'>
                            <div className="">

                                <div className="w-[198px] h-[198px] bg-GrayHomz5 rounded-full flex items-center justify-center">
                                    <Image
                                        src="/user.png"
                                        height={52}
                                        width={52}
                                        alt="img"
                                    />
                                </div>
                            </div>
                            <h1 className="font-[700] my-2 text-[20px] text-GrayHomz">
                                {residentData?.visitor}
                            </h1>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Phone No</p>
                                <p className="text-[13px] font-[500] text-end text-BlackHomz w-[62%]">
                                    {residentData?.phoneNumber}
                                </p>
                            </div>
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Email</p>
                                <p className="text-[13px] font-[500] text-end break-words text-BlackHomz w-[62%]">
                                    AdeyemoOla@gmail.com
                                </p>
                            </div>
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Home Address</p>
                                <p className="text-[13px] font-[500] text-end text-BlackHomz break-words w-[62%]">
                                    17, Alapere, Alagomeji Area, Yaba, Lagos
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 w-full bg-GrayHomz6 rounded-[12px] text-[14px] font-[500] text-BlackHomz'>
                        <div className='px-4 h-[60px] flex items-center justify-between border-GrayHomz2 border-b-[1px] w-full'>
                            Rent Information
                            <div
                                onClick={() => {
                                    setShowWidget(true)
                                    handleRent()
                                }}
                                className='cursor-pointer'
                            >
                                <ArrowRight height={20} width={20} />
                            </div>
                        </div>
                        <div className='px-4 h-[60px] flex items-center border-GrayHomz2 border-b-[1px] justify-between w-full'>
                            Payment History
                            <div
                                onClick={() => {
                                    setShowWidget(true)
                                    handleBillPaymentHistory()
                                }}
                                className='cursor-pointer'
                            >
                                <ArrowRight height={20} width={20} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default WidgetMobile;