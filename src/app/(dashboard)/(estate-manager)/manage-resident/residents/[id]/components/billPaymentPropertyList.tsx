import React from 'react'
import ArrowRight from '@/components/icons/arrowRight'
import Tower from '@/components/icons/tower'
import { ManagerResidentItem } from '@/store/useResidentsListStore'
import { PropertyDetailsType } from './propertyDetails'

interface Props {
    residentData: ManagerResidentItem | null
    onSelectProperty: (property: PropertyDetailsType) => void
}

const BillPaymentPropertyList: React.FC<Props> = ({ residentData, onSelectProperty }) => {
    const items: PropertyDetailsType[] = React.useMemo(() => {
        if (!residentData) return [];

        const list: PropertyDetailsType[] = [];

        // 1. Primary Residence
        list.push({
            id: residentData._id,
            title: `${residentData.building || 'Building'} - ${residentData.apartment || 'Apartment'}`,
            subtitle: `View ${residentData.estateName || 'Estate'}`,
            details: {
                role: 'Primary Resident',
                rentStart: residentData.rentedDetails?.rentStartDate ? new Date(residentData.rentedDetails.rentStartDate).toLocaleDateString() : undefined,
                rentDue: residentData.rentedDetails?.rentDueDate ? new Date(residentData.rentedDetails.rentDueDate).toLocaleDateString() : undefined,
                apartment: residentData.apartment,
                building: residentData.building,
                street: residentData.streetName,
                zone: residentData.zone,
                ownershipType: residentData.ownershipType,
                residencyType: (residentData as ManagerResidentItem & { residencyType?: string }).residencyType,
                rentDurationType: residentData?.rentedDetails?.rentDurationType ? residentData.rentedDetails.rentDurationType : undefined,
                rentDuration: residentData?.rentedDetails?.rentDuration ? residentData.rentedDetails.rentDuration : undefined
            }
        });

        // 2. Additional Residences
        if (residentData.residences && residentData.residences.length > 0) {
            residentData.residences.forEach((res) => {
                list.push({
                    id: res._id,
                    title: `${res.building || 'Building'} - ${res.apartment || 'Apartment'}`,
                    subtitle: `View ${residentData.estateName || 'Estate'}`,
                    details: {
                        rentStart: res.rentedDetails?.rentStartDate ? new Date(res.rentedDetails.rentStartDate).toLocaleDateString() : undefined,
                        rentDue: res.rentedDetails?.rentDueDate ? new Date(res.rentedDetails.rentDueDate).toLocaleDateString() : undefined,
                        building: res.building,
                        street: res.streetName,
                        zone: res.zone,
                        role: 'Additional Residence',
                        ownershipType: res.ownershipType,
                        residencyType: res.residencyType,
                        rentDurationType: res?.rentedDetails?.rentDurationType ? res.rentedDetails.rentDurationType : undefined,
                        rentDuration: res?.rentedDetails?.rentDuration ? res.rentedDetails.rentDuration : undefined
                    }
                });
            });
        }

        return list;
    }, [residentData]);

    return (
        <div className='text-sm md:text-[16px]'>
            <p className='mt-2 text-GrayHomz font-normal'>View bill payment history for all properties currently linked to this Resident.</p>
            <div className='flex flex-col'>
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSelectProperty(item)}
                        className='mt-4 p-4 bg-[#FCFCFC] rounded-[8px] flex items-center justify-between cursor-pointer'
                    >
                        <div className='flex items-center gap-2'>
                            <div className='flex-1 flex justify-center items-center h-[44px] w-[44px] rounded-full bg-BlueHomz'>
                                <Tower />
                            </div>
                            <div className="text-GrayHomz font-medium flex flex-col gap-1 ml-1">
                                <p className='text-sm'>{item.title}</p>
                                <p className='text-[11px]'>{item.details?.ownershipType || 'Resident'}</p>
                            </div>
                        </div>
                        <ArrowRight className="#4E4E4E" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BillPaymentPropertyList
