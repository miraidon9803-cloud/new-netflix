import React, { useRef } from 'react';
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

const NowPlay: React.FC = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // ✅ 마우스 드래그
  const onMouseDown: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    el.classList.add('dragging');

    startXRef.current = e.pageX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (!isDraggingRef.current) return;

    e.preventDefault();
    const dx = e.pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const endDrag = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = false;
    el.classList.remove('dragging');
  };

  // ✅ 터치 드래그(모바일)
  const onTouchStart: React.TouchEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    el.classList.add('dragging');

    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onTouchMove: React.TouchEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (!isDraggingRef.current) return;

    const dx = e.touches[0].pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  return (
    <div className="playWrap">
      <p>지금 방영 중인 콘텐츠</p>

      <ul
        className="Nowplay"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        {play.map((src, i) => (
          <li key={i}>
            <img src={src} alt="" draggable={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NowPlay;
