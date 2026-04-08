"use client"

import React, { Suspense } from 'react'
import EstateForm from './estateForm'
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import { useEstateFormStore } from '@/store/useEstateFormStore';
import { useAuthSlice } from '@/store/authStore';

// Add estate component
const AddEstate = () => {
    const router = useRouter();
    const ability = useAbility();
    const formData = useEstateFormStore((state) => state.formData);
    const { estateLoading, estatesData } = useAuthSlice();
    const [checkComplete, setCheckComplete] = React.useState(false);

    // Allow access to add-estate page for community managers who can create estates
    // OR for new users who haven't created any estates yet (estatesData.length === 0)
    // OR for users with in-progress form data
    React.useEffect(() => {
        // If estates data is still loading, don't do anything yet
        if (estateLoading) {
            return;
        }

        setCheckComplete(true);

        // Check if there's form data in progress - if so, allow access
        const hasFormData = formData?.estateName || formData?.state || formData?.area;

        // Allow access if:
        // 1. User has permission to create estates, OR
        // 2. User has no estates yet (new community manager), OR
        // 3. User has in-progress form data
        const canAccess = ability.can('create', 'estate') ||
            (estatesData && estatesData.length === 0) ||
            hasFormData;

        if (!canAccess) {
            router.push('/dashboard');
        }
    }, [ability, router, estateLoading, estatesData, formData]);

    // Show loading while checking permissions
    if (!checkComplete && estateLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EstateForm />
        </Suspense>
    )
}

export default AddEstate