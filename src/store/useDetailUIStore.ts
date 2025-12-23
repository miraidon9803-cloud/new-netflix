import { create } from "zustand";

type ActiveTab = "에피소드" | "비슷한콘텐츠" | "관련클립";

interface DetailUIState {
  // Season state
  activeSeason: number | null;
  seasonOpen: boolean;

  // Video state
  selectedVideoKey: string | null;
  play: boolean;
  playerNonce: number;

  // Tab state
  activeTab: ActiveTab;

  // More info state
  moreOpen: boolean;

  // Actions
  setActiveSeason: (season: number | null) => void;
  setSeasonOpen: (open: boolean) => void;
  toggleSeasonOpen: () => void;

  setSelectedVideoKey: (key: string | null) => void;
  setPlay: (play: boolean) => void;
  refreshPlayer: () => void;

  setActiveTab: (tab: ActiveTab) => void;

  setMoreOpen: (open: boolean) => void;
  toggleMoreOpen: () => void;

  resetPlayer: () => void;
}

export const useDetailUIStore = create<DetailUIState>((set) => ({
  // Initial state
  activeSeason: null,
  seasonOpen: false,
  selectedVideoKey: null,
  play: false,
  playerNonce: 0,
  activeTab: "에피소드",
  moreOpen: false,

  // Season actions
  setActiveSeason: (season) => set({ activeSeason: season }),
  setSeasonOpen: (open) => set({ seasonOpen: open }),
  toggleSeasonOpen: () => set((state) => ({ seasonOpen: !state.seasonOpen })),

  // Video actions
  setSelectedVideoKey: (key) => set({ selectedVideoKey: key }),
  setPlay: (play) => set({ play }),
  refreshPlayer: () => set({ playerNonce: Date.now() }),

  // Tab actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  // More info actions
  setMoreOpen: (open) => set({ moreOpen: open }),
  toggleMoreOpen: () => set((state) => ({ moreOpen: !state.moreOpen })),

  // Reset player
  resetPlayer: () =>
    set({
      play: false,
      selectedVideoKey: null,
      playerNonce: Date.now(),
    }),
}));
