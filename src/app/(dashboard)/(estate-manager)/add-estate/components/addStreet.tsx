import CustomInput from '@/components/general/customInput';
import Dropdown from '@/components/general/dropDown';
import AddIcon from '@/components/icons/addIcon';
import ArrowDown from '@/components/icons/arrowDown';
import MiniClose from '@/components/icons/miniClose';
import RemoveIcon from '@/components/icons/removeIcon';
import { Street, useEstateFormStore } from '@/store/useEstateFormStore';
import React from 'react';

const AddStreet = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenTwo, setIsOpenTwo] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdownTwo = () => setIsOpenTwo(!isOpenTwo);

    const { formData, setStreets } = useEstateFormStore();
    const [localStreets, setLocalStreets] = React.useState<Street[]>(
        formData?.streets?.length ? formData?.streets : [{ id: 1, label: '', zone: '' }]
    );

    // Sync with store when localStreets change
    React.useEffect(() => {
        setStreets(localStreets.filter(street => street.label.trim() !== ''));
    }, [localStreets, setStreets]);

    const handleAddStreet = () => {
        const newId = localStreets.length ? Math.max(...localStreets.map(s => s.id)) + 1 : 1;
        setLocalStreets([...localStreets, { id: newId, label: '', zone: '' }]);
    };

    const handleRemoveStreet = (id: number) => {
        if (localStreets.length > 1) {
            setLocalStreets(localStreets.filter(street => street.id !== id));
        }
    };

    const handleUpdateStreetLabel = (id: number, value: string) => {
        setLocalStreets(localStreets.map(street =>
            street.id === id ? { ...street, label: value } : street
        ));
    };

    const handleUpdateStreetZone = (id: number, value: string) => {
        setLocalStreets(localStreets.map(street =>
            street.id === id ? { ...street, zone: value } : street
        ));
    };

    return (
        <div className="mt-8">
            {/** Mobile View **/}
            <div className="md:hidden flex flex-col gap-6">
                {localStreets && localStreets?.map((street, index) => (
                    <div key={street.id} className='flex flex-col gap-4'>
                        <button
                            onClick={index === 0 ? toggleDropdown : toggleDropdownTwo}
                            className="bg-GrayHomz6 p-4 rounded-[12px] flex items-center justify-between w-full"
                        >
                            <p className='text-sm font-medium text-BlackHomz'>
                                {street.label || '[Street Name]'}
                            </p>
                            <span className={`w-5 h-5 transition-transform duration-200 ${(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? "transform rotate-180" : ""}`}>
                                <ArrowDown size={20} className="#4E4E4E" />
                            </span>
                        </button>

                        {(index === 0 && isOpen) || (index !== 0 && isOpenTwo) ? (
                            <div className="flex flex-col gap-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                                <CustomInput
                                    label="Street Name *"
                                    placeholder="e.g Adegoke Street"
                                    value={street.label}
                                    onValueChange={(value) => handleUpdateStreetLabel(street.id, value)}
                                    className='h-[45px] pl-4'
                                />
                                <div className='flex items-center gap-4'>
                                    <div className='flex flex-col gap-1 w-full text-sm'>
                                        <div className='mb-1'>Select Zone (optional)</div>
                                        <Dropdown
                                            options={formData?.zones}
                                            onSelect={(option) => handleUpdateStreetZone(street.id, option.label)}
                                            selectOption={street?.zone ? street?.zone : `Select Zone`}
                                            showSearch={false}
                                            borderColor='border-[#A9A9A9]'
                                            arrowColor='#A9A9A9'
                                        />
                                    </div>
                                </div>
                                {index !== 0 && (
                                    <span
                                        className='text-sm font-normal text-error flex items-center gap-1 cursor-pointer'
                                        onClick={() => handleRemoveStreet(street.id)}
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
                    onClick={handleAddStreet}
                >
                    <AddIcon /> Add New Street
                </button>
            </div>

            {/** Desktop View **/}
            <div className="hidden md:flex flex-col gap-6 bg-[#FCFCFC] p-4 rounded-[12px]">
                {localStreets && localStreets?.map((street) => (
                    <div key={street.id} className='flex items-center gap-4'>
                        <div className='flex items-center gap-4 w-[95%]'>
                            <CustomInput
                                label="Street Name *"
                                placeholder="e.g Adegoke Street"
                                value={street.label}
                                onValueChange={(value) => handleUpdateStreetLabel(street.id, value)}
                                className='h-[45px] pl-4'
                            />
                            <div className='flex flex-col gap-1 w-full text-sm'>
                                <div className=''>Select Zone (optional)</div>
                                <Dropdown
                                    options={formData?.zones}
                                    onSelect={(option) => handleUpdateStreetZone(street.id, option.label)}
                                    selectOption={street?.zone ? street?.zone : `Select Zone`}
                                    showSearch={false}
                                    borderColor='border-[#A9A9A9]'
                                    arrowColor='#A9A9A9'
                                />
                            </div>
                        </div>
                        {localStreets.length > 1 && (
                            <button
                                className='cursor-pointer mt-6'
                                onClick={() => handleRemoveStreet(street.id)}
                            >
                                <MiniClose />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    className='text-sm md:text-[16px] font-normal text-BlueHomz flex items-center gap-2'
                    onClick={handleAddStreet}
                >
                    <AddIcon /> Add New Street
                </button>
            </div>
        </div>
    );
};

export default AddStreet;