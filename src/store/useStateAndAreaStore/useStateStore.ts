import { create } from 'zustand';
import api from '@/utils/api';


const useStateStore = create((set) => ({
  loading: false,
  success: false,
  error: null,
  data: null,
  chooseState: async () => {
    set({ loading: true, success: false, error: null, data: null });
    try {
      const response = await api.get(`/state-area/find-all-states`);
      set({ loading: false, success: true, data: response?.data });
    } catch (error: any) {
      set({ loading: false, success: false, error: error?.response?.data });
    }
  },
}));

export default useStateStore