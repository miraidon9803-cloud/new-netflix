import { create } from "zustand";
interface UserState {
  profileId: string;
  onSetProfile: (id: string) => void;
}
export const useUserStore = create<UserState>((set) => ({
  profileId: "mom",
  onSetProfile: (id) => set({ profileId: id }),
}));
