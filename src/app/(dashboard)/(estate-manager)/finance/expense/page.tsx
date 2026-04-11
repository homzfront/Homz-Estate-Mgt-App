"use client";
import React from 'react';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';

const Expense = () => {
  const router = useRouter();
  const ability = useAbility();

  React.useEffect(() => {
    if (!ability.can('read', 'finance')) {
      router.push('/dashboard');
    }
  }, [ability, router]);

  return (
    <div>Expense</div>
  )
}

export default Expense