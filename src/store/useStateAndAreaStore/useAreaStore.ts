import api from '@/utils/api';
import { create } from 'zustand';


const useAreaStore = create((set) => ({
    loading: false,
    success: false,
    error: null,
    data: null,
    chooseArea: async (state: string) => {
        set({ loading: true, success: false, error: null, data: null });
        try {
            const response = await api.post(`/state-area/find-state/${state}/area`);
            set({ loading: false, success: true, data: response?.data });
        } catch (error: any) {
            set({ loading: false, success: false, error: error?.response?.data });
        }
    },
}));

export default useAreaStore