const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

type Params = Record<string, string | number | boolean | undefined>;

export type TVItem = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date?: string;
  original_language?: string;
};

export type TMDBDiscoverResponse = {
  page: number;
  results: TVItem[];
  total_pages: number;
  total_results: number;
};

/**
 * 최신 TV 시리즈 (첫 방영일 필터 제거, 최신순 정렬)
 * - TMDB discover는 기본적으로 page당 20개 반환
 */
export async function fetchRecentTVSeries2025(params: Params = {}) {
  const qs = new URLSearchParams({
    api_key: API_KEY,
    language: 'ko-KR',
    include_adult: 'false',

    // ✅ 최신순 정렬만 유지
    sort_by: 'first_air_date.desc',

    ...Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${BASE}/discover/tv?${qs.toString()}`;
  console.log('[TMDB][recent tv] URL:', url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

  const data = (await res.json()) as TMDBDiscoverResponse;

  // ✅ 최소 필터: 포스터 있는 것만 (빈 배열 방지에 도움)
  const filteredResults = (data.results ?? []).filter((tv) => !!tv.poster_path);

  console.log('[TMDB][recent tv] raw count:', data.results?.length ?? 0);
  console.log('[TMDB][recent tv] filtered count:', filteredResults.length);

  return {
    ...data,
    results: filteredResults, // 최대 20개
  };
}
