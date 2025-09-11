import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResidentCommunityType } from './useResidentCommunity';

interface EstateStore {
  selectedEstate: ResidentCommunityType | null;
  setSelectedEstate: (data: ResidentCommunityType | null) => void;
}

export const useSelectedEsate = create<EstateStore>()(
  persist(
    (set) => ({
      selectedEstate: null,
      setSelectedEstate: (data) => set({ selectedEstate: data }),
    }),
    {
      name: 'selected-estate', // localStorage key
      partialize: (state) => ({
        selectedEstate: state.selectedEstate,
      }),
    }
  )
);  