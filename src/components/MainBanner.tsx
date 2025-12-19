import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// 모바일 배너이미지
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
};

const bannerSet: Banner[] = banBG.map((bg, i) => {
  // ✅ TMDB ID 매핑 (배너 순서와 1:1로 맞춰둠)
  // 0: 웬즈데이 (tv) 119051
  // 1: 케데헌=케이팝 데몬 헌터스 (movie) 803796
  // 2: 다 이루어질지니 (tv) 228689
  const tmdbMap: Array<{ tmdbId: number; mediaType: MediaType }> = [
    { tmdbId: 119051, mediaType: 'tv' },
    { tmdbId: 803796, mediaType: 'movie' },
    { tmdbId: 228689, mediaType: 'tv' },
  ];

  return {
    bg,
    mid: banMid[i],
    txt: banTXT[i],
    ...tmdbMap[i],
  };
});

const AUTO_DELAY = 4500;

const MainBanner: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 상세페이지 이동 경로 (프로젝트 라우트에 맞게 여기만 바꾸면 됨)
  const goDetail = (mediaType: 'tv' | 'movie', tmdbId: number) => {
    navigate(`/${mediaType}/${tmdbId}`);

    // 예: 네가 /movie/:id, /tv/:id 구조면 아래처럼 바꾸면 됨
    // navigate(`/${mediaType}/${tmdbId}`);
  };

  // 앞뒤로 복제한 확장 슬라이드
  const extended = useMemo(() => {
    const first = bannerSet[0];
    const last = bannerSet[bannerSet.length - 1];
    return [last, ...bannerSet, first];
  }, []);

  // index = 1부터 시작 → 원래 0번째 슬라이드
  const [index, setIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);

  // 현재 실제 슬라이드 인덱스 (0 ~ bannerSet.length - 1)
  const realIndex = useMemo(() => {
    return (index - 1 + bannerSet.length) % bannerSet.length;
  }, [index]);

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setNoTransition(false);
      setIndex((prev) => prev + 1);
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, []);

  // 무한 루프 순간 이동 처리
  const handleTransitionEnd = () => {
    if (index === extended.length - 1) {
      setNoTransition(true);
      setIndex(1);
    } else if (index === 0) {
      setNoTransition(true);
      setIndex(extended.length - 2);
    }
  };

  // 도트 클릭 시 해당 슬라이드로 이동
  const handleDotClick = (target: number) => {
    setNoTransition(false);
    setIndex(target + 1);
  };

  return (
    <div className="wrap">
      <div
        className={`banner-track ${noTransition ? 'no-transition' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}>
        {extended.map((banner, i) => (
          <div className="banner-item" key={i}>
            <div className="banner-layer">
              <img className="banBg" src={banner.bg} alt="" />
              <img className="banMid" src={banner.mid} alt="" />
            </div>

            <div className="btns-text">
              <img className="banTxt" src={banner.txt} alt="" />

              {/* ✅ 재생: 해당 배너 TMDB ID로 상세페이지 이동 */}
              <button
                type="button"
                className="play"
                onClick={() => goDetail(banner.mediaType, banner.tmdbId)}>
                <img src="/images/icon/play.png" alt="" /> 재생
              </button>

              <button type="button" className="wish">
                <img src="/images/icon/heart.png" alt="" /> 위시리스트
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 도트 */}
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

      {/* 모바일 */}
      <div className="mobile-wrap">
        <div className="mobileBG">
          <img src={MobileBG[realIndex]} alt="mobile background" />
        </div>

        <div className="mobileimg">
          <img src={MobileBan[realIndex]} alt="mobile banner" />
        </div>

        <div className="mobilebtn">
          {/* ✅ 모바일 재생도 동일하게 이동 */}
          <button
            type="button"
            className="mplay"
            onClick={() => goDetail(bannerSet[realIndex].mediaType, bannerSet[realIndex].tmdbId)}>
            <img src="/images/icon/play.png" alt="play" />
            재생
          </button>

          <button type="button" className="mwish">
            <img src="/images/icon/mobile_wish.png" alt="wish" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
