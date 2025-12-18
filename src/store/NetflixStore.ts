import { create } from 'zustand';
import type { NetflixState, MediaItem } from '../types/netflix';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const NETFLIX_ID = 213;

type Network = { id: number; name?: string };
type Company = { id: number; name?: string };

// ✅ 공통 확장 타입 (뱃지용 플래그 추가)
export type MediaItemWithBadges = MediaItem & {
  networks?: Network[];
  production_companies?: Company[];
  isNetflixOriginal?: boolean;

  // 출시일 기준 뱃지
  releaseDate?: string | null; // tv: first_air_date, movie: release_date
  isNew3Months?: boolean; // 90일 이내
  isOld1Year?: boolean; // 365일 이상
};

const parseDate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getReleaseFlags = (dateStr?: string | null) => {
  const d = parseDate(dateStr);
  if (!d) {
    return { releaseDate: dateStr ?? null, isNew3Months: false, isOld1Year: false };
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  // 미래 날짜(아직 공개 전) → 뱃지 안 붙임
  if (diffMs < 0) {
    return { releaseDate: dateStr ?? null, isNew3Months: false, isOld1Year: false };
  }

  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const isNew3Months = diffDays <= 90;
  const isOld1Year = diffDays >= 365;

  return { releaseDate: dateStr ?? null, isNew3Months, isOld1Year };
};

// ✅ 2025년만 통과
const isReleaseYear2025 = (item: MediaItemWithBadges) => {
  if (!item.releaseDate) return false;
  return item.releaseDate.startsWith('2025');
};

// ✅ TV 상세 → 넷플 판별 + 출시일(first_air_date) 플래그
const enrichTv = async (item: MediaItem): Promise<MediaItemWithBadges> => {
  try {
    const detailRes = await fetch(`${BASE_URL}/tv/${item.id}?api_key=${API_KEY}&language=ko-KR`);
    const detail = await detailRes.json();

    const networks: Network[] = detail?.networks || [];
    const companies: Company[] = detail?.production_companies || [];

    // ✅ Netflix Original 판별 (network 또는 제작사에 Netflix가 있으면 true)
    const isNetflixOriginal =
      networks.some((n) => n.id === NETFLIX_ID) || companies.some((c) => c.id === NETFLIX_ID);

    const releaseDate = (detail?.first_air_date ?? item.first_air_date ?? null) as string | null;
    const flags = getReleaseFlags(releaseDate);

    return {
      ...item,
      networks,
      production_companies: companies,
      isNetflixOriginal,
      ...flags,
    };
  } catch {
    const releaseDate = (item.first_air_date ?? null) as string | null;
    const flags = getReleaseFlags(releaseDate);

    return {
      ...item,
      networks: [],
      production_companies: [],
      isNetflixOriginal: false,
      ...flags,
    };
  }
};

// ✅ Movie 상세 → 넷플 판별 + 출시일(release_date) 플래그
const enrichMovie = async (item: MediaItem): Promise<MediaItemWithBadges> => {
  try {
    const detailRes = await fetch(`${BASE_URL}/movie/${item.id}?api_key=${API_KEY}&language=ko-KR`);
    const detail = await detailRes.json();

    const companies: Company[] = detail?.production_companies || [];

    // ✅ 영화는 제작사로 Netflix 판별
    const isNetflixOriginal = companies.some((c) => c.id === NETFLIX_ID);

    const releaseDate = (detail?.release_date ?? item.release_date ?? null) as string | null;
    const flags = getReleaseFlags(releaseDate);

    return {
      ...item,
      production_companies: companies,
      isNetflixOriginal,
      ...flags,
    };
  } catch {
    const releaseDate = (item.release_date ?? null) as string | null;
    const flags = getReleaseFlags(releaseDate);

    return {
      ...item,
      production_companies: [],
      isNetflixOriginal: false,
      ...flags,
    };
  }
};

// ✅ 여러 페이지를 돌면서 2025년작을 최대 target개까지 채우는 헬퍼
const collect2025Items = async <T extends MediaItemWithBadges>(
  fetchPage: (page: number) => Promise<MediaItem[]>,
  enrichFn: (item: MediaItem) => Promise<T>,
  target = 10,
  maxPages = 5
): Promise<T[]> => {
  const result: T[] = [];
  const seen = new Set<number>();

  for (let page = 1; page <= maxPages; page++) {
    const rawList = await fetchPage(page);
    if (!rawList || rawList.length === 0) break;

    const enriched = await Promise.all(rawList.map(enrichFn));

    for (const item of enriched) {
      if (item?.id == null) continue;
      if (seen.has(item.id)) continue;

      seen.add(item.id);

      if (isReleaseYear2025(item)) {
        result.push(item);
        if (result.length >= target) return result;
      }
    }
  }

  return result;
};

export const useNetflixStore = create<NetflixState>((set) => ({
  original: [],
  netflixTop10: [],
  movieTop10: [],
  SeriesTop10: [],
  SFNFTop10: [],

  // 1) 넷플릭스 오리지널 불러오기
  onFetchOriginal: async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/discover/tv?with_networks=${NETFLIX_ID}&api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();

      console.log('🟥 넷플릭스 오리지널:', data.results);
      set({ original: data.results });
    } catch (err) {
      console.error('넷플릭스 오리지널 오류:', err);
    }
  },

  // 2) 넷플릭스 제공 중 TV 인기 TOP10 (2025년만)
  onFetchNetflixTop10: async () => {
    try {
      const fetchPage = async (page: number) => {
        const res = await fetch(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_watch_providers=8&watch_region=KR&page=${page}`
        );
        const data = await res.json();
        return (data.results || []) as MediaItem[];
      };

      const enriched2025 = await collect2025Items(fetchPage, enrichTv, 10, 5);

      console.log('🟩 넷플 TOP10 (2025 only, enriched):', enriched2025);
      set({ netflixTop10: enriched2025 as any });
    } catch (err) {
      console.error('넷플릭스 TOP10 오류:', err);
    }
  },

  // 3) 오늘의 트렌딩 영화 TOP10 (2025년만)
  onFetchMovieTop10: async () => {
    try {
      const fetchPage = async (page: number) => {
        const res = await fetch(
          `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=ko-KR&page=${page}`
        );
        const data = await res.json();
        return (data.results || []) as MediaItem[];
      };

      const enriched2025 = await collect2025Items(fetchPage, enrichMovie, 10, 5);

      console.log('🎬 영화 TOP10 (2025 only, enriched):', enriched2025);
      set({ movieTop10: enriched2025 as any });
    } catch (err) {
      console.error('영화 TOP10 오류:', err);
    }
  },

  // 4) 오늘의 트렌딩 시리즈 TOP10 (2025년만)
  onFetchSeriesTop10: async () => {
    try {
      const fetchPage = async (page: number) => {
        const res = await fetch(
          `${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=ko-KR&page=${page}`
        );
        const data = await res.json();
        return (data.results || []) as MediaItem[];
      };

      const enriched2025 = await collect2025Items(fetchPage, enrichTv, 10, 5);

      console.log('🎬 시리즈 TOP10 (2025 only, enriched):', enriched2025);
      set({ SeriesTop10: enriched2025 as any });
    } catch (err) {
      console.error('시리즈 TOP10 오류:', err);
    }
  },

  // 5) SF & Fantasy TOP10 (2025년만)
  onFetchSFTop10: async () => {
    try {
      const fetchPage = async (page: number) => {
        const res = await fetch(
          `${BASE_URL}/tv/popular?with_genres=878,14&api_key=${API_KEY}&language=ko-KR&page=${page}`
        );
        const data = await res.json();
        return (data.results || []) as MediaItem[];
      };

      const enriched2025 = await collect2025Items(fetchPage, enrichTv, 10, 5);

      console.log('🎬 SF&Fantasy TOP10 (2025 only, enriched):', enriched2025);
      set({ SFNFTop10: enriched2025 as any });
    } catch (err) {
      console.error('SF TOP10 오류:', err);
    }
  },
}));
