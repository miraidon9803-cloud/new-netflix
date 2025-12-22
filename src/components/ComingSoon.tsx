import { useEffect, useRef } from "react";
import "./scss/Comingsoon.scss";

const coming = [
  "/images/comingsoon/자백의대가.png",
  "/images/comingsoon/나이브스아웃.png",
  "/images/comingsoon/캐셔로.png",
  "/images/comingsoon/살인자리포트.png",
];
// 🔥 휠 → 가로 스크롤 & 끝에서만 페이지 스크롤 허용

const ComingSoon = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

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

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  return (
    <div className="comingsoon">
      <p>NEW 공개 예정 콘텐츠</p>
      <ul ref={scrollRef} className="cominglist">
        {coming.map((src, i) => (
          <li className="comingimg" key={i}>
            <img src={src} alt="comingBanner" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComingSoon;
