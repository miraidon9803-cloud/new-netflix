import React from "react";
import "./scss/Nowplay.scss";
import { Link } from "react-router-dom";

// ✅ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";

type PlayItem = {
  id: number;
  type: "tv" | "movie";
  src: string;
};

const play: PlayItem[] = [
  { id: 70593, type: "tv", src: "/images/nowplay/킹덤.png" },
  { id: 197067, type: "tv", src: "/images/nowplay/우영우.png" },
  { id: 97970, type: "tv", src: "/images/nowplay/수리남.png" },
  { id: 725201, type: "movie", src: "/images/nowplay/그레이맨.png" },
  { id: 129888, type: "tv", src: "/images/nowplay/스물다섯스물하나.png" },
  { id: 96162, type: "tv", src: "/images/nowplay/이태원클라스.png" },
  { id: 293613, type: "tv", src: "/images/nowplay/피지컬아시아.png" },
  { id: 196268, type: "tv", src: "/images/nowplay/안나.png" },
  { id: 154887, type: "tv", src: "/images/nowplay/나의해방일지.png" },
  { id: 509967, type: "movie", src: "/images/nowplay/6언더그라운드.png" },
  { id: 11529, type: "movie", src: "/images/nowplay/스위트알라바마.png" },
  { id: 63351, type: "tv", src: "/images/nowplay/나르코스.png" },
  { id: 492188, type: "movie", src: "/images/nowplay/결혼이야기.png" },
  { id: 113268, type: "tv", src: "/images/nowplay/경의로운소문.png" },
  { id: 63174, type: "tv", src: "/images/nowplay/루시퍼.png" },
  { id: 210757, type: "tv", src: "/images/nowplay/루머의루머의루머.png" },
  { id: 96648, type: "tv", src: "/images/nowplay/스위트홈.png" },
  { id: 91239, type: "tv", src: "/images/nowplay/브리저튼.png" },
  { id: 86423, type: "tv", src: "/images/nowplay/로크앤키.png" },
  { id: 78191, type: "tv", src: "/images/nowplay/너의모든것.png" },
  { id: 118990, type: "tv", src: "/images/nowplay/고요의바다.png" },
  { id: 71446, type: "tv", src: "/images/nowplay/종이의집.png" },
  { id: 256556, type: "tv", src: "/images/nowplay/흑백요리사.png" },
  { id: 696806, type: "movie", src: "/images/nowplay/애덤프로젝트.png" },
  { id: 65494, type: "tv", src: "/images/nowplay/더크라운.png" },
  { id: 66732, type: "tv", src: "/images/nowplay/기묘한이야기.png" },
  { id: 96677, type: "tv", src: "/images/nowplay/뤼팽.png" },
  { id: 70523, type: "tv", src: "/images/nowplay/다크.png" },
  { id: 126943, type: "tv", src: "/images/nowplay/마이네임.png" },
  { id: 117183, type: "tv", src: "/images/nowplay/엣지러너.png" },
  { id: 94796, type: "tv", src: "/images/nowplay/사랑의불시착.png" },
  { id: 63333, type: "tv", src: "/images/nowplay/라스트킹덤.png" },
  { id: 125988, type: "tv", src: "/images/nowplay/지금우리학교는.png" },
  { id: 125678, type: "tv", src: "/images/nowplay/DP.png" },
  { id: 152450, type: "tv", src: "/images/nowplay/사내맞선.png" },
  { id: 135753, type: "tv", src: "/images/nowplay/솔로지옥.png" },
  { id: 100088, type: "tv", src: "/images/nowplay/빈센조.png" },
  { id: 1424, type: "tv", src: "/images/nowplay/오렌지블랙.png" },
  { id: 87739, type: "tv", src: "/images/nowplay/퀸스갬빗.png" },
  { id: 93405, type: "tv", src: "/images/nowplay/오징어게임.png" },
  { id: 86831, type: "tv", src: "/images/nowplay/러브데스로봇.png" },
  { id: 581389, type: "movie", src: "/images/nowplay/승리호.png" },
  { id: 512195, type: "movie", src: "/images/nowplay/레드노티스.png" },
];

const NowPlay: React.FC = () => {
  return (
    <div className="playWrap">
      <p>지금 방영 중인 콘텐츠</p>

      <Swiper
        className="nowplaySwiper"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={24}
        freeMode
        mousewheel={{ forceToAxis: true }}
      >
        {play.map((item, i) => (
          <SwiperSlide key={`${item.type}-${item.id}-${i}`} className="nowplaySlide">
            <Link to={`/${item.type}/${item.id}`} className="nowplayLink" aria-label="go detail">
              <img src={item.src} alt="" draggable={false} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NowPlay;
