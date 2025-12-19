import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/MovieBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const FALLBACK_BG = '/images/icon/no_poster.png';

type MovieListItem = {
  id: number;
  title?: string;
  overview?: string;
  backdrop_path?: string | null;
};

type MovieListResponse = {
  results: MovieListItem[];
};

type BannerItem = {
  id: number;
  title?: string;
  overview: string;
  backdrop_path: string | null;
};

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const MovieBanner: React.FC = () => {
  const [item, setItem] = useState<BannerItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchRandomMovieBanner = async () => {
      try {
        // ✅ 후보 풀: now_playing + popular
        const [nowRes, popRes] = await Promise.all([
          fetch(`${BASE}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`),
          fetch(`${BASE}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`),
        ]);

        if (!nowRes.ok) throw new Error(`TMDB now_playing error: ${nowRes.status}`);
        if (!popRes.ok) throw new Error(`TMDB popular error: ${popRes.status}`);

        const nowData = (await nowRes.json()) as MovieListResponse;
        const popData = (await popRes.json()) as MovieListResponse;

        // ✅ backdrop 있는 애들만 + 중복 제거
        const merged = [...(nowData.results ?? []), ...(popData.results ?? [])]
          .filter((m) => m?.id && m.backdrop_path)
          .reduce<MovieListItem[]>((acc, cur) => {
            if (acc.some((x) => x.id === cur.id)) return acc;
            acc.push(cur);
            return acc;
          }, []);

        if (!mounted || !merged.length) return;

        const picked = pickRandom(merged);

        // ✅ 상세 재요청
        const detailRes = await fetch(
          `${BASE}/movie/${picked.id}?api_key=${API_KEY}&language=ko-KR`
        );
        if (!detailRes.ok) throw new Error(`TMDB detail error: ${detailRes.status}`);

        const detail = (await detailRes.json()) as BannerItem;
        if (!mounted) return;

        setItem(detail);
      } catch (err) {
        console.error('[MovieBanner] error:', err);
      }
    };

    fetchRandomMovieBanner();

    return () => {
      mounted = false;
    };
  }, []);

  if (!item) return null;

  const displayTitle = item.title ?? '';
  const imgSrc = item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : FALLBACK_BG;

  /** ✅ 재생 버튼 클릭 → Movie 상세 페이지 */
  const onClickPlay = () => {
    navigate(`/movie/${item.id}`);
  };

  return (
    <section className="movie-banner">
      <img
        className="movie-bg"
        src={imgSrc}
        alt={displayTitle}
        draggable={false}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_BG;
        }}
      />

      <div className="movie-banner-inner">
        <div className="movie-bannertxt">
          <h2>{displayTitle}</h2>
          <h3>{item.overview}</h3>
        </div>

        <div className="movie-banner-btns">
          <button className="play" type="button" onClick={onClickPlay}>
            <img src="/images/icon/play.png" alt="play" draggable={false} />
            재생
          </button>

          <button className="wish" type="button">
            <img src="/images/icon/heart.png" alt="wishlist" draggable={false} />
            위시리스트
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieBanner;
