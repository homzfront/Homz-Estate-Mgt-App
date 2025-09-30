import React, { useState, useEffect } from 'react';
import { useEstateFormStore, Zone } from '@/store/useEstateFormStore';
import CustomInput from '@/components/general/customInput';
import MiniClose from '@/components/icons/miniClose';
import AddIcon from '@/components/icons/addIcon';

const AddZone = () => {
    const { formData, setZones } = useEstateFormStore();
    const [localZones, setLocalZones] = useState<Zone[]>(
        formData.zones.length ? formData.zones : [{ id: 1, label: '' }]
    );

    // Sync with store when localZones change
    useEffect(() => {
        setZones(localZones.filter(zone => zone.label.trim() !== ''));
    }, [localZones, setZones]);

    const handleAddZone = () => {
        const newId = localZones.length ? Math.max(...localZones.map(z => z.id)) + 1 : 1;
        setLocalZones([...localZones, { id: newId, label: '' }]);
    };

    const handleRemoveZone = (id: number) => {
        if (localZones.length > 1) {
            setLocalZones(localZones.filter(zone => zone.id !== id));
        }
    };

    const handleUpdateZone = (id: number, value: string) => {
        setLocalZones(localZones.map(zone =>
            zone.id === id ? { ...zone, label: value } : zone
        ));
    };

    return (
        <div className="mt-8">
            <div className="space-y-4 bg-[#FCFCFC] p-4 rounded-[12px]">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {localZones.map((zone, index) => (
                        <div key={zone.id} className='relative'>
                            <CustomInput
                                label="Zone Name (optional)"
                                placeholder={`Zone ${String.fromCharCode(65 + index)}`}
                                value={zone.label}
                                onValueChange={(value) => handleUpdateZone(zone.id, value)}
                                className='h-[45px] pl-4'
                            />
                            {localZones.length > 1 && (
                                <button
                                    className='absolute top-[40px] right-3'
                                    onClick={() => handleRemoveZone(zone.id)}
                                >
                                    <MiniClose />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className='text-sm md:text-[16px] font-normal text-BlueHomz flex items-center gap-2'
                    onClick={handleAddZone}
                >
                    <AddIcon /> Add New Zone
                </button>
            </div>
        </div>
    );
};

export default AddZone;