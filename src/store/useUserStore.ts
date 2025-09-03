import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  accounts: string[];
}

interface UserStore {
  userData: UserData | null;
  setUserData: (value: UserData | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (value) => set({ userData: value }),
    }),
    {
      name: "user", // storage key
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
);