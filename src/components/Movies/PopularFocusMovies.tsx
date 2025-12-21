import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularFocusMovies, type MovieItem } from '../../api/tmdbMovie';
import './scss/Movie.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

const PopularFocusMovies: React.FC = () => {
  const [list, setList] = useState<MovieItem[]>([]);

  useEffect(() => {
    fetchPopularFocusMovies().then((data) => {
      setList((data.results ?? []).filter((m) => m.poster_path));
    });
  }, []);

  return (
    <section className="movie-section">
      <h3 className="section-title">지금 주목받는 영화</h3>

      <Swiper
        className="movie-row"
        modules={[FreeMode]}
        freeMode
        grabCursor
        slidesPerView="auto"
        spaceBetween={12}>
        {list.map((m) => (
          <SwiperSlide key={m.id} className="movie-slide" style={{ width: 'auto' }}>
            <div className="movie-card">
              <Link to={`/movie/${m.id}`} className="movie-link">
                <img
                  src={m.poster_path ? `${IMG}${m.poster_path}` : FALLBACK_POSTER}
                  alt={m.title}
                  className="movie-poster"
                  draggable={false}
                  onError={(ev) => {
                    (ev.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                  }}
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularFocusMovies;
