/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long';
import ArrowLeftMob from '@/components/icons/arrowLeftMob';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import EstateInfo from '../../add-estate/components/estateInfo';
import AddZone from '../../add-estate/components/addZone';
import AddStreet from '../../add-estate/components/addStreet';
import AddBuilding from '../../add-estate/components/addBuilding';
import AppApartment from '../../add-estate/components/appApartment';
import UpdateButtonPassword from '../../profile/(changePassword)/components/updateButtonPassword';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { EstateFormData, useEstateFormStore } from '@/store/useEstateFormStore';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import useStateStore from '@/store/useStateAndAreaStore/useStateStore';
import { useAuthSlice } from '@/store/authStore';

const EditEstateForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [active, setActive] = React.useState<number>(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
    const [doneUpdate, setDoneUpdate] = React.useState(false);
    const setSelectedCommunity = useSelectedCommunity((state) => state.setSelectedCommunity);
    const [showDialogue, setShowDialogue] = React.useState(false);
    const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
    const { formData, setFormData, setZones, setStreets, setBuildings, setApartments, clearForm } = useEstateFormStore();
    // zustand for state 
    const { chooseState } = useStateStore();
    const { getEstates, estatesData } = useAuthSlice();
    // Header 
    const widgetHeaders = ["Estate Information", "Add Zones (Optional)", "Add Streets", "Add Buildings", "Add Apartments"]

    React.useEffect(() => {
        if (selectedCommunity) {
            // Map basic details
            setFormData({
                estateName: selectedCommunity.basicDetails.name,
                estateLocation: selectedCommunity.basicDetails.location.area,
                area: selectedCommunity.basicDetails.location.area,
                state: selectedCommunity.basicDetails.location.state,
                managerPhone: selectedCommunity.contactInformation.managerPhone,
                utilityPhone: selectedCommunity.contactInformation.utilityServicesPhone,
                accountNumber: selectedCommunity.bankDetails.accountNumber,
                bankName: selectedCommunity.bankDetails.bankName,
                accountName: selectedCommunity.bankDetails.accountName,
                emergencyPhone: selectedCommunity.contactInformation.emergencyPhone,
                securityPhone: selectedCommunity.contactInformation.securityPhone,
                coverPhoto: selectedCommunity.coverPhoto?.url || null
            });

            // Map zones
            const mappedZones = selectedCommunity.zones.map((zone, index) => ({
                id: index,
                label: zone.name
            }));
            setZones(mappedZones);

            // Map streets
            const mappedStreets = selectedCommunity.streets.map((street, index) => ({
                id: index,
                label: street.name,
                zone: street.zone
            }));
            setStreets(mappedStreets);

            // Map buildings
            const mappedBuildings = selectedCommunity.buildings.map((building, index) => ({
                id: index,
                label: building.name,
                street: building.street,
                zone: building.zone
            }));
            setBuildings(mappedBuildings);

            // Map apartments
            const mappedApartments = selectedCommunity.apartments.map((apartment, index) => ({
                id: index,
                label: apartment.name,
                building: apartment.building,
                street: apartment.street,
                zone: apartment.zone
            }));
            setApartments(mappedApartments);
        }
    }, [selectedCommunity]);

    // Load state 
    React.useEffect(() => {
        chooseState()
    }, []);

    // update selected community data when estatesData changes
    React.useEffect(() => {
        if (estatesData && doneUpdate) {
            const newData = estatesData.find((data) => data._id === selectedCommunity?._id) || selectedCommunity;
            setSelectedCommunity(newData);
        }
    }, [estatesData, doneUpdate, selectedCommunity, setSelectedCommunity]);


    // Set initial active page from URL params
    React.useEffect(() => {
        const page = searchParams.get('page');
        if (page) {
            const pageNum = parseInt(page);
            if (!isNaN(pageNum)) {
                setActive(pageNum >= 0 && pageNum < widgetHeaders.length ? pageNum : 0);
            }
        }
    }, [searchParams]);


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

    const updateDone = async () => {
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
            // First, update the estate
            const estateId = selectedCommunity?._id; // Adjust based on your API response
            const organizationId = selectedCommunity?.associatedIds?.organizationId
            const createEstateResponse = await api.patch(`/estates/community-manager/update-estate/organizations/${organizationId}/estates/${estateId}`, payload);

            if (createEstateResponse?.data) {

                // Then upload the cover photo if it exists
                if (coverPhoto !== selectedCommunity?.coverPhoto?.url && coverPhoto) {
                    // Convert data URL to blob
                    const blob = await fetch(coverPhoto).then(res => res.blob());

                    const formData = new FormData();
                    formData.append('coverImage', blob, 'cover-photo.jpg');

                    await api.patch(`/estates/upload/single/cover-photo/${organizationId}/${estateId}`, formData);
                }

            }
            // Show success toast
            await getEstates()
            setDoneUpdate(true);

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
                {/* Back button */}
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => {
                            clearForm();
                            router.back();
                        }}
                        className='hidden md:flex text-sm font-normal text-GrayHomz2 items-center gap-1'
                    >
                        <ArrowLeft16Long className='#A9A9A9' /> Go Back
                    </button>
                    <button onClick={() => router.back()} className='md:hidden text-sm font-normal text-GrayHomz flex items-center gap-1'>
                        <ArrowLeftMob />
                    </button>
                    <button className='ml-2 text-sm md:text-[16px] font-normal text-GrayHomz flex items-center' onClick={() => router.push("/dashboard")}>
                        {selectedCommunity ? selectedCommunity?.basicDetails?.name : "[Estate Name]"} /
                    </button>
                    <button className='text-[16px] md:text-[20px] font-normal text-GrayHomz flex items-center' onClick={() => router.push("/dashboard")}>
                        Estate Information
                    </button>
                </div>

                {/* Desktop header */}
                <div className='flex flex-wrap items-center gap-4 mt-8'>
                    {widgetHeaders.map((data, index) => {
                        const isActive = index === active;
                        // Get the count for each section
                        let count = 0;
                        if (index === 1) count = selectedCommunity?.zones.length ?? 0;        // Zones count
                        else if (index === 2) count = selectedCommunity?.streets.length ?? 0; // Streets count
                        else if (index === 3) count = selectedCommunity?.buildings.length ?? 0; // Buildings count
                        else if (index === 4) count = selectedCommunity?.apartments.length ?? 0; // Apartments count

                        return (
                            <div
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`cursor-pointer text-[14px] font-normal ${isActive ? "text-GrayHomz" :
                                    "text-GrayHomz"
                                    }`}
                            >
                                <div className={`flex gap-2 items-center ${isActive ? "border-b border-BlueHomz text-BlueHomz pb-2" : "text-GrayHomz"}`}>
                                    {data}
                                    <span className={`${index === 0 ? "hidden" : "block"} 
                                        w-[40px] h-[25px] rounded-[16px] flex items-center justify-center text-[14px] font-normal
                                        ${isActive ? "bg-BlueHomz text-white" : "bg-[#E6E6E6] text-BlackHomz"}
                                      `} >{count}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Form Content */}
                {renderFormContent()}

                {/* Navigation Buttons */}
                <UpdateButtonPassword
                    updateDone={updateDone}
                    doneUpdate={doneUpdate}
                    setDoneUpdate={setDoneUpdate}
                    loading={loading}
                    showDialogue={showDialogue}
                    setShowDialogue={setShowDialogue}
                />
            </div>
        </div>

    )
}

export default EditEstateForm