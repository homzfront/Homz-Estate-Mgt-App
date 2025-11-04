import { useSearchParams } from 'next/navigation'

export function useRoleSignupParams() {
  const searchParams = useSearchParams();
  return {
    invitation: searchParams.get('invitation') || '',
    organizationId: searchParams.get('organizationId') || '',
    estateId: searchParams.get('estateId') || '',
    email: searchParams.get('email') || '',
  };
}
