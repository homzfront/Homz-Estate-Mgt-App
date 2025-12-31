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
import { RESIDENCY_TYPES } from '@/constant';
import DeleteIcon from '@/components/icons/deleteIcon';
import AddIcon from '@/components/icons/addIcon';

interface ManualFormProps {
    setOpenManualForm: (data: boolean) => void;
    setOpenSuccessModal: (data: boolean) => void;
};

interface ResidenceForm {
    id: string;
    selectZone: string;
    streetName: string;
    building: string;
    apartment: string;
    residentType: string;
    selectOwnershipType: string;
    rentDuration: string;
    rentDurationType: string;
    rentStartDate: string;
    rentDueDate: string;
    residencyStartDate: string;
    calculatedDueDate: string;
}

const ManualForm = ({ setOpenManualForm, setOpenSuccessModal }: ManualFormProps) => {
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const [loading, setLoading] = React.useState(false);

    // Personal Information
    const [personalInfo, setPersonalInfo] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    // Residences
    const [residences, setResidences] = React.useState<ResidenceForm[]>([{
        id: Date.now().toString(),
        selectZone: '',
        streetName: '',
        building: '',
        apartment: '',
        residentType: '',
        selectOwnershipType: '',
        rentDuration: '',
        rentDurationType: 'months',
        rentStartDate: '',
        rentDueDate: '',
        residencyStartDate: '',
        calculatedDueDate: ''
    }]);

    // Accordion state for residences (track open residence ID)
    const [openResidenceId, setOpenResidenceId] = React.useState<string | null>(residences[0].id);

    const { fetchResidents } = useResidentsListStore();

    // Prepare residency types for dropdown
    const residencyTypeOptions = RESIDENCY_TYPES
        .filter(type => type !== 'All Residency Type')
        .map((type, index) => ({
            id: index,
            label: type
        }));

    // Helper functions to get filtered options based on current selection
    const getZoneOptions = () => {
        const apartments = selectedCommunity?.estate?.apartments || [];
        const zones = new Set(apartments.map(a => a.zone).filter(Boolean));
        return Array.from(zones).map(z => ({ id: z, label: z }));
    };

    const getStreetOptions = (selectedZone: string) => {
        const apartments = selectedCommunity?.estate?.apartments || [];
        const filtered = apartments.filter(a => !selectedZone || a.zone === selectedZone);
        const streets = new Set(filtered.map(a => a.street).filter(Boolean));
        return Array.from(streets).map(s => ({ id: s, label: s }));
    };

    const getBuildingOptions = (selectedZone: string, selectedStreet: string) => {
        const apartments = selectedCommunity?.estate?.apartments || [];
        const filtered = apartments.filter(a =>
            (!selectedZone || a.zone === selectedZone) &&
            (!selectedStreet || a.street === selectedStreet)
        );
        const buildings = new Set(filtered.map(a => a.building).filter(Boolean));
        return Array.from(buildings).map(b => ({ id: b, label: b }));
    };

    const getApartmentOptions = (selectedZone: string, selectedStreet: string, selectedBuilding: string) => {
        const apartments = selectedCommunity?.estate?.apartments || [];
        const filtered = apartments.filter(a =>
            (!selectedZone || a.zone === selectedZone) &&
            (!selectedStreet || a.street === selectedStreet) &&
            (!selectedBuilding || a.building === selectedBuilding)
        );
        return filtered.map(a => ({ id: a.name, label: a.name, ...a }));
    };

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

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleResidenceChange = (id: string, field: keyof ResidenceForm, value: string) => {
        setResidences(prev => prev.map(res => {
            if (res.id === id) {
                const updatedRes = { ...res, [field]: value };

                // Handle cascading clears and auto-fills
                if (field === 'selectZone') {
                    updatedRes.streetName = '';
                    updatedRes.building = '';
                    updatedRes.apartment = '';
                    updatedRes.residentType = '';
                } else if (field === 'streetName') {
                    updatedRes.building = '';
                    updatedRes.apartment = '';
                    updatedRes.residentType = '';
                } else if (field === 'building') {
                    updatedRes.apartment = '';
                    updatedRes.residentType = '';
                } else if (field === 'apartment') {
                    // Auto-fill residency type from selected apartment
                    const apartments = selectedCommunity?.estate?.apartments || [];
                    const selectedApt = apartments.find(a =>
                        a.name === value &&
                        (!updatedRes.selectZone || a.zone === updatedRes.selectZone) &&
                        (!updatedRes.streetName || a.street === updatedRes.streetName) &&
                        (!updatedRes.building || a.building === updatedRes.building)
                    );

                    if (selectedApt) {
                        updatedRes.residentType = selectedApt.residencyType || '';
                        // Also ensure parent fields are consistent if they were empty (though dropdowns enforce this mostly)
                        if (!updatedRes.selectZone) updatedRes.selectZone = selectedApt.zone;
                        if (!updatedRes.streetName) updatedRes.streetName = selectedApt.street;
                        if (!updatedRes.building) updatedRes.building = selectedApt.building;
                    }
                }

                // Recalculate due date if relevant fields change
                if (field === 'rentStartDate' || field === 'rentDuration' || field === 'rentDurationType') {
                    updatedRes.calculatedDueDate = calculateDueDate(
                        updatedRes.rentStartDate,
                        updatedRes.rentDuration,
                        updatedRes.rentDurationType
                    );
                }
                return updatedRes;
            }
            return res;
        }));
    };

    const calculateDueDate = (startDateStr: string, durationStr: string, durationType: string) => {
        if (!startDateStr || !durationStr) return '';

        const startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) return '';

        const duration = parseInt(durationStr);
        if (isNaN(duration)) return '';

        const dueDate = new Date(startDate);

        if (durationType === 'months') {
            dueDate.setMonth(dueDate.getMonth() + duration);
            dueDate.setDate(dueDate.getDate() - 1);
        } else if (durationType === 'years') {
            dueDate.setFullYear(dueDate.getFullYear() + duration);
            dueDate.setDate(dueDate.getDate() - 1);
        }

        if (dueDate.getDate() !== (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())).getDate()) {
            dueDate.setDate(0);
        }

        return String(dueDate.getMonth() + 1).padStart(2, '0') + '/' +
            String(dueDate.getDate()).padStart(2, '0') + '/' +
            dueDate.getFullYear();
    };

    const addResidence = () => {
        const newId = Date.now().toString();
        setResidences(prev => [...prev, {
            id: newId,
            selectZone: '',
            streetName: '',
            building: '',
            apartment: '',
            residentType: '',
            selectOwnershipType: '',
            rentDuration: '',
            rentDurationType: 'months',
            rentStartDate: '',
            rentDueDate: '',
            residencyStartDate: '',
            calculatedDueDate: ''
        }]);
        setOpenResidenceId(newId);
    };

    const removeResidence = (id: string) => {
        if (residences.length <= 1) return;
        setResidences(prev => prev.filter(res => res.id !== id));
        if (openResidenceId === id) {
            setOpenResidenceId(null);
        }
    };

    // Form validation
    const isFormValid = React.useMemo(() => {
        // Check personal info
        if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim() || !personalInfo.email.trim()) {
            return false;
        }

        // Check each residence
        for (const res of residences) {
            if (!res.streetName || !res.building || !res.apartment || !res.residentType || !res.selectOwnershipType) {
                return false;
            }

            if (res.selectOwnershipType === "Renting this apartment/property") {
                if (!res.rentDuration || !res.rentStartDate) {
                    return false;
                }
            } else if (res.selectOwnershipType === "Owns this apartment/property") {
                if (!res.residencyStartDate) {
                    return false;
                }
            }
        }

        return true;
    }, [personalInfo, residences]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validate Personal Info
            if (!personalInfo.email || !personalInfo.firstName || !personalInfo.lastName) {
                toast.error("Please fill in all personal information fields", { position: "top-center" });
                setLoading(false);
                return;
            }

            // Validate Residences
            for (const res of residences) {
                if (!res.streetName || !res.building || !res.apartment || !res.selectOwnershipType || !res.residentType) {
                    toast.error("Please fill in all required residence fields", { position: "top-center" });
                    setLoading(false);
                    return;
                }
                if (res.selectOwnershipType === "Renting this apartment/property") {
                    if (!res.rentDuration || !res.rentStartDate) {
                        toast.error("Rent duration and start date are required for rented properties", { position: "top-center" });
                        setLoading(false);
                        return;
                    }
                } else if (res.selectOwnershipType === "Owns this apartment/property") {
                    if (!res.residencyStartDate) {
                        toast.error("Residency start date is required for owned properties", { position: "top-center" });
                        setLoading(false);
                        return;
                    }
                }
            }

            // Construct Payload
            // Use the first residence for the root level fields (primary residence)
            const primaryRes = residences[0];

            const payload: any = {
                email: personalInfo.email,
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                estateName: selectedCommunity?.estate?.basicDetails?.name,

                // Root level fields from primary residence
                zone: primaryRes.selectZone || undefined,
                streetName: primaryRes.streetName,
                building: primaryRes.building,
                apartment: primaryRes.apartment,
                residencyType: primaryRes.residentType || undefined,
                ownershipType: primaryRes.selectOwnershipType === "Renting this apartment/property" ? "rented" : "owned",

                // Residences array (additional residences, excluding primary)
                residences: residences.slice(1).map(res => {
                    const resPayload: any = {
                        zone: res.selectZone || undefined,
                        streetName: res.streetName,
                        building: res.building,
                        apartment: res.apartment,
                        residencyType: res.residentType || undefined,
                        ownershipType: res.selectOwnershipType === "Renting this apartment/property" ? "rented" : "owned",
                    };

                    if (res.selectOwnershipType === "Owns this apartment/property") {
                        resPayload.ownedDetails = {
                            residencyStartDate: new Date(res.residencyStartDate).toISOString()
                        };
                    } else {
                        resPayload.rentedDetails = {
                            rentDurationType: res.rentDurationType === 'months' ? 'Monthly' : 'Yearly',
                            rentDuration: parseInt(res.rentDuration),
                            rentStartDate: new Date(res.rentStartDate).toISOString(),
                            rentDueDate: formatDueDateForSubmission(res.calculatedDueDate)
                        };
                    }
                    return resPayload;
                })
            };

            // Add root level details for primary residence
            if (primaryRes.selectOwnershipType === "Owns this apartment/property") {
                payload.ownedDetails = {
                    residencyStartDate: new Date(primaryRes.residencyStartDate).toISOString()
                };
            } else {
                payload.rentedDetails = {
                    rentDurationType: primaryRes.rentDurationType === 'months' ? 'Monthly' : 'Yearly',
                    rentDuration: parseInt(primaryRes.rentDuration),
                    rentStartDate: new Date(primaryRes.rentStartDate).toISOString(),
                    rentDueDate: formatDueDateForSubmission(primaryRes.calculatedDueDate)
                };
            }

            // Make API call
            await api.post(`/community-manager/resident/create-profile/organizations/${selectedCommunity?.estate?.associatedIds?.organizationId}/estates/${selectedCommunity?.estate?._id}`, payload);

            setOpenSuccessModal(true)
            setOpenManualForm(false)
            fetchResidents({ page: 1, silent: true })

        } catch (error: any) {
            const initialMessage = error?.response?.data?.errors?.[0]?.message
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred while creating your profile";

            toast.error(initialMessage || backendMessage || backendMessageTwo || fallbackMessage, {
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


    return (
        <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
            <div className='flex justify-between items-start border-b pb-4'>
                <div className='max-w-[80%]'>
                    <h2 className='text-BlackHomz text-sm md:text-[18px] font-medium'>Add a Resident by Mail</h2>
                    <h2 className='text-GrayHomz text-[13px] font-normal mt-1'>Fill in the details below to add a new resident to your estate.</h2>
                </div>
                <button onClick={() => setOpenManualForm(false)}>
                    <CloseTransluscentIcon />
                </button>
            </div>

            <div className='mt-6 space-y-6'>
                {/* Estate Name */}
                <div className='flex flex-col gap-1 w-full text-sm'>
                    <h3 className='text-sm font-medium text-BlackHomz'>Estate Name <span className='text-error'>*</span></h3>
                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4 text-GrayHomz'>
                        {selectedCommunity?.estate?.basicDetails?.name || "Auto-filled"}
                    </span>
                </div>

                {/* 1. Resident Personal Information */}
                <div>
                    <h3 className='text-BlackHomz font-medium text-sm mb-3'>1. Resident Personal Information</h3>
                    <div className='bg-inputBg py-5 px-4 rounded-[8px] space-y-4 border border-[#E6E6E6]'>
                        <div className='flex flex-col md:flex-row items-center gap-4'>
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="First Name"
                                placeholder="e.g Dele"
                                value={personalInfo.firstName}
                                onValueChange={(value) => handlePersonalInfoChange('firstName', value)}
                                required
                                className='h-[45px] pl-4'
                            />
                            <CustomInput
                                borderColor="#4E4E4E"
                                label="Last Name"
                                placeholder="e.g Dayo"
                                value={personalInfo.lastName}
                                onValueChange={(value) => handlePersonalInfoChange('lastName', value)}
                                required
                                className='h-[45px] pl-4'
                            />
                        </div>
                        <CustomInput
                            borderColor="#4E4E4E"
                            label="Email"
                            placeholder="e.g Deledayo@gmail.com"
                            value={personalInfo.email}
                            onValueChange={(value) => handlePersonalInfoChange('email', value)}
                            required
                            type='email'
                            className='h-[45px] pl-4'
                        />
                    </div>
                </div>

                {/* 2. Occupancy Information */}
                <div>
                    <h3 className='text-BlackHomz font-medium text-sm'>2. Occupancy Information</h3>
                    <p className='text-GrayHomz text-xs mt-1 mb-3'>This section supports multiple property associations, meaning one resident can be linked to more than one property (e.g., multiple apartments).</p>

                    <div className='space-y-4'>
                        {residences.map((res, index) => (
                            <div key={res.id} className='border border-[#E6E6E6] rounded-[8px]'>
                                <button
                                    className={`w-full flex items-center justify-between p-4 bg-GrayHomz6 ${openResidenceId === res.id ? 'border-b border-[#E6E6E6]' : ''}`}
                                    onClick={() => setOpenResidenceId(openResidenceId === res.id ? null : res.id)}
                                >
                                    <div className='flex items-center gap-3'>
                                        <span className='text-sm font-medium text-BlackHomz'>
                                            {res.building && res.apartment ? `${res.building}, ${res.apartment}` : `Add Residence ${index > 0 ? index + 1 : ''}`}
                                        </span>

                                        {residences.length > 1 && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeResidence(res.id);
                                                }}
                                                className='text-red-500 text-xs hover:underline'
                                            >
                                                <DeleteIcon />
                                            </span>
                                        )}
                                    </div>
                                    <div className={`transition-transform duration-200 ${openResidenceId === res.id ? "transform rotate-180" : ""}`}>
                                        <ArrowDown className="#292D32" />
                                    </div>
                                </button>

                                {openResidenceId === res.id && (
                                    <div className='bg-inputBg p-4 space-y-4'>
                                        <div className='flex flex-col md:flex-row items-center gap-4'>
                                            <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                                                <div className='mb-1'>Select Zone (optional)</div>
                                                <Dropdown
                                                    options={getZoneOptions()}
                                                    onSelect={(option) => handleResidenceChange(res.id, 'selectZone', option.label)}
                                                    selectOption={res.selectZone || "Select Zone"}
                                                    borderColor='border-[#A9A9A9]'
                                                    arrowColor='#A9A9A9'
                                                    showSearch={false}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                                                <div className='mb-1'>Street Name <span className='text-error'>*</span></div>
                                                <Dropdown
                                                    options={getStreetOptions(res.selectZone)}
                                                    onSelect={(option) => handleResidenceChange(res.id, 'streetName', option.label)}
                                                    selectOption={res.streetName || "Select Street"}
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
                                                    options={getBuildingOptions(res.selectZone, res.streetName)}
                                                    onSelect={(option) => handleResidenceChange(res.id, 'building', option.label)}
                                                    selectOption={res.building || "Select Building"}
                                                    borderColor='border-[#A9A9A9]'
                                                    showSearch={false}
                                                    arrowColor='#A9A9A9'
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                                                <div className='mb-1'>Apartment <span className='text-error'>*</span></div>
                                                <Dropdown
                                                    options={getApartmentOptions(res.selectZone, res.streetName, res.building)}
                                                    onSelect={(option) => handleResidenceChange(res.id, 'apartment', option.label)}
                                                    selectOption={res.apartment || "Select Apartment"}
                                                    showSearch={false}
                                                    borderColor='border-[#A9A9A9]'
                                                    arrowColor='#A9A9A9'
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                                            <div className='mb-1'>Residency Type <span className='text-error'>*</span></div>
                                            <Dropdown
                                                options={residencyTypeOptions}
                                                onSelect={(option) => handleResidenceChange(res.id, 'residentType', option.label)}
                                                selectOption={res.residentType || "Select option"}
                                                showSearch={false}
                                                borderColor='border-[#A9A9A9]'
                                                arrowColor='#A9A9A9'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                                            <div className='mb-1'>Select Ownership Type <span className='text-error'>*</span></div>
                                            <Dropdown
                                                options={ownershipTypes}
                                                onSelect={(option) => handleResidenceChange(res.id, 'selectOwnershipType', option.label)}
                                                selectOption={res.selectOwnershipType || "Select option"}
                                                showSearch={false}
                                                borderColor='border-[#A9A9A9]'
                                                arrowColor='#A9A9A9'
                                            />
                                        </div>

                                        {res.selectOwnershipType === "Renting this apartment/property" &&
                                            <div>
                                                <div className='relative'>
                                                    <CustomInput
                                                        borderColor="#4E4E4E"
                                                        label="Rent Duration"
                                                        placeholder="e.g 12"
                                                        value={res.rentDuration}
                                                        onValueChange={(value) => handleResidenceChange(res.id, 'rentDuration', value)}
                                                        required
                                                        type='number'
                                                        className='h-[45px] pl-4 pr-[100px]'
                                                    />
                                                    <select
                                                        className="absolute top-9 right-2 border-none text-xs px-2 py-1 bg-transparent"
                                                        value={res.rentDurationType}
                                                        onChange={(e) => handleResidenceChange(res.id, 'rentDurationType', e.target.value)}
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
                                                                onChange={(e) => handleResidenceChange(res.id, 'rentStartDate', e.target.value)}
                                                                required
                                                                value={res.rentStartDate}
                                                            />
                                                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                                                <DateIcon />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col gap-1 w-full md:w-[50%] text-sm'>
                                                        <h3 className='text-sm font-medium text-BlackHomz'>Rent Due Date <span className='text-error'>*</span></h3>
                                                        <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                                            {res.calculatedDueDate ? res.calculatedDueDate : 'Auto-filled'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {res.selectOwnershipType === "Owns this apartment/property" &&
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
                                                            onChange={(e) => handleResidenceChange(res.id, 'residencyStartDate', e.target.value)}
                                                            required
                                                            value={res.residencyStartDate}
                                                        />
                                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                                            <DateIcon />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addResidence}
                        className='mt-4 flex items-center gap-1 text-BlueHomz text-sm font-medium hover:opacity-80'
                    >
                        <AddIcon /> Add Another Residence
                    </button>
                </div>
            </div>

            <button
                onClick={() => {
                    handleSubmit()
                }}
                disabled={!isFormValid || loading}
                className={`mt-8 w-full text-[16px] text-medium text-white h-[48px] flex items-center justify-center rounded-[4px]
                           ${loading ? "pointer-events-none w-full flex justify-center" : ""}
                           ${!isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-BlueHomz hover:bg-blue-700"}`}
            >
                {loading ? <DotLoader /> : "Add Resident"}
            </button>
        </div>
    )
}

export default ManualForm