import ArrowLeft16Long from '@/components/icons/arrowLeft16Long';
import ArrowLeftMob from '@/components/icons/arrowLeftMob';
import { useUserStore } from '@/store/useUserStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import EstateInfo from '../../add-estate/components/estateInfo';
import AddZone from '../../add-estate/components/addZone';
import AddStreet from '../../add-estate/components/addStreet';
import AddBuilding from '../../add-estate/components/addBuilding';
import AppApartment from '../../add-estate/components/appApartment';
import UpdateButtonPassword from '../../profile/(changePassword)/components/updateButtonPassword';

const EditEstateForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [active, setActive] = React.useState<number>(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
    const [doneUpdate, setDoneUpdate] = React.useState(false);
    const [showDialogue, setShowDialogue] = React.useState(false);
    const setUserData = useUserStore((state) => state.setUserData);
    const [formData, setFormData] = React.useState({
        estateName: '',
        estateLocation: '',
        area: '',
        state: '',
        managerPhone: '',
        utilityPhone: '',
        accountNumber: '',
        bankName: '',
        accountName: '',
        emergencyPhone: '',
        securityPhone: ''
    });

    const widgetHeaders = ["Estate Information", "Add Zones (Optional)", "Add Streets", "Add Buildings", "Add Apartments"]

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

    const updateDone = async (e:
        React.FormEvent
    ) => {
        e.preventDefault();
        // Handle the update logic here
        console.log("Update done with data:", formData);
        setUserData(true);
        router.push("/dashboard")
    }


    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
                        handleInputChange={handleInputChange}
                        formData={formData}
                    />
                );
            case 2:
                return (
                    <AddStreet
                        handleInputChange={handleInputChange}
                        formData={formData}
                    />
                );
            case 3:
                return (
                    <AddBuilding
                        handleInputChange={handleInputChange}
                        formData={formData}
                    />
                );
            case 4:
                return (
                    <AppApartment
                        handleInputChange={handleInputChange}
                        formData={formData}
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
                    <button onClick={() => router.back()} className='hidden md:flex text-sm font-normal text-GrayHomz2 items-center gap-1'>
                        <ArrowLeft16Long className='#A9A9A9' /> Go Back
                    </button>
                    <button onClick={() => router.back()} className='md:hidden text-sm font-normal text-GrayHomz flex items-center gap-1'>
                        <ArrowLeftMob />
                    </button>
                    <button className='ml-2 text-sm md:text-[16px] font-normal text-GrayHomz flex items-center' onClick={() => router.push("/dashboard")}>
                        [Estate Name] /
                    </button>
                    <button className='text-[16px] md:text-[20px] font-normal text-GrayHomz flex items-center' onClick={() => router.push("/dashboard")}>
                        Estate Information
                    </button>
                </div>

                {/* Desktop header */}
                <div className='flex flex-wrap items-center gap-4 mt-8'>
                    {widgetHeaders.map((data, index) => {
                        const isActive = index === active;
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
                                      `} >[2]</span>
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
                    loading={false}
                    showDialogue={showDialogue}
                    setShowDialogue={setShowDialogue}
                />
            </div>
        </div>

    )
}

export default EditEstateForm