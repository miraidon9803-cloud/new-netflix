import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNetflixOriginalTop10 } from '../../api/TmdbOriginal';
// import './scss/Top10.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type Top10Item = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;
};

const NetflixOriginalTop10: React.FC = () => {
  const [netflixTop10, setNetflixTop10] = useState<Top10Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const top10 = await fetchNetflixOriginalTop10();
        if (!mounted) return;

        console.log(
          '[NetflixOriginalTop10] top10:',
          top10.map((t, i) => ({ rank: i + 1, id: t.id, name: t.name }))
        );

        setNetflixTop10(top10 as Top10Item[]);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'TMDB 요청 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // ✅ “드래그로 판단” 임계값 (살짝 움직였으면 클릭 막기)
  const movedRef = useRef(false);
  const DRAG_THRESHOLD = 6;

  const getTitle = (item: Top10Item) => (item.name ?? item.title ?? 'poster') as string;

  const onMouseDown: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    movedRef.current = false;

    el.classList.add('dragging');
    startXRef.current = e.pageX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;

    const dx = e.pageX - startXRef.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) movedRef.current = true;

    e.preventDefault();
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
    movedRef.current = false;

    el.classList.add('dragging');
    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onTouchMove: React.TouchEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;

    const dx = e.touches[0].pageX - startXRef.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) movedRef.current = true;

    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  // ✅ 드래그 중 클릭 시 Link 이동 막기
  const onClickLink: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (movedRef.current) e.preventDefault();
  };

  return (
    <div className="top10Wrap">
      <h2>오늘의 TOP 10 오리지널</h2>

      {loading && <p style={{ color: '#fff' }}>로딩중...</p>}
      {error && <p style={{ color: 'salmon' }}>에러: {error}</p>}

      {!loading && !error && (
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
            const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;
            const to = `/tv/${item.id}`; // ✅ Top10은 “오리지널 시리즈”니까 tv로

            return (
              <li key={item.id} className="top10Item">
                <span className="rank">{index + 1}</span>

                <div className="posterWrap">
                  <Link to={to} onClick={onClickLink} aria-label={getTitle(item)}>
                    <img
                      className="poster"
                      src={posterSrc}
                      alt={getTitle(item)}
                      draggable={false}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                      }}
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NetflixOriginalTop10;
