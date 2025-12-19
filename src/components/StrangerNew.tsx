import React from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/StrangerNew.scss';

const STRANGER_TMDB_ID = 66732;

const StrangerNew: React.FC = () => {
  const navigate = useNavigate();

  const goDetail = () => {
    navigate(`/tv/${STRANGER_TMDB_ID}`);
  };

  return (
    <div className="Stranger">
      <div className="poster">
        <p>기묘한 이야기 새로운 시즌</p>
        <img src="/images/stranger-poster.png" alt="stranger" />
      </div>

      <div className="button">
        <button type="button" onClick={goDetail}>
          <img src="/images/icon/play.png" alt="play" />
          재생
        </button>
      </div>
    </div>
  );
};

export default StrangerNew;
