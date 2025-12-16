import { useEffect, useRef } from "react";
import "./scss/Originals.scss";
import { Link } from "react-router-dom";

const originals = [
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
const Originals = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      // 양 끝에서는 페이지 스크롤 허용
      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) {
        return;
      }

      // 그 외에는 강제로 가로 스크롤
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="OriginalWrap">
      <p>넷플릭스 오리지널</p>

      <ul className="original" ref={scrollRef}>
        {originals.map((src, i) => (
          <li key={i}>
            <Link to={`/tv/${src.id}`}>
              <img src={src.src} alt="" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Originals;
