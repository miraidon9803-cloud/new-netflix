import React from 'react';
import './scss/StrangerNew.scss';

const StrangerNew = () => {
  return (
    <div className="Stranger">
      <div className="poster">
        <p>기묘한 이야기 새로운 시즌</p>
        <img src="/images/stranger-poster.png" alt="stranger" />
      </div>
      <div className="button">
        <button>
          <img src="/images/icon/play.png" alt="play" />
          재생
        </button>
      </div>
    </div>
  );
};

export default StrangerNew;
