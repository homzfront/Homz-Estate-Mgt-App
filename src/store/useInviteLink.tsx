// store/useInviteLink.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InviteLinkEntry {
  link: string;
  fetchedAt: number;
}

interface InviteLinkState {
  links: Record<string, InviteLinkEntry>; // key = estateId
  setInviteLink: (estateId: string, link: string) => void;
  getInviteLink: (estateId: string) => InviteLinkEntry | undefined;
  clearInviteLink: (estateId: string) => void;
}

export const useInviteLinkStore = create<InviteLinkState>()(
  persist(
    (set, get) => ({
      links: {},
      setInviteLink: (estateId, link) =>
        set((state) => ({
          links: {
            ...state.links,
            [estateId]: { link, fetchedAt: Date.now() },
          },
        })),
      getInviteLink: (estateId) => get().links[estateId],
      clearInviteLink: (estateId) =>
        set((state) => {
          const { [estateId]:_, ...rest } = state.links;
          console.log(_)
          return { links: rest };
        }),
    }),
    {
      name: "invite-link-store", // key in localStorage
    }
  )
);
