import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentTVSeries2025, type TVItem } from '../../api/tmdbSeries';
import './scss/Series.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

// ✅ 랜덤 셔플 유틸 (Fisher–Yates)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ForeignThrillerMystery: React.FC = () => {
  const [list, setList] = useState<TVItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const baseParams = useMemo(
    () => ({
      without_origin_country: 'KR',
      sort_by: 'popularity.desc',
      page: 1,
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const [thrillerRes, mysteryRes] = await Promise.all([
          fetchRecentTVSeries2025({ ...baseParams, with_genres: '53' }),
          fetchRecentTVSeries2025({ ...baseParams, with_genres: '9648' }),
        ]);

        if (!mounted) return;

        const merged = [...(thrillerRes.results ?? []), ...(mysteryRes.results ?? [])];

        const unique = Array.from(
          new Map(
            merged
              .filter((tv) => tv.poster_path)
              .map((tv) => [tv.id, tv])
          ).values()
        );

        setList(shuffle(unique));
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '해외 스릴러/미스터리 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [baseParams]);

  return (
    <section className="series-section">
      <h2 className="series-title">해외 스릴러 &amp; 미스터리</h2>

      {loading && <p className="state">로딩중...</p>}
      {error && <p className="state error">에러: {error}</p>}
      {!loading && !error && !list.length && <div className="series-empty">결과가 없습니다</div>}

      {!loading && !error && !!list.length && (
        <Swiper
          className="series-row"
          modules={[FreeMode]}
          freeMode
          grabCursor
          slidesPerView="auto"
          spaceBetween={12}>
          {list.map((tv) => (
            <SwiperSlide key={tv.id} className="series-card" style={{ width: 'auto' }}>
              <Link to={`/tv/${tv.id}`}>
                <img
                  className="series-poster"
                  src={tv.poster_path ? `${IMG}${tv.poster_path}` : FALLBACK_POSTER}
                  alt={tv.name}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                  }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default ForeignThrillerMystery;
