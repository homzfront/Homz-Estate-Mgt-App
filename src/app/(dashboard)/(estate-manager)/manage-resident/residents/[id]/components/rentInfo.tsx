import ArrowRight from '@/components/icons/arrowRight'
import Tower from '@/components/icons/tower'
import React from 'react'

type PropertyItem = {
    id: string | number
    title: string
    subtitle?: string
}

interface RentInfoProps {
    // called when a property card is clicked — parent should open the property detail modal
    onOpenProperty?: (property: PropertyItem) => void
    // optional list to render; defaults to sample items
    properties?: PropertyItem[]
}

const RentInfo: React.FC<RentInfoProps> = ({ onOpenProperty, properties }) => {
    const items: PropertyItem[] = properties ?? [
        { id: 1, title: '[2-Bedroom Bungalow]', subtitle: '[View Gold Property]' },
        { id: 2, title: '[4-Bedroom Bungalow]', subtitle: '[View Gold Property]' },
        { id: 3, title: '[8-Bedroom Bungalow]', subtitle: '[View Gold Property]' },
    ]

    const handleKeyDown = (e: React.KeyboardEvent, item: PropertyItem) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenProperty?.(item)
        }
    }

    return (
        <div className='text-sm md:text-[16px]'>
            <p className="mt-2 text-GrayHomz font-normal">
                View rent information for all properties currently rented by this Resident.
            </p>

            {items.map((item) => (
                <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenProperty?.(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    className="mt-4 p-4 bg-[#FCFCFC] rounded-[8px] flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex justify-center items-center h-[44px] w-[44px] rounded-full bg-BlueHomz">
                            <Tower />
                        </div>
                        <div className="text-GrayHomz font-medium flex flex-col gap-1 ml-1">
                            <p className="text-sm">{item.title}</p>
                            {item.subtitle && <p className="text-[11px]">{item.subtitle}</p>}
                        </div>
                    </div>
                    <ArrowRight className="#4E4E4E" />
                </div>
            ))}
        </div>
    )
}

export default RentInfo