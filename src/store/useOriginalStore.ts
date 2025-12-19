import { create } from 'zustand';

/** 정렬 키 */
export type OriginalSortKey = 'popular' | 'latest' | 'title';

/** 넷플릭스 오리지널 필터 상태 */
export type OriginalFilterState = {
  sort: OriginalSortKey;
  genres: number[]; // TMDB genre id
  countries: string[]; // ISO code
};

type OriginalFilterStore = {
  filters: OriginalFilterState;

  /** 부분 업데이트 */
  setFilters: (next: Partial<OriginalFilterState>) => void;

  /** 초기화 */
  resetFilters: () => void;

  /** URLSearchParams → store 복원 */
  setFromQuery: (query: Record<string, string>) => void;
};

const initialFilters: OriginalFilterState = {
  sort: 'popular',
  genres: [],
  countries: [],
};

export const useOriginalFilterStore = create<OriginalFilterStore>((set) => ({
  filters: initialFilters,

  setFilters: (next) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...next,
      },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  setFromQuery: (query) => {
    const sortBy = query.sort_by;

    const sort: OriginalSortKey =
      sortBy === 'original_title.asc'
        ? 'title'
        : sortBy === 'primary_release_date.desc'
        ? 'latest'
        : 'popular';

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
