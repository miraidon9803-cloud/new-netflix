const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetch2025Movies = async () => {
  const res = await fetch(
    `${BASE_URL}/discover/movie` +
      `?api_key=${API_KEY}` +
      `&release_date.gte=2020-01-01` +
      `&release_date.lte=2025-12-31` +
      `&language=ko-KR` +
      `&sort_by=popularity.desc`
  );

  if (!res.ok) {
    const text = await res.text();
    console.log("TMDB ERROR", res.status, text);
    throw new Error("영화 데이터를 불러오지 못했습니다");
  }

  const data = await res.json();
  return data.results;
};

export const fetch2025Tv = async () => {
  const res = await fetch(
    `${BASE_URL}/discover/tv` +
      `?api_key=${API_KEY}` +
      `&first_air_date.gte=2020-01-01` +
      `&first_air_date.lte=2025-12-31` +
      `&language=ko-KR` +
      `&sort_by=popularity.desc`
  );

  if (!res.ok) {
    const text = await res.text();
    console.log("TMDB ERROR", res.status, text);
    throw new Error("드라마 데이터를 불러오지 못했습니다");
  }

  const data = await res.json();
  return data.results;
};
