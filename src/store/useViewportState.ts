// stores/useViewportStore.ts
import { create } from 'zustand';

interface ViewportState {
  width: number;
  isAt624px: boolean;
  setViewport: (width: number) => void;
}

const useViewportStore = create<ViewportState>((set) => ({
  width: 0,
  isAt624px: false,
  setViewport: (width: number) =>
    set({
      width,
      isAt624px: width >= 624, // Fixed the property name to match the interface
    }),
}));

export default useViewportStore;