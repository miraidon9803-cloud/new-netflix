import React, { useEffect } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/TrandingSeries.scss';
import { Link } from 'react-router-dom';

// ✅ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode, Mousewheel } from 'swiper/modules';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type MediaType = 'tv' | 'movie';

type MediaItem = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;
  media_type?: MediaType;
  isNetflixOriginal?: boolean;
};

const TrandingSeries: React.FC = () => {
  const { SeriesTop10, onFetchSeriesTop10 } = useNetflixStore() as {
    SeriesTop10: MediaItem[];
    onFetchSeriesTop10: () => void;
  };

  useEffect(() => {
    onFetchSeriesTop10();
  }, [onFetchSeriesTop10]);

  const getTitle = (item: MediaItem) => (item.name ?? item.title ?? 'title') as string;

  const getType = (item: MediaItem): MediaType => {
    if (item.media_type === 'tv' || item.media_type === 'movie') return item.media_type;
    if (item.name) return 'tv';
    return 'movie';
  };

  return (
    <div className="seriesTopWrap">
      <p>급상승</p>

      <Swiper
        className="seriesTopSwiper"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={24}
        freeMode
        mousewheel={{ forceToAxis: true }}
      >
        {SeriesTop10.map((item) => {
          const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;
          const type = getType(item);

          return (
            <SwiperSlide key={`${type}-${item.id}`} className="seriesTopSlide">
              <Link to={`/${type}/${item.id}`} className="seriesItem" aria-label={getTitle(item)}>
                <div className="posterWrap">
                  {item.isNetflixOriginal && (
                    <img
                      className="netflixBadge"
                      src="/images/icon/오리지널_뱃지.png"
                      alt="Netflix Original"
                      draggable={false}
                    />
                  )}

                  <img
                    className="poster"
                    src={posterSrc}
                    alt={getTitle(item)}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                    }}
                  />
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TrandingSeries;
