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
        const estateIdRaw = urlParams.get('estateId')

        let estateId = ''
        let email = ''
        let estateName = ''
        let firstName = ''
        let lastName = ''

        if (estateIdRaw) {
            const decoded = decodeURIComponent(estateIdRaw)
            const parts = decoded.split(' ')
            console.log({ parts })

            if (parts.length >= 5) {
                estateId = parts[0] || ''
                email = parts[1] || ''
                estateName = parts[2] || ''
                firstName = parts[3] || ''
                lastName = parts[4] || ''
            }
        }

        if (invitation && organizationId && estateId) {
            setResidentData({
                token: invitation,
                organizationId,
                estateId,
                email,
                estateName,
                firstName,
                lastName,
            })
        } else {
            clearResidentData()
            router.push('/login')
        }
    }, [setResidentData, clearResidentData, router])
}
