import React, { useEffect } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/TrandingSeries.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const TrandingSeries = () => {
  const { SeriesTop10, onFetchSeriesTop10 } = useNetflixStore();

  useEffect(() => {
    onFetchSeriesTop10();
  }, []);
  return (
    <div className="seriesTopWrap">
      <p>급상승 시리즈</p>

      <ul className="seriesTopList">
        {SeriesTop10.map((movie, id) => (
          <li key={movie.id} className="seriesItem">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrandingSeries;
