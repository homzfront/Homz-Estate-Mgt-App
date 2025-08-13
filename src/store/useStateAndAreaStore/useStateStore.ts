/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/utils/api';

interface StateStore {
  loading: boolean;
  success: boolean;
  error: string | null;
  stateList: any[] | null;
  chooseState: () => Promise<void>;
};

const useStateStore = create<StateStore>((set) => ({
  loading: false,
  success: false,
  error: null,
  stateList: null,

  chooseState: async () => {
    set({ loading: true, success: false, error: null, stateList: null });
    try {
      const response = await api.get<{ data: any[] }>('/state-area/find-all-states');
      set({ loading: false, success: true, stateList: response.data.data });
    } catch (error: any) {
      set({ loading: false, success: false, error: error?.response?.data || 'Unknown error' });
    }
  },
}));

export default useStateStore;
