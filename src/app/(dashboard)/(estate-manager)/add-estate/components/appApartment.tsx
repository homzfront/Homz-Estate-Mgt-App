import CustomInput from '@/components/general/customInput'
import Dropdown from '@/components/general/dropDown'
import AddIcon from '@/components/icons/addIcon'
import ArrowDown from '@/components/icons/arrowDown'
import MiniClose from '@/components/icons/miniClose'
import RemoveIcon from '@/components/icons/removeIcon'
import React from 'react'

interface AppApartmentProps {
    handleInputChange: (field: string, value: string) => void;
    formData: {
        estateName: string;
        area: string;
        state: string;
    };
};

const AppApartment = ({ handleInputChange, formData }: AppApartmentProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const toggleDropdownTwo = () => {
        setIsOpenTwo(!isOpenTwo);
    };
    const areaOptions = [
        { id: 1, label: "Lekki Phase 1" },
        { id: 2, label: "Victoria Island" },
        { id: 3, label: "Ikoyi" }
    ];
    return (
        <div className="mt-8">
            {/** desk-top **/}
            <div className="md:hidden flex flex-col gap-6">
                <div className='flex flex-col gap-4 '>
                    <button onClick={toggleDropdown} className="bg-GrayHomz6 p-4 rounded-[12px] flex items-center justify-between w-full">
                        <p className='text-sm font-medium text-BlackHomz'>
                            [Apartment Name]
                        </p>
                        <span className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}>
                            <ArrowDown size={20} className="#4E4E4E" />
                        </span>
                    </button>
                    {
                        isOpen && (
                            <div className="flex flex-col gap-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                                <CustomInput
                                    label="Apartment Name"
                                    placeholder="e.g Adegoke Street"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex items-center gap-4'>
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
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className='flex flex-col gap-4 '>
                    <button onClick={toggleDropdownTwo} className="bg-GrayHomz6 p-4 rounded-[12px] flex items-center justify-between w-full">
                        <p className='text-sm font-medium text-BlackHomz'>
                            [Apartment Name]
                        </p>
                        <span className={`w-5 h-5 transition-transform duration-200 ${isOpenTwo ? "transform rotate-180" : ""}`}>
                            <ArrowDown size={20} className="#4E4E4E" />
                        </span>
                    </button>
                    {
                        isOpenTwo && (
                            <div className="flex flex-col gap-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                                <CustomInput
                                    label="Apartment Name"
                                    placeholder="e.g Adegoke Street"
                                    value={formData.estateName}
                                    onValueChange={(value) => handleInputChange('estateName', value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex items-center gap-4'>
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
                                </div>
                                <span className='text-sm font-normal text-error flex items-center gap-1'><RemoveIcon /> Remove</span>
                            </div>
                        )
                    }
                </div>
            </div>
            {/** mobile **/}
            <div className="hidden md:flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
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
    )
}

export default AppApartment