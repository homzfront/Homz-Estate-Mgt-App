import { Resident } from '@/app/(dashboard)/(estate-manager)/manage-resident/components/resident';
import { Visitor } from '@/app/(dashboard)/components/visitors';
import { create } from 'zustand';

interface UseAccessStoreType {
    accessData: boolean;
    setAccessData: (value: boolean) => void;
    accessForm: boolean;
    setAccessForm: (value: boolean) => void;
    residentData: Visitor | null;
    setResidentData: (data: Visitor | null) => void;
    resident: Resident | null;
    setResident: (data: Resident | null) => void;
}

export const useAccessStore = create<UseAccessStoreType>((set) => ({
    accessData: false,
    setAccessData: (value) => set({ accessData: value }),
    accessForm: false,
    setAccessForm: (value) => set({ accessForm: value }),
    residentData: null,
    setResidentData: (value) => set({ residentData: value }),
    resident: null,
    setResident: (value) => set({ resident: value }),
}));


