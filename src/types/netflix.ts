// src/types/netflix.ts

export interface MediaItem {
  id: number;
  name?: string; // TV
  title?: string; // 영화
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  first_air_date?: string; // TV
  release_date?: string; // Movie
  adult?: boolean;
  scr: string;
  media_type: 'movie' | 'tv';
}

// 넷플릭스 Top10도 같은 형태로 쓸거면 재사용해도 되고,
// 따로 TVItem 타입을 만들어도 됨.
export interface NetflixState {
  original: MediaItem[];
  netflixTop10: MediaItem[];
  movieTop10: MediaItem[];
  SeriesTop10: MediaItem[];
  SFNFTop10: MediaItem[];
  onFetchOriginal: () => Promise<void>;
  onFetchNetflixTop10: () => Promise<void>;
  onFetchMovieTop10: () => Promise<void>;
  onFetchSeriesTop10: () => Promise<void>;
  onFetchSFTop10: () => Promise<void>;
}
