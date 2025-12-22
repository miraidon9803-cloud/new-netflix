import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/InfiniSubmenu.scss";

//  메뉴 배열 (네가 준 장르로 교체)
const subMenus = [
  "액션",
  "모험",
  "애니메이션",
  "코미디",
  "범죄",
  "다큐멘터리",
  "드라마",
  "가족",
  "판타지",
  "역사",
  "공포",
  "음악",
  "미스터리",
  "로맨스",
  "SF",
  "스릴러",
  "전쟁",
  "서부극",
  "TV 영화",
] as const;

type MenuLabel = (typeof subMenus)[number];

//  TMDB Movie 장르 ID
const MOVIE_GENRE_ID: Record<MenuLabel, number> = {
  액션: 28,
  모험: 12,
  애니메이션: 16,
  코미디: 35,
  범죄: 80,
  다큐멘터리: 99,
  드라마: 18,
  가족: 10751,
  판타지: 14,
  역사: 36,
  공포: 27,
  음악: 10402,
  미스터리: 9648,
  로맨스: 10749,
  SF: 878,
  스릴러: 53,
  전쟁: 10752,
  서부극: 37,
  "TV 영화": 10770,
};

// TMDB TV 장르 ID
// TV는 액션/모험이 Action & Adventure(10759)로 묶임
// SF/판타지는 Sci-Fi & Fantasy(10765)로 묶임
const TV_GENRE_ID: Record<MenuLabel, number> = {
  액션: 10759,
  모험: 10759,
  애니메이션: 16,
  코미디: 35,
  범죄: 80,
  다큐멘터리: 99,
  드라마: 18,
  가족: 10751,
  판타지: 10765,
  역사: 36,
  공포: 9648, // TV Horror 단독이 없어서 미스터리 계열로 매핑
  음악: 10402,
  미스터리: 9648,
  로맨스: 10749,
  SF: 10765,
  스릴러: 9648,
  전쟁: 10768, // War & Politics
  서부극: 37,
  "TV 영화": 10770,
};

const InfiniSubmenu: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // 메뉴 배열 3배 복제 (무한 스크롤 기반)
  const infiMenu = [...subMenus, ...subMenus, ...subMenus];

  // 세트 1개의 width 계산 함수
  const getOneSetWidth = () => {
    const el = scrollRef.current;
    if (!el) return 0;

    const children = el.children;
    let width = 0;

    // 원본 메뉴 개수만큼 합산
    for (let i = 0; i < subMenus.length; i++) {
      const item = children[i] as HTMLElement | undefined;
      if (!item) break;
      width += item.offsetWidth + 12; // gap 12px
    }
    return width;
  };

  // 화면 렌더 후 가운데 세트에서 시작
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const oneSetWidth = getOneSetWidth();
    el.scrollLeft = oneSetWidth; // 가운데 세트로 이동
  }, []);

  // 무한 스크롤 유지
  const handleInfiniteScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const oneSetWidth = getOneSetWidth();
    if (!oneSetWidth) return;

    const left = el.scrollLeft;

    if (left < 20) el.scrollLeft = left + oneSetWidth;
    else if (left > oneSetWidth * 2 - 20) el.scrollLeft = left - oneSetWidth;
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
    el.classList.add("is-dragging");
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    const dx = e.clientX - startX.current;
    el.scrollLeft = startScrollLeft.current - dx;
  };

  // 드래그 종료
  const handleMouseUpLeave = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.classList.remove("is-dragging");
  };

  // 휠 가로 스크롤 + 페이지 세로 스크롤 차단(양끝 제외)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft <= 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // 양 끝에서 더 가려고 하면 페이지 스크롤 허용
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) return;

      // 그 외엔 가로 스크롤로 소비(페이지 안 내려감)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  //  클릭 시 TotalFilter로 이동
  const onClickGenre = (label: MenuLabel) => {
    const genreMovie = MOVIE_GENRE_ID[label];
    const genreTv = TV_GENRE_ID[label];

    navigate(
      `/total-filter?label=${encodeURIComponent(
        label
      )}&genreMovie=${genreMovie}&genreTv=${genreTv}`
    );
  };

  return (
    <div className="submenu-wrap">
      <div
        className="submenu-scroll"
        ref={scrollRef}
        onScroll={handleInfiniteScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpLeave}
        onMouseLeave={handleMouseUpLeave}
      >
        {infiMenu.map((item, idx) => (
          <button
            key={idx}
            className="submenu-item"
            type="button"
            onClick={() => onClickGenre(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InfiniSubmenu;
