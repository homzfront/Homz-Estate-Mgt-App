'use client';

import { createContext, useContext, useMemo, useEffect } from 'react';
import { AppAbility, defineAbilityFor } from '@/utils/ability';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import { useAuthSlice } from '@/store/authStore';

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const setSelectedCommunity = useSelectedCommunity((state) => state.setSelectedCommunity);
  const { estatesData } = useAuthSlice();

  // When estatesData is freshly fetched, sync the role of the selected community
  // This ensures a role change made by another admin is reflected after the next page load
  // without requiring the affected user to log out and back in.
  useEffect(() => {
    if (!selectedCommunity || !estatesData || estatesData.length === 0) return;
    const freshRecord = estatesData.find((e) => e._id === selectedCommunity._id);
    if (freshRecord && freshRecord.role !== selectedCommunity.role) {
      setSelectedCommunity({ ...selectedCommunity, role: freshRecord.role });
    }
  }, [estatesData, selectedCommunity, setSelectedCommunity]);

  const ability = useMemo(() => {
    const role = selectedCommunity?.role ? selectedCommunity.role : estatesData && estatesData.length === 0 ? 'owner' : '';
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