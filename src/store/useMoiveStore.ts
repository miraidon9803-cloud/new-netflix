import { create } from "zustand";
import type { MovieState } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  videos: [],
  seasons: [],
  episodes: [],

  // ✅ 추가: 영화 상세
  movieDetail: null,
  onFetchMovieDetail: async (id: string) => {
    if (!API_KEY) return;

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ movieDetail: data });
  },

  // ✅ 기존: TV 상세
  tvDetail: null,
  onFetchTvDetail: async (id: string) => {
    if (!API_KEY) return;

    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ tvDetail: data });
  },

  // 인기 영화
  onFetchPopular: async () => {
    if (!API_KEY) return;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();

    const movieExtra = await Promise.all(
      data.results.map(async (movie: any) => {
        const resAge = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const dataAge = await resAge.json();
        const krInfo = dataAge.results?.find(
          (item: any) => item.iso_3166_1 === "KR"
        );
        const cAge = krInfo?.release_dates?.[0]?.certification || "none";

        const resLogo = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${API_KEY}`
        );
        const dataLogo = await resLogo.json();
        const logo = dataLogo.logos?.[0]?.file_path || null;

        return { ...movie, cAge, logo };
      })
    );

    set({ movies: movieExtra });
  },
  tvRating: null,
  onFetchTvRating: async (tvId: string) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/content_ratings?api_key=${API_KEY}`
      );
      const data = await res.json();

      const results = data?.results ?? [];
      const kr = results.find((r: any) => r.iso_3166_1 === "KR")?.rating;
      const us = results.find((r: any) => r.iso_3166_1 === "US")?.rating;
      const first = results[0]?.rating;

      set({ tvRating: kr ?? us ?? first ?? null });
    } catch {
      set({ tvRating: null });
    }
  },

  // 영화 비디오
  onFetchVideo: async (id: string) => {
    if (!API_KEY) return [];
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ videos: data.results ?? [] });
    return data.results ?? [];
  },

  // TV 시즌 목록
  onFetchSeason: async (id: string) => {
    if (!API_KEY) return;
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ seasons: data.seasons ?? [] });
  },

  // TV 에피소드 목록
  onFetchEpisode: async (id: string, season: number) => {
    if (!API_KEY) return;
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ episodes: data.episodes ?? [] });
  },
}));
