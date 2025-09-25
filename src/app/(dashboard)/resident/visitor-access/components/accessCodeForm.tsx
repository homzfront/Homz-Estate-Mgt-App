/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeEmptyFields } from '@/app/utils/removeEmptyFields';
import CustomInput from '@/components/general/customInput';
import DotLoader from '@/components/general/dotLoader';
import ActiveToggle from '@/components/icons/activeToggle';
import DateIcon from '@/components/icons/dateIcon';
import InactiveToggle from '@/components/icons/inactiveToggle';
// import { useResidentCommunity } from '@/store/useResidentCommunity';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import api from '@/utils/api';
import React from 'react'
import toast from "react-hot-toast";

interface AccessCodeFormProps {
    setOpenAccessCodeForm: (data: boolean) => void;
    setOpenSuccessModal: (data: boolean) => void;
    organizationId?: string;
    estateId?: string;
    fetchAccessCode?: () => Promise<void>;
}

const AccessCodeForm = ({
    setOpenAccessCodeForm,
    fetchAccessCode,
    setOpenSuccessModal,
    // organizationId = "",
    // estateId = ""
}: AccessCodeFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const [codeGenerated, setCodeGenerated] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState({
        visitorName: '',
        visitPurpose: '',
        phoneNo: '',
        NoOfPersons: '',
        arrivalDate: '',
        startTime: '',
        endTime: ''
    });
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const [timeCode, setTimeCode] = React.useState<string>("One-Time");

    const onGenerateCode = async () => {
        setLoading(true);
        try {
            // Format the payload according to the expected structure
            const payload = {
                visitor: formData.visitorName,
                purpose: formData.visitPurpose,
                phoneNumber: formData.phoneNo,
                numberOfVisitors: parseInt(formData.NoOfPersons) || 1,
                arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate).toISOString() : "",
                codeType: timeCode === "One-Time" ? "One-Time Code" : "Permanent Code",
                expectedArrivalTime: timeCode === "One-Time" ? {
                    from: formData.startTime ? new Date(`${formData.arrivalDate}T${formData.startTime}`).toISOString() : "",
                    to: formData.endTime ? new Date(`${formData.arrivalDate}T${formData.endTime}`).toISOString() : ""
                } : undefined
            };

            // Make API request
            await api.post(
                `/access-control/residents/organizations/${selectedEstate?.associatedIds?.organizationId}/estates/${selectedEstate?.estateId}`,
                removeEmptyFields(payload)
            );


            setOpenSuccessModal(true);
            setCodeGenerated(false);
            setOpenAccessCodeForm(false);
            await fetchAccessCode?.();

            // Show success toast
            // toast.success("Code generated!", {
            //     position: "top-center",
            //     duration: 2000,
            //     style: {
            //         background: "#E8F5E9",
            //         color: "#2E7D32",
            //         fontWeight: 500,
            //         padding: "12px 20px",
            //         borderRadius: "8px",
            //         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            //     },
            // });

            setCodeGenerated(true);

        } catch (error: any) {
            console.log(error)
            const majorBackendError = error?.response?.data?.errors?.[0]?.message
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred, can't generate code";

            // Show toast notification
            toast.error(
                majorBackendError ||
                backendMessage ||
                backendMessageTwo ||
                fallbackMessage,
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className='p-4 rounded-[12px] bg-white w-[350px] md:w-[550px] mb-[50px] md:mb-0'>
            {
                !codeGenerated ?
                    <div>
                        <h2 className='text-[16px] font-medium text-BlueHomz'>Register Visitor</h2>
                        <h4 className='mt-1 text-[13px] font-normal text-GrayHomz'>Enter information about  visitor(s) </h4>

                        <div className='mt-4 py-5 px-4 rounded-[8px] space-y-4'>
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Visitor's Name"
                                placeholder="e.g Nnamdi Anyaoku"
                                value={formData.visitorName}
                                onValueChange={(value) => handleInputChange('visitorName', value)}
                                required
                                className='h-[45px] pl-4'
                            />
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Purpose of visit"
                                placeholder="e.g Estate Maintenance"
                                value={formData.visitPurpose}
                                onValueChange={(value) => handleInputChange('visitPurpose', value)}
                                required
                                className='h-[45px] pl-4'
                            />
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Visitor's Phone Number"
                                placeholder="e.g 012345679"
                                value={formData.phoneNo}
                                onValueChange={(value) => handleInputChange('phoneNo', value)}
                                required
                                className='h-[45px] pl-4'
                            />
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Number of Persons"
                                placeholder="e.g 2"
                                value={formData.NoOfPersons}
                                onValueChange={(value) => handleInputChange('NoOfPersons', value)}
                                required
                                className='h-[45px] pl-4'
                            />

                            <div className='flex items-center gap-4'>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-BlackHomz mb-1">
                                        Arrival Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1">
                                        <CustomInput
                                            borderColor="#4E4E4E"
                                            type="date"
                                            className="h-[45px] px-4 pr-10 input-hide-date-icon"
                                            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <DateIcon />
                                        </span>
                                    </div>

                                    {/* Radio buttons */}
                                    <div className="mt-4 space-y-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <button type="button" onClick={() => setTimeCode("One-Time")}>{timeCode === "One-Time" ? <ActiveToggle /> : <InactiveToggle />}</button>
                                            <span className="text-GrayHomz font-medium text-[16px]">One-Time Code</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <button type="button" onClick={() => setTimeCode("Perm-Time")}>{timeCode === "Perm-Time" ? <ActiveToggle /> : <InactiveToggle />}</button>
                                            <span className="text-GrayHomz font-medium text-[16px]">Permanent Code</span>
                                        </label>
                                    </div>

                                    {/* Time Pickers */}
                                    {timeCode === "One-Time" &&
                                        <div>
                                            <label className="block text-sm font-medium text-BlackHomz mt-4 mb-1">
                                                Expected Arrival Time <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-4 mt-1">
                                                <div className="relative w-full">
                                                    <CustomInput
                                                        borderColor="#4E4E4E"
                                                        type="time"
                                                        className='h-[45px] px-4'
                                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <CustomInput
                                                        borderColor="#4E4E4E"
                                                        type="time"
                                                        className='h-[45px] px-4'
                                                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 mb-2 px-4'>
                            <button
                                onClick={() => onGenerateCode()}
                                disabled={loading}
                                className={`${loading ? "pointer-events-none flex justify-center h-[48px]" : ""} w-full text-center text-white bg-BlueHomz p-3 rounded-[4px] font-bold`}
                            >
                                {loading ? <DotLoader /> : "Generate Access Code"}
                            </button>
                        </div>
                    </div>
                    : null
                // <div className='p-2'>
                //     <h1 className='text-[16px] md:text-[20px] font-normal md:font-bold text-BlackHomz'>Visitor Access Code Generated!</h1>
                //     <h4 className='mt-1 text-[13px] md:text-[16px] font-normal text-GrayHomz'>Copy and share the message below with your visitor.</h4>
                //     <div className='mt-4 bg-inputBg p-4 rounded-[8px] space-y-4'>
                //         <div className="text-GrayHomz text-sm font-medium space-y-4">
                //             <p>Hi {formData.visitorName},</p>

                //             <p>Your {timeCode.toLowerCase()} access code is: <strong>{accessCode}</strong></p>

                //             <p>
                //                 Location: [Resident Address] <br />
                //                 From: {formData.arrivalDate}, {formData.startTime} <br />
                //                 To: {formData.arrivalDate}, {formData.endTime}
                //             </p>

                //             <p>
                //                 To start enjoying Homz.ng access control in your community too, send an email to <span className="text-blue-600">support@homz.ng</span>.
                //             </p>

                //             <p className="font-bold">Powered by Homz.ng</p>
                //         </div>
                //         <button
                //             onClick={copyToClipboard}
                //             className='flex gap-2 items-center text-[16px] text-BlueHomz font-normal'
                //         >
                //             <CopyIcon />
                //             Copy message
                //         </button>
                //     </div>
                //     {/* <div className='flex justify-between items-center mt-6'>
                //         <span className='border border-GrayHomz5 w-[45%]' />
                //         <span className="font-normal w-[10%] text-center text-sm md:text-[16px] text-GrayHomz">
                //             OR
                //         </span>
                //         <span className='border border-GrayHomz5 w-[45%]' />
                //     </div> */}

                //     {/* <div className='mt-2'>
                //         <h3 className='text-sm md:text-[16px] font-normal text-GrayHomz'>Send code to visitor's mail</h3>
                //         <div className='mt-2 flex flex-col gap-4 md:flex-row md:items-center md:gap-2'>
                //             <CustomInput
                //                 type="email"
                //                 placeholder="Enter visitor's email"
                //                 className='h-[45px] px-4'
                //                 onChange={(e) => handleInputChange('visitorEmail', e.target.value)}
                //             />
                //             <button
                //                 onClick={() => {
                //                     setOpenSuccessModal(true);
                //                     setCodeGenerated(false);
                //                     setOpenAccessCodeForm(false);
                //                 }}
                //                 className='w-full md:w-[55%] rounded-[4px] bg-BlueHomz text-white text-sm font-normal h-[45px] flex items-center justify-center'
                //             >
                //                 Send Code
                //             </button>
                //         </div>
                //     </div> */}
                //     <div className='mt-4 flex items-start gap-2'>
                //         <WarningIcon />
                //         <span className='font-normal text-sm md:text-[15px] mt-0.5 text-GrayHomz'>
                //             Access codes are unique and expire after the stated date/time.
                //         </span>
                //     </div>

                //     <button
                //         onClick={async () => {
                //             setOpenSuccessModal(true);
                //             setCodeGenerated(false);
                //             setOpenAccessCodeForm(false);
                //             await fetchAccessCode?.();
                //         }}
                //         className='w-full mt-4 rounded-[4px] bg-BlueHomz text-white text-sm font-normal h-[45px] flex items-center justify-center'
                //     >
                //         Done
                //     </button>
                // </div>
            }
        </div >
    )
}

export default AccessCodeForm;