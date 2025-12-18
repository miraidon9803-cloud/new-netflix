import React, { useEffect, useMemo, useRef } from "react";
import { useNetflixStore } from "../store/NetflixStore";
import "./scss/SFNFantasy.scss";
import { Link } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/images/icon/no_poster.png";

type MediaType = "tv" | "movie";

type SFItem = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;

  // ✅ tv/movie 섞이면 이 값이 필요
  media_type?: MediaType;

  isNetflixOriginal?: boolean;
  isNew3Months?: boolean;
  isOld1Year?: boolean;
};

/* ✅ 랜덤 셔플 (Fisher–Yates) */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const SFNFantasy: React.FC = () => {
  const { SFNFTop10, onFetchSFTop10 } = useNetflixStore() as {
    SFNFTop10: SFItem[];
    onFetchSFTop10: () => void;
  };

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    onFetchSFTop10();
  }, [onFetchSFTop10]);

  /* ✅ store 데이터가 바뀔 때마다 1번만 랜덤 */
  const randomizedList = useMemo(() => {
    return shuffle(SFNFTop10 ?? []);
  }, [SFNFTop10]);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const getTitle = (item: SFItem) =>
    (item.name ?? item.title ?? "poster") as string;

  // ✅ type 결정: media_type 있으면 사용, 없으면 name/title로 추론
  const getType = (item: SFItem): MediaType => {
    if (item.media_type === "tv" || item.media_type === "movie")
      return item.media_type;
    if (item.name) return "tv";
    return "movie";
  };

  const getBadgeType = (item: SFItem): "netflix" | "new" | "old" | null => {
    if (item.isNetflixOriginal) return "netflix";
    if (item.isNew3Months) return "new";
    if (item.isOld1Year) return "old";
    return null;
  };

  // ✅ 마우스 드래그
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
    if (!el || !isDraggingRef.current) return;

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

  // ✅ 터치 드래그
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
    if (!el || !isDraggingRef.current) return;

    const dx = e.touches[0].pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  return (
    <div className="sfTopWrap">
      <p>SF&판타지 시리즈</p>

      <ul
        className="sfTopList"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {randomizedList.map((item) => {
          const type = getType(item); // ✅ 여기서 type 생성
          const badge = getBadgeType(item);

          const posterSrc = item.poster_path
            ? `${IMG_BASE}${item.poster_path}`
            : FALLBACK_POSTER;

          return (
            <li key={`${type}-${item.id}`} className="sfItem">
              <Link to={`/${type}/${item.id}`}>
                <div className="posterWrap">
                  {badge === "netflix" && (
                    <img
                      className="netflixBadge"
                      src="/images/icon/오리지널_뱃지.png"
                      alt="Netflix Original"
                      draggable={false}
                    />
                  )}

                  {badge === "new" && (
                    <img
                      className="newBadge"
                      src="/images/icon/뉴_뱃지.png"
                      alt="New (3 months)"
                      draggable={false}
                    />
                  )}

                  {badge === "old" && (
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

export default SFNFantasy;
