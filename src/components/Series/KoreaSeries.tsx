import React, { useEffect, useRef, useState } from 'react';
import { fetchRecentTVSeries2025, type TVItem } from '../../api/tmdbSeries';
import './scss/Series.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';

const KoreanSeries: React.FC = () => {
  const [list, setList] = useState<TVItem[]>([]);
  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    console.log('[KoreanSeries] fetch start');

    fetchRecentTVSeries2025({
      with_origin_country: 'KR',
      sort_by: 'popularity.desc',
      page: 1,
    })
      .then((data) => {
        console.log('[KoreanSeries] results array:', data.results);
        console.log('[KoreanSeries] results count:', data.results?.length ?? 0);
        console.log('[KoreanSeries] first item:', data.results?.[0]);

        setList(data.results ?? []);
      })
      .catch((err) => console.error('[KoreanSeries] error:', err));
  }, []);

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
    if (!el || !isDraggingRef.current) return;

    const dx = e.touches[0].pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  return (
    <section className="series-section">
      <h2 className="series-title">한국 시리즈</h2>

      <ul
        className="series-row"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        {list.map((tv) => (
          <li className="series-card" key={tv.id}>
            <img
              className="series-poster"
              src={`${IMG}${tv.poster_path}`}
              alt={tv.name}
              loading="lazy"
              draggable={false}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KoreanSeries;
