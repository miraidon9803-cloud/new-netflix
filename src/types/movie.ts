export interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;

  // store에서 추가하는 필드 (없을 수도 있어서 optional)
  cAge?: string;
  logo?: string | null;
}

// video 타입 (✅ 주석 제거하고 실제로 사용)
export interface Video {
  id: string;
  key: string; // 유튜브 키
  name: string;
  site: string; // YouTube 등
  type: string; // Trailer, Teaser 등
  official: string;
}

// TV 타입
export interface TV {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  adult: boolean;
}

// Season
export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  poster_path: string;
}

// Episode
export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null; // TMDB에서 null일 수 있음
}
export interface Genre {
  id: number;
  name: string;
}

export interface TvDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  seasons: Season[];
  genres: Genre[];
  vote_average?: number;
  runtime?: number;
}
export interface TvListItem {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  adult?: boolean;
  origin_country?: string[];
}
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  genres: Genre[];
}

export interface MovieState {
  movies: Movie[];
  videos: Video[];
  seasons: Season[];
  episodes: Episode[];
  tvDetail: TvDetail | null;
  tvRating?: string | null;

  movieDetail: MovieDetail | null;
  onFetchMovieDetail: (id: string) => Promise<void>;
  onFetchPopular: () => Promise<void>;
  onFetchVideo: (id: string) => Promise<Video[]>;
  onFetchSeason: (id: string) => Promise<void>;
  onFetchEpisode: (id: string, season: number) => Promise<void>;
  onFetchTvDetail: (id: string) => Promise<void>;
  onFetchTvRating: (id: string) => Promise<void>;
}

export interface NetflixState {
  original: TvListItem[];
  netflixTop10: TvListItem[];
  movieTop10: Movie[]; // 영화는 Movie 타입 써도 OK
  SeriesTop10: TvListItem[];
  SFNFTop10: TvListItem[];
  onFetchOriginal: () => Promise<void>;
  onFetchNetflixTop10: () => Promise<void>;
  onFetchMovieTop10: () => Promise<void>;
  onFetchSeriesTop10: () => Promise<void>;
  onFetchSFTop10: () => Promise<void>;
}
