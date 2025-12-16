import { create } from "zustand";
// import type { MovieState } from "../types/movie";np
//TMDB 키

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useMovieStore = create<MovieState>((set) => ({
  // 인기 영화를 저장할 배열
  movies: [],
  videos: [],

  //인기 영화를 가져올 메서드
  onFetchPopular: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();
    console.log("인기영화", data.results);

    //연령, 제목 이미지
    const movieExtra = await Promise.all(
      data.results.map(async (movie) => {
        //1)연령 등급 요청
        const resAge = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const dataAge = await resAge.json();
        console.log("나이가 맞니", dataAge.results);
        const krInfo = dataAge.results.find((item) => item.iso_3166_1 === "KR");
        const cAge = krInfo?.release_dates?.[0].certification || "none";

        //2)로고 이미지
        const resLogo = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${API_KEY}`
        );
        const dataLogo = await resLogo.json();
        console.log("로고이미지", dataLogo);
        const logo = dataLogo.logos?.[0]?.file_path || null;

        return {
          ...movie, //원래 영화 기본정보
          cAge, // 추가한 연령 등급
          logo,
        };
      })
    );
    // set({ movies: data.results })
    set({ movies: movieExtra });
  },

  onFetchVideo: async (id) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    console.log("비디오가져오기", data.results);
    set({ videos: data.results });
    return data.results;
  },
}));
