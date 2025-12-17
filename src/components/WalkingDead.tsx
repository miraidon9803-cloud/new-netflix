import React, { useEffect, useRef } from "react";
import "./scss/Wakingdead.scss";
import { Link } from "react-router-dom";

const WALKING_DEAD_TV_ID = 1402;

const WalkingDeadList = [
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 0,
    src: "/images/워킹데드/메인.png",
    label: "메인",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 1,
    src: "/images/워킹데드/시즌1.png",
    label: "시즌 1",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 2,
    src: "/images/워킹데드/시즌2.png",
    label: "시즌 2",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 3,
    src: "/images/워킹데드/시즌3.png",
    label: "시즌 3",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 4,
    src: "/images/워킹데드/시즌4.png",
    label: "시즌 4",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 5,
    src: "/images/워킹데드/시즌5.png",
    label: "시즌 5",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 6,
    src: "/images/워킹데드/시즌6.png",
    label: "시즌 6",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 7,
    src: "/images/워킹데드/시즌7.png",
    label: "시즌 7",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 8,
    src: "/images/워킹데드/시즌8.png",
    label: "시즌 8",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 9,
    src: "/images/워킹데드/시즌9.png",
    label: "시즌 9",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 10,
    src: "/images/워킹데드/시즌10.png",
    label: "시즌 10",
  },
  {
    tvId: WALKING_DEAD_TV_ID,
    season: 11,
    src: "/images/워킹데드/시즌11.png",
    label: "시즌 11",
  },
];

const WalkingDead = () => {
  const scrollRef = useRef<HTMLUListElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      if ((atLeftEnd && e.deltaY < 0) || (atRightEnd && e.deltaY > 0)) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
    el.classList.add("is-dragging");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    const dx = e.clientX - startX.current;
    el.scrollLeft = startScrollLeft.current - dx;
  };

  const stopDragging = () => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.classList.remove("is-dragging");
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
        onMouseLeave={stopDragging}
      >
        {WalkingDeadList.map((item, i) => (
          <li key={`${item.tvId}-${item.season}`}>
            {i === 0 && (
              <button type="button">
                <img src="/images/icon/play.png" alt="play" />
                재생
              </button>
            )}

            <Link to={`/tv/${item.tvId}`} state={{ season: item.season }}>
              <img src={item.src} alt={item.label} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalkingDead;
