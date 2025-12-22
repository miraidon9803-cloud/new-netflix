// src/components/OriginalBanner.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNetflixOriginalAll } from '../../api/TmdbOriginal';
import WishlistPopup from '../WishlistPopup';
import './scss/OriginalBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const IMG_POSTER = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_BG = '/images/icon/no_poster.png';

type OriginalPick = {
  id: number;
  type: 'tv' | 'movie';
  title: string;
  poster_path: string;
  vote_average: number;
};

type BannerDetail = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path?: string | null;
};

type BannerState = BannerDetail & { type: 'tv' | 'movie' };

const OriginalBanner: React.FC = () => {
  const [item, setItem] = useState<BannerState | null>(null);
  const navigate = useNavigate();

  // 위시리스트 팝업 상태
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchBanner = async () => {
      try {
        const list = (await fetchNetflixOriginalAll(1, 60)) as OriginalPick[];
        if (!mounted || !list.length) return;

        const picked = list[Math.floor(Math.random() * list.length)];

        const detailUrl =
          picked.type === 'tv'
            ? `${BASE}/tv/${picked.id}?api_key=${API_KEY}&language=ko-KR`
            : `${BASE}/movie/${picked.id}?api_key=${API_KEY}&language=ko-KR`;

        const res = await fetch(detailUrl);
        if (!res.ok) throw new Error(`TMDB detail error: ${res.status}`);

        const data = (await res.json()) as BannerDetail;
        if (!mounted) return;

        setItem({ ...data, type: picked.type });
      } catch (err) {
        console.error('[OriginalBanner] error:', err);
      }
    };

    fetchBanner();
    return () => {
      mounted = false;
    };
  }, []);

  if (!item) return null;

  const displayTitle = item.title ?? item.name ?? '';
  const imgSrc = item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : FALLBACK_BG;

  const onClickPlay = () => {
    navigate(item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  // 위시리스트 버튼 클릭 핸들러
  const handleWishlistClick = () => {
    setShowWishlistPopup(true);
  };

  return (
    <>
      <section className="original-banner">
        <img className="original-bg" src={imgSrc} alt={displayTitle} draggable={false} />

        <div className="original-banner-inner">
          <div className="original-bannertxt">
            <h2>{displayTitle}</h2>
            <h3>{item.overview}</h3>
          </div>

          <div className="original-banner-btns">
            {/* 재생 버튼 */}
            <button className="play" type="button" onClick={onClickPlay}>
              <span className="play-ico">
                <img className="playicon" src="/images/icon/play.png" alt="" />
                <img className="play-hover" src="/images/icon/play-hover.png" alt="" />
              </span>
              <span>재생</span>
            </button>

            {/* 위시리스트 버튼 */}
            <button className="wish" type="button" onClick={handleWishlistClick}>
              <span className="wish-ico">
                <img className="wishicon" src="/images/icon/heart.png" alt="" />
                <img className="wish-hover" src="/images/icon/heart-active.png" alt="" />
              </span>
              <span>위시리스트</span>
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
            media_type: item.type,
          }}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </>
  );
};

export default OriginalBanner;