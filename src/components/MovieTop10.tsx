import React, { useEffect, useRef } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/Top10.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type MovieItem = {
  id: number;
  poster_path: string | null;
  title?: string | null;
  name?: string | null;
  isNetflixOriginal?: boolean;
};

const MovieTop10: React.FC = () => {
  const { movieTop10, onFetchMovieTop10 } = useNetflixStore() as {
    movieTop10: MovieItem[];
    onFetchMovieTop10: () => void;
  };

  useEffect(() => {
    onFetchMovieTop10();
  }, [onFetchMovieTop10]);

  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const getTitle = (item: MovieItem) => (item.title ?? item.name ?? 'movie') as string;

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
    <div className="top10Wrap">
      <h2>오늘의 TOP 10 영화</h2>

      <ul
        className="top10List"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        {movieTop10.map((item, index) => {
          const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;

          return (
            <li key={item.id} className="top10Item">
              <span className="rank">{index + 1}</span>

              <div className="posterWrap">
                {item.isNetflixOriginal && (
                  <img
                    className="netflixBadge"
                    src="/images/icon/오리지널_뱃지.png"
                    alt="Netflix Original"
                    draggable={false}
                  />
                )}

                {/* ✅ poster_path 없어도 렌더 + fallback */}
                <img
                  className="poster"
                  src={posterSrc}
                  alt={getTitle(item)}
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MovieTop10;
