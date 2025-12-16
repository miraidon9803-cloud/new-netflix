// CoverflowCarousel.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import CountUp from "react-countup";

import "./scss/CoverflowCarousel.scss";

interface SlideItem {
  id: number;
  title: string;
  image: string;
}

const slides: SlideItem[] = [
  { id: 1, title: "스물다섯스물하나", image: "/images/nowplay/스물다섯스물하나.png" },
  { id: 2, title: "빈센조", image: "/images/nowplay/빈센조.png" },
  { id: 3, title: "솔로지옥", image: "/images/nowplay/솔로지옥.png" },
  { id: 4, title: "퀸스 갬빗", image: "/images/nowplay/퀸스갬빗.png" },
  { id: 5, title: "러브데스로봇", image: "/images/nowplay/러브데스로봇.png" },
  { id: 6, title: "고요의바다", image: "/images/nowplay/고요의바다.png" },
];

const CoverflowCarousel: React.FC = () => {
  return (
    <section className="coverflow">
      {/* 타이틀 */}
      <div className="coverflow_title">
        <h3>끝없는 즐거움의 세계, 만날 준비 되셨나요?</h3>
        <p>다양한 시리즈와 영화를 감상하세요</p>
      </div>

      {/* 커버플로우 */}
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        loopAdditionalSlides={slides.length}
        watchSlidesProgress
        coverflowEffect={{
          rotate: 0,
          stretch: 120,
          depth: 320,
          modifier: 1.2,
          slideShadows: false,
        }}
        className="coverflow_swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="coverflow_slide">
            <img src={slide.image} alt={slide.title} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 통계 */}
      <div className="coverflow_stats">
        <div className="stat">
          <strong>
            <CountUp end={316_300_000} duration={2.5} separator="," />
          </strong>
          <span>전 세계 구독자</span>
        </div>

        <div className="stat">
          <strong>
            <CountUp end={18_000} duration={2} separator="," />
          </strong>
          <span>여 편의 작품</span>
        </div>

        <div className="stat">
          <strong>
            <CountUp end={100_000_000} duration={2.5} separator="," />
          </strong>
          <span>누적 시청 시간</span>
        </div>
      </div>
    </section>
  );
};

export default CoverflowCarousel;