/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import AddBlue from '@/components/icons/addBlue'
import AddIcon from '@/components/icons/addIcon'
import ArrowLeft from '@/components/icons/arrowLeft'
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long'
import ArrowLeftMob from '@/components/icons/arrowLeftMob'
import ArrowRightWhite from '@/components/icons/arrowRightWhite'
import MiniClose from '@/components/icons/miniClose'
import { useUserStore } from '@/store/useUserStore'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import SuccessModal from '../../components/successModal'

const EstateForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [active, setActive] = React.useState<number>(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const setUserData = useUserStore((state) => state.setUserData);
    const [formData, setFormData] = React.useState({
        estateName: '',
        estateLocation: '',
        area: '',
        state: '',
        managerPhone: '',
        utilityPhone: '',
        accountNumber: '',
        bankName: '',
        accountName: '',
        emergencyPhone: '',
        securityPhone: ''
    });

    const widgetHeaders = ["Estate Information", "Add Zones (Optional)", "Add Streets", "Add Buildings", "Add Apartments"]
    const widgetHeadersMob = ["Estate Info", "Contact Info", "Bank Details"]

    // Sample data for dropdowns
    const areaOptions = [
        { id: 1, label: "Lekki Phase 1" },
        { id: 2, label: "Victoria Island" },
        { id: 3, label: "Ikoyi" }
    ];

    const stateOptions = [
        { id: 1, label: "Lagos" },
        { id: 2, label: "Abuja" },
        { id: 3, label: "Rivers" }
    ];

    // const bankOptions = [
    //     { id: 1, label: "Access Bank" },
    //     { id: 2, label: "GTBank" },
    //     { id: 3, label: "Zenith Bank" }
    // ];

    // Set initial active page from URL params
    useEffect(() => {
        const page = searchParams.get('page');
        if (page) {
            const pageNum = parseInt(page);
            if (!isNaN(pageNum)) {
                setActive(pageNum >= 0 && pageNum < widgetHeaders.length ? pageNum : 0);
            }
        }
    }, [searchParams]);

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleSubmit = () => {
        setUserData(true);
        router.push("/dashboard")
    }

    // Update URL when active page changes
    const handlePageChange = (index: number) => {
        setActive(index);
        // Mark current step as completed before moving
        if (index > active && !completedSteps.includes(active)) {
            setCompletedSteps([...completedSteps, active]);
        }
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', index.toString());
        router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    };


    const handleNext = () => {
        if (active < widgetHeaders.length - 1) {
            // Mark current step as completed before moving to next
            if (!completedSteps.includes(active)) {
                setCompletedSteps([...completedSteps, active]);
            }
            setActive(active + 1);
        }
    };

    const handleBack = () => {
        if (active > 0) {
            setActive(active - 1);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderFormContent = () => {
        switch (active) {
            case 0:
                return (
                    <div className="mt-8 space-y-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className="space-y-4 bg-[#FCFCFC] rounded-[12px] p-4">
                                <CustomInput
                                    label="Estate Name"
                                    placeholder="Enter estate name"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    required
                                    className='h-[45px] pl-4'
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estate Location<span className='text-error'>*</span></label>
                                    <div className='flex flex-row gap-4 '>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Select Area"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                        <Dropdown
                                            options={stateOptions}
                                            onSelect={(option) => handleInputChange('state', option.label)}
                                            selectOption="Select State"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-4 bg-[#FCFCFC] rounded-[12px] p-4'>
                                <div className='border-b pb-2 border-[#E6E6E6]'>
                                    <h3 className='text-[16px] font-medium text-BlackHomz'>Add Cover Photo <span className='text-GrayHomz'>(optional)</span></h3>
                                    <h6 className='text-sm font-normal text-GrayHomz'>Supported formats are .jpg and .png up to 5 mb</h6>
                                </div>
                                <button className='h-[99px] rounded-[7px] w-[99px] bg-[#EEF5FF] flex justify-center items-center cursor-pointer'>
                                    <AddBlue />
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#FCFCFC] p-4">
                            <h4 className='text-[#A9A9A9] font-normal text-[16px]'>
                                Contact Information
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <CustomInput
                                    label="Manager’s Phone Number"
                                    placeholder="e.g 0701 234 5678"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    required
                                    className='h-[45px] pl-4'
                                />
                                <CustomInput
                                    label="Emergency Phone Number (optional)"
                                    placeholder="e.g 0701 234 5678"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <CustomInput
                                    label="Utility Services Phone Number (Dry cleaning, Waste disposal, etc)"
                                    placeholder="e.g 0701 234 5678"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <CustomInput
                                    label="Security  Phone Number (optional)"
                                    placeholder="e.g 0701 234 5678"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                            </div>
                        </div>
                        <div className="bg-[#FCFCFC] p-4 grid grid-cols-1 md:grid-cols-2">
                            <div className='space-y-4'>
                                <h4 className='text-[#A9A9A9] font-normal text-[16px]'>
                                    Bank Account Details (Optional)
                                </h4>
                                <div className='flex flex-col gap-4'>
                                    <CustomInput
                                        label="Account Number"
                                        placeholder="e.g 1524368709"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        required
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Bank Name <span className='text-error'>*</span></div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Access Bank"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <h3 className='mb-1'>Account Name</h3>
                                        <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                            Auto-filled
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="mt-8">
                        <div className="space-y-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <CustomInput
                                    label="Zone Name (optional)"
                                    placeholder="Zone A"
                                    type="tel"
                                    value={formData.managerPhone}
                                    onValueChange={(value) => handleInputChange('managerPhone', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='relative'>
                                    <CustomInput
                                        label="Zone Name (optional)"
                                        placeholder="Zone B"
                                        type="tel"
                                        value={formData.managerPhone}
                                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <button className='absolute top-[40px] right-3'>
                                        <MiniClose />
                                    </button>
                                </div>
                                <div className='relative'>
                                    <CustomInput
                                        label="Zone Name (optional)"
                                        placeholder="Zone C"
                                        type="tel"
                                        value={formData.managerPhone}
                                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <button className='absolute top-[40px] right-3'>
                                        <MiniClose />
                                    </button>
                                </div>
                                <div className='relative'>
                                    <CustomInput
                                        label="Zone Name (optional)"
                                        placeholder="Zone D"
                                        type="tel"
                                        value={formData.managerPhone}
                                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <button className='absolute top-[40px] right-3'>
                                        <MiniClose />
                                    </button>
                                </div>
                                <div className='relative'>
                                    <CustomInput
                                        label="Zone Name (optional)"
                                        placeholder="Zone E"
                                        type="tel"
                                        value={formData.managerPhone}
                                        onValueChange={(value) => handleInputChange('managerPhone', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <button className='absolute top-[40px] right-3'>
                                        <MiniClose />
                                    </button>
                                </div>
                            </div>
                            <button className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Add New Zone</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="mt-8">
                        <div className="flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                            <div className='flex items-center gap-4'>
                                <CustomInput
                                    label="Street Name"
                                    placeholder="e.g Adegoke Street"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Select Zone (optional)</div>
                                    <Dropdown
                                        options={areaOptions}
                                        onSelect={(option) => handleInputChange('area', option.label)}
                                        selectOption="Select zone"
                                        showSearch={false}
                                        borderColor='border-[#A9A9A9]'
                                        arrowColor='#A9A9A9'
                                    />
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4 w-[95%]'>
                                    <CustomInput
                                        label="Street Name"
                                        placeholder="White House"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Select Zone (optional)</div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Select zone"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <button className='cursor-pointer mt-6'>
                                    <MiniClose />
                                </button>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4 w-[95%]'>
                                    <CustomInput
                                        label="Street Name"
                                        placeholder="e.g White House"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Select Zone (optional)</div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Select zone"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <button className='cursor-pointer mt-6'>
                                    <MiniClose />
                                </button>
                            </div>
                            <button className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Add New Street</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="mt-8">
                        <div className="flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                            <div className='flex items-center gap-4'>
                                <CustomInput
                                    label="Building Name"
                                    placeholder="White House"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Street Name</div>
                                    <Dropdown
                                        options={areaOptions}
                                        onSelect={(option) => handleInputChange('area', option.label)}
                                        selectOption="Adegoke Street"
                                        showSearch={false}
                                        borderColor='border-[#A9A9A9]'
                                        arrowColor='#A9A9A9'
                                    />
                                </div>
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <h3 className='mb-1'>Zone Name</h3>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        N/A
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4 w-[95%]'>
                                    <CustomInput
                                        label="Building Name"
                                        placeholder="White House"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Street Name</div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Adegoke Street"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <h3 className='mb-1'>Zone Name</h3>
                                        <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                            N/A
                                        </span>
                                    </div>
                                </div>
                                <button className='cursor-pointer mt-6'>
                                    <MiniClose />
                                </button>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4 w-[95%]'>
                                    <CustomInput
                                        label="Building Name"
                                        placeholder="e.g White House"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Street Name</div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Select Street"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <button className='cursor-pointer mt-6'>
                                    <MiniClose />
                                </button>
                            </div>
                            <button className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Add New Building</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="mt-8">
                        <div className="flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <CustomInput
                                    label="Apartment Name"
                                    placeholder="No. 14"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Building Name</div>
                                    <Dropdown
                                        options={areaOptions}
                                        onSelect={(option) => handleInputChange('area', option.label)}
                                        selectOption="White House"
                                        showSearch={false}
                                        borderColor='border-[#A9A9A9]'
                                        arrowColor='#A9A9A9'
                                    />
                                </div>
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <h3 className='mb-1'>Street Name</h3>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        Auto-filled
                                    </span>
                                </div>

                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <h3 className='mb-1'>Zone Name</h3>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        N/A
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4 w-[95%]'>
                                    <CustomInput
                                        label="Apartment Name"
                                        placeholder="e.g No. 14"
                                        value={formData.estateName}
                                        onValueChange={(value) => handleInputChange('estateName', value)}
                                        className='h-[45px] pl-4'
                                    />
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Building Name</div>
                                        <Dropdown
                                            options={areaOptions}
                                            onSelect={(option) => handleInputChange('area', option.label)}
                                            selectOption="Select building"
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <button className='cursor-pointer mt-6'>
                                    <MiniClose />
                                </button>
                            </div>
                            <button className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'> <AddIcon /> Add New Apartment</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='p-8 w-full max-w-[1440px]'>
                {isOpen &&
                    <SuccessModal
                        title='Estate Created Successfully'
                        successText='You can now manage estate information, invite residents and add bills.'
                        submitText='Invite Residents'
                        handleSubmit={handleSubmit}
                        handleBack={() => setIsOpen(false)}
                        isOpen={isOpen}
                        closeSuccessModal={() => setIsOpen(false)}
                    />
                }
                {/* Back button */}
                <button onClick={() => router.back()} className='hidden md:flex text-sm font-normal text-GrayHomx items-center gap-1'>
                    <ArrowLeft16Long /> Cancel
                </button>
                <button onClick={() => router.back()} className='md:hidden text-sm font-normal text-GrayHomx flex items-center gap-1'>
                    <ArrowLeftMob />
                </button>

                {/* Header */}
                <div className='mt-4'>
                    <h1 className='text-BlackHomz font-bold md:font-medium text-[16px] md:text-[20px]'>Add a New Community/Estate</h1>
                    <h3 className='mt-1 text-GrayHomz font-normal text-sm md:text-[16px]'>Enter estate details to begin managing its bills, residents, and visitors.</h3>
                </div>

                {/* Desktop header */}
                <div className='hidden md:flex flex-wrap items-center gap-4 mt-8'>
                    {widgetHeaders.map((data, index) => {
                        const isActive = index === active;
                        const isCompleted = completedSteps.includes(index);
                        // const isFutureStep = index > active && !isCompleted;

                        return (
                            <div
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`cursor-pointer text-[11px] font-normal ${isActive ? "text-GrayHomz" :
                                    isCompleted ? "text-green-600" :
                                        "text-GrayHomz"
                                    }`}
                            >
                                <div className='flex flex-col gap-2'>
                                    <div className={`flex gap-2 items-center ${isActive ? "text-GrayHomz" : isCompleted ? "text-[#039855]" : "text-GrayHomz"}`}>
                                        <span className={`
                                        w-5 h-5 rounded-full text-xs font-bold flex justify-center items-center 
                                        ${isActive ? "text-[#039855] bg-[#CDEADD]" :
                                                isCompleted ? "text-[#CDEADD] bg-Success" :
                                                    "text-GrayHomz bg-[#E6E6E6]"}
                                        `}>
                                            {index + 1}
                                        </span>
                                        {data}
                                    </div>
                                    <span className={`
                                        w-[105px] md:w-[240px] h-[4px] rounded-[8px] 
                                        ${isActive ? "bg-[#81CBAA]" :
                                            isCompleted ? "bg-Success" :
                                                "bg-[#E6E6E6]"}
                                      `} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile header */}
                <div className='flex md:hidden flex-wrap items-center gap-4 mt-8'>
                    {
                        widgetHeadersMob.map((data, index) => (
                            <div
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`cursor-pointer text-[11px] font-normal ${index === active ? "text-[#81CBAA]" : "text-GrayHomz"}`}
                            >
                                <div className={`flex flex-col gap-2`}>
                                    <div className='flex gap-2 justify-center items-center'>
                                        {data} {index !== 2 && <span className='text-error'>*</span>}
                                    </div>
                                    <span className={`w-[105px] md:w-[240px] h-[4px] rounded-[8px] ${index === active ? "bg-[#81CBAA]" : "bg-[#E6E6E6]"}`} />
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Form Content */}
                {renderFormContent()}

                {/* Navigation Buttons */}
                <div className={`mt-8 flex flex-col gap-4 md:gap-0 items-center md:flex-row md:items-start ${active === 0 ? "justify-end" : "justify-between"}`}>
                    {active > 0 && (
                        <button
                            onClick={() => { }}
                            className="text-sm font-medium text-BlackHomz hover:text-gray-500"
                        >
                            Save
                        </button>
                    )}
                    <div className='flex items-center gap-4'>
                        {active > 0 && (
                            <button
                                onClick={handleBack}
                                className="text-sm font-medium text-BlackHomz hover:text-gray-700 flex gap-1 items-center"
                            >
                                <ArrowLeft /> Back
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (active === widgetHeaders.length - 1) {
                                    handleOpenModal()
                                }
                                else {
                                    handleNext()
                                }
                            }}
                            className={`ml-auto px-3 py-2 rounded-[4px] text-sm font-medium flex items-center gap-1 text-white bg-BlueHomz hover:bg-blue-700`}
                        >
                            {active === widgetHeaders.length - 1 ? 'Create Estate' : 'Next'}
                            {active !== widgetHeaders.length - 1 && <ArrowRightWhite />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default EstateForm