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
        // ✅ airing_today + popular 섞어서 후보 풀 구성
        const [airRes, popRes] = await Promise.all([
          fetch(`${BASE}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&page=1`),
          fetch(`${BASE}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1`),
        ]);

        if (!airRes.ok) throw new Error(`TMDB airing_today error: ${airRes.status}`);
        if (!popRes.ok) throw new Error(`TMDB popular error: ${popRes.status}`);

        const airData = (await airRes.json()) as TVListResponse;
        const popData = (await popRes.json()) as TVListResponse;

        // ✅ backdrop 있는 것만 + 중복 제거
        const merged = [...(airData.results ?? []), ...(popData.results ?? [])]
          .filter((t) => t?.id && t.backdrop_path)
          .reduce<TVListItem[]>((acc, cur) => {
            if (acc.some((x) => x.id === cur.id)) return acc;
            acc.push(cur);
            return acc;
          }, []);

        if (!mounted || !merged.length) return;

        const picked = pickRandom(merged);

        // ✅ 상세 재요청
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

  /** ✅ 재생 버튼 클릭 → TV 상세 페이지 */
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

export default SeriesBanner;
