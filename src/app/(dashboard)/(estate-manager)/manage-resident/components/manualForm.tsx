import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import ArrowDown from '@/components/icons/arrowDown';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import DateIcon from '@/components/icons/dateIcon';
import React from 'react'

interface ManualFormProps {
    setOpenManualForm: (data: boolean) => void;
    setOpenSuccessModal: (data: boolean) => void;
};

const ManualForm = ({ setOpenManualForm, setOpenSuccessModal }: ManualFormProps) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        estateName: '',
        selectZone: '',
        streetName: '',
        building: '',
        apartment: '',
        selectOwnershipType: '',
        rentDuration: '',
        rentStartDate: '',
        rentDueDate: '',
    });

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

    // 1. Zones (optional)
    const zones = [
        { id: "zone-1", label: "Mainland Zone" },
        { id: "zone-2", label: "Island Zone" },
        { id: "zone-3", label: "Lekki Zone" },
        { id: "zone-4", label: "Ikeja Zone" },
    ];

    // 2. Streets (required)
    const streets = [
        { id: "street-1", label: "Admiralty Way" },
        { id: "street-2", label: "Allen Avenue" },
        { id: "street-3", label: "Bourdillon Road" },
        { id: "street-4", label: "Awolowo Road" },
        { id: "street-5", label: "Sanusi Fafunwa" },
    ];

    // 3. Buildings (required)
    const buildings = [
        { id: "building-1", label: "Greenwood Tower" },
        { id: "building-2", label: "Oceanview Apartments" },
        { id: "building-3", label: "Ikeja Mansion" },
        { id: "building-4", label: "Banana Heights" },
    ];

    // 4. Apartments (required)
    const apartments = [
        { id: "apt-1", label: "Flat 1A" },
        { id: "apt-2", label: "Flat 3B" },
        { id: "apt-3", label: "Penthouse Suite" },
        { id: "apt-4", label: "Studio 2A" },
        { id: "apt-5", label: "Duplex C4" },
    ];

    // 5. Ownership Type (required)
    const ownershipTypes = [
        { id: "own-1", label: "Renting this apartment/property" },
        { id: "own-2", label: "Owns this apartment/property" },
    ];

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
                            Auto-filled
                        </span>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Select Zone (optional)</div>
                            <Dropdown
                                options={zones}
                                onSelect={(option) => handleInputChange('selectZone', option.label)}
                                selectOption="Select Zone"
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Street Name <span className='text-error'>*</span></div>
                            <Dropdown
                                options={streets}
                                onSelect={(option) => handleInputChange('streetName', option.label)}
                                selectOption="Select Street"
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Building <span className='text-error'>*</span></div>
                            <Dropdown
                                options={buildings}
                                onSelect={(option) => handleInputChange('building', option.label)}
                                selectOption="Select Building"
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm font-medium text-BlackHomz'>
                            <div className='mb-1'>Apartment <span className='text-error'>*</span></div>
                            <Dropdown
                                options={apartments}
                                onSelect={(option) => handleInputChange('apartment', option.label)}
                                selectOption="Select Apartment"
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
                            borderColor='border-[#A9A9A9]'
                            arrowColor='#A9A9A9'
                        />
                    </div>
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
                        <select className="absolute top-9 right-2 border-none text-xs px-2 py-1">
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
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
                                Auto-filled
                            </span>
                        </div>
                    </div>
                </div>
            }
            <button
                onClick={() => {
                    setOpenSuccessModal(true)
                    setOpenManualForm(false)
                }}
                className='mt-8 w-full text-[16px] text-medium text-white bg-BlueHomz h-[48px] flex items-center justify-center rounded-[4px]'
            >
                Add Resident
            </button>
        </div>
    )
}

export default ManualForm