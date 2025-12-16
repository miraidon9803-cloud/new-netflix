// types/movie.ts

export interface MediaBase {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  adult: boolean;
}

export interface Movie extends MediaBase {
  title: string;
}

export interface Tv extends MediaBase {
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieState {
  movies: Movie[];
  videos: Video[];
  onFetchPopular: () => Promise<void>;
  onFetchVideo: (id: string) => Promise<void>;
}
