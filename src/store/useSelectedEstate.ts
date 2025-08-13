import { create } from 'zustand';


interface EstateType {
    id: number;
    estate: string;
    building: string;
    apartmentName: string;
    residents: number;
}

interface EstateStore {
  selectedEstate: EstateType | null;
  setSelectedEstate: (data: EstateType | null) => void;
}

export const useSelectedEsate = create<EstateStore>((set) => ({
    selectedEstate: null,
    setSelectedEstate: (data) => set({ selectedEstate: data }),
}));
