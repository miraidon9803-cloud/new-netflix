import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNetflixOriginalTop10 } from '../../api/TmdbOriginal';
import './scss/originaltop10.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type Top10Item = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;
};

const NetflixOriginalTop10: React.FC = () => {
  const [netflixTop10, setNetflixTop10] = useState<Top10Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const top10 = await fetchNetflixOriginalTop10();
        if (!mounted) return;

        setNetflixTop10(top10 as Top10Item[]);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'TMDB 요청 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const getTitle = (item: Top10Item) => (item.name ?? item.title ?? 'poster') as string;

  return (
    <div className="Original-top10Wrap">
      <h2>오늘의 TOP 10 오리지널</h2>

      {loading && <p style={{ color: '#fff' }}>로딩중...</p>}
      {error && <p style={{ color: 'salmon' }}>에러: {error}</p>}

      {!loading && !error && (
        <Swiper
          className="Original-top10Swiper"
          modules={[FreeMode]}
          freeMode={{ enabled: true, momentum: true }}
          grabCursor
          slidesPerView="auto"
          watchOverflow
          spaceBetween={88}
          breakpoints={{
            0: { spaceBetween: 32 },
            431: { spaceBetween: 60 },
            1441: { spaceBetween: 88 },
          }}
        >
          {netflixTop10.map((item, index) => {
            const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;
            const to = `/tv/${item.id}`;

            return (
              <SwiperSlide key={item.id} className="Original-top10Slide">
                <div className="Original-top10Item">
                  <span className="Original-rank">{index + 1}</span>

                  <div className="Original-posterWrap">
                    <Link to={to} aria-label={getTitle(item)}>
                      <img
                        className="Original-poster"
                        src={posterSrc}
                        alt={getTitle(item)}
                        draggable={false}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default NetflixOriginalTop10;
