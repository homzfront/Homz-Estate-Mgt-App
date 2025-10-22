"use client"

import React, { Suspense } from 'react'
import EstateForm from './estateForm'
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';

// Add estate component
const AddEstate = () => {
    const router = useRouter();
    const ability = useAbility();

    // Redirect if user doesn't have permission to create estates
    React.useEffect(() => {
        if (!ability.can('create', 'estate')) {
            router.push('/dashboard');
        }
    }, [ability, router]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EstateForm />
        </Suspense>
    )
}

export default AddEstate