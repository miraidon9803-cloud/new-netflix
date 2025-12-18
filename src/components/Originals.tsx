import React, { useRef } from "react";
import "./scss/Originals.scss";
import { Link } from "react-router-dom";

const imgs = [
  { id: 119051, src: "/images/Original/웬즈데이.png" }, // 웬즈데이
  { id: 63174, src: "/images/Original/루시퍼.png" }, // 루시퍼
  { id: 223300, src: "/images/Original/버려진 자들.png" }, // 버려진 자들
  { id: 71912, src: "/images/Original/위쳐.png" }, // 위쳐
  { id: 66732, src: "/images/Original/기묘한 이야기.png" }, // 기묘한 이야기
  { id: 93405, src: "/images/Original/오징어 게임.png" }, // 오징어 게임
  { id: 78191, src: "/images/Original/너의 모든 것.png" }, // 너의 모든 것 (YOU)
  { id: 252193, src: "/images/Original/이쿠사가미_전쟁의 신.png" }, // 이쿠사가미: 전쟁의 신
  { id: 110316, src: "/images/Original/아리스 인 보더랜드.png" }, // 아리스 인 보더랜드
  { id: 200709, src: "/images/Original/약한영웅.png" }, // 약한영웅
  { id: 42009, src: "/images/Original/블랙 미러.png" }, // 블랙 미러
  { id: 76669, src: "/images/Original/엘리트들.png" }, // 엘리트들
  { id: 250504, src: "/images/Original/내안의 괴물.png" }, // 내 안의 괴물
  { id: 77169, src: "/images/Original/코브라 카이.png" }, // 코브라 카이
  { id: 502, src: "/images/Original/세서미 스트리트.png" }, // 세서미 스트리트
  { id: 70523, src: "/images/Original/다크.png" }, // 다크
  { id: 63333, src: "/images/Original/라스트 킹덤.png" }, // 라스트 킹덤
  { id: 4656, src: "/images/Original/Raw.png" }, // RAW
  { id: 76669, src: "/images/Original/브리저튼.png" }, // 브리저튼
  { id: 286801, src: "/images/Original/괴물: 에드 게인 이야기.png" }, // 괴물: 에드 게인 이야기
];

const Originals: React.FC = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  // ✅ 드래그 상태
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

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

  // ✅ 터치 드래그(모바일)
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
    <div className="OriginalWrap">
      <p>넷플릭스 오리지널</p>

      <ul
        className="original"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {imgs.map((src, i) => (
          <li key={i}>
            <Link to={`/tv/${src.id}`}>
              <img src={src.src} alt="" draggable={false} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Originals;
