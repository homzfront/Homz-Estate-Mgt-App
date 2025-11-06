'use client';

import { createContext, useContext, useMemo } from 'react';
import { AppAbility, defineAbilityFor } from '@/utils/ability';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const ability = useMemo(() => {
    return defineAbilityFor(selectedCommunity?.role || '');
  }, [selectedCommunity?.role]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return ability;
}