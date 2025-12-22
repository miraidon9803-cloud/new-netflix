import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
// import "swiper/css/effect-coverflow";
import "./scss/Step2.scss";
import SideNav from "./SideNav";

type FlowValue = "light" | "medium" | "immersive" | "binge";

/* 카드 타입 */
interface FlowCard {
  id: number;
  images: string;
  label: string;
  value: FlowValue;
}

/* Step2 props */
interface Step2Props {
  onNext: (value: string) => void;
  onPrev: () => void;
}

/* 카드 데이터 */
const flowCards: FlowCard[] = [
  {
    id: 1,
    label: "가볍게 보고 싶어요",
    value: "light",
    images: "/images/card-1.png",
  },
  {
    id: 2,
    label: "적당히 몰입하고 싶어요",
    value: "medium",
    images: "/images/card-1-1.png",
  },
  {
    id: 3,
    label: "시간 가는 줄 몰랐어요",
    value: "immersive",
    images: "/images/card-1-2.png",
  },
  {
    id: 4,
    label: "정주행하고 싶어요",
    value: "binge",
    images: "/images/card-1-3.png",
  },
];

const Step2 = ({ onNext }: Step2Props) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleCardClick = (value: FlowValue, index: number) => {
    // ⭐ 중앙 카드만 클릭 가능
    if (activeIndex !== index) return;

    onNext(value); // Step3으로 이동
  };

  return (
    <section className="step2_section">
      <SideNav />
      <div className="step2_textbox">
        <p className="step2_small">2단계</p>
        <h2 className="step2_title">오늘은 어느 정도의 몰입을 원하시나요?</h2>
      </div>

      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        grabCursor
        slideToClickedSlide
        initialSlide={1}
        coverflowEffect={{
          rotate: 30,
          stretch: -120,
          depth: 400,
          modifier: 1,
          slideShadows: false,
        }}
        className="step2_swiper"
        onSlideChange={handleSlideChange}
      >
        {flowCards.map((card, index) => (
          <SwiperSlide key={card.id} className="step2_slide">
            <button
              className={`step2_card ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleCardClick(card.value, index)}
            >
              <img src={card.images} alt={card.label} />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Step2;
