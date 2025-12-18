import React, { useEffect, useRef } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/TrandingSeries.scss';
import { Link } from 'react-router-dom';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type SeriesItem = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;
  isNetflixOriginal?: boolean;
};

const TrandingSeries: React.FC = () => {
  const { SeriesTop10, onFetchSeriesTop10 } = useNetflixStore() as {
    SeriesTop10: SeriesItem[];
    onFetchSeriesTop10: () => void;
  };

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    onFetchSeriesTop10();
  }, [onFetchSeriesTop10]);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const getTitle = (item: SeriesItem) => (item.name ?? item.title ?? 'series') as string;

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
    <div className="seriesTopWrap">
      <p>급상승 시리즈</p>

      <ul
        className="seriesTopList"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        {SeriesTop10.map((item) => {
          const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;

          return (
            <li key={item.id} className="seriesItem">
              <div className="posterWrap">
                {item.isNetflixOriginal && (
                  <img
                    className="netflixBadge"
                    src="/images/icon/오리지널_뱃지.png"
                    alt="Netflix Original"
                    draggable={false}
                  />
                )}

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

export default TrandingSeries;
