import React, { useEffect, useMemo, useState } from 'react';
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

//모바일 배너이미지
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

const bannerSet = banBG.map((bg, i) => ({
  bg,
  mid: banMid[i],
  txt: banTXT[i],
}));

const AUTO_DELAY = 4500;

const MainBanner = () => {
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
      // 마지막 복제 → 첫번째 슬라이드 위치로 순간이동
      setNoTransition(true);
      setIndex(1);
    } else if (index === 0) {
      // 첫 복제 → 마지막 실제 슬라이드로 순간이동
      setNoTransition(true);
      setIndex(extended.length - 2);
    }
  };

  // ✅ 도트 클릭 시 해당 슬라이드로 이동
  const handleDotClick = (target: number) => {
    setNoTransition(false);
    // extended에서 실제 슬라이드의 위치는 +1
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
      {/* ✅ 페이지네이션 도트 */}
      <div className="banner-dots">
        {bannerSet.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${realIndex === i ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}>
            {/* 점 내용은 비워두고, CSS로 동그라미 표현 */}
          </button>
        ))}
      </div>
      <div className="mobile-wrap">
        <div className="mobileBG">
          {/* 첫 번째: 모바일 배경 */}
          <img src={MobileBG[realIndex]} alt="mobile background" />
        </div>
        <div className="mobileimg">
          {/* 두 번째: 모바일 배너 */}
          <img src={MobileBan[realIndex]} alt="mobile banner" />
        </div>
        <div className="mobilebtn">
          <button>
            <img src="/images/icon/play.png" alt="play" />
            재생
          </button>
          <button>
            <img src="/images/icon/mobile_wish.png" alt="wish" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
