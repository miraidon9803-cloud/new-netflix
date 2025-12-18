import React, { useEffect, useRef, useState } from 'react';
import { fetchRecentTVSeries2025, type TVItem } from '../../api/tmdbSeries';
import './scss/Series.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';

// ✅ 랜덤 셔플 유틸 (Fisher–Yates)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ForeignThrillerMystery: React.FC = () => {
  const [list, setList] = useState<TVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    console.log('[ForeignThrillerMystery] fetch start');
    setLoading(true);
    setError('');

    Promise.all([
      fetchRecentTVSeries2025({
        with_genres: '53',
        sort_by: 'popularity.desc',
        page: 1,
      }),
      fetchRecentTVSeries2025({
        with_genres: '9648',
        sort_by: 'popularity.desc',
        page: 1,
      }),
    ])
      .then(([thrillerRes, mysteryRes]) => {
        const merged = [...(thrillerRes.results ?? []), ...(mysteryRes.results ?? [])];

        // ✅ id 기준 중복 제거
        const unique = Array.from(new Map(merged.map((tv) => [tv.id, tv])).values());

        // ✅ 랜덤 정렬
        const randomized = shuffle(unique);

        console.log('[ForeignThrillerMystery] final count:', randomized.length);

        setList(randomized);
      })
      .catch((err) => {
        console.error('[ForeignThrillerMystery] error:', err);
        setError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <section className="series-section">
        <h2 className="series-title">해외 스릴러 & 미스터리</h2>
        <div className="series-empty">로딩 중…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="series-section">
        <h2 className="series-title">해외 스릴러 & 미스터리</h2>
        <div className="series-empty">에러: {error}</div>
      </section>
    );
  }

  if (!list.length) {
    return (
      <section className="series-section">
        <h2 className="series-title">해외 스릴러 & 미스터리</h2>
        <div className="series-empty">결과가 없습니다</div>
      </section>
    );
  }

  return (
    <section className="series-section">
      <h2 className="series-title">해외 스릴러 & 미스터리</h2>

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

export default ForeignThrillerMystery;
