import { useSearchParams } from 'next/navigation'

export function useRoleSignupParams() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const emails = emailParam.split(' ').filter(email => email.trim() !== '');
  const email = emails.slice(0, -1).join(' ') || '';
  return {
    invitation: searchParams.get('invitation') || '',
    organizationId: searchParams.get('organizationId') || '',
    estateId: searchParams.get('estateId') || '',
    email,
  };
}
