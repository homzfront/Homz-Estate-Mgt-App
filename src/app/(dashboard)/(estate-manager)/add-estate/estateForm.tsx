/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowLeft from '@/components/icons/arrowLeft'
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long'
import ArrowLeftMob from '@/components/icons/arrowLeftMob'
import ArrowRightWhite from '@/components/icons/arrowRightWhite'
// import { useUserStore } from '@/store/useUserStore'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import SuccessModal from '../../components/successModal'
import EstateInfo from './components/estateInfo'
import AddZone from './components/addZone'
import AddStreet from './components/addStreet'
import AddBuilding from './components/addBuilding'
import AppApartment from './components/appApartment'
import useStateStore from '@/store/useStateAndAreaStore/useStateStore'
import { EstateFormData, useEstateFormStore } from '@/store/useEstateFormStore'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import DotLoader from '@/components/general/dotLoader'

const EstateForm = () => {
    // react components
    const router = useRouter();
    const searchParams = useSearchParams();

    // zustand for state 
    const { chooseState } = useStateStore();

    // normal states
    const [active, setActive] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    // const setUserData = useUserStore((state) => state.setUserData);
    const {
        formData,
        setFormData,
        clearForm
    } = useEstateFormStore();

    // Load state 
    React.useEffect(() => {
        chooseState()
    }, []);

    const widgetHeaders = ["Estate Information", "Add Zones (Optional)", "Add Streets", "Add Buildings", "Add Apartments"]

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

    const handleSubmit = async () => {
        // Get all data from the store
        const {
            estateName,
            area,
            state,
            managerPhone,
            utilityPhone,
            emergencyPhone,
            securityPhone,
            accountNumber,
            bankName,
            accountName,
            zones,
            streets,
            buildings,
            apartments,
            coverPhoto
        } = useEstateFormStore.getState().formData;

        // Prepare the payload
        const payload = {
            basicDetails: {
                name: estateName,
                location: {
                    area,
                    state
                }
            },
            contactInformation: {
                managerPhone,
                emergencyPhone,
                utilityServicesPhone: utilityPhone,
                securityPhone
            },
            bankDetails: {
                accountNumber,
                accountName,
                bankName
            },
            zones: zones.map(zone => ({ name: zone.label })),
            streets: streets.map(street => ({
                name: street.label,
                zone: street.zone
            })),
            buildings: buildings.map(building => ({
                name: building.label,
                street: building.street,
                zone: building.zone
            })),
            apartments: apartments.map(apartment => ({
                name: apartment.label,
                building: apartment.building,
                street: apartment.street,
                zone: apartment.zone
            }))
        };

        try {
            setLoading(true);
            // First, create the estate
            const createEstateResponse = await api.post(`/estates/create-estate`, payload);

            if (createEstateResponse?.data) {
                const estateData = createEstateResponse?.data?.data

                const estateId = estateData._id; // Adjust based on your API response
                const estateManId = estateData?.associatedIds?.organizationId
                // Then upload the cover photo if it exists
                if (coverPhoto) {
                    // Convert data URL to blob
                    const blob = await fetch(coverPhoto).then(res => res.blob());

                    const formData = new FormData();
                    formData.append('coverImage', blob, 'cover-photo.jpg');

                    await api.patch(`/estates/upload/single/cover-photo/${estateManId}/${estateId}`, formData);
                }

            }
            // On success
            setIsOpen(true);
        } catch (error: any) {
            const majorBackendError = error?.response?.data?.errors?.[0]?.message
            const backendMessage = error?.response?.data?.message;
            const backendMessageTwo = error?.response?.data?.message?.[0];
            const fallbackMessage = error?.message || "An error occurred during login";

            // Show toast notification
            toast.error(
                majorBackendError ||
                backendMessage ||
                backendMessageTwo ||
                fallbackMessage,
                {
                    position: "top-center",
                    duration: 5000,
                }
            );
        } finally {
            setLoading(false)
        }
    };

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

    const handleInputChange = (field: keyof EstateFormData, value: string) => {
        setFormData({ [field]: value });
    };

    const renderFormContent = () => {
        switch (active) {
            case 0:
                return (
                    <EstateInfo
                        handleInputChange={handleInputChange}
                        formData={formData}
                    />
                );
            case 1:
                return (
                    <AddZone
                    />
                );
            case 2:
                return (
                    <AddStreet
                    />
                );
            case 3:
                return (
                    <AddBuilding
                    />
                );
            case 4:
                return (
                    <AppApartment
                    />
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
                        handleSubmit={() => {
                            // setUserData(true);
                            clearForm();
                            router.push("/dashboard");
                        }}
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
                <div className='flex flex-wrap items-center gap-4 mt-8'>
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

                {/* Form Content */}
                {renderFormContent()}

                {/* Navigation Buttons */}
                <div className={`mt-8 flex gap-4 md:gap-0 items-center flex-row md:items-start ${active === 0 ? "justify-end" : "justify-end md:justify-between"}`}>
                    {active > 0 && (
                        <button
                            onClick={() => { }}
                            className="text-sm font-medium text-BlackHomz hover:text-gray-500"
                        >
                            Save <span className='md:hidden'>Progress</span>
                        </button>
                    )}
                    <div className='flex items-center gap-4'>
                        {active > 0 && (
                            <button
                                onClick={handleBack}
                                className="hidden text-sm font-medium text-BlackHomz hover:text-gray-700 md:flex gap-1 items-center"
                            >
                                <ArrowLeft /> Back
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (active === widgetHeaders.length - 1) {
                                    handleSubmit()
                                }
                                else {
                                    handleNext()
                                }
                            }}
                            className={`${loading && "pointer-events-none flex justify-center items-center h-[35px] w-[120px]"} ml-auto px-3 py-2 rounded-[4px] text-sm font-medium flex items-center gap-1 text-white bg-BlueHomz hover:bg-blue-700`}
                        >
                            {
                                loading ? (
                                    <DotLoader />
                                ) : (
                                    <>
                                        {active === widgetHeaders.length - 1 ? 'Create Estate' : 'Next'}
                                        {active !== widgetHeaders.length - 1 && <ArrowRightWhite />}
                                    </>
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EstateForm