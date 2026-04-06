/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeEmptyFields } from '@/app/utils/removeEmptyFields';
import CustomInput from '@/components/general/customInput';
import DotLoader from '@/components/general/dotLoader';
import ActiveToggle from '@/components/icons/activeToggle';
import ArrowDown from '@/components/icons/arrowDown';
import CopyIcon from '@/components/icons/copyIcon';
import DateIcon from '@/components/icons/dateIcon';
import InactiveToggle from '@/components/icons/inactiveToggle';
import WarningIcon from '@/components/icons/warningIcon';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import api from '@/utils/api';
import { getFriendlyErrorMessage } from '@/utils/friendlyErrorMessage';
import React from 'react'
import toast from 'react-hot-toast';
interface AddManualFormProps {
    setOpenAddManual: (data: boolean) => void;
    setOpenSuccessModal: (data: boolean) => void;
}
const AddManualForm = ({ setOpenAddManual, setOpenSuccessModal }: AddManualFormProps) => {
    const [isOpen, setIsOpen] = React.useState(true);
    // const [accessCode, setAccessCode] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const [codeGenerated, setCodeGenerated] = React.useState<boolean>(false);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const [formData, setFormData] = React.useState({
        visitorName: '',
        visitPurpose: '',
        phoneNo: '',
        NoOfPersons: '',
        arrivalDate: '',
        startTime: '',
        endTime: ''
    });
    const [timeCode, setTimeCode] = React.useState<string>("One-Time");
    const handleDropdownToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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
                `/access-control/community-manager/organizations/${selectedCommunity?.estate?.associatedIds?.organizationId}/estates/${selectedCommunity?.estate?._id}`,
                removeEmptyFields(payload)
            );
            setOpenSuccessModal(true);
            setOpenAddManual(false);
            // // Show success toast
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

            // setCodeGenerated(true);

        } catch (error: any) {
            const errorMessage = getFriendlyErrorMessage(error);
            // Show toast notification
            toast.error(
                errorMessage,
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const message = `Hi ${formData.visitorName},

        Your ${timeCode.toLowerCase()} access code is: 

        Location: ${selectedCommunity?.estate?.basicDetails?.name}
        From: ${formData.arrivalDate}, ${formData.startTime}
        To: ${formData.arrivalDate}, ${formData.endTime}

        To start enjoying Homz.ng access control in your community too, send an email to support@homz.ng.

        Powered by Homz.ng`;

        navigator.clipboard.writeText(message)
            .then(() => {
                toast.success("Message copied to clipboard!", {
                    position: "top-center",
                    duration: 2000,
                });
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error("Failed to copy message", {
                    position: "top-center",
                    duration: 2000,
                });
            });
    };

    return (
        <div className='p-4 rounded-[12px] bg-white w-[350px] md:w-[550px] mb-[50px] md:mb-0'>
            {
                !codeGenerated ?
                    <div>
                        <h2 className='text-[16px] font-medium text-BlueHomz'>Register Visitor</h2>
                        <h4 className='mt-1 text-[13px] font-normal text-GrayHomz'>Enter information about  visitor(s) </h4>

                        <button
                            className={`mt-8 text-BlackHomz font-medium bg-GrayHomz6 text-sm p-4 rounded-[8px] cursor-pointer flex w-full items-center justify-between`}
                            onClick={handleDropdownToggle}
                        >
                            <span>Visitor Information</span>
                            <div className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : "mt-1"}`}>
                                <ArrowDown size={20} className="#292D32" />
                            </div>
                        </button>

                        {
                            isOpen &&
                            <div className='mt-4 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                                <CustomInput
                                    borderColor="#4E4E4E"
                                    label="Visitor’s Name"
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
                                <div className='flex items-center gap-4'>
                                    <CustomInput
                                        borderColor="#4E4E4E"
                                        label="Phone No."
                                        placeholder="e.g 012345679"
                                        value={formData.phoneNo}
                                        onValueChange={(value) => handleInputChange('phoneNo', value)}
                                        required
                                        className='h-[45px] pl-4'
                                    />
                                    <CustomInput
                                        borderColor="#4E4E4E"
                                        label="No. of Persons"
                                        placeholder="e.g 2"
                                        value={formData.NoOfPersons}
                                        onValueChange={(value) => handleInputChange('NoOfPersons', value)}
                                        required
                                        className='h-[45px] pl-4'
                                    />
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className="w-full">
                                        <label className="text-sm text-GrayHomz font-medium">
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
                                                <button onClick={() => setTimeCode("One-Time")}>{timeCode === "One-Time" ? <ActiveToggle /> : <InactiveToggle />}</button>
                                                <span className="text-GrayHomz font-medium text-[16px]">One-Time Code</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <button onClick={() => setTimeCode("Perm-Time")}>{timeCode === "Perm-Time" ? <ActiveToggle /> : <InactiveToggle />}</button>
                                                <span className="text-GrayHomz font-medium text-[16px]">Permanent Code</span>
                                            </label>
                                        </div>

                                        {/* Time Pickers */}
                                        {timeCode === "One-Time" &&
                                            <div>
                                                <label className="block mt-4 text-sm text-GrayHomz font-medium">
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
                        }

                        <div className='mt-4 mb-2 font-medium text-sm flex flex-col-reverse gap-4 md:flex-row md:justify-end items-center md:gap-2'>
                            <button disabled={loading} onClick={() => setOpenAddManual(false)} className='w-full md:w-auto text-GrayHomz'>Close</button>
                            <button onClick={() => onGenerateCode()} className={`${loading ? "pointer-events-none flex justify-center h-[48px]" : ""} w-full md:w-auto text-white bg-BlueHomz p-3 rounded-[4px]`}>{loading ? <DotLoader /> : "Add Record"}</button>
                        </div>
                    </div>
                    :
                    <div className='p-2'>
                        <h1 className='text-[16px] md:text-[20px] font-normal md:font-bold text-BlackHomz'>Visitor Access Code Generated!</h1>
                        <h4 className='mt-1 text-[13px] md:text-[16px] font-normal text-GrayHomz'>Copy and share the message below with your visitor.</h4>
                        <div className='mt-4 bg-inputBg p-4 rounded-[8px] space-y-4'>
                            <div className="text-GrayHomz text-sm font-medium space-y-4">
                                <p>Hi {formData.visitorName},</p>

                                <p>Your {timeCode.toLowerCase()} access code is: <strong></strong></p>

                                <p>
                                    Location: {selectedCommunity?.estate?.basicDetails?.name} <br />
                                    From: {formData.arrivalDate}, {formData.startTime} <br />
                                    To: {formData.arrivalDate}, {formData.endTime}
                                </p>

                                <p>
                                    To start enjoying Homz.ng access control in your community too, send an email to <span className="text-blue-600">support@homz.ng</span>.
                                </p>

                                <p className="font-bold">Powered by Homz.ng</p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className='flex gap-2 items-center text-[16px] text-BlueHomz font-normal'
                            >
                                <CopyIcon />
                                Copy message
                            </button>
                        </div>
                        {/* <div className='flex justify-between items-center mt-6'>
                            <span className='border border-GrayHomz5 w-[45%]' />
                            <span className="font-normal w-[10%] text-center text-sm md:text-[16px] text-GrayHomz">
                                OR
                            </span>
                            <span className='border border-GrayHomz5 w-[45%]' />
                        </div>

                        <div className='mt-2'>
                            <h3 className='text-sm md:text-[16px] font-normal text-GrayHomz'>Send code to visitor’s mail</h3>
                            <div className='mt-2 flex flex-col gap-4 md:flex-row md:items-center md:gap-2'>
                                <CustomInput
                                    type="text"
                                    placeholder='Enter visitor’s email'
                                    className='h-[45px] px-4'
                                    onChange={(e) => handleInputChange('sendCode', e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        setOpenSuccessModal(true);
                                        setCodeGenerated(false);
                                        setOpenAddManual(false);
                                    }}
                                    className='w-full md:w-[55%] rounded-[4px] bg-BlueHomz text-white text-sm font-normal h-[45px] flex items-center justify-center'
                                >
                                    Send Code
                                </button>
                            </div>
                        </div> */}
                        <div className='mt-4 flex items-start gap-2'>
                            <WarningIcon />
                            <span className='font-normal text-sm md:text-[15px] mt-0.5 text-GrayHomz'>
                                Access codes are unique and expire after the stated date/time.
                            </span>
                        </div>
                        <button
                            onClick={async () => {
                                setOpenSuccessModal(true);
                                setCodeGenerated(false);
                                setOpenAddManual(false);
                            }}
                            className='w-full mt-4 rounded-[4px] bg-BlueHomz text-white text-sm font-normal h-[45px] flex items-center justify-center'
                        >
                            Done
                        </button>
                    </div>
            }
        </div>
    )
}

export default AddManualForm