/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { Suspense } from 'react'
import EditEstateForm from './editEstateForm'
import { useAbility } from '@/contexts/AbilityContext'
import { useRouter } from 'next/navigation'

const EstateInfo = () => {
    const router = useRouter();
    const ability = useAbility();

    // Redirect if user doesn't have access to estate info
    React.useEffect(() => {
        if (!ability.can('read', 'estate-info')) {
            router.push('/dashboard');
        }
    }, [ability, router]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditEstateForm />
        </Suspense>
    )
}

export default EstateInfo