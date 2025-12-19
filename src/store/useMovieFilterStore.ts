import { create } from 'zustand';

export type SortKey = 'latest' | 'title' | 'popular';

export type MovieFilterState = {
  sort: SortKey;
  genres: number[];
  countries: string[];
};

type MovieFilterStore = {
  filters: MovieFilterState;

  // ✅ 일부만 덮어쓰기(패치) 또는 통째로 교체 둘 다 가능하게
  setFilters: (next: MovieFilterState | Partial<MovieFilterState>) => void;

  // ✅ 초기화
  resetFilters: () => void;

  // ✅ (선택) URLSearchParams로 들어온 값을 store로 복원
  setFromQuery: (query: Record<string, string>) => void;
};

const initialFilters: MovieFilterState = {
  sort: 'latest',
  genres: [],
  countries: [],
};

export const useMovieFilterStore = create<MovieFilterStore>((set, get) => ({
  filters: initialFilters,

  setFilters: (next) => {
    const prev = get().filters;

    // next가 Partial이면 합쳐서 저장
    const merged =
      typeof next === 'object' && !Array.isArray(next)
        ? { ...prev, ...(next as Partial<MovieFilterState>) }
        : (next as MovieFilterState);

    set({ filters: merged });
  },

  resetFilters: () => set({ filters: initialFilters }),

  setFromQuery: (query) => {
    // query 예시:
    // sort_by=primary_release_date.desc
    // with_genres=28,35
    // with_origin_country=KR,US

    const sortBy = query.sort_by;

    // sort_by → store sort로 역변환
    const sort: SortKey =
      sortBy === 'original_title.asc'
        ? 'title'
        : sortBy === 'popularity.desc'
        ? 'popular'
        : 'latest';

    const genres =
      query.with_genres
        ?.split(',')
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n)) ?? [];

    const countries = query.with_origin_country?.split(',').filter(Boolean) ?? [];

    set({
      filters: {
        sort,
        genres,
        countries,
      },
    });
  },
}));
