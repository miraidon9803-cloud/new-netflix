import React, { useEffect } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/MovieTop10.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieTop10 = () => {
  const { movieTop10, onFetchMovieTop10 } = useNetflixStore();

  useEffect(() => {
    onFetchMovieTop10();
  }, []);

  return (
    <div className="movieTopWrap">
      <p>오늘의 TOP 10 영화</p>

      <ul className="movieTopList">
        {movieTop10.map((movie, id) => (
          <li key={movie.id} className="movieItem">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieTop10;
