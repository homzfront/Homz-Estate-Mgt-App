import { create } from 'zustand';

interface UserStore {
  userData: boolean;
  setUserData: (value: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: false,
  setUserData: (value) => set({ userData: value }),
}));
