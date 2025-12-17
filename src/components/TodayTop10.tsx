import React, { useEffect, useRef } from 'react';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/Top10.scss';
import { Link } from 'react-router-dom';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type Top10Item = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;

  isNetflixOriginal?: boolean;
  isNew3Months?: boolean;
  isOld1Year?: boolean;
};

const TodayTop10: React.FC = () => {
  const { netflixTop10, onFetchNetflixTop10 } = useNetflixStore() as {
    netflixTop10: Top10Item[];
    onFetchNetflixTop10: () => void;
  };

  useEffect(() => {
    onFetchNetflixTop10();
  }, [onFetchNetflixTop10]);

  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const getTitle = (item: Top10Item) => (item.name ?? item.title ?? 'poster') as string;

  const getBadgeType = (item: Top10Item): 'netflix' | 'new' | 'old' | null => {
    if (item.isNetflixOriginal) return 'netflix';
    if (item.isNew3Months) return 'new';
    if (item.isOld1Year) return 'old';
    return null;
  };

  // ✅ 마우스 드래그 핸들러
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

    e.preventDefault(); // ✅ 드래그 중 텍스트 선택 방지
    const dx = e.pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx; // ✅ 드래그 방향에 맞게 이동
  };

  const endDrag = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = false;
    el.classList.remove('dragging');
  };

  // ✅ 터치 드래그(모바일)도 같이 지원
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
      <h2>오늘의 TOP 10 시리즈</h2>

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
        {netflixTop10.map((item, index) => {
          const badge = getBadgeType(item);
          const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;

          return (
            <li key={item.id} className="top10Item">
              <span className="rank">{index + 1}</span>

              <div className="posterWrap">
                {badge === 'netflix' && (
                  <img
                    className="netflixBadge"
                    src="/images/icon/오리지널_뱃지.png"
                    alt="Netflix Original"
                    draggable={false}
                  />
                )}

                {badge === 'new' && (
                  <img
                    className="newBadge"
                    src="/images/icon/뉴_뱃지.png"
                    alt="New (3 months)"
                    draggable={false}
                  />
                )}

                {badge === 'old' && (
                  <img
                    className="oldBadge"
                    src="/images/icon/곧 종료_뱃지.png"
                    alt="Old (1 year+)"
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

export default TodayTop10;
