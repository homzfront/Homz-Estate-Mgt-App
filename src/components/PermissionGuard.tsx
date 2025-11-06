import { useAbility } from '@/contexts/AbilityContext';
import { Actions, Subjects } from '@/utils/ability';

interface PermissionGuardProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  action,
  subject,
  children,
  fallback = null
}: PermissionGuardProps) {
  const ability = useAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}