"use client"
import React from 'react'
import SupportComponent from '../../features/supportComponent'
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';

const Support = () => {
  const router = useRouter();
  const ability = useAbility();

  // Redirect if user doesn't have access to support
  React.useEffect(() => {
    if (!ability.can('read', 'support')) {
      router.push('/dashboard');
    }
  }, [ability, router]);

  return (
    <div><SupportComponent /></div>
  )
}

export default Support