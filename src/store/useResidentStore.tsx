// stores/useResidentStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ResidentState {
  token: string | null
  organizationId: string | null
  estateId: string | null
  isResident: boolean
  email: string | null 
  estateName: string | null
  firstName: string | null 
  lastName: string | null 
  setResidentData: (data: {
    token: string
    organizationId: string
    estateId: string
    email?: string
    firstName?: string
    lastName?: string
    estateName?: string
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
      email: null, 
      firstName: null, 
      estateName: null,
      lastName: null, 
      
      setResidentData: (data) => set({
        token: data.token,
        organizationId: data.organizationId,
        estateId: data.estateId,
        isResident: true,
        email: data.email || null,
        estateName: data.estateName || null,
        firstName: data.firstName || null,
        lastName: data.lastName || null
      }),
      
      clearResidentData: () => set({
        token: null,
        organizationId: null,
        estateId: null,
        isResident: false,
        email: null,
        firstName: null,
        estateName: null,
        lastName: null
      })
    }),
    {
      name: 'resident-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)