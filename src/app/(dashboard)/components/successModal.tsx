import React from "react";
import Image from "next/image";
import CustomModal from "@/components/general/customModal";

interface SuccessModalType {
    isOpen: boolean;
    title: string;
    handleSubmit: () => void;
    handleBack: () => void;
    successText: string;
    optionalText?: string;
    submitText: string
    closeSuccessModal: () => void;
}

const SuccessModal = ({
    isOpen,
    title,
    handleSubmit,
    handleBack,
    successText,
    optionalText,
    submitText,
    closeSuccessModal
}: SuccessModalType) => {
    return (
        <div>
            <CustomModal
                isOpen={isOpen}
                onRequestClose={closeSuccessModal}
            >
                <div className="bg-white flex flex-col w-[333px] md:w-[464px] p-[32px] rounded-[12px] gap-[18px]">
                    <div className="flex flex-col gap-6 items-center justify-center">
                        <Image
                            src="/success_icon.svg"
                            height={48}
                            width={46}
                            alt=""
                        />
                        <div className="flex flex-col">
                            <p className="text-[14px] md:text-[20px] font-[700] leading-[17.64px] md:leading-[25.2px] text-center mb-1">
                                {title}
                            </p>
                            <p className=" leading-[19.5px] text-[13px] md:text-[16px] font-[400] md:leading-[24px] text-center">
                                {successText}
                            </p>
                        </div>
                    </div>
                    {handleSubmit &&
                        <button
                            className="bg-BlueHomz text-white rounded-[4px] h-[48px] p-[12px]"
                            onClick={handleSubmit}
                        >
                            {submitText}
                        </button>
                    }
                    {handleBack &&
                        <button
                            className={`text-BlackHomz font-normal text-sm hover:text-GrayHomz cursor-pointer h-[48px]`}
                            onClick={handleBack}
                        >
                            {optionalText ? optionalText : "Close"}
                        </button>
                    }
                </div>
            </CustomModal>
        </div>
    );
};

export default SuccessModal;
