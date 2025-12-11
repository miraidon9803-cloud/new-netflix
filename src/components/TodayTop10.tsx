import React, { useEffect } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/TodayTop10.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const TodayTop10 = () => {
  const { netflixTop10, onFetchNetflixTop10 } = useNetflixStore();

  useEffect(() => {
    onFetchNetflixTop10();
  }, []);

  console.log('Zustand에 들어온 top10:', netflixTop10);

  return (
    <div className="top10Wrap">
      <h2>오늘의 TOP 10 시리즈</h2>

      <ul className="top10List">
        {netflixTop10.map((item, index) => (
          <li key={item.id} className="top10Item">
            <span className="rank">{index + 1}</span>

            <img src={`${IMG_BASE}${item.poster_path}`} alt={item.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayTop10;
