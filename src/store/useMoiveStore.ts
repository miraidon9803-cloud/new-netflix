import { create } from "zustand";
import type {
  Movie,
  MovieDetail,
  TvDetail,
  Season,
  Episode,
  Video,
} from "../types/movie";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type MovieStore = {
  /* ================== LIST ================== */
  movies: Movie[];

  /* ================== DETAIL ================== */
  movieDetail: MovieDetail | null;
  tvDetail: TvDetail | null;

  /* ================== RATING ================== */
  movieRating: string | null;
  tvRating: string | null;

  /* ================== MEDIA ================== */
  videos: Video[];

  /* ================== TV ONLY ================== */
  seasons: Season[];
  episodes: Episode[];

  /* ================== ACTION ================== */
  fetchPopularMovies: () => Promise<void>;
  fetchMovieDetail: (id: string) => Promise<void>;
  fetchTvDetail: (id: string) => Promise<void>;
  fetchMovieRating: (id: string) => Promise<void>;
  fetchTvRating: (id: string) => Promise<void>;
  fetchVideos: (id: string, type: "movie" | "tv") => Promise<void>;
  fetchSeasons: (tvId: string) => Promise<void>;
  fetchEpisodes: (tvId: string, season: number) => Promise<void>;
  clearDetail: () => void;
};

export const useMovieStore = create<MovieStore>((set) => ({
  /* ================== STATE ================== */
  movies: [],

  movieDetail: null,
  tvDetail: null,

  movieRating: null,
  tvRating: null,

  videos: [],
  seasons: [],
  episodes: [],

  /* ================== MOVIE LIST ================== */
  fetchPopularMovies: async () => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();

    const enriched = await Promise.all(
      data.results.map(async (movie: Movie) => {
        // 🔹 연령 등급
        const ageRes = await fetch(
          `${BASE_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const ageData = await ageRes.json();

        const kr = ageData.results?.find((r: any) => r.iso_3166_1 === "KR")
          ?.release_dates?.[0]?.certification;

        // 🔹 로고
        const logoRes = await fetch(
          `${BASE_URL}/movie/${movie.id}/images?api_key=${API_KEY}`
        );
        const logoData = await logoRes.json();
        const logo = logoData.logos?.[0]?.file_path ?? null;

        return { ...movie, rating: kr ?? null, logo };
      })
    );

    set({ movies: enriched });
  },

  /* ================== DETAIL ================== */
  fetchMovieDetail: async (id) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ movieDetail: data });
  },

  fetchTvDetail: async (id) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ tvDetail: data });
  },

  /* ================== RATING ================== */
  fetchMovieRating: async (id) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`
      );
      const data = await res.json();

      const results = data.results ?? [];
      const kr =
        results.find((r: any) => r.iso_3166_1 === "KR")?.release_dates?.[0]
          ?.certification ?? null;
      const us =
        results.find((r: any) => r.iso_3166_1 === "US")?.release_dates?.[0]
          ?.certification ?? null;

      set({ movieRating: kr || us });
    } catch {
      set({ movieRating: null });
    }
  },

  fetchTvRating: async (id) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `${BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}`
      );
      const data = await res.json();

      const results = data.results ?? [];
      const kr = results.find((r: any) => r.iso_3166_1 === "KR")?.rating;
      const us = results.find((r: any) => r.iso_3166_1 === "US")?.rating;

      set({ tvRating: kr || us || null });
    } catch {
      set({ tvRating: null });
    }
  },

  /* ================== MEDIA ================== */
  fetchVideos: async (id: string, type: "movie" | "tv") => {
    const koRes = await axios.get(`${BASE_URL}/${type}/${id}/videos`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });

    if (koRes.data.results.length > 0) {
      set({ videos: koRes.data.results });
      return;
    }

    // 2️⃣ 영어 fallback
    const enRes = await axios.get(`${BASE_URL}/${type}/${id}/videos`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
    });

    set({ videos: enRes.data.results });
  },
  /* ================== TV ONLY ================== */
  fetchSeasons: async (tvId) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ seasons: data.seasons ?? [] });
  },

  fetchEpisodes: async (tvId, season) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${season}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ episodes: data.episodes ?? [] });
  },

  /* ================== CLEAN ================== */
  clearDetail: () =>
    set({
      movieDetail: null,
      tvDetail: null,
      seasons: [],
      episodes: [],
      videos: [],
      movieRating: null,
      tvRating: null,
    }),
}));
