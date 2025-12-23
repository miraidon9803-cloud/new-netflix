// src/components/StrangerNew.tsx
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
        {/* ✅ MainBanner랑 동일: 아이콘 hover 교체 + hover 보더(#E50914) */}
        <button type="button" className="Splay" onClick={goDetail}>
          <span className="play-ico" aria-hidden="true">
            <img className="playicon" src="/images/icon/play.png" alt="" />
            <img className="play-hover" src="/images/icon/play-hover.png" alt="" />
          </span>
          <span className="play-txt">재생</span>
        </button>
      </div>
    </div>
  );
};

export default StrangerNew;
