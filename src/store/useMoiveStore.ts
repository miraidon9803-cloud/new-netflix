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

/* ================== CREDITS TYPES ================== */
export type CreditCast = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null; // ✅ undefined 허용
};

export type CreditCrew = {
  id: number;
  name: string;
  job?: string;
  department?: string;
};

export type Credits = {
  cast: CreditCast[];
  crew: CreditCrew[];
};

export type Keyword = {
  id: number;
  name: string;
};

/* ================== STORE TYPE ================== */
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

  /* ================== CREDITS ================== */
  movieCredits: Credits | null;
  tvCredits: Credits | null;

  /* ================== KEYWORDS & SIMILAR ================== */
  movieKeywords: Keyword[];
  tvKeywords: Keyword[];
  movieSimilar: Movie[];
  tvSimilar: Movie[];
  movieSimilarId: string | null;
  tvSimilarId: string | null;

  /* ================== ACTION ================== */
  fetchPopularMovies: () => Promise<void>;
  fetchMovieDetail: (id: string) => Promise<void>;
  fetchTvDetail: (id: string) => Promise<void>;
  fetchMovieRating: (id: string) => Promise<void>;
  fetchTvRating: (id: string) => Promise<void>;

  // return Video[] + (선택) seasonNumber 지원
  fetchVideos: (
    id: string,
    type: "movie" | "tv",
    seasonNumber?: number
  ) => Promise<Video[]>;

  fetchSeasons: (tvId: string) => Promise<void>;
  fetchEpisodes: (tvId: string, season: number) => Promise<void>;

  fetchMovieCredits: (id: string) => Promise<void>;
  fetchTvCredits: (id: string) => Promise<void>;

  fetchMovieKeywords: (id: string) => Promise<void>;
  fetchTvKeywords: (id: string) => Promise<void>;

  fetchMovieSimilar: (id: string) => Promise<void>;
  fetchTvSimilar: (id: string) => Promise<void>;

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

  movieKeywords: [],
  tvKeywords: [],
  movieSimilar: [],
  tvSimilar: [],
  movieSimilarId: null,
  tvSimilarId: null,

  movieCredits: null,
  tvCredits: null,

  /* ================== MOVIE LIST ================== */
  fetchPopularMovies: async () => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();

    const enriched = await Promise.all(
      (data.results ?? []).map(async (movie: Movie) => {
        // 연령(Release Dates)
        const ageRes = await fetch(
          `${BASE_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const ageData = await ageRes.json();

        const kr =
          ageData.results?.find((r: any) => r.iso_3166_1 === "KR")
            ?.release_dates?.[0]?.certification ?? null;

        // 로고 (Images)
        const logoRes = await fetch(
          `${BASE_URL}/movie/${movie.id}/images?api_key=${API_KEY}`
        );
        const logoData = await logoRes.json();
        const logo = logoData.logos?.[0]?.file_path ?? null;

        // ⚠️ Movie 타입에 rating/logo가 없으면 types/movie 쪽에 추가하거나,
        // 여기서 as any로 캐스팅 처리 필요할 수 있어요.
        return { ...(movie as any), rating: kr, logo } as Movie;
      })
    );

    set({ movies: enriched });
  },

  /* ================== DETAIL ================== */
  fetchMovieDetail: async (id: string) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ movieDetail: data });
  },

  fetchTvDetail: async (id: string) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ tvDetail: data });
  },

  /* ================== RATING ================== */
  fetchMovieRating: async (id: string) => {
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

  fetchTvRating: async (id: string) => {
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
  fetchVideos: async (
    id: string,
    type: "movie" | "tv",
    seasonNumber?: number
  ) => {
    if (!API_KEY) {
      set({ videos: [] });
      return [];
    }

    const endpoint =
      type === "tv" && typeof seasonNumber === "number"
        ? `${BASE_URL}/tv/${id}/season/${seasonNumber}/videos`
        : `${BASE_URL}/${type}/${id}/videos`;

    // 1) ko
    const koRes = await axios.get(endpoint, {
      params: { api_key: API_KEY, language: "ko-KR" },
    });

    const koList = (koRes.data?.results ?? []) as Video[];
    if (koList.length > 0) {
      set({ videos: koList });
      return koList;
    }

    // 2) en fallback
    const enRes = await axios.get(endpoint, {
      params: { api_key: API_KEY, language: "en-US" },
    });

    const enList = (enRes.data?.results ?? []) as Video[];
    set({ videos: enList });
    return enList;
  },

  /* ================== TV ONLY ================== */
  fetchSeasons: async (tvId: string) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ seasons: data.seasons ?? [] });
  },

  fetchEpisodes: async (tvId: string, season: number) => {
    if (!API_KEY) return;

    const res = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${season}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    set({ episodes: data.episodes ?? [] });
  },

  /* ================== CREDITS ================== */
  fetchMovieCredits: async (id: string) => {
    if (!API_KEY) return;
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      set({ movieCredits: data });
    } catch {
      set({ movieCredits: null });
    }
  },

  fetchTvCredits: async (id: string) => {
    if (!API_KEY) return;
    try {
      const res = await fetch(
        `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      set({ tvCredits: data });
    } catch {
      set({ tvCredits: null });
    }
  },

  /* ================== KEYWORDS ================== */
  fetchMovieKeywords: async (id: string) => {
    if (!API_KEY) return;

    try {
      const res = await axios.get(`${BASE_URL}/movie/${id}/keywords`, {
        params: { api_key: API_KEY },
      });
      set({ movieKeywords: res.data?.keywords ?? [] });
    } catch {
      set({ movieKeywords: [] });
    }
  },

  fetchTvKeywords: async (id: string) => {
    if (!API_KEY) return;

    try {
      const res = await axios.get(`${BASE_URL}/tv/${id}/keywords`, {
        params: { api_key: API_KEY },
      });
      set({ tvKeywords: res.data?.results ?? [] });
    } catch {
      set({ tvKeywords: [] });
    }
  },

  /* ================== SIMILAR ================== */
  fetchMovieSimilar: async (id: string) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=ko-KR&page=1`
      );
      const data = await res.json();
      set({ movieSimilar: data.results ?? [], movieSimilarId: id });
    } catch {
      set({ movieSimilar: [] });
    }
  },

  fetchTvSimilar: async (id: string) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}&language=ko-KR&page=1`
      );
      const data = await res.json();
      set({ tvSimilar: data.results ?? [], tvSimilarId: id });
    } catch {
      set({ tvSimilar: [] });
    }
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
      movieCredits: null,
      tvCredits: null,
      movieKeywords: [],
      tvKeywords: [],
      movieSimilar: [],
      tvSimilar: [],
      movieSimilarId: null,
      tvSimilarId: null,
    }),
}));
