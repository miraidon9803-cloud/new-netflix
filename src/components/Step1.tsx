import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
// import "swiper/css/effect-coverflow";
import "./scss/Step1.scss";
import SideNav from "./SideNav";

/* 카드 타입 */
interface MoodCard {
  id: number;
  images: string; // 이미지 경로
  label: string; // 카드 하단에 표시될 라벨
  value: string;
}

/* Step1 props */
interface Step1Props {
  onNext: (value: string) => void;
}

/* 카드 데이터 */
const moodCards: MoodCard[] = [
  {
    id: 1,
    label: "감정이 깊어지는 이야기",
    value: "deep",
    images: "/images/pink.png",
  },
  {
    id: 2,
    label: "자극적인 이야기",
    value: "stimulating",
    images: "/images/yellow.png",
  },
  { id: 3, label: "편안한 이야기", value: "calm", images: "/images/green.png" },
  {
    id: 4,
    label: "현실을 벗어나기",
    value: "escape",
    images: "/images/blue.png",
  },
  {
    id: 5,
    label: "아무 생각없기",
    value: "blank",
    images: "/images/purple.png",
  },
];

const Step1 = ({ onNext }: Step1Props) => {
  const [activeIndex, setActiveIndex] = useState(2);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleCardClick = (value: string, index: number) => {
    // 중앙 카드만 선택되게 하고 싶다면 조건 추가 가능
    if (activeIndex !== index) return;

    onNext(value); // 여기서 Step2로 이동
  };

  return (
    <section className="step1_section">
      <SideNav />
      <div className="step1-textbox">
        <p className="step1_small">1단계</p>
        <h2 className="step1_title">지금, 가장 가까운 기분은 무엇인가요?</h2>
      </div>

      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        grabCursor
        slideToClickedSlide
        loop={false}
        initialSlide={2} // 배열 인덱스 2 (세 번째 카드)부터 시작
        coverflowEffect={{
          rotate: 30, // 회전 각도 초반50
          stretch: -120, // 겹침 정도 (마이너스 값이 클수록 많이 겹쳐짐)
          depth: 400, // 깊이감 (카드가 얼마나 튀어나오는지)
          modifier: 1, // 효과 배율
          slideShadows: false,
        }}
        className="step1_swiper"
        onSlideChange={handleSlideChange} // 슬라이드가 바뀔 때 상태 업데이트
      >
        {moodCards.map((card, index) => (
          <SwiperSlide key={card.id} className="step1_slide">
            <button
              className={`step1_card ${activeIndex === index ? "active" : ""}`}
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

export default Step1;
