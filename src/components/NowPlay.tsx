import React, { useEffect, useRef } from 'react';
import './scss/Nowplay.scss';

const play = [
  '/images/nowplay/킹덤.png',
  '/images/nowplay/우영우.png',
  '/images/nowplay/수리남.png',
  '/images/nowplay/그레이맨.png',
  '/images/nowplay/스물다섯스물하나.png',
  '/images/nowplay/이태원클라스.png',
  '/images/nowplay/피지컬아시아.png',
  '/images/nowplay/안나.png',
  '/images/nowplay/나의해방일지.png',
  '/images/nowplay/6언더그라운드.png',
  '/images/nowplay/스위트알라바마.png',
  '/images/nowplay/나르코스.png',
  '/images/nowplay/결혼이야기.png',
  '/images/nowplay/경의로운소문.png',
  '/images/nowplay/루시퍼.png',
  '/images/nowplay/루머의루머의루머.png',
  '/images/nowplay/스위트홈.png',
  '/images/nowplay/브리저튼.png',
  '/images/nowplay/로크앤키.png',
  '/images/nowplay/너의모든것.png',
  '/images/nowplay/고요의바다.png',
  '/images/nowplay/종이의집.png',
  '/images/nowplay/흑백요리사.png',
  '/images/nowplay/애덤프로젝트.png',
  '/images/nowplay/더크라운.png',
  '/images/nowplay/기묘한이야기.png',
  '/images/nowplay/뤼팽.png',
  '/images/nowplay/다크.png',
  '/images/nowplay/마이네임.png',
  '/images/nowplay/엣지러너.png',
  '/images/nowplay/사랑의불시착.png',
  '/images/nowplay/라스트킹덤.png',
  '/images/nowplay/지금우리학교는.png',
  '/images/nowplay/DP.png',
  '/images/nowplay/사내맞선.png',
  '/images/nowplay/솔로지옥.png',
  '/images/nowplay/빈센조.png',
  '/images/nowplay/오렌지블랙.png',
  '/images/nowplay/퀸스갬빗.png',
  '/images/nowplay/오징어게임.png',
  '/images/nowplay/러브데스로봇.png',
  '/images/nowplay/승리호.png',
  '/images/nowplay/레드노티스.png',
];

const NowPlay = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  // 🔥 리스트 위 휠 = 가로 스크롤 + 페이지 세로 스크롤 차단
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const el = scrollRef.current;
      if (!el) return;

      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // 스크롤이 양 끝일 때 → 기본 동작 허용 (페이지 스크롤)
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) {
        return; // preventDefault() 안함
      }

      // 그 외엔 가로 스크롤 처리
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    // passive: false 필수
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="playWrap">
      <p>지금 방영 중인 콘텐츠</p>

      <ul className="Nowplay" ref={scrollRef}>
        {play.map((src, i) => (
          <li key={i}>
            <img src={src} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NowPlay;
