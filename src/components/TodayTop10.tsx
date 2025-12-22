import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNetflixStore } from "../store/NetflixStore";
import "./scss/Top10.scss";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/images/icon/no_poster.png";

type Top10Item = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;

  isNetflixOriginal?: boolean;
  isNew3Months?: boolean;
  isOld1Year?: boolean;
};

const TodayTop10: React.FC = () => {
  const { netflixTop10, onFetchNetflixTop10 } = useNetflixStore() as {
    netflixTop10: Top10Item[];
    onFetchNetflixTop10: () => void;
  };

  useEffect(() => {
    onFetchNetflixTop10();
  }, [onFetchNetflixTop10]);

  const getTitle = (item: Top10Item) =>
    (item.name ?? item.title ?? "poster") as string;

  const getBadgeType = (item: Top10Item): "netflix" | "new" | "old" | null => {
    if (item.isNetflixOriginal) return "netflix";
    if (item.isNew3Months) return "new";
    if (item.isOld1Year) return "old";
    return null;
  };

  return (
    <div className="top10Wrap">
      <h2>오늘의 TOP 10 시리즈</h2>

      <Swiper
        className="top10Swiper"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        freeMode
        mousewheel={{ forceToAxis: true }}
        spaceBetween={80} // ✅ 2.4rem 고정
      >
        {netflixTop10.map((item, index) => {
          const badge = getBadgeType(item);
          const posterSrc = item.poster_path
            ? `${IMG_BASE}${item.poster_path}`
            : FALLBACK_POSTER;

          return (
            <SwiperSlide key={item.id} className="top10Slide">
              <div className="top10Item">
                <span className="rank">{index + 1}</span>

                <Link
                  to={`/tv/${item.id}`}
                  className="posterWrap"
                  aria-label={getTitle(item)}
                >
                  {badge === "netflix" && (
                    <img
                      className="netflixBadge"
                      src="/images/icon/오리지널_뱃지.png"
                      alt="Netflix Original"
                      draggable={false}
                    />
                  )}

                  {badge === "new" && (
                    <img
                      className="newBadge"
                      src="/images/icon/뉴_뱃지.png"
                      alt="New"
                      draggable={false}
                    />
                  )}

                  {badge === "old" && (
                    <img
                      className="oldBadge"
                      src="/images/icon/곧 종료_뱃지.png"
                      alt="Ending Soon"
                      draggable={false}
                    />
                  )}

                  <img
                    className="poster"
                    src={posterSrc}
                    alt={getTitle(item)}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        FALLBACK_POSTER;
                    }}
                  />
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TodayTop10;
