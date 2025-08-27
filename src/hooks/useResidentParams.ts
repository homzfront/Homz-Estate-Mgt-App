// hooks/useResidentParams.ts
import { useResidentStore } from '@/store/useResidentStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useResidentParams = () => {
    const { setResidentData, clearResidentData } = useResidentStore()
    const router = useRouter()
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const invitation = urlParams.get('invitation')
        const organizationId = urlParams.get('organizationId')
        const estateId = urlParams.get('estateId')

        if (invitation && organizationId && estateId) {
            setResidentData({
                token: invitation,
                organizationId,
                estateId
            })
        } else {
            // Optional: Clear data if params are missing
            clearResidentData()
            router.push("/login")
        }
    }, [setResidentData, clearResidentData])
}