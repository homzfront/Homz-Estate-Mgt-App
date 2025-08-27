// stores/useResidentStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ResidentState {
  token: string | null
  organizationId: string | null
  estateId: string | null
  isResident: boolean
  setResidentData: (data: {
    token: string
    organizationId: string
    estateId: string
  }) => void
  clearResidentData: () => void
}

export const useResidentStore = create<ResidentState>()(
  persist(
    (set) => ({
      token: null,
      organizationId: null,
      estateId: null,
      isResident: false,
      
      setResidentData: (data) => set({
        token: data.token,
        organizationId: data.organizationId,
        estateId: data.estateId,
        isResident: true
      }),
      
      clearResidentData: () => set({
        token: null,
        organizationId: null,
        estateId: null,
        isResident: false
      })
    }),
    {
      name: 'resident-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)