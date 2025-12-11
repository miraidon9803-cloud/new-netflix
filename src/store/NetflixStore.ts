import { create } from 'zustand';
import type { NetflixState, MediaItem } from '../types/netflix';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const useNetflixStore = create<NetflixState>((set) => ({
  original: [],
  netflixTop10: [],
  movieTop10: [],
  SeriesTop10: [],
  SFNFTop10: [],

  //  1. 넷플릭스 오리지널 불러오기
  onFetchOriginal: async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/discover/tv?with_networks=213&api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();

      console.log('🟥 넷플릭스 오리지널:', data.results);

      set({ original: data.results });
    } catch (err) {
      console.error('넷플릭스 오리지널 오류:', err);
    }
  },

  //  2. 넷플릭스 제공 중 tv시리즈 인기 TOP 10 가져오기
  onFetchNetflixTop10: async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_watch_providers=8&watch_region=KR&page=1`
      );
      const data = await res.json();

      const top10: MediaItem[] = (data.results || []).slice(0, 10);

      // 콘솔로 서버 데이터 확인
      console.log('🟦 넷플릭스 인기 TOP10 TV (원본):', data);
      console.log('🟩 TOP10 배열:', top10);
      console.log(
        '🟨 TOP10 이름 목록:',
        top10.map((t) => t.name)
      );

      set({ netflixTop10: top10 });
    } catch (err) {
      console.error('넷플릭스 TOP10 오류:', err);
    }
  },

  //  3. 오늘의 트렌딩 영화 TOP10 가져오기
  onFetchMovieTop10: async () => {
    try {
      const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=ko-KR`);

      const data = await res.json();

      const top10: MediaItem[] = (data.results || []).slice(0, 10);

      console.log('🎬 오늘의 트렌딩 영화 TOP10:', top10);

      set({ movieTop10: top10 });
    } catch (err) {
      console.error('영화 TOP10 오류:', err);
    }
  },
  //  4. 오늘의 트렌딩 시리즈 TOP10 가져오기
  onFetchSeriesTop10: async () => {
    try {
      const res = await fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=ko-KR`);
      // https://api.themoviedb.org/3/trending/tv/day?language=en-US

      const data = await res.json();

      const stop10: MediaItem[] = (data.results || []).slice(0, 10);

      console.log('🎬 오늘의 트렌딩 시리즈 TOP10:', stop10);

      set({ SeriesTop10: stop10 });
    } catch (err) {
      console.error('영화 TOP10 오류:', err);
    }
  },
  onFetchSFTop10: async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tv/popular?with_genres=878,14&api_key=${API_KEY}&language=ko-KR`
      );
      // https://api.themoviedb.org/3&api_key=API_KEY

      const data = await res.json();

      const sftop10: MediaItem[] = (data.results || []).slice(0, 10);

      console.log('🎬 오늘의 SF&Fantasy 시리즈 TOP10:', sftop10);

      set({ SFNFTop10: sftop10 });
    } catch (err) {
      console.error('SF TOP10 오류:', err);
    }
  },
}));
