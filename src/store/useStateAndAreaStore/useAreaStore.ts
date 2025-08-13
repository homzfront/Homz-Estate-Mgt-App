/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';

interface AreaStore {
  loading: boolean;
  success: boolean;
  error: string | null;
  areaData: any[] | null;
  chooseArea: (state: string) => Promise<void>;
}

const useAreaStore = create<AreaStore>((set) => ({
  loading: false,
  success: false,
  error: null,
  areaData: null,

  chooseArea: async (state: string) => {
    set({ loading: true, success: false, error: null, areaData: null });
    try {
      const response = await api.post<{ data: any[] }>(
        `/state-area/find-state/${state}/area`
      );
      set({ loading: false, success: true, areaData: response.data.data });
    } catch (error: any) {
      set({
        loading: false,
        success: false,
        error: error?.response?.data || 'Unknown error',
      });
    }
  },
}));

export default useAreaStore;
