// src/components/WalkingDead.tsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/Wakingdead.scss';

const WALKING_DEAD_TV_ID = 1402; // TMDB The Walking Dead TV ID

const WalkingDeadList = [
  { tvId: WALKING_DEAD_TV_ID, season: 0, src: '/images/워킹데드/메인.png', label: '메인' },
  { tvId: WALKING_DEAD_TV_ID, season: 1, src: '/images/워킹데드/시즌1.png', label: '시즌 1' },
  { tvId: WALKING_DEAD_TV_ID, season: 2, src: '/images/워킹데드/시즌2.png', label: '시즌 2' },
  { tvId: WALKING_DEAD_TV_ID, season: 3, src: '/images/워킹데드/시즌3.png', label: '시즌 3' },
  { tvId: WALKING_DEAD_TV_ID, season: 4, src: '/images/워킹데드/시즌4.png', label: '시즌 4' },
  { tvId: WALKING_DEAD_TV_ID, season: 5, src: '/images/워킹데드/시즌5.png', label: '시즌 5' },
  { tvId: WALKING_DEAD_TV_ID, season: 6, src: '/images/워킹데드/시즌6.png', label: '시즌 6' },
  { tvId: WALKING_DEAD_TV_ID, season: 7, src: '/images/워킹데드/시즌7.png', label: '시즌 7' },
  { tvId: WALKING_DEAD_TV_ID, season: 8, src: '/images/워킹데드/시즌8.png', label: '시즌 8' },
  { tvId: WALKING_DEAD_TV_ID, season: 9, src: '/images/워킹데드/시즌9.png', label: '시즌 9' },
  { tvId: WALKING_DEAD_TV_ID, season: 10, src: '/images/워킹데드/시즌10.png', label: '시즌 10' },
  { tvId: WALKING_DEAD_TV_ID, season: 11, src: '/images/워킹데드/시즌11.png', label: '시즌 11' },
];

const WalkingDead: React.FC = () => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  // 기존 드래그 로직 그대로
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

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
    if (!el || !isDraggingRef.current) return;

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
    if (!el || !isDraggingRef.current) return;

    const dx = e.touches[0].pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  return (
    <div className="walking">
      <p>워킹데드 몰아보기</p>

      <ul
        ref={scrollRef}
        className="walking-list"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {WalkingDeadList.map((item, i) => (
          <li key={i}>
            {i === 0 && (
              <button type="button" className="play" onClick={() => navigate(`/tv/${WALKING_DEAD_TV_ID}`)}>
                <span className="play-ico" aria-hidden="true">
                  <img className="playicon" src="/images/icon/play.png" alt="" draggable={false} />
                  <img className="play-hover" src="/images/icon/play-hover.png" alt="" draggable={false} />
                </span>
                <span className="play-txt">재생</span>
              </button>
            )}

            <img src={item.src} alt="" draggable={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalkingDead;
