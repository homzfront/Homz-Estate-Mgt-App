/* eslint-disable @typescript-eslint/no-explicit-any */
import useClickOutside from '@/app/utils/useClickOutside';
import CustomModal from '@/components/general/customModal';
import ArrowLeftLong from '@/components/icons/arrowLeftLong';
import { useSelectedEsate } from '@/store/useSelectedEstate';
import Link from 'next/link';
import React from 'react'
import PickEstate from '../../components/pickEstate';
import Image from 'next/image';
import ArrowDown from '@/components/icons/arrowDown';
import EstateInformation from './components/estateInformation';
import MyProperties from './components/myProperties';
import { useSearchParams } from 'next/navigation';

const allPages = [
    {
        id: 1,
        name: "Estate Information",
        key: "estateInfo",
        component: <EstateInformation />,
    },
    {
        id: 2,
        name: "My Properties",
        key: "myProperties",
        component: <MyProperties />,
    },
];

const EditEstateForm = () => {
    const urlParams = useSearchParams();
    const pages = allPages;
    const initialTab = urlParams.get("tab");
    const initialActiveTab = initialTab ? pages.find(page => page.key === initialTab)?.id : 1;
    const [active, setActive] = React.useState<any>(initialActiveTab);
    const selectedEstate = useSelectedEsate((state) => state.selectedEstate);
    const [openEstateList, setOpenEstateList] = React.useState<boolean>(false);

    const closeRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(closeRef as any, () => {
        setOpenEstateList(false);
    });


    const handlePageChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string | number): void => {
        e.preventDefault();
        setActive(id);
    };


    return (
        <div className='p-8'>
            {openEstateList &&
                <CustomModal isOpen={openEstateList} onRequestClose={() => setOpenEstateList(false)}>
                    <PickEstate closeRef={closeRef} />
                </CustomModal>
            }
            <button onClick={() => setOpenEstateList(true)} className='md:hidden border border-[#E6E6E6] hover:bg-white hover:shadow-md bg-[#F6F6F6] text-GrayHomz text-sm font-normal py-2 flex items-center justify-between w-full h-[48px] rounded-[4px] px-4 mb-4 onClick={()=> setOpenEsateList(true)}'>
                <div className='flex gap-2 items-center'>
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                            src={"/houses.jpg"}
                            alt={"estate-img"}
                            width={24}
                            height={24}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {selectedEstate ? selectedEstate?.estateName : "Diamond Estate"}
                </div>
                <div className='mt-1.5'>
                    <ArrowDown size={20} className='#4E4E4E' />
                </div>
            </button>
            <div className='hidden md:flex items-center gap-1 mb-1'>
                <Link href={"/resident/dashboard"} className='text-[20px] text-BlackHomz font-medium'>{`${selectedEstate?.estateName} >`}</Link>
                <p className='text-[20px] text-BlackHomz font-bold'>Estate Information</p>
            </div>
            <div className='md:hidden items-center gap-4 mb-1'>
                <Link href={"/resident/dashboard"} className='text-[20px] text-BlackHomz font-medium'><ArrowLeftLong /></Link>
                <p className='text-[16px] text-BlackHomz font-medium mt-6'>Estate Information</p>
            </div>
            <p className='text-sm md:text-[16px] font-normal text-GrayHomz'>All details and records related to your selected estate.</p>

            <div className="w-full h-auto py-4">
                <div className="flex mt-5 gap-4 cursor-pointer">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className={`flex flex-col items-center py-2 px-3 justify-center rounded-md ${active === page.id ? "bg-BlueHomz text-white" : "bg-whiteblue md:bg-transparent text-BlueHomz md:text-BlackHomz"}`}
                            onClick={(e) => handlePageChange(e, page.id)}
                        >
                            <p className="text-[14px] font-500">{page.name}</p>
                        </div>
                    ))}
                </div>
                <div className="my-5 rounded-[12px]">
                    {pages.map((page) => (
                        <div key={page.id} className={active === page.id ? "inline" : "hidden"}>
                            {typeof page.component === "function" ? page.component : page.component}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EditEstateForm