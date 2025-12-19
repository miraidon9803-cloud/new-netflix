import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNetflixOriginalAll } from '../../api/TmdbOriginal';
import './scss/OriginalBanner.scss';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
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
};

// ✅ 배너에서 실제로 쓸 state 타입 (type 포함)
type BannerState = BannerDetail & { type: 'tv' | 'movie' };

const OriginalBanner: React.FC = () => {
  const [item, setItem] = useState<BannerState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchBanner = async () => {
      try {
        // 1) 넷플릭스 오리지널 60개 확보
        const list = (await fetchNetflixOriginalAll(1, 60)) as OriginalPick[];
        if (!mounted) return;
        if (!list.length) return;

        // 2) 랜덤 1개
        const picked = list[Math.floor(Math.random() * list.length)];
        console.log('[OriginalBanner] picked:', picked.type, picked.id, picked.title);

        // 3) 타입별 상세 요청
        const detailUrl =
          picked.type === 'tv'
            ? `${BASE}/tv/${picked.id}?api_key=${API_KEY}&language=ko-KR`
            : `${BASE}/movie/${picked.id}?api_key=${API_KEY}&language=ko-KR`;

        const res = await fetch(detailUrl);
        if (!res.ok) throw new Error(`TMDB detail error: ${res.status}`);

        const data = (await res.json()) as BannerDetail;
        if (!mounted) return;

        // ✅ type을 같이 저장해둬야 라우팅 가능
        setItem({ ...data, type: picked.type });

        console.log('[OriginalBanner] detail:', {
          id: data.id,
          type: picked.type,
          title: data.title ?? data.name,
          hasBackdrop: !!data.backdrop_path,
        });
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

  // ✅ 재생 버튼 → 타입에 맞게 상세 페이지로
  const onClickPlay = () => {
    navigate(item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <section className="original-banner">
      <img
        className="original-bg"
        src={imgSrc}
        alt={displayTitle}
        draggable={false}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_BG;
        }}
      />

      <div className="original-banner-inner">
        <div className="original-bannertxt">
          <h2>{displayTitle}</h2>
          <h3>{item.overview}</h3>
        </div>

        <div className="original-banner-btns">
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

export default OriginalBanner;
