"use client";
// import { Visitor } from "@/app/(dashboard)/components/visitors";
import React from "react";
import RentInfo from "./rentInfo";
import PropertyDetails from './propertyDetails'
import AddIcon from "@/components/icons/addIcon";
import ExportIcon from "@/components/icons/estateManager&Resident/desktop/exportIcon";
import Billing from "./billing";
import AddPaymentRecordModal from './addPaymentRecordModal'

// interface widgetProps {
//     residentData: Visitor | null;
// };

const Widget = () => {
    const [step, setStep] = React.useState(0);
    const [openPaymentModal, setOpenPaymentModal] = React.useState(false)
    const [modalInitialData, setModalInitialData] = React.useState<any>(null)
    const [showPropertyDetails, setShowPropertyDetails] = React.useState(false)
    const [showData, setShowData] = React.useState(false)
    const [selectedProperty, setSelectedProperty] = React.useState<any | null>(null)

    const openAddModal = () => {
        setModalInitialData(null)
        setOpenPaymentModal(true)
    }

    const openEditModal = (data: any) => {
        setModalInitialData(data)
        setOpenPaymentModal(true)
    }

    const openPropertyDetails = (prop: any) => {
        setSelectedProperty(prop)
        setShowPropertyDetails(true)
    }

    const closePropertyDetails = () => {
        setSelectedProperty(null)
        setShowPropertyDetails(false)
    }

    return (
        <div>
            <div className="inline-block min-w-[620px] w-[100%] h-auto shadow-md bg-white rounded-[12px]">
                {!showPropertyDetails &&
                    <div className="w-full p-6 border-b border-[#E6E6E6] flex items-center justify-between">
                        <div className="flex gap-2">
                            <div
                                className={`cursor-pointer rounded-md h-[37px] w-[auto] px-4 text-[14px] font-[500] flex justify-center items-center text-center ${step === 0 ? "bg-BlueHomz text-white" : "text-GrayHomz"}`}
                                onClick={() => setStep(0)}
                            >
                                <p>Rent Information</p>
                            </div>
                            <div
                                className={`cursor-pointer rounded-md h-[37px] w-[auto] px-4 text-[14px] font-[500] flex justify-center items-center text-center ${step === 1 ? "bg-BlueHomz text-white" : "text-GrayHomz"}`}
                                onClick={() => setStep(1)}
                            >
                                <p>Bill Payment History</p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button onClick={openAddModal} className="flex gap-1 items-center text-BlueHomz text-sm"><AddIcon /> Add new payment record </button>
                            <button className="p-2 rounded-[8px] bg-[#EEF5FF]"><ExportIcon className="#006AFF" /></button>
                        </div>
                    </div>
                }
                <div className="mt-5 rounded-[12px] px-6 pb-6">
                    {step === 0 && !showPropertyDetails && (
                        <RentInfo onOpenProperty={openPropertyDetails} />
                    )}
                    {step === 0 && showPropertyDetails && selectedProperty && (
                        <PropertyDetails property={selectedProperty} onBack={closePropertyDetails} />
                    )}
                    {step === 1 && (
                        <Billing  onOpenPaymentModal={openEditModal} showData={showData} />
                    )}
                </div>
            </div>
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
    );
};

export default Widget;
