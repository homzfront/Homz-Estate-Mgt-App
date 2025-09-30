/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDueDateForSubmission } from '@/app/utils/formatDueDateForSubmission';
import CustomInput from '@/components/general/customInput';
import DotLoader from '@/components/general/dotLoader';
import Dropdown from '@/components/general/dropDown';
import ArrowDown from '@/components/icons/arrowDown';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import DateIcon from '@/components/icons/dateIcon';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import api from '@/utils/api';
import React from 'react'
import toast from 'react-hot-toast';
import { useResidentsListStore } from '@/store/useResidentsListStore';

interface ManualFormProps {
    setOpenManualForm: (data: boolean) => void;
    setOpenSuccessModal: (data: boolean) => void;
};

const ManualForm = ({ setOpenManualForm, setOpenSuccessModal }: ManualFormProps) => {
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const [isOpen, setIsOpen] = React.useState(true);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const [calculatedDueDate, setCalculatedDueDate] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        selectZone: '',
        streetName: '',
        building: '',
        apartment: '',
        selectOwnershipType: '',
        residencyStartDate: '',
        rentDuration: '',
        rentStartDate: '',
        rentDueDate: '',
        rentDurationType: 'months',
    });
    const { fetchResidents } = useResidentsListStore();

    const community = selectedCommunity;

    // Zones
    const zoneOptions = community?.zones.map((z) => ({
        id: z.name,
        label: z.name,
    }));

    // Streets
    const streetOptions = community?.streets.map((s) => ({
        id: s.name,
        label: s.name,
    }));

    // Buildings
    const buildingOptions = community?.buildings.map((b) => ({
        id: b.name,
        label: b.name,
    }));

    // Apartments
    const apartmentOptions = community?.apartments.map((a) => ({
        id: a.name,
        label: a.name,
    }));

    // Ownership Type (required)
    const ownershipTypes = [
        { id: "own-1", label: "Renting this apartment/property" },
        { id: "own-2", label: "Owns this apartment/property" },
    ];

    // Duration Type
    const durationTypeOptions = [
        { id: 1, label: "Months", value: "months" },
        { id: 2, label: "Years", value: "years" }
    ];

    const handleDropdownToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleDropdownToggleTwo = () => {
        setIsOpenTwo(prev => !prev);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateDueDate = () => {
        if (!formData.rentStartDate || !formData.rentDuration) {
            setCalculatedDueDate('');
            return;
        }

        const startDate = new Date(formData.rentStartDate);
        if (!startDate) {
            setCalculatedDueDate('');
            return;
        }

        const duration = parseInt(formData.rentDuration);
        const dueDate = new Date(startDate);

        if (formData.rentDurationType === 'months') {
            // Move forward by `duration` months, keeping the same day
            dueDate.setMonth(dueDate.getMonth() + duration);
            // Subtract one day to get the day before
            dueDate.setDate(dueDate.getDate() - 1);
        } else if (formData.rentDurationType === 'years') {
            // Move forward by `duration` years, keeping the same day
            dueDate.setFullYear(dueDate.getFullYear() + duration);
            // Subtract one day to get the day before
            dueDate.setDate(dueDate.getDate() - 1);
        }

        // Handle edge case: if the resulting date is invalid (e.g., Feb 30), adjust to last day of previous month
        if (dueDate.getDate() !== (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())).getDate()) {
            dueDate.setDate(0); // Set to last day of previous month
        }

        // Format: MM/DD/YYYY
        const formatted =
            String(dueDate.getMonth() + 1).padStart(2, '0') + '/' +
            String(dueDate.getDate()).padStart(2, '0') + '/' +
            dueDate.getFullYear();

        setCalculatedDueDate(formatted);
    };

    React.useEffect(() => {
        if (formData.rentStartDate && formData.rentDurationType && formData.rentDuration) {
            calculateDueDate()
            return;
        }

    }, [formData.rentStartDate, formData.rentDuration, formData.rentDurationType]);

    const handleDurationTypeChange = (type: string) => {
        setFormData(prev => ({
            ...prev,
            rentDurationType: type
        }));
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validate required fields
            if (!formData?.email || !selectedCommunity?.basicDetails?.name || !formData.firstName || !formData.lastName || !formData?.streetName || !formData?.building || !formData?.apartment || !formData?.selectOwnershipType) {
                toast.error("Please fill in all required fields", {
                    position: "top-center",
                    duration: 3000,
                    style: {
                        background: "#FFEBEE",
                        color: "#D32F2F",
                        fontWeight: 500,
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                });
                return;
            }

            // Prepare the payload based on ownership type
            const payload: any = {
                email: formData?.email || "",
                firstName: formData?.firstName,
                lastName: formData?.lastName,
                estateName: selectedCommunity?.basicDetails?.name,
                zone: formData?.selectZone || undefined, // Optional
                streetName: formData?.streetName,
                building: formData?.building,
                apartment: formData?.apartment,
                ownershipType: formData?.selectOwnershipType === "Renting this apartment/property" ? "rented" : "owned",
            };

            if (formData?.selectOwnershipType === "Owns this apartment/property") {
                if (!formData?.residencyStartDate) {
                    toast.error("Residency start date is required", {
                        position: "top-center",
                        duration: 3000,
                        style: {
                            background: "#FFEBEE",
                            color: "#D32F2F",
                            fontWeight: 500,
                            padding: "12px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                    });
                    return;
                }
                payload.ownedDetails = {
                    residencyStartDate: new Date(formData.residencyStartDate).toISOString()
                };
            } else if (formData.selectOwnershipType === "Renting this apartment/property") {
                if (!formData.rentDuration || !formData.rentStartDate) {
                    toast.error("Rent duration and start date are required", {
                        position: "top-center",
                        duration: 3000,
                        style: {
                            background: "#FFEBEE",
                            color: "#D32F2F",
                            fontWeight: 500,
                            padding: "12px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                    });
                    return;
                }

                const startDate = new Date(formData.rentStartDate);
                payload.rentedDetails = {
                    rentDurationType: formData?.rentDurationType === 'months' ? 'Monthly' : 'Yearly',
                    rentDuration: parseInt(formData?.rentDuration),
                    rentStartDate: startDate?.toISOString(),
                    rentDueDate: formatDueDateForSubmission(calculatedDueDate)
                };
            }

            // Make API call
            await api.post(`/community-manager/resident/create-profile/organizations/${selectedCommunity?.associatedIds?.organizationId}/estates/${selectedCommunity?._id}`, payload);

            // Open Success Modal && CloseModal
            setOpenSuccessModal(true)
            setOpenManualForm(false)
            // Refresh residents list
            fetchResidents({ page: 1, silent: true })

        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while creating your profile";

            toast.error(backendMessage || backendMessageTwo || fallbackMessage, {
                position: "top-center",
                duration: 4000,
                style: {
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    fontWeight: 500,
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
            });
        } finally {
            setLoading(false);
        }
    };
    console.log(formData)

    return (
        <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
            <div className='flex justify-between items-start border-b pb-4'>
                <div className='max-w-[80%]'>
                    <h2 className='text-BlackHomz text-sm md:text-[18px] font-medium'>Manually Add a Resident</h2>
                    <h2 className='text-GrayHomz text-[13px] font-normal mt-1'>Fill in the details below to add a new resident to your estate.</h2>
                </div>
                <button onClick={() => setOpenManualForm(false)}>
                    <CloseTransluscentIcon />
                </button>
            </div>

            <button
                className={`mt-5 text-BlackHomz font-medium bg-GrayHomz6 text-sm p-4 rounded-[8px] cursor-pointer flex w-full items-center justify-between`}
                onClick={handleDropdownToggle}
            >
                <span>Resident Information</span>
                <div className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : "mt-1"}`}>
                    <ArrowDown size={20} className="#292D32" />
                </div>
            </button>

            {
                isOpen &&
                <div className='mt-1 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <CustomInput
                            borderColor="#4E4E4E"
                            label="First Name"
                            placeholder="e.g Dele"
                            value={formData.firstName}
                            onValueChange={(value) => handleInputChange('firstName', value)}
                            required
                            className='h-[45px] pl-4'
                        />
                        <CustomInput
                            borderColor="#4E4E4E"
                            label="Last Name"
                            placeholder="e.g Dayo"
                            value={formData.lastName}
                            onValueChange={(value) => handleInputChange('lastName', value)}
                            required
                            className='h-[45px] pl-4'
                        />
                    </div>
                    <CustomInput
                        borderColor="#4E4E4E"
                        label="Email"
                        placeholder="e.g Deledayo@gmail.com"
                        value={formData.email}
                        onValueChange={(value) => handleInputChange('email', value)}
                        required
                        type='email'
                        className='h-[45px] pl-4'
                    />
                </div>
            }

            <button
                className={`mt-4 text-BlackHomz font-medium bg-GrayHomz6 text-sm p-4 rounded-[8px] cursor-pointer flex w-full items-center justify-between`}
                onClick={handleDropdownToggleTwo}
            >
                <span>Resident Occupancy Information</span>
                <div className={`transition-transform duration-200 ${isOpenTwo ? "transform rotate-180" : "mt-1"}`}>
                    <ArrowDown size={20} className="#292D32" />
                </div>
            </button>

            {
                isOpenTwo &&
                <div className='mt-1 bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
                    <div className='flex flex-col gap-1 w-full text-sm'>
                        <h3 className='text-sm font-medium text-BlackHomz'>Estate Name <span className='text-error'>*</span></h3>
                        <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                            {selectedCommunity?.basicDetails?.name || "Auto-filled"}
                        </span>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Select Zone (optional)</div>
                            <Dropdown
                                options={zoneOptions || []}
                                onSelect={(option) => handleInputChange('selectZone', option.label)}
                                selectOption="Select Zone"
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                                showSearch={false}
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Street Name <span className='text-error'>*</span></div>
                            <Dropdown
                                options={streetOptions || []}
                                onSelect={(option) => handleInputChange('streetName', option.label)}
                                selectOption="Select Street"
                                borderColor='border-[#A9A9A9]'
                                showSearch={false}
                                arrowColor='#A9A9A9'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Building <span className='text-error'>*</span></div>
                            <Dropdown
                                options={buildingOptions || []}
                                onSelect={(option) => handleInputChange('building', option.label)}
                                selectOption="Select Building"
                                borderColor='border-[#A9A9A9]'
                                showSearch={false}
                                arrowColor='#A9A9A9'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Apartment <span className='text-error'>*</span></div>
                            <Dropdown
                                options={apartmentOptions || []}
                                onSelect={(option) => handleInputChange('apartment', option.label)}
                                selectOption="Select Apartment"
                                showSearch={false}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                        <div className='mb-1'>Select Ownership Type <span className='text-error'>*</span></div>
                        <Dropdown
                            options={ownershipTypes}
                            onSelect={(option) => handleInputChange('selectOwnershipType', option.label)}
                            selectOption="Select option"
                            showSearch={false}
                            borderColor='border-[#A9A9A9]'
                            arrowColor='#A9A9A9'
                        />
                    </div>

                    {formData?.selectOwnershipType === "Renting this apartment/property" &&
                        <div>
                            <div className='relative'>
                                <CustomInput
                                    borderColor="#4E4E4E"
                                    label="Rent Duration"
                                    placeholder="e.g 12"
                                    value={formData.rentDuration}
                                    onValueChange={(value) => handleInputChange('rentDuration', value)}
                                    required
                                    type='number'
                                    className='h-[45px] pl-4 pr-[100px]'
                                />
                                <select
                                    className="absolute top-9 right-2 border-none text-xs px-2 py-1 bg-transparent"
                                    value={formData.rentDurationType}
                                    onChange={(e) => handleDurationTypeChange(e.target.value)}
                                >
                                    {durationTypeOptions.map(option => (
                                        <option key={option.id} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col md:flex-row items-center mt-4 gap-4'>
                                <div className='w-full md:w-[50%]'>
                                    <label className="text-sm text-BlackHomz font-medium">
                                        Rent Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <CustomInput
                                            borderColor="#4E4E4E"
                                            type="date"
                                            className="h-[45px] px-4 pr-10 input-hide-date-icon"
                                            onChange={(e) => handleInputChange('rentStartDate', e.target.value)}
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <DateIcon />
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 w-full md:w-[50%] text-sm'>
                                    <h3 className='text-sm font-medium text-BlackHomz'>Rent Due Date <span className='text-error'>*</span></h3>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        {calculatedDueDate ? calculatedDueDate : 'Auto-filled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                    {formData?.selectOwnershipType === "Owns this apartment/property" &&
                        <div>
                            <div className='w-full'>
                                <label className="text-sm text-BlackHomz font-medium">
                                    Residency Start Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <CustomInput
                                        borderColor="#4E4E4E"
                                        type="date"
                                        className="h-[45px] px-4 pr-10 input-hide-date-icon"
                                        onChange={(e) => handleInputChange('residencyStartDate', e.target.value)}
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                        <DateIcon />
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
            <button
                onClick={() => {
                    handleSubmit()
                }}
                className={`mt-8 w-full text-[16px] text-medium text-white bg-BlueHomz h-[48px] flex items-center justify-center rounded-[4px]
                           ${loading ? "pointer-events-none w-full flex justify-center" : ""}`}
            >
                {loading ? <DotLoader /> : "Add Resident"}
            </button>
        </div>
    )
}

export default ManualForm