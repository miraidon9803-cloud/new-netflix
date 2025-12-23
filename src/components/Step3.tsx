import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
// import "swiper/css/effect-coverflow";
import "./scss/Step3.scss";
import SideNav from "./SideNav";

type ToneValue = "warm" | "calm" | "dark" | "dreamy" | "tense" | "funny";

/* 카드 타입 */
interface SituationCard {
  id: number;
  images: string;
  label: string;
  value: ToneValue;
}

/* Step3 props */
interface Step3Props {
  onNext: (value: string) => void;
}

/* 카드 데이터 */
const situationCards: SituationCard[] = [
  { id: 1, label: "따듯한", value: "warm", images: "/images/card-01.png" },
  { id: 2, label: "차분한", value: "calm", images: "/images/card-01-1.png" },
  { id: 3, label: "어두운", value: "dark", images: "/images/card-01-2.png" },
  {
    id: 4,
    label: "몽환적인",
    value: "dreamy",
    images: "/images/card-01-3.png",
  },
  {
    id: 5,
    label: "긴장감 있는",
    value: "tense",
    images: "/images/card-01-4.png",
  },
  {
    id: 6,
    label: "웃을 수 있는",
    value: "funny",
    images: "/images/card-01-5.png",
  },
];

const Step3 = ({ onNext }: Step3Props) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleCardClick = (value: ToneValue, index: number) => {
    //중앙 카드만 클릭
    if (activeIndex !== index) return;

    onNext(value); // Result로 이동
  };

  return (
    <section className="step3_section">
      <SideNav />
      <div className="step3_textbox">
        <p className="step3_small">3단계</p>
        <h2 className="step3_title">어떤 분위기의 이야기가 좋으신가요?</h2>
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
        className="step3_swiper"
        onSlideChange={handleSlideChange}
      >
        {situationCards.map((card, index) => (
          <SwiperSlide key={card.id} className="step3_slide">
            <button
              className={`step3_card ${activeIndex === index ? "active" : ""}`}
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

export default Step3;
