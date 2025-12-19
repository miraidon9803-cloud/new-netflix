import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentTVSeries2025, type TVItem } from '../../api/tmdbSeries';
import './scss/Series.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

// ✅ 랜덤 셔플 유틸 (Fisher–Yates)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const LightSeries: React.FC = () => {
  const [list, setList] = useState<TVItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const [comedyRes, romanceRes, animationRes] = await Promise.all([
          fetchRecentTVSeries2025({
            with_genres: '35', // 코미디
            sort_by: 'popularity.desc',
            page: 1,
          }),
          fetchRecentTVSeries2025({
            with_genres: '10749', // 로맨스
            sort_by: 'popularity.desc',
            page: 1,
          }),
          fetchRecentTVSeries2025({
            with_genres: '16', // 애니메이션
            sort_by: 'popularity.desc',
            page: 1,
          }),
        ]);

        if (!mounted) return;

        const merged = [
          ...(comedyRes.results ?? []),
          ...(romanceRes.results ?? []),
          ...(animationRes.results ?? []),
        ];

        // ✅ 포스터 없는 것 제거 + id 중복 제거
        const unique = Array.from(
          new Map(merged.filter((tv) => tv.poster_path).map((tv) => [tv.id, tv])).values()
        );

        // ✅ 랜덤 정렬
        const randomized = shuffle(unique);

        setList(randomized);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? '가볍게 즐길 콘텐츠 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
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
      <h2 className="series-title">가볍게 즐길 콘텐츠</h2>

      {loading && <p className="state">로딩중...</p>}
      {error && <p className="state error">에러: {error}</p>}

      {!loading && !error && !list.length && <div className="series-empty">결과가 없습니다</div>}

      {!loading && !error && !!list.length && (
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
              {/* ✅ TV 상세 페이지 이동 */}
              <Link to={`/tv/${tv.id}`}>
                <img
                  className="series-poster"
                  src={tv.poster_path ? `${IMG}${tv.poster_path}` : FALLBACK_POSTER}
                  alt={tv.name}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                  }}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default LightSeries;
