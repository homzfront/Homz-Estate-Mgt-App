"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/general/loadingSpinner'

// Minimal wrapper — just shows spinner and redirects link invites to register
// Email invites (with email param) are handled by a lazy-loaded component
const SignupContent = React.lazy(() => import('./components/signupContent'))

const ResidentSignup = () => {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isEmailInvite, setIsEmailInvite] = React.useState(false)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const invitation = params.get('invitation')
    const organizationId = params.get('organizationId')
    const estateId = params.get('estateId')
    const email = params.get('email')

    if (invitation && organizationId && estateId && !email) {
      sessionStorage.setItem('homz_resident_invite', JSON.stringify({
        invitation, organizationId, estateId
      }))
      router.replace(`/register?${params.toString()}`)
    } else {
      setIsEmailInvite(true)
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Always render spinner on server and first client paint — prevents hydration mismatch
  if (!mounted || !isEmailInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    }>
      <SignupContent />
    </React.Suspense>
  )
}

export default ResidentSignup