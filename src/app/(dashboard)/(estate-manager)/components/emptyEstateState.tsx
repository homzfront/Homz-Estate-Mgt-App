"use client";
import React from 'react';
import EmptyEstateIcon from '@/components/icons/estateManager&Resident/desktop/emptyEstateIcon';
import { useRouter } from 'next/navigation';
import { useAbility } from '@/contexts/AbilityContext';
import AddIcon from '@/components/icons/addIcon';

/**
 * Empty Estate State Component
 * 
 * Design Pattern: Marketing-style empty state
 * - Large icon/illustration (144px on desktop, 112px on mobile)
 * - Clear, action-oriented headline
 * - Descriptive subtext explaining the benefit
 * - Prominent CTA button
 * - Calm, clean aesthetic
 */

const EmptyEstateState = () => {
    const router = useRouter();
    const ability = useAbility();

    return (
        <div className='bg-white rounded-[12px] w-full flex justify-center items-center min-h-[500px] shadow-sm'>
            <div className='flex flex-col gap-6 justify-center items-center py-[60px] md:py-[80px] px-6'>
                <div className='w-[112px] md:w-[144px] h-[112px] md:h-[144px] rounded-full bg-[#EEF5FF] flex justify-center items-center'>
                    <EmptyEstateIcon />
                </div>

                <div className='flex flex-col gap-2 items-center'>
                    <h2 className='text-center text-[18px] md:text-[22px] font-bold text-BlackHomz max-w-[500px] leading-tight'>
                        Experience the Full Power of Homz
                    </h2>
                    <p className='text-center text-[15px] md:text-[16px] font-medium text-[#4E4E4E] max-w-[420px] leading-relaxed'>
                        Create an estate & add residents to start creating bills and managing your community efficiently.
                    </p>
                </div>

                {ability.can('create', 'estate') && (
                    <button
                        onClick={() => router.push("/add-estate")}
                        className='bg-BlueHomz hover:bg-BlueHomzDark text-white px-8 py-3 rounded-[4px] text-[15px] font-semibold transition-colors duration-200 flex items-center gap-2 shadow-md'
                    >
                        <AddIcon className='#ffffff'/> Create An Estate
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyEstateState;
