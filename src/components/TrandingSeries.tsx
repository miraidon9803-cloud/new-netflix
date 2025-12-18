import React, { useEffect, useRef } from "react";
import { useNetflixStore } from "../store/NetflixStore";
import "./scss/TrandingSeries.scss";
import { Link } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/images/icon/no_poster.png";

type MediaType = "tv" | "movie";

// ✅ store가 내려주는 원본 타입(= MediaItem에 맞춰서)
type MediaItem = {
  id: number;
  poster_path: string | null;
  name?: string | null; // tv title
  title?: string | null; // movie title
  media_type?: MediaType; // ✅ tv/movie 섞이면 보통 이 값이 옴 (trending/multi 등)
  isNetflixOriginal?: boolean;
};

const TrandingSeries: React.FC = () => {
  const { SeriesTop10, onFetchSeriesTop10 } = useNetflixStore() as {
    SeriesTop10: MediaItem[];
    onFetchSeriesTop10: () => void;
  };

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    onFetchSeriesTop10();
  }, [onFetchSeriesTop10]);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const getTitle = (item: MediaItem) =>
    (item.name ?? item.title ?? "title") as string;

  // ✅ type 결정: media_type이 있으면 그걸 쓰고, 없으면 name/title로 추론
  const getType = (item: MediaItem): MediaType => {
    if (item.media_type === "tv" || item.media_type === "movie")
      return item.media_type;
    // fallback: name 있으면 tv, title 있으면 movie
    if (item.name) return "tv";
    return "movie";
  };

  const onMouseDown: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    el.classList.add("dragging");

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
    el.classList.remove("dragging");
  };

  const onTouchStart: React.TouchEventHandler<HTMLUListElement> = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    el.classList.add("dragging");

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
      <p>급상승</p>

      <ul
        className="seriesTopList"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {SeriesTop10.map((item) => {
          const posterSrc = item.poster_path
            ? `${IMG_BASE}${item.poster_path}`
            : FALLBACK_POSTER;
          const type = getType(item);

          return (
            <li key={`${type}-${item.id}`} className="seriesItem">
              <Link to={`/${type}/${item.id}`}>
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
                      (e.currentTarget as HTMLImageElement).src =
                        FALLBACK_POSTER;
                    }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrandingSeries;
