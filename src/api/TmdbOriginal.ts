const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';

export type NetflixOriginalItem = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date?: string;
  vote_average: number;
};

type DiscoverTVResponse = {
  results: NetflixOriginalItem[];
};

// Netflix Network ID
const NETFLIX_NETWORK_ID = '213';

/** 🎬 넷플릭스 오리지널 시리즈 TOP 10 (✅ 그대로 유지) */
export const fetchNetflixOriginalTop10 = async () => {
  const url =
    `${BASE}/discover/tv?` +
    new URLSearchParams({
      api_key: API_KEY,
      language: 'ko-KR',
      include_adult: 'false',
      with_networks: NETFLIX_NETWORK_ID,
      sort_by: 'popularity.desc',
      page: '1',
    }).toString();

  console.log('[TMDB][Netflix Originals ONLY] URL:', url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

  const data = (await res.json()) as DiscoverTVResponse;

  return (data.results ?? []).filter((item) => item.poster_path).slice(0, 10);
};

/* =========================
   ✅ 추가: 필터 타입 + 정렬 매핑
========================= */
export type OriginalSortKey = 'popular' | 'latest' | 'title';

type OriginalFilterParams = {
  sort?: OriginalSortKey; // store의 sort
  with_genres?: string; // "28,12"
  with_origin_country?: string; // "KR,US"
};

// TV/Movie 정렬 키가 다르니까 분리
const TV_SORT_MAP: Record<OriginalSortKey, string> = {
  popular: 'popularity.desc',
  latest: 'first_air_date.desc',
  title: 'name.asc',
};

const MOVIE_SORT_MAP: Record<OriginalSortKey, string> = {
  popular: 'popularity.desc',
  latest: 'primary_release_date.desc',
  title: 'original_title.asc',
};

/** 🎬 넷플릭스 오리지널 (시리즈 + 영화, ko → en fallback, 첫 로드 60개 원샷 + ✅필터 적용) */
export const fetchNetflixOriginalAll = async (
  startPage = 1,
  targetCount = 60,
  filters: OriginalFilterParams = {}
) => {
  const sortKey: OriginalSortKey = filters.sort ?? 'popular';

  const baseParams = (language?: string) => ({
    api_key: API_KEY,
    include_adult: 'false',
    ...(language ? { language } : {}),
  });

  const fetchTV = async (page: number, language?: string) => {
    const qs = new URLSearchParams({
      ...baseParams(language),
      with_networks: NETFLIX_NETWORK_ID,
      sort_by: TV_SORT_MAP[sortKey],
      page: String(page),

      ...(filters.with_genres ? { with_genres: filters.with_genres } : {}),
      ...(filters.with_origin_country ? { with_origin_country: filters.with_origin_country } : {}),
    });

    const url = `${BASE}/discover/tv?${qs.toString()}`;
    console.log('[TMDB][Netflix Originals TV] URL:', url);

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = (await res.json()) as DiscoverTVResponse;
    return data.results ?? [];
  };

  const fetchMovie = async (page: number, language?: string) => {
    const qs = new URLSearchParams({
      ...baseParams(language),
      with_companies: NETFLIX_NETWORK_ID, // ⚠️ 이건 실제 "넷플릭스 오리지널 영화" 완벽 조건은 아님(회사ID와 네트워크ID는 다름)
      sort_by: MOVIE_SORT_MAP[sortKey],
      page: String(page),

      ...(filters.with_genres ? { with_genres: filters.with_genres } : {}),
      ...(filters.with_origin_country ? { with_origin_country: filters.with_origin_country } : {}),
    });

    const url = `${BASE}/discover/movie?${qs.toString()}`;
    console.log('[TMDB][Netflix Originals MOVIE] URL:', url);

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = (await res.json()) as {
      results: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
      }[];
    };

    return data.results ?? [];
  };

  // ✅ 중복 제거 + 공통 포맷
  const map = new Map<
    string,
    { id: number; type: 'tv' | 'movie'; title: string; poster_path: string; vote_average: number }
  >();

  const pushTV = (item: NetflixOriginalItem) => {
    if (!item?.poster_path) return;
    const key = `tv-${item.id}`;
    if (map.has(key)) return;

    map.set(key, {
      id: item.id,
      type: 'tv',
      title: item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
    });
  };

  const pushMovie = (item: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
  }) => {
    if (!item?.poster_path) return;
    const key = `movie-${item.id}`;
    if (map.has(key)) return;

    map.set(key, {
      id: item.id,
      type: 'movie',
      title: item.title,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
    });
  };

  // ✅ 60개 채울 때까지 페이지 돌기 (ko → en 보충)
  let page = startPage;
  const MAX_PAGES = 10;

  while (map.size < targetCount && page < startPage + MAX_PAGES) {
    const [tvKo, movieKo] = await Promise.all([fetchTV(page, 'ko-KR'), fetchMovie(page, 'ko-KR')]);
    tvKo.forEach(pushTV);
    movieKo.forEach(pushMovie);

    if (map.size < targetCount) {
      const [tvEn, movieEn] = await Promise.all([
        fetchTV(page, 'en-US'),
        fetchMovie(page, 'en-US'),
      ]);
      tvEn.forEach(pushTV);
      movieEn.forEach(pushMovie);
    }

    page += 1;
  }

  const result = Array.from(map.values()).slice(0, targetCount);

  console.log('[TMDB][Netflix Originals ALL]', {
    target: targetCount,
    final: result.length,
    appliedFilters: filters,
  });

  return result;
};
