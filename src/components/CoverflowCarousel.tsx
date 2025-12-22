import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import CountUp from "react-countup";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
// import "swiper/css/effect-coverflow";
import "./scss/CoverflowCarousel.scss";

interface SlideItem {
  id: number;
  title: string;
  image: string;
}

/* 원본 슬라이드 */
const slides: SlideItem[] = [
  { id: 1, title: "솔로지옥", image: "/images/nowplay/솔로지옥.png" },
  { id: 2, title: "빈센조", image: "/images/nowplay/빈센조.png" },
  { id: 3, title: "오렌지블랙", image: "/images/nowplay/오렌지블랙.png" },
  { id: 4, title: "퀸스 갬빗", image: "/images/nowplay/퀸스갬빗.png" },
  { id: 5, title: "오징어게임", image: "/images/nowplay/오징어게임.png" },
  { id: 6, title: "러브데스로봇", image: "/images/nowplay/러브데스로봇.png" },
  { id: 7, title: "승리호", image: "/images/nowplay/승리호.png" },
  { id: 8, title: "킹덤", image: "/images/nowplay/킹덤.png" },
  { id: 9, title: "스위트홈", image: "/images/nowplay/스위트홈.png" },
];

/* 가짜 루프용 슬라이드 (3배) */
const loopSlides: SlideItem[] = [...slides, ...slides, ...slides];

const CoverflowCarousel: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const baseLength = slides.length;

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;

    const interval = setInterval(() => {
      swiper.slideNext(600);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="coverflow">
      <div className="coverflow_inner">
        {/* 타이틀 */}
        <div className="coverflow_title">
          <h3>끝없는 즐거움의 세계, 만날 준비 되셨나요?</h3>
          <p>다양한 시리즈와 영화를 감상하세요</p>
        </div>
      </div>
      <div className="coverflow_full">
        {/* 커버플로우 */}
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          centeredSlides
          slidesPerView="auto"
          grabCursor
          loop={false} // ❌ Swiper 기본 loop 사용 안 함
          initialSlide={baseLength} // ⭐ 처음 보이는 화면 그대로 유지
          watchSlidesProgress
          speed={600}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          className="coverflow_swiper"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            const index = swiper.activeIndex;

            // ⬅️ 너무 왼쪽으로 가면 중앙으로 순간 이동
            if (index < baseLength) {
              swiper.slideTo(index + baseLength, 0);
            }

            // ➡️ 너무 오른쪽으로 가면 중앙으로 순간 이동
            if (index >= baseLength * 2) {
              swiper.slideTo(index - baseLength, 0);
            }
          }}
        >
          {loopSlides.map((slide, idx) => (
            <SwiperSlide key={`${slide.id}-${idx}`} className="coverflow_slide">
              <img src={slide.image} alt={slide.title} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="coverflow_inner">
        {/* 통계 */}
        <div className="coverflow_stats">
          <div className="stat stat-left">
            <CountUp
              end={316_300_000}
              duration={2.5}
              separator=","
              className="stat_number"
            />
            <span className="stat_label">전 세계 구독자</span>
          </div>

          <div className="stat stat-right">
            <CountUp
              end={18_000}
              duration={2}
              separator=","
              className="stat_number"
            />
            <span className="stat_label">여 편의 작품</span>
          </div>

          <div className="stat stat-center">
            <CountUp
              end={100_000_000}
              duration={2.5}
              separator=","
              className="stat_number"
            />
            <span className="stat_label">누적 시청 시간</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverflowCarousel;
