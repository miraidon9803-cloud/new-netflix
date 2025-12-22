import { create } from "zustand";
import type { MovieState } from "../types/movie";

//vite
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
//cra process.env.변수
export const useMovieStore = create<MovieState>((set) => ({
  //인기 영화 목록을 불러서 저장할 변수
  movies: [],
  videos: [],
  tvs: [],
  seasons: [],

  //인기 영화 불러올 메서드
  onFetchPopular: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=-US&page=1`
    );
    const data = await res.json();
    console.log("인기영화", data.results);
    set({ movies: data.results });
  },

  //예고편 영상 가져오기
  onFetchVideo: async (id: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    console.log(data.results);
    set({ videos: data.results });
    return data.results;
  },

  //시리즈 tv 영상 불러올 메서드
  onFetchTvs: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await res.json();
    console.log("인기 tv", data.results);
    set({ tvs: data.results });
  },

  onFetchTvVideos: async (id) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}&language=en-US&page=1`
    );
    const data = await res.json();
    console.log(data);
    set({ videos: data.results });
  },

  //시리즈 시즌
  onFetchSeasons: async (id) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    console.log("시즌", data);
    set({ seasons: data.seasons });
  },

  //시즌 에피소드
  episodes: [],
  onFetchEpisodes: async (id, season) => {
    const res = await fetch(`h`);
  },
}));
