import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { estateData } from './authStore';

interface CommunityStore {
  selectedCommunity: estateData | null;
  setSelectedCommunity: (data: estateData | null) => void;
  isSwitchingEstate: boolean;
  setIsSwitchingEstate: (value: boolean) => void;
  publicCommunity: estateData | null;
  setPublicCommunity: (data: estateData | null) => void;
}

export const useSelectedCommunity = create<CommunityStore>()(
  persist(
    (set) => ({
      selectedCommunity: null,
      setSelectedCommunity: (data) => set({ selectedCommunity: data }),
      isSwitchingEstate: false,
      setIsSwitchingEstate: (value) => set({ isSwitchingEstate: value }),
      publicCommunity: null,
      setPublicCommunity: (data) => set({ publicCommunity: data }),
    }),
    {
      name: "selected-community", // storage key
      partialize: (state) => ({
        selectedCommunity: state.selectedCommunity,
      }),
    }
  )
);
