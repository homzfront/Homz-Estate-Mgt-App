import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import MiniClose from '@/components/icons/miniClose';
import RemoveIcon from '@/components/icons/removeIcon';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import React from 'react';

const AddBuilding = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdownTwo = () => setIsOpenTwo(!isOpenTwo);

    const { formData, setBuildings } = useEstateFormStore();
    const [localBuildings, setLocalBuildings] = React.useState(
        formData?.buildings?.length ? formData.buildings : [{ id: 1, label: '', street: '', zone: '' }]
    );

    // Sync with store when localBuildings change
    React.useEffect(() => {
        setBuildings(localBuildings.filter(building => building.label.trim() !== ''));
    }, [localBuildings, setBuildings]);

    const handleAddBuilding = () => {
        const newId = localBuildings.length ? Math.max(...localBuildings.map(b => b.id)) + 1 : 1;
        setLocalBuildings([...localBuildings, { id: newId, label: '', street: '', zone: '' }]);
    };

    const handleRemoveBuilding = (id: number) => {
        if (localBuildings.length > 1) {
            setLocalBuildings(localBuildings?.filter(building => building?.id !== id));
        }
    };

    const handleUpdateBuildingLabel = (id: number, value: string) => {
        setLocalBuildings(localBuildings?.map(building =>
            building?.id === id ? { ...building, label: value } : building
        ));
    };

    const handleUpdateBuildingStreet = (id: number, streetName: string) => {
        // Find the selected street to get its zone
        const selectedStreet = formData.streets?.find(street => street?.label === streetName);
        const zone = selectedStreet ? selectedStreet.zone : '';
        
        setLocalBuildings(localBuildings.map(building =>
            building?.id === id ? { ...building, street: streetName, zone } : building
        ));
    };

    return (
        <div className="mt-8">
            {/** Mobile View **/}
            <div className="md:hidden flex flex-col gap-6">
                {localBuildings.map((building, index) => (
                    <div key={building.id} className='flex flex-col gap-4'>
                        <button 
                            onClick={index === 0 ? toggleDropdown : toggleDropdownTwo} 
                            className="bg-GrayHomz6 p-4 rounded-[12px] flex items-center justify-between w-full"
                        >
                            <p className='text-sm font-medium text-BlackHomz'>
                                {building.label || '[Building Name]'}
                            </p>
                            <span className={`w-5 h-5 transition-transform duration-200 ${(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? "transform rotate-180" : ""}`}>
                                <ArrowDown size={20} className="#4E4E4E" />
                            </span>
                        </button>
                        
                        {(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? (
                            <div className="flex flex-col gap-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                                <CustomInput
                                    label="Building Name *"
                                    placeholder="e.g White House"
                                    value={building.label}
                                    onValueChange={(value) => handleUpdateBuildingLabel(building.id, value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex items-center gap-4'>
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Street Name *</div>
                                        <Dropdown
                                            options={formData.streets}
                                            onSelect={(option) => handleUpdateBuildingStreet(building.id, option.label)}
                                            selectOption={building.street || "Select Street"}
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 w-full text-sm'>
                                    <div className='mb-1'>Zone Name</div>
                                    <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                        {building.zone || 'N/A'}
                                    </span>
                                </div>
                                {index !== 0 && (
                                    <span 
                                        className='text-sm font-normal text-error flex items-center gap-1 cursor-pointer'
                                        onClick={() => handleRemoveBuilding(building.id)}
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
                    onClick={handleAddBuilding}
                >
                    <AddIcon /> Add New Building
                </button>
            </div>

            {/** Desktop View **/}
            <div className="hidden md:flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                {localBuildings.map((building) => (
                    <div key={building.id} className='flex items-center gap-4'>
                        <div className='flex items-center gap-4 w-[95%]'>
                            <CustomInput
                                label="Building Name"
                                placeholder="e.g White House"
                                value={building.label}
                                onValueChange={(value) => handleUpdateBuildingLabel(building.id, value)}
                                className='h-[45px] pl-4'
                            />
                            <div className='flex flex-col gap-1 w-full text-sm'>
                                <div className='mb-1'>Street Name</div>
                                <Dropdown
                                    options={formData.streets}
                                    onSelect={(option) => handleUpdateBuildingStreet(building.id, option.label)}
                                    selectOption={building.street || "Select Street"}
                                    showSearch={false}
                                    borderColor='border-[#A9A9A9]'
                                    arrowColor='#A9A9A9'
                                />
                            </div>
                            <div className='flex flex-col gap-1 w-full text-sm'>
                                <div className='mb-1'>Zone Name</div>
                                <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                                    {building.zone || 'N/A'}
                                </span>
                            </div>
                        </div>
                        {localBuildings.length > 1 && (
                            <button 
                                className='cursor-pointer mt-6'
                                onClick={() => handleRemoveBuilding(building.id)}
                            >
                                <MiniClose />
                            </button>
                        )}
                    </div>
                ))}
                <button 
                    className='text-[16px] font-normal text-BlueHomz flex items-center gap-2' 
                    onClick={handleAddBuilding}
                >
                    <AddIcon /> Add New Building
                </button>
            </div>
        </div>
    );
};

export default AddBuilding;