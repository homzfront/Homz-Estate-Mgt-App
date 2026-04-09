'use client';

import { createContext, useContext, useMemo } from 'react';
import { AppAbility, defineAbilityFor } from '@/utils/ability';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useAuthSlice } from '@/store/authStore';

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const { estatesData } = useAuthSlice();

  // Derive the role reactively:
  // - If we have a selected community with a role, use it (covers invited members)
  // - If estatesData is loaded but empty, the user is an owner who hasn't created an estate yet
  // - Otherwise empty string → no permissions (will redirect to appropriate page)
  const ability = useMemo(() => {
    const role = selectedCommunity?.role
      ? selectedCommunity.role
      : estatesData && estatesData.length === 0
        ? 'owner'
        : '';
    return defineAbilityFor(role);
  }, [selectedCommunity?.role, estatesData]);

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