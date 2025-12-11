// src/components/MainBanner.tsx
import React, { useState } from 'react';
import './scss/Mainbanner.scss';

const banBG = [
  '/images/Mainbanner/웬즈데이BG.png',
  '/images/Mainbanner/케데헌BG.png',
  '/images/Mainbanner/다이루어질지니BG.png',
];

const banMid = [
  '/images/Mainbanner/웬즈데이사람만.png',
  '/images/Mainbanner/케데헌사람만.png',
  '/images/Mainbanner/다이루어질지니사람만.png',
];

const banTXT = [
  '/images/Mainbanner/웬즈데이TEXT.png',
  '/images/Mainbanner/케데헌TEXT.png',
  '/images/Mainbanner/다이루어질지니TEXT.png',
];

// 3개 배열을 같은 인덱스로 묶기
const bannerSet = banBG.map((bg, i) => ({
  bg,
  mid: banMid[i],
  txt: banTXT[i],
}));

const MainBanner = () => {
  const [index, setIndex] = useState(0);
  const length = bannerSet.length;

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + length) % length); // 왼쪽으로 무한
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % length); // 오른쪽으로 무한
  };

  return (
    <div className="wrap">
      {/* 슬라이드 트랙 */}
      <div className="banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {bannerSet.map((banner, idx) => (
          <div className="banner-item" key={idx}>
            <div className="banner-layer">
              <img className="banBg" src={banner.bg} alt="" />
              <img className="banMid" src={banner.mid} alt="" />
            </div>

            <div className="btns-text">
              <img className="banTxt" src={banner.txt} alt="" />
              <button className="play">
                <img src="/images/icon/play.png" alt="" /> 재생
              </button>
              <button className="wish">
                <img src="/images/icon/heart.png" alt="" /> 위시리스트
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 좌우 버튼 */}
      <button className="nav prev" onClick={handlePrev}>
        ‹
      </button>
      <button className="nav next" onClick={handleNext}>
        ›
      </button>
    </div>
  );
};

export default MainBanner;
