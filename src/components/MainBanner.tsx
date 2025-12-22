// src/components/MainBanner.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistPopup from './WishlistPopup';
import type { WishlistContent } from '../store/WishlistStore';
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

const MobileBG = [
  '/images/Mainbanner/모바일웬즈데이배너배경.png',
  '/images/Mainbanner/모바일케데헌배경.png',
  '/images/Mainbanner/모바일다이루어질지니배경.png',
];

const MobileBan = [
  '/images/Mainbanner/모바일웬즈데이배너.png',
  '/images/Mainbanner/모바일케데헌배너.png',
  '/images/Mainbanner/모바일다이루어질지니배너.png',
];

type MediaType = 'movie' | 'tv';

type Banner = {
  bg: string;
  mid: string;
  txt: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath?: string | null;
};

const tmdbMap: Array<{ tmdbId: number; mediaType: MediaType; title: string; posterPath?: string | null }> = [
  { 
    tmdbId: 119051, 
    mediaType: 'tv', 
    title: '웬즈데이',
    posterPath: '/images/Mainbanner/웬즈데이사람만.png'
  },
  { 
    tmdbId: 803796, 
    mediaType: 'movie', 
    title: '케이트 미들턴: 왕실의 헌신',
    posterPath: '/images/Mainbanner/케데헌사람만.png'
  },
  { 
    tmdbId: 228689, 
    mediaType: 'tv', 
    title: '다이루어질 지니',
    posterPath: '/images/Mainbanner/다이루어질지니사람만.png'
  },
];

const bannerSet: Banner[] = banBG.map((bg, i) => ({
  bg,
  mid: banMid[i],
  txt: banTXT[i],
  ...tmdbMap[i],
}));

const AUTO_DELAY = 4500;

const MainBanner: React.FC = () => {
  const navigate = useNavigate();

  // 위시리스트 팝업 상태
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [selectedContent, setSelectedContent] = useState<WishlistContent | null>(null);

  const goDetail = (mediaType: MediaType, tmdbId: number) => {
    navigate(`/${mediaType}/${tmdbId}`);
  };

  // 위시리스트 버튼 클릭 핸들러
  const handleWishlistClick = (banner: Banner) => {
    const content: WishlistContent = {
      id: banner.tmdbId,
      title: banner.title,
      poster_path: banner.posterPath || null,
      media_type: banner.mediaType,
    };
    setSelectedContent(content);
    setShowWishlistPopup(true);
  };

  const extended = useMemo(() => {
    const first = bannerSet[0];
    const last = bannerSet[bannerSet.length - 1];
    return [last, ...bannerSet, first];
  }, []);

  const [index, setIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);

  const realIndex = useMemo(
    () => (index - 1 + bannerSet.length) % bannerSet.length,
    [index]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNoTransition(false);
      setIndex((prev) => prev + 1);
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (index === extended.length - 1) {
      setNoTransition(true);
      setIndex(1);
    } else if (index === 0) {
      setNoTransition(true);
      setIndex(extended.length - 2);
    }
  };

  const handleDotClick = (target: number) => {
    setNoTransition(false);
    setIndex(target + 1);
  };

  return (
    <div className="wrap">
      <div
        className={`banner-track ${noTransition ? 'no-transition' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extended.map((banner, i) => (
          <div className="banner-item" key={i}>
            <div className="banner-layer">
              <img className="banBg" src={banner.bg} alt="" />
              <img className="banMid" src={banner.mid} alt="" />
            </div>

            <div className="btns-text">
              <img className="banTxt" src={banner.txt} alt="" />

              <div className="btns">
                <button
                type="button"
                className="play"
                onClick={() => goDetail(banner.mediaType, banner.tmdbId)}>
                <span className="play-ico" aria-hidden="true">
                  <img className="playicon" src="/images/icon/play.png" alt="" />
                  <img className="play-hover" src="/images/icon/play-hover.png" alt="" />
                </span>
                <span className="play-txt">재생</span>
              </button>

              <button 
                type="button" 
                className="wish"
                onClick={() => handleWishlistClick(banner)}
              >
                <span className="wish-ico" aria-hidden="true">
                  <img className="wishicon" src="/images/icon/heart.png" alt="" />
                  <img className="wish-hover" src="/images/icon/heart-active.png" alt="" />
                </span>
                <span className="wish-txt">위시리스트</span>
              </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <div className="banner-dots">
        {bannerSet.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${realIndex === i ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>

      {/* 모바일 배너 */}
      <div className="mobile-wrap">
        <div className="mobileBG">
          <img src={MobileBG[realIndex]} alt="mobile background" />
        </div>

        <div className="mobileimg">
          <img src={MobileBan[realIndex]} alt="mobile banner" />
        </div>

        <div className="mobilebtn">
          <button
            type="button"
            className="mplay"
            onClick={() => goDetail(bannerSet[realIndex].mediaType, bannerSet[realIndex].tmdbId)}
          >
            <img src="/images/icon/play.png" alt="play" />
            재생
          </button>

          <button 
            type="button" 
            className="mwish"
            onClick={() => handleWishlistClick(bannerSet[realIndex])}
          >
            <img src="/images/icon/mobile_wish.png" alt="wish" />
          </button>
        </div>
      </div>

      {/* 위시리스트 팝업 */}
      {showWishlistPopup && selectedContent && (
        <WishlistPopup
          content={selectedContent}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </div>
  );
};

export default MainBanner;