import React, { useEffect, useState } from 'react';
import './scss/SeriesBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const FALLBACK_BG = '/images/icon/no_poster.png';

type BannerItem = {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
};

const SeriesBanner: React.FC = () => {
  const [item, setItem] = useState<BannerItem | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${BASE}/tv/209110?api_key=${API_KEY}&language=ko-KR`);
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        const data = (await res.json()) as BannerItem;
        setItem(data);
      } catch (err) {
        console.error('[SeriesBanner] error:', err);
      }
    };

    fetchBanner();
  }, []);

  if (!item) return null;

  const imgSrc = item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : FALLBACK_BG;

  return (
    <section className="banner">
      {/* ✅ 배경이미지: 레이아웃 안 밀리게 absolute로 깔기 */}
      <img
        className="banner-bg"
        src={imgSrc}
        alt={item.name}
        draggable={false}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_BG;
        }}
      />

      {/* ✅ 텍스트/버튼은 위에 올라가게 */}
      <div className="banner-inner">
        <div className="bannertxt">
          <img src="/images/자백의대가.png" alt="" />
          <h2>{item.overview}</h2>
        </div>

        <div className="banner-btns">
          <button className="play" type="button">
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

export default SeriesBanner;
