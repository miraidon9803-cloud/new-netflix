import React, { useEffect } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/SFNFantasy.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const SFNFantasy = () => {
  const { SFNFTop10, onFetchSFTop10 } = useNetflixStore();

  useEffect(() => {
    onFetchSFTop10();
  }, []);
  return (
    <div className="sfTopWrap">
      <p>SF&판타지 시리즈</p>

      <ul className="sfTopList">
        {SFNFTop10.map((movie, id) => (
          <li key={movie.id} className="sfItem">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SFNFantasy;
