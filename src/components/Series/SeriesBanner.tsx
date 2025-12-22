// src/components/SeriesBanner.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/SeriesBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const FALLBACK_BG = '/images/icon/no_poster.png';

type TVListItem = {
  id: number;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
};

type TVListResponse = {
  results: TVListItem[];
};

type BannerItem = {
  id: number;
  name?: string;
  overview: string;
  backdrop_path: string | null;
};

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const SeriesBanner: React.FC = () => {
  const [item, setItem] = useState<BannerItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchRandomSeriesBanner = async () => {
      try {
        const [airRes, popRes] = await Promise.all([
          fetch(`${BASE}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&page=1`),
          fetch(`${BASE}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1`),
        ]);

        if (!airRes.ok) throw new Error(`TMDB airing_today error: ${airRes.status}`);
        if (!popRes.ok) throw new Error(`TMDB popular error: ${popRes.status}`);

        const airData = (await airRes.json()) as TVListResponse;
        const popData = (await popRes.json()) as TVListResponse;

        const merged = [...(airData.results ?? []), ...(popData.results ?? [])]
          .filter((t) => t?.id && t.backdrop_path)
          .reduce<TVListItem[]>((acc, cur) => {
            if (acc.some((x) => x.id === cur.id)) return acc;
            acc.push(cur);
            return acc;
          }, []);

        if (!mounted || !merged.length) return;

        const picked = pickRandom(merged);

        const detailRes = await fetch(`${BASE}/tv/${picked.id}?api_key=${API_KEY}&language=ko-KR`);
        if (!detailRes.ok) throw new Error(`TMDB detail error: ${detailRes.status}`);

        const detail = (await detailRes.json()) as BannerItem;
        if (!mounted) return;

        setItem(detail);
      } catch (err) {
        console.error('[SeriesBanner] error:', err);
      }
    };

    fetchRandomSeriesBanner();

    return () => {
      mounted = false;
    };
  }, []);

  if (!item) return null;

  const displayTitle = item.name ?? '';
  const imgSrc = item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : FALLBACK_BG;

  const onClickPlay = () => {
    navigate(`/tv/${item.id}`);
  };

  return (
    <section className="series-banner">
      <img
        className="series-bg"
        src={imgSrc}
        alt={displayTitle}
        draggable={false}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_BG;
        }}
      />

      <div className="series-banner-inner">
        <div className="series-bannertxt">
          <h2>{displayTitle}</h2>
          <h3>{item.overview}</h3>
        </div>

        <div className="series-banner-btns">
          {/* ✅ play: 아이콘 hover 교체 + hover 때만 보더 */}
          <button className="play" type="button" onClick={onClickPlay}>
            <span className="play-ico" aria-hidden="true">
              <img className="playicon" src="/images/icon/play.png" alt="" draggable={false} />
              <img className="play-hover" src="/images/icon/play-hover.png" alt="" draggable={false} />
            </span>
            <span className="play-txt">재생</span>
          </button>

          {/* ✅ wish: 아이콘 hover 교체 + hover 때만 보더 */}
          <button className="wish" type="button">
            <span className="wish-ico" aria-hidden="true">
              <img className="wishicon" src="/images/icon/heart.png" alt="" draggable={false} />
              <img className="wish-hover" src="/images/icon/heart-active.png" alt="" draggable={false} />
            </span>
            <span className="wish-txt">위시리스트</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SeriesBanner;
