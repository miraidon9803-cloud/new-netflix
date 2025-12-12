import React, { useEffect, useRef } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/MovieTop10.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieTop10 = () => {
  const { movieTop10, onFetchMovieTop10 } = useNetflixStore();

  useEffect(() => {
    onFetchMovieTop10();
  }, []);

  // 가로 스크롤용 refs
  const scrollRef = useRef<HTMLUListElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // 휠 → 가로 스크롤 + 끝에서는 페이지 스크롤 허용
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // 양 끝에서는 페이지 스크롤 허용
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) {
        return;
      }

      // 가로 스크롤 강제
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault(); // 세로 스크롤 차단
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();
    isDragging.current = true;

    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;

    el.classList.add('is-dragging');
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    const dx = e.clientX - startX.current;
    el.scrollLeft = startScrollLeft.current - dx;
  };

  // 드래그 종료
  const stopDragging = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.classList.remove('is-dragging');
  };

  return (
    <div className="top10Wrap">
      <h2>오늘의 TOP 10 영화</h2>

      <ul
        className="top10List"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}>
        {movieTop10.map((item, index) => (
          <li key={item.id} className="top10Item">
            <span className="rank">{index + 1}</span>
            <img src={`${IMG_BASE}${item.poster_path}`} alt={item.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieTop10;
