import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Community } from './authStore';

interface CommunityStore {
  selectedCommunity: Community | null;
  setSelectedCommunity: (data: Community | null) => void;
}

export const useSelectedCommunity = create<CommunityStore>()(
  persist(
    (set) => ({
      selectedCommunity: null,
      setSelectedCommunity: (data) => set({ selectedCommunity: data }),
    }),
    {
      name: "selected-community", // storage key
      partialize: (state) => ({
        selectedCommunity: state.selectedCommunity,
      }),
    }
  )
);
