import React, { useEffect, useRef } from 'react';
import './scss/InfiniSubmenu.scss';

// ✔ 메뉴 배열
const subMenus = [
  '예능',
  '한국',
  '외국',
  '액션',
  '코미디',
  '스포츠',
  '키즈&가족',
  '로맨스',
  '드라마',
  '호러',
  '스릴러',
  'SF',
  '판타지',
  '애니메이션',
  '다큐멘터리',
  '할리우드',
  '뮤지컬',
] as const;

const InfiniSubmenu: React.FC = () => {
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
      const item = children[i] as HTMLElement;
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
    el.classList.add('is-dragging');
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
    el.classList.remove('is-dragging');
  };

  // ✅ 마우스가 메뉴 위에 있을 때 휠 = 가로 스크롤 + 페이지 세로 스크롤 차단(양끝 제외)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft <= 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // ✅ 양 끝에서 더 가려고 하면 페이지 스크롤 허용
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) return;

      // ✅ 그 외엔 무조건 가로 스크롤로 소비(페이지 안 내려감)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="submenu-wrap">
      <div
        className="submenu-scroll"
        ref={scrollRef}
        onScroll={handleInfiniteScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpLeave}
        onMouseLeave={handleMouseUpLeave}>
        {infiMenu.map((item, idx) => (
          <button key={idx} className="submenu-item" type="button">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InfiniSubmenu;
