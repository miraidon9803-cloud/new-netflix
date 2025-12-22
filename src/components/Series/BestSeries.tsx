import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentTVSeries2025, type TVItem } from '../../api/tmdbSeries';
import './scss/Series.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

const BestSeries: React.FC = () => {
  const [list, setList] = useState<TVItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchRecentTVSeries2025({
          sort_by: 'vote_average.desc',
          'vote_count.gte': 300,
          page: 1,
        });

        if (!mounted) return;

        const filtered = (data.results ?? []).filter((tv) => tv.poster_path);
        setList(filtered);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? '평단 호평 시리즈 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="series-section">
      <h2 className="series-title">평단의 찬사를 받은 시리즈</h2>

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

export default BestSeries;
