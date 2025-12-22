// src/components/MovieBanner.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistPopup from '../WishlistPopup';
import './scss/MovieBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const IMG_POSTER = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_BG = '/images/icon/no_poster.png';

type MovieListItem = {
  id: number;
  title?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
};

type MovieListResponse = {
  results: MovieListItem[];
};

type BannerItem = {
  id: number;
  title?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path?: string | null;
};

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const MovieBanner: React.FC = () => {
  const [item, setItem] = useState<BannerItem | null>(null);
  const navigate = useNavigate();

  // 위시리스트 팝업 상태
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchRandomMovieBanner = async () => {
      try {
        const [nowRes, popRes] = await Promise.all([
          fetch(`${BASE}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`),
          fetch(`${BASE}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`),
        ]);

        if (!nowRes.ok || !popRes.ok) return;

        const nowData = (await nowRes.json()) as MovieListResponse;
        const popData = (await popRes.json()) as MovieListResponse;

        const merged = [...nowData.results, ...popData.results]
          .filter((m) => m.id && m.backdrop_path)
          .reduce<MovieListItem[]>((acc, cur) => {
            if (!acc.some((x) => x.id === cur.id)) acc.push(cur);
            return acc;
          }, []);

        if (!mounted || !merged.length) return;

        const picked = pickRandom(merged);
        const detailRes = await fetch(
          `${BASE}/movie/${picked.id}?api_key=${API_KEY}&language=ko-KR`
        );
        if (!detailRes.ok) return;

        const detail = (await detailRes.json()) as BannerItem;
        if (mounted) setItem(detail);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRandomMovieBanner();
    return () => {
      mounted = false;
    };
  }, []);

  if (!item) return null;

  const imgSrc = item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : FALLBACK_BG;
  const displayTitle = item.title ?? '';
  
  const onClickPlay = () => navigate(`/movie/${item.id}`);

  // 위시리스트 버튼 클릭 핸들러
  const handleWishlistClick = () => {
    setShowWishlistPopup(true);
  };

  return (
    <>
      <section className="movie-banner">
        <img className="movie-bg" src={imgSrc} alt="" draggable={false} />

        <div className="movie-banner-inner">
          <div className="movie-bannertxt">
            <h2>{displayTitle}</h2>
            <h3>{item.overview}</h3>
          </div>

          <div className="movie-banner-btns">
            {/* 재생 버튼 */}
            <button className="play" onClick={onClickPlay}>
              <span className="ico">
                <img className="icon" src="/images/icon/play.png" alt="" />
                <img className="icon-hover" src="/images/icon/play-hover.png" alt="" />
              </span>
              재생
            </button>

            {/* 위시리스트 버튼 */}
            <button className="wish" onClick={handleWishlistClick}>
              <span className="ico">
                <img className="icon" src="/images/icon/heart.png" alt="" />
                <img className="icon-hover" src="/images/icon/heart-active.png" alt="" />
              </span>
              위시리스트
            </button>
          </div>
        </div>
      </section>

      {/* 위시리스트 팝업 */}
      {showWishlistPopup && item && (
        <WishlistPopup
          content={{
            id: item.id,
            title: displayTitle,
            poster_path: item.poster_path ? `${IMG_POSTER}${item.poster_path}` : null,
            media_type: 'movie',
          }}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </>
  );
};

export default MovieBanner;