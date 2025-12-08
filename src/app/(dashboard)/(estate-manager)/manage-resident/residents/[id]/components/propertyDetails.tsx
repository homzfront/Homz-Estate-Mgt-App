import React from 'react'
import LongLeftArrow from '@/components/icons/longLeftArrow'
import Tower from '@/components/icons/tower'
import ProfileUser from '@/components/icons/ProfileUser'
import capitalizeFirstLetter from '@/app/utils/capitalizeFirstLetter'

export type PropertyDetailsType = {
    id: string | number
    title: string
    subtitle?: string
    details?: {
        role?: string
        rentStart?: string
        rentDue?: string
        apartment?: string
        building?: string
        street?: string
        zone?: string
        ownershipType?: string
        residencyType?: string
    }
}

interface Props {
    property: PropertyDetailsType
    onBack: () => void
}

const PropertyDetails: React.FC<Props> = ({ property, onBack }) => {
    const d = property.details || {}

    return (
        <div className='text-sm md:text-[16px] min-w-[300px]'>
            <button onClick={onBack} className="text-GrayHomz2 hover:text-BlackHomz flex items-center gap-2">
                <LongLeftArrow /> Go Back
            </button>

            <div className=" bg-white rounded-[12px]">
                <div className="flex items-center gap-4 mt-4">
                    <div className="h-[44px] w-[44px] rounded-full flex justify-center items-center bg-BlueHomz">
                        <Tower />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-BlackHomz font-medium">{property.title}</p>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] text-sm">
                    <p className="text-BlackHomz font-medium">Ownership Type</p>
                    <p className="text-GrayHomz">{d.ownershipType ? capitalizeFirstLetter(d.ownershipType) : '[Owner] / [Renter]'}</p>

                    <p className="text-BlackHomz font-medium">Role</p>
                    <p className="text-GrayHomz">{d.role || 'Primary Resident'}</p>
                    
                    <p/>
                    <p className='text-BlueHomz flex items-center gap-1'><ProfileUser /> View Co-residents</p>


                    <p className="text-BlackHomz font-medium">Rent Start Date</p>
                    <p className="text-GrayHomz">{d.rentStart || '[10th June, 2024]'}</p>

                    <p className="text-BlackHomz font-medium">Rent Due Date</p>
                    <p className="text-GrayHomz">{d.rentDue || '[9th June, 2025]'}</p>

                    <p className="text-BlackHomz font-medium">Apartment</p>
                    <p className="text-GrayHomz">{d.apartment || '[Apartment Name/No]'}</p>

                    <p className="text-BlackHomz font-medium">Residency Type</p>
                    <p className="text-GrayHomz">{d.residencyType ? capitalizeFirstLetter(d.residencyType) : '[Residency Type]'}</p>

                    <p className="text-BlackHomz font-medium">Building</p>
                    <p className="text-GrayHomz">{d.building || '[Building Name]'}</p>

                    <p className="text-BlackHomz font-medium">Street</p>
                    <p className="text-GrayHomz">{d.street || '[Street Name]'}</p>

                    <p className="text-BlackHomz font-medium">Zone</p>
                    <p className="text-GrayHomz">{d.zone || '[Zone Name]'}</p>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetails
