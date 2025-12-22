const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';

export type MovieItem = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
};

type MovieResponse = {
  results: MovieItem[];
};

const getRandomPage = (max = 10) => String(Math.floor(Math.random() * max) + 1);

const qs = (params: Record<string, string>) =>
  new URLSearchParams({
    api_key: API_KEY,
    language: 'ko-KR',
    ...params,
  }).toString();

/** 🇰🇷 한국 영화 (성인 제외 + 랜덤) */
/** 🇰🇷 한국 영화 (성인 제외 + 랜덤) */
export const fetchKoreaMovies = async () => {
  const page = getRandomPage();

  const url = `${BASE}/discover/movie?${qs({
    with_origin_country: 'KR',
    include_adult: 'false',
    without_genres: '10749',
    sort_by: 'popularity.desc',
    page,
  })}`;

  console.log('[TMDB][KOREA] request url:', url);

  const res = await fetch(url);
  const data = (await res.json()) as MovieResponse;

  console.log('[TMDB][KOREA] page:', page, 'count:', data.results?.length ?? 0);

  console.log(
    '[TMDB][KOREA] titles:',
    (data.results ?? []).map((m) => ({
      id: m.id,
      title: m.title,
      vote: m.vote_average,
      release: m.release_date,
    }))
  );

  return data;
};

/** 🌍 해외 영화 (랜덤) */
export const fetchNotKoreaMovies = async () => {
  const res = await fetch(
    `${BASE}/discover/movie?${qs({
      without_origin_country: 'KR',
      include_adult: 'false',
      sort_by: 'popularity.desc',
      page: getRandomPage(),
    })}`
  );
  return (await res.json()) as MovieResponse;
};

/** 🕵️ 미스터리 (랜덤) */
export const fetchMisteryMovies = async () => {
  const res = await fetch(
    `${BASE}/discover/movie?${qs({
      with_genres: '9648',
      include_adult: 'false',
      sort_by: 'popularity.desc',
      page: getRandomPage(),
    })}`
  );
  return (await res.json()) as MovieResponse;
};

/** 😂 코미디 (랜덤) */
export const fetchFunMovies = async () => {
  const res = await fetch(
    `${BASE}/discover/movie?${qs({
      with_genres: '35',
      include_adult: 'false',
      sort_by: 'popularity.desc',
      page: getRandomPage(),
    })}`
  );
  return (await res.json()) as MovieResponse;
};

/** 🏆 수상/평점 높은 영화 (랜덤) */
export const fetchAwardMovies = async () => {
  const res = await fetch(
    `${BASE}/discover/movie?${qs({
      sort_by: 'vote_average.desc',
      'vote_average.gte': '7.8',
      'vote_count.gte': '2000',
      include_adult: 'false',
      page: getRandomPage(5), // 🔸 고평점은 페이지 적게
    })}`
  );
  return (await res.json()) as MovieResponse;
};

/** 🔥 인기순 영화 (랜덤) */
export const fetchPopularFocusMovies = async () => {
  const res = await fetch(
    `${BASE}/discover/movie?${qs({
      sort_by: 'popularity.desc',
      include_adult: 'false',
      page: getRandomPage(),
    })}`
  );
  return (await res.json()) as MovieResponse;
};
