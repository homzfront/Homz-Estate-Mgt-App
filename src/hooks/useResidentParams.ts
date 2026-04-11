// hooks/useResidentParams.ts
import { useResidentStore } from '@/store/useResidentStore'
import { useEffect, useState } from 'react'

export const useResidentParams = () => {
    const { setResidentData, clearResidentData } = useResidentStore()
    const [paramsLoaded, setParamsLoaded] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)

        const invitation = urlParams.get('invitation')
        const organizationId = urlParams.get('organizationId')
        const estateId = urlParams.get('estateId')
        const email = urlParams.get('email')
        const firstName = urlParams.get('firstName')
        const lastName = urlParams.get('lastName')

        if (invitation || organizationId || estateId || email || firstName || lastName) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const availableData: any = {}
            if (invitation) availableData.token = invitation
            if (organizationId) availableData.organizationId = organizationId
            if (estateId) availableData.estateId = estateId
            if (email) availableData.email = email
            if (firstName) availableData.firstName = firstName
            if (lastName) availableData.lastName = lastName

            setResidentData(availableData)
        } else {
            clearResidentData()
        }

        setParamsLoaded(true)
    }, [setResidentData, clearResidentData])

    return { paramsLoaded }
}