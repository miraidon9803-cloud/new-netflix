import React, { useEffect, useRef } from 'react';
import './scss/Wakingdead.scss';

const WalkingDeadList = [
  '/images/워킹데드/메인.png',
  '/images/워킹데드/시즌1.png',
  '/images/워킹데드/시즌2.png',
  '/images/워킹데드/시즌3.png',
  '/images/워킹데드/시즌4.png',
  '/images/워킹데드/시즌5.png',
  '/images/워킹데드/시즌6.png',
  '/images/워킹데드/시즌7.png',
  '/images/워킹데드/시즌8.png',
  '/images/워킹데드/시즌9.png',
  '/images/워킹데드/시즌10.png',
  '/images/워킹데드/시즌11.png',
];

const WalkingDead = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  // 드래그 상태 관리
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // 🔥 휠 → 가로 스크롤 & 끝에서만 페이지 스크롤 허용
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // 끝에서 더 가려고 하면 → 페이지 스크롤 허용
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) {
        return;
      }

      // 그 외엔 가로 스크롤 강제
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ✋ 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault(); // 텍스트 / 이미지 드래그 선택 방지

    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
    el.classList.add('is-dragging');
  };

  // 🖱 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    const dx = e.clientX - startX.current;
    el.scrollLeft = startScrollLeft.current - dx;
  };

  // 🧊 드래그 종료
  const stopDragging = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.classList.remove('is-dragging');
  };

  return (
    <div className="walking">
      <p>워킹데드 몰아보기</p>

      <ul
        ref={scrollRef}
        className="walking-list"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}>
        {WalkingDeadList.map((src, i) => (
          <li key={i}>
            {i === 0 && (
              <button>
                <img src="/images/icon/play.png" alt="play" />
                재생
              </button>
            )}
            <img src={src} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalkingDead;
