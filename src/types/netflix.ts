export interface Original {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  adult: boolean;
}
export interface NetflixState {
  original: Original[];
  onFetchOriginal: () => Promise<void>;
}
