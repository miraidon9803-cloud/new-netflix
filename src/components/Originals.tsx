import React, { useEffect, useRef } from 'react';
import './scss/Originals.scss';

const imgs = [
  '/images/Original/웬즈데이.png',
  '/images/Original/루시퍼.png',
  '/images/Original/버려진 자들.png',
  '/images/Original/위쳐.png',
  '/images/Original/기묘한 이야기.png',
  '/images/Original/오징어 게임.png',
  '/images/Original/너의 모든 것.png',
  '/images/Original/이쿠사가미_전쟁의 신.png',
  '/images/Original/아리스 인 보더랜드.png',
  '/images/Original/약한영웅.png',
  '/images/Original/블랙 미러.png',
  '/images/Original/엘리트들.png',
  '/images/Original/내안의 괴물.png',
  '/images/Original/코브라 카이.png',
  '/images/Original/세서미 스트리트.png',
  '/images/Original/다크.png',
  '/images/Original/라스트 킹덤.png',
  '/images/Original/Raw.png',
  '/images/Original/브리저튼.png',
  '/images/Original/괴물: 에드 게인 이야기.png',
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

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="OriginalWrap">
      <p>넷플릭스 오리지널</p>

      <ul className="original" ref={scrollRef}>
        {imgs.map((src, i) => (
          <li key={i}>
            <img src={src} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Originals;
