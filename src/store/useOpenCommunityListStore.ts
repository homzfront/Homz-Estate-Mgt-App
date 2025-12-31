import { create } from 'zustand';

interface CommunityListStore {
    openEstateList: boolean;
    setOpenEstateList: (data: boolean) => void;
    openPendingModal: boolean;
    setOpenPendingModal: (data: boolean) => void;
}

export const useOpenCommunityListStore = create<CommunityListStore>()(
    (set) => ({
        openEstateList: false,
        setOpenEstateList: (data) => set({ openEstateList: data }),
        openPendingModal: false,
        setOpenPendingModal: (data) => set({ openPendingModal: data }),
    }),
);
