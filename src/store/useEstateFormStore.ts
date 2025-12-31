import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Zone {
    id: number;
    label: string;
}

export interface Street {
    id: number;
    label: string;
    zone: string
}

export interface Building {
    id: number;
    label: string;
    street: string
    zone: string
}

export interface Apartment {
    id: number;
    label: string;
    residencyType: string;
    building: string;
    street: string;
    zone: string;
}

export interface EstateFormData {
    estateName: string;
    estateLocation: string;
    area: string;
    state: string;
    managerPhone: string;
    utilityPhone: string;
    accountNumber: string;
    bankName: string;
    accountName: string;
    emergencyPhone: string;
    securityPhone: string;
    coverPhoto: string | null;
    zones: Zone[];
    streets: Street[];
    buildings: Building[];
    apartments: Apartment[];
}

const initialFormData: EstateFormData = {
    estateName: '',
    estateLocation: '',
    area: '',
    state: '',
    managerPhone: '',
    utilityPhone: '',
    accountNumber: '',
    bankName: '',
    accountName: '',
    emergencyPhone: '',
    securityPhone: '',
    coverPhoto: null,
    zones: [],
    streets: [],
    buildings: [],
    apartments: [],
};

export interface EstateFormStore {
    formData: EstateFormData;
    setFormData: (data: Partial<EstateFormData>) => void;
    setCoverPhoto: (photo: string | null) => void;
    clearForm: () => void;
    setZones: (zones: Zone[]) => void;
    setStreets: (streets: Street[]) => void
    setBuildings: (Buildings: Building[]) => void
    setApartments: (Apartments: Apartment[]) => void
}

export const useEstateFormStore = create<EstateFormStore>()(
    persist(
        (set) => ({
            formData: initialFormData,
            setFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data }
                })),
            setCoverPhoto: (coverPhoto) =>
                set((state) => ({
                    formData: { ...state.formData, coverPhoto }
                })),
            clearForm: () => set({ formData: initialFormData }),
            setZones: (zones) =>
                set((state) => ({
                    formData: {
                        ...state.formData,
                        zones
                    }
                })),
            setStreets: (streets) =>
                set((state) => ({
                    formData: {
                        ...state.formData,
                        streets
                    }
                })),
            setBuildings: (buildings) =>
                set((state) => ({
                    formData: {
                        ...state.formData,
                        buildings
                    }
                })),
            setApartments: (apartments) =>
                set((state) => ({
                    formData: {
                        ...state.formData,
                        apartments
                    }
                })),
        }),
        {
            name: 'estate-form-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                formData: {
                    ...state.formData,
                    coverPhoto: null, // Do not persist the large base64 string
                },
            }),
        }
    )
);