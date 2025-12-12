import React, { useEffect, useRef } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/TrandingSeries.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const TrandingSeries = () => {
  const { SeriesTop10, onFetchSeriesTop10 } = useNetflixStore();

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    onFetchSeriesTop10();
  }, []);

  // 리스트 위 휠 = 가로 스크롤 / 페이지 세로 스크롤 막기
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

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="seriesTopWrap">
      <p>급상승 시리즈</p>

      <ul className="seriesTopList" ref={scrollRef}>
        {SeriesTop10.map((movie, id) => (
          <li key={movie.id} className="seriesItem">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrandingSeries;
