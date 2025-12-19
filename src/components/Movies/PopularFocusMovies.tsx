import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularFocusMovies, type MovieItem } from '../../api/tmdbMovie';
import './scss/Movie.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

// ✅ 클릭이 “안 죽게” 임계값을 넉넉하게 + 가로 드래그일 때만 인정
const DRAG_THRESHOLD = 16;

const PopularFocusMovies: React.FC = () => {
  const [list, setList] = useState<MovieItem[]>([]);
  const rowRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 스크롤 상태
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // ✅ “이번 조작이 드래그였나”
  const draggedRef = useRef(false);

  // ✅ 드래그 직후 딸려오는 클릭 1번만 막기
  const justDraggedRef = useRef(false);

  useEffect(() => {
    fetchPopularFocusMovies().then((data) => {
      setList((data.results ?? []).filter((m) => m.poster_path));
    });
  }, []);

  // ✅ 포인터업 누락되면 클릭 계속 막히는 이슈 방지: 윈도우에서 강제 종료
  useEffect(() => {
    const hardEnd = () => {
      isDownRef.current = false;
      draggedRef.current = false;
      // 드래그가 아니라면 justDragged도 해제
      if (!justDraggedRef.current) return;
      // 혹시 클릭이 안 발생해도 다음 틱에 자동 해제
      setTimeout(() => (justDraggedRef.current = false), 0);
    };

    window.addEventListener('pointerup', hardEnd);
    window.addEventListener('pointercancel', hardEnd);
    window.addEventListener('blur', hardEnd);

    return () => {
      window.removeEventListener('pointerup', hardEnd);
      window.removeEventListener('pointercancel', hardEnd);
      window.removeEventListener('blur', hardEnd);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rowRef.current;
    if (!el) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isDownRef.current = true;
    draggedRef.current = false;
    justDraggedRef.current = false;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollLeftRef.current = el.scrollLeft;

    // ✅ 업 이벤트 누락 방지
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rowRef.current;
    if (!el || !isDownRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // ✅ 가로로 “확실히” 움직였을 때만 드래그로 인정 (클릭 흔들림 방지)
    const isHorizontalDrag = Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy);

    if (!draggedRef.current && isHorizontalDrag) {
      draggedRef.current = true;
    }

    if (!draggedRef.current) return;

    // ✅ 드래그로 확정된 뒤에만 기본동작 차단
    e.preventDefault();
    e.stopPropagation();

    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = rowRef.current;

    isDownRef.current = false;

    try {
      el?.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    // ✅ 드래그였다면 “딸려오는 클릭 1번”만 막기
    if (draggedRef.current) {
      justDraggedRef.current = true;

      // 클릭 이벤트가 안 오더라도 다음 틱에 자동 해제
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 0);
    }

    draggedRef.current = false;
  };

  // ✅ 링크/이미지 고스트 드래그 차단
  const blockNativeDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ✅ 클릭이 막히는 핵심: “드래그 직후 1번”만 막고, 그 외는 무조건 이동
  const onLinkClick = (e: React.MouseEvent) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      justDraggedRef.current = false;
    }
  };

  return (
    <section className="movie-section">
      <h3 className="section-title">지금 주목받는 영화</h3>

      <ul
        ref={rowRef}
        className="movie-row"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}>
        {list.map((m) => (
          <li key={m.id} className="movie-card">
            <Link
              to={`/movie/${m.id}`}
              className="movie-link"
              onClick={onLinkClick}
              draggable={false}
              onDragStart={blockNativeDrag}>
              <img
                src={m.poster_path ? `${IMG}${m.poster_path}` : FALLBACK_POSTER}
                alt={m.title}
                className="movie-poster"
                draggable={false}
                onDragStart={blockNativeDrag}
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PopularFocusMovies;
