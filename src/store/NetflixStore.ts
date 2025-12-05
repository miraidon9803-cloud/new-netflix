import { create } from "zustand";
import type { NetflixState } from "../types/netflix";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useNetflixStorte = create<NetflixState>((set) => ({
  original: [],

  //넷플릭스 오리지날 불러올 메서드
  onFetchOriginal: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?with_networks=213&api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    console.log("넷플릭스 오리지널", data.results);

    set({ original: data.results });
  },
}));
