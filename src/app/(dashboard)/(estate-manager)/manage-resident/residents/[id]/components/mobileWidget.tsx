import { ManagerResidentItem } from "@/store/useResidentsListStore";
import ArrowRight from "@/components/icons/arrowRight";
import MobileBackButton from "@/components/icons/estateManager&Resident/mobile/mobileBackButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import RentInfo from "./rentInfo";
import Billing from "./billing";
import PropertyDetails, { PropertyDetailsType } from './propertyDetails'
import AddPaymentRecordModal from "./addPaymentRecordModal";
import AddIcon from "@/components/icons/addIcon";


interface widgetMobileProps {
    residentData: ManagerResidentItem | null;
};

const WidgetMobile = ({
    residentData,
}: widgetMobileProps) => {
    const [active, setActive] = React.useState(true);
    const [activeTwo, setActiveTwo] = React.useState(false);
    const [showData, setShowData] = React.useState(false)
    const [showWidget, setShowWidget] = React.useState(false);
    const [openPaymentModal, setOpenPaymentModal] = React.useState(false)
    const [modalInitialData, setModalInitialData] = React.useState<Record<string, unknown> | undefined>(undefined)
    const [showPropertyDetails, setShowPropertyDetails] = React.useState(false)
    const [selectedProperty, setSelectedProperty] = React.useState<PropertyDetailsType | undefined>(undefined)
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

    const openPropertyDetails = (prop: PropertyDetailsType) => {
        setSelectedProperty(prop)
        setShowPropertyDetails(true)
    }

    const closePropertyDetails = () => {
        setSelectedProperty(undefined)
        setShowPropertyDetails(false)
    }

    const openAddModal = () => {
        setModalInitialData(undefined)
        setOpenPaymentModal(true)
    }

    const openEditModal = (data: unknown) => {
        setModalInitialData(data as Record<string, unknown>)
        setOpenPaymentModal(true)
    }

    return (
        <div className={`${!showPropertyDetails ? 'p-8' : ''} flex flex-col gap-2`}>
            {!showPropertyDetails &&
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
            }
            {showWidget
                ?
                <div>
                    {!showPropertyDetails &&
                        <div className="flex flex-row justify-between mt-8 w-full">
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
                                <button onClick={openAddModal} className="flex gap-1 items-center text-BlueHomz text-sm"><AddIcon /></button>
                        </div>
                    }

                    <div className="my-7 rounded-[12px] w-full">
                        <div className={`${active ? "inline" : "hidden"}`}>
                            {!showPropertyDetails && <RentInfo residentData={residentData} onOpenProperty={openPropertyDetails} />}
                            {showPropertyDetails && selectedProperty && <PropertyDetails property={selectedProperty as PropertyDetailsType} onBack={closePropertyDetails} />}
                        </div>
                        <div className={`${activeTwo ? "inline" : "hidden"}`}>
                            <Billing onOpenPaymentModal={openEditModal} showData={showData} />
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
                                       {residentData ? `${residentData.firstName} ${residentData.lastName}` : ''}
                            </h1>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Phone No</p>
                                <p className="text-[13px] font-[500] text-end text-BlackHomz w-[62%]">
                                    {residentData?.phoneNumber || '-'}
                                </p>
                            </div>
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Email</p>
                                <p className="text-[13px] font-[500] text-end break-words text-BlackHomz w-[62%]">
                                    {residentData?.email}
                                </p>
                            </div>
                            <div className="flex justify-between gap-3">
                                <p className="text-[13px] font-[400] text-GrayHomz">Home Address</p>
                                <p className="text-[13px] font-[500] text-end text-BlackHomz break-words w-[62%]">
                                     {residentData ? `${residentData.building}, ${residentData.apartment}, ${residentData.streetName}, ${residentData.zone}` : ''}
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
                                <ArrowRight className="#4E4E4E" height={20} width={20} />
                            </div>
                        </div>
                        <div className='px-4 h-[60px] flex items-center border-GrayHomz2 justify-between w-full'>
                            Payment History
                            <div
                                onClick={() => {
                                    setShowWidget(true)
                                    handleBillPaymentHistory()
                                }}
                                className='cursor-pointer'
                            >
                                <ArrowRight className="#4E4E4E" height={20} width={20} />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <AddPaymentRecordModal
                isOpen={openPaymentModal}
                onRequestClose={() => setOpenPaymentModal(false)}
                initialData={modalInitialData}
                setShowData={setShowData}
                onSave={(d) => {
                    // placeholder: could dispatch update to table or API
                    console.log('saved payment record', d)
                }}
            />
        </div>
    )
}

export default WidgetMobile;