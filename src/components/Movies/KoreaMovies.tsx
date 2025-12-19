import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchKoreaMovies, type MovieItem } from '../../api/tmdbMovie';
import './scss/Movie.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

const KoreaMovies: React.FC = () => {
  const [list, setList] = useState<MovieItem[]>([]);

  useEffect(() => {
    fetchKoreaMovies().then((data) => setList((data.results ?? []).filter((m) => m.poster_path)));
  }, []);

  return (
    <section className="movie-section">
      <h3 className="section-title">한국 영화</h3>

      <ul className="movie-row">
        {list.map((m) => (
          <li key={m.id} className="movie-card">
            {/* ✅ 클릭 시 영화 상세 페이지로 이동 */}
            <Link to={`/movie/${m.id}`}>
              <img
                src={m.poster_path ? `${IMG}${m.poster_path}` : FALLBACK_POSTER}
                alt={m.title}
                className="movie-poster"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KoreaMovies;
