import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import MiniClose from '@/components/icons/miniClose';
import RemoveIcon from '@/components/icons/removeIcon';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import React from 'react';

const AppApartment = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdownTwo = () => setIsOpenTwo(!isOpenTwo);

    const { formData, setApartments } = useEstateFormStore();
    const [localApartments, setLocalApartments] = React.useState(
        formData.apartments?.length ? formData.apartments : [{ id: 1, label: '', building: '', street: '', zone: '' }]
    );

    // Get buildings from formData to use in dropdown
    const buildingOptions = formData.buildings.map(building => ({
        id: building.id,
        label: building.label
    }));

    // Sync with store when localApartments change
    React.useEffect(() => {
        setApartments(localApartments.filter(apartment => apartment.label.trim() !== ''));
    }, [localApartments, setApartments]);

    const handleAddApartment = () => {
        const newId = localApartments.length ? Math.max(...localApartments.map(a => a.id)) + 1 : 1;
        setLocalApartments([...localApartments, { id: newId, label: '', building: '', street: '', zone: '' }]);
    };

    const handleRemoveApartment = (id: number) => {
        if (localApartments.length > 1) {
            setLocalApartments(localApartments.filter(apartment => apartment.id !== id));
        }
    };

    const handleUpdateApartmentLabel = (id: number, value: string) => {
        setLocalApartments(localApartments.map(apartment =>
            apartment.id === id ? { ...apartment, label: value } : apartment
        ));
    };

    const handleUpdateApartmentBuilding = (id: number, buildingName: string) => {
        // Find the selected building to get its street and zone
        const selectedBuilding = formData.buildings.find(b => b.label === buildingName);
        const street = selectedBuilding ? selectedBuilding.street : '';
        const zone = selectedBuilding ? selectedBuilding.zone : '';

        setLocalApartments(localApartments.map(apartment =>
            apartment.id === id ? { ...apartment, building: buildingName, street, zone } : apartment
        ));
    };

    return (
        <div className="mt-8">
            {/** Mobile View **/}
            <div className="md:hidden flex flex-col gap-6">
                {localApartments.map((apartment, index) => (
                    <div key={apartment.id} className='flex flex-col gap-4'>
                        <button
                            onClick={index === 0 ? toggleDropdown : toggleDropdownTwo}
                            className="bg-GrayHomz6 p-4 rounded-[12px] flex items-center justify-between w-full"
                        >
                            <p className='text-sm font-medium text-BlackHomz'>
                                {apartment.label || '[Apartment Name]'}
                            </p>
                            <span className={`w-5 h-5 transition-transform duration-200 ${(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? "transform rotate-180" : ""}`}>
                                <ArrowDown size={20} className="#4E4E4E" />
                            </span>
                        </button>

                        {(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? (
                            <div className="flex flex-col gap-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                                <CustomInput
                                    label="Apartment Name"
                                    placeholder="e.g No. 14"
                                    value={apartment.label}
                                    onValueChange={(value) => handleUpdateApartmentLabel(apartment.id, value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex items-center gap-4'>
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Building Name</div>
                                        <Dropdown
                                            options={buildingOptions}
                                            onSelect={(option) => handleUpdateApartmentBuilding(apartment.id, option.label)}
                                            selectOption={apartment.building || "Select Building"}
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Street Name</div>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        {apartment.street || 'Auto-filled'}
                                    </span>
                                </div>
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Zone Name</div>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        {apartment.zone || 'N/A'}
                                    </span>
                                </div>
                                {index !== 0 && (
                                    <span
                                        className='text-sm font-normal text-error flex items-center gap-1 cursor-pointer'
                                        onClick={() => handleRemoveApartment(apartment.id)}
                                    >
                                        <RemoveIcon /> Remove
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </div>
                ))}
                <button
                    className='text-sm font-normal text-BlueHomz flex items-center gap-2'
                    onClick={handleAddApartment}
                >
                    <AddIcon /> Add New Apartment
                </button>
            </div>

            {/** Desktop View **/}
            <div className="hidden md:flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                {localApartments.map((apartment) => (
                    <div key={apartment.id} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <CustomInput
                            label="Apartment Name"
                            placeholder="e.g No. 14"
                            value={apartment.label}
                            onValueChange={(value) => handleUpdateApartmentLabel(apartment.id, value)}
                            className='h-[45px] pl-4'
                        />
                        <div className='flex flex-col gap-1 w-full text-sm'>
                            <div className='mb-1'>Building Name</div>
                            <Dropdown
                                options={buildingOptions}
                                onSelect={(option) => handleUpdateApartmentBuilding(apartment.id, option.label)}
                                selectOption={apartment.building || "Select Building"}
                                showSearch={false}
                                borderColor='border-[#A9A9A9]'
                                arrowColor='#A9A9A9'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full text-sm'>
                            <div className='mb-1'>Street Name</div>
                            <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                {apartment.street || 'Auto-filled'}
                            </span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex flex-col gap-1 w-full text-sm'>
                                <div className='mb-1'>Zone Name</div>
                                <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                    {apartment.zone || 'N/A'}
                                </span>
                            </div>
                            {localApartments.length > 1 && (
                                <button
                                    className='cursor-pointer mt-6 col-span-4 flex justify-end'
                                    onClick={() => handleRemoveApartment(apartment.id)}
                                >
                                    <MiniClose />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button
                    className='text-[16px] font-normal text-BlueHomz flex items-center gap-2'
                    onClick={handleAddApartment}
                >
                    <AddIcon /> Add New Apartment
                </button>
            </div>
        </div>
    );
};

export default AppApartment;