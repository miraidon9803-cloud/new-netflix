import React, { useEffect, useMemo } from "react";
import { useNetflixStore } from "../store/NetflixStore";
import "./scss/SFNFantasy.scss";
import { Link } from "react-router-dom";

// ✅ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/images/icon/no_poster.png";

type MediaType = "tv" | "movie";

type SFItem = {
  id: number;
  poster_path: string | null;
  name?: string | null;
  title?: string | null;
  media_type?: MediaType;

  isNetflixOriginal?: boolean;
  isNew3Months?: boolean;
  isOld1Year?: boolean;
};

/* ✅ 랜덤 셔플 (Fisher–Yates) */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const SFNFantasy: React.FC = () => {
  const { SFNFTop10, onFetchSFTop10 } = useNetflixStore() as {
    SFNFTop10: SFItem[];
    onFetchSFTop10: () => void;
  };

  useEffect(() => {
    onFetchSFTop10();
  }, [onFetchSFTop10]);

  /* ✅ store 데이터 바뀔 때마다 1번만 랜덤 */
  const randomizedList = useMemo(() => shuffle(SFNFTop10 ?? []), [SFNFTop10]);

  const getTitle = (item: SFItem) => (item.name ?? item.title ?? "poster") as string;

  const getType = (item: SFItem): MediaType => {
    if (item.media_type === "tv" || item.media_type === "movie") return item.media_type;
    if (item.name) return "tv";
    return "movie";
  };

  const getBadgeType = (item: SFItem): "netflix" | "new" | "old" | null => {
    if (item.isNetflixOriginal) return "netflix";
    if (item.isNew3Months) return "new";
    if (item.isOld1Year) return "old";
    return null;
  };

  return (
    <div className="sfTopWrap">
      <p>SF&판타지 시리즈</p>

      <Swiper
        className="sfTopSwiper"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={24}
        freeMode
        mousewheel={{ forceToAxis: true }}
      >
        {randomizedList.map((item) => {
          const type = getType(item);
          const badge = getBadgeType(item);

          const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;

          return (
            <SwiperSlide key={`${type}-${item.id}`} className="sfTopSlide">
              <Link to={`/${type}/${item.id}`} className="sfItem" aria-label={getTitle(item)}>
                <div className="posterWrap">
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
                      alt="New (3 months)"
                      draggable={false}
                    />
                  )}

                  {badge === "old" && (
                    <img
                      className="oldBadge"
                      src="/images/icon/곧 종료_뱃지.png"
                      alt="Old (1 year+)"
                      draggable={false}
                    />
                  )}

                  <img
                    className="poster"
                    src={posterSrc}
                    alt={getTitle(item)}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                    }}
                  />
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SFNFantasy;
