import React from 'react';
import './scss/Originals.scss';
import { Link } from 'react-router-dom';

// ✅ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode, Mousewheel } from 'swiper/modules';

const imgs = [
  { id: 119051, src: '/images/Original/웬즈데이.png' },
  { id: 63174, src: '/images/Original/루시퍼.png' },
  { id: 223300, src: '/images/Original/버려진 자들.png' },
  { id: 71912, src: '/images/Original/위쳐.png' },
  { id: 66732, src: '/images/Original/기묘한 이야기.png' },
  { id: 93405, src: '/images/Original/오징어 게임.png' },
  { id: 78191, src: '/images/Original/너의 모든 것.png' },
  { id: 252193, src: '/images/Original/이쿠사가미_전쟁의 신.png' },
  { id: 110316, src: '/images/Original/아리스 인 보더랜드.png' },
  { id: 200709, src: '/images/Original/약한영웅.png' },
  { id: 42009, src: '/images/Original/블랙 미러.png' },
  { id: 76669, src: '/images/Original/엘리트들.png' },
  { id: 250504, src: '/images/Original/내안의 괴물.png' },
  { id: 77169, src: '/images/Original/코브라 카이.png' },
  { id: 502, src: '/images/Original/세서미 스트리트.png' },
  { id: 70523, src: '/images/Original/다크.png' },
  { id: 63333, src: '/images/Original/라스트 킹덤.png' },
  { id: 4656, src: '/images/Original/Raw.png' },
  { id: 76669, src: '/images/Original/브리저튼.png' },
  { id: 286801, src: '/images/Original/괴물: 에드 게인 이야기.png' },
];

const Originals: React.FC = () => {
  return (
    <div className="OriginalWrap">
      <p>넷플릭스 오리지널</p>

      <Swiper
        className="originalSwiper"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={24}
        freeMode
        mousewheel={{ forceToAxis: true }}
      >
        {imgs.map((item) => (
          <SwiperSlide key={`${item.id}-${item.src}`} className="originalSlide">
            <Link to={`/tv/${item.id}`} className="originalLink" aria-label="original">
              <img src={item.src} alt="" className="originalImg" draggable={false} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Originals;
