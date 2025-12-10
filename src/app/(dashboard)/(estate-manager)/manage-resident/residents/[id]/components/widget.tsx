"use client";
// import { Visitor } from "@/app/(dashboard)/components/visitors";
import React from "react";
import RentInfo from "./rentInfo";
import PropertyDetails, { PropertyDetailsType } from './propertyDetails'
import AddIcon from "@/components/icons/addIcon";
import ExportIcon from "@/components/icons/estateManager&Resident/desktop/exportIcon";
import Billing from "./billing";
import AddPaymentRecordModal from './addPaymentRecordModal'
import { ManagerResidentItem } from "@/store/useResidentsListStore";
import BillPaymentPropertyList from "./billPaymentPropertyList";
import ArrowLeft from "@/components/icons/arrowLeft";
import ArrowLeft16Long from "@/components/icons/arrowLeft16Long";

interface widgetProps {
    residentData: ManagerResidentItem | null;
};

const Widget: React.FC<widgetProps> = ({ residentData }) => {
    const [step, setStep] = React.useState(0);
    const [openPaymentModal, setOpenPaymentModal] = React.useState(false)
    const [modalInitialData, setModalInitialData] = React.useState<Record<string, unknown> | undefined>(undefined)
    const [showPropertyDetails, setShowPropertyDetails] = React.useState(false)
    const [showData, setShowData] = React.useState(false)
    const [selectedProperty, setSelectedProperty] = React.useState<PropertyDetailsType | undefined>(undefined)
    
    const [showBillingDetails, setShowBillingDetails] = React.useState(false)
    const [selectedBillingProperty, setSelectedBillingProperty] = React.useState<PropertyDetailsType | undefined>(undefined)

    const openAddModal = () => {
        setModalInitialData(undefined)
        setOpenPaymentModal(true)
    }

    const openEditModal = (data: unknown) => {
        setModalInitialData(data as Record<string, unknown>)
        setOpenPaymentModal(true)
    }

    const openPropertyDetails = (prop: PropertyDetailsType) => {
        setSelectedProperty(prop)
        setShowPropertyDetails(true)
    }

    const closePropertyDetails = () => {
        setSelectedProperty(undefined)
        setShowPropertyDetails(false)
    }

    const openBillingDetails = (prop: PropertyDetailsType) => {
        setSelectedBillingProperty(prop)
        setShowBillingDetails(true)
        setShowData(false)
    }

    const closeBillingDetails = () => {
        setSelectedBillingProperty(undefined)
        setShowBillingDetails(false)
    }

    return (
        <div>
            <div className="inline-block min-w-[620px] w-[100%] h-auto shadow-md bg-white rounded-[12px]">
                {!showPropertyDetails && !(step === 1 && showBillingDetails) &&
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
                            {/* Only show Add button if not in list view for billing */}
                            {/* {step !== 1 && ( */}
                                <button onClick={openAddModal} className="flex gap-1 items-center text-BlueHomz text-sm"><AddIcon /> Add new payment record </button>
                            {/* )} */}
                            <button className="p-2 rounded-[8px] bg-[#EEF5FF]"><ExportIcon className="#006AFF" /></button>
                        </div>
                    </div>
                }
                {step === 1 && showBillingDetails && (
                    <div className="w-full p-6 border-b border-[#E6E6E6] flex items-center justify-between">
                        <button onClick={closeBillingDetails} className="flex items-center gap-2 text-sm text-GrayHomz">
                            <ArrowLeft16Long /> {selectedBillingProperty?.title || 'Back to Properties'}
                        </button>
                        <div className="flex gap-2 items-center">
                            <button onClick={openAddModal} className="flex gap-1 items-center text-BlueHomz text-sm"><AddIcon /> Add new payment record </button>
                            <button className="p-2 rounded-[8px] bg-[#EEF5FF]"><ExportIcon className="#006AFF" /></button>
                        </div>
                    </div>
                )}
                <div className="mt-5 rounded-[12px] px-6 pb-6">
                    {step === 0 && !showPropertyDetails && (
                        <RentInfo residentData={residentData} onOpenProperty={openPropertyDetails} />
                    )}
                    {step === 0 && showPropertyDetails && selectedProperty && (
                        <PropertyDetails property={selectedProperty} onBack={closePropertyDetails} />
                    )}
                    {step === 1 && !showBillingDetails && (
                        <BillPaymentPropertyList residentData={residentData} onSelectProperty={openBillingDetails} />
                    )}
                    {step === 1 && showBillingDetails && (
                        <div>
                             <Billing onOpenPaymentModal={openEditModal} showData={showData} />
                        </div>
                    )}
                </div>
            </div>
            <AddPaymentRecordModal
                isOpen={openPaymentModal}
                onRequestClose={() => setOpenPaymentModal(false)}
                initialData={modalInitialData}
                setShowData={setShowData}
                residentData={residentData}
                selectedProperty={selectedBillingProperty}
                onSave={(d) => {
                    // placeholder: could dispatch update to table or API
                    console.log('saved payment record', d)
                }}
            />
        </div>
    );
};

export default Widget;
