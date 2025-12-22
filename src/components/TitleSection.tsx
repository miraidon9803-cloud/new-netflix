import { useState } from "react";
import WishlistPopup from "./WishlistPopup";
import type { WishlistContent } from "../store/WishlistStore";
import RatingBadge from "./RatingBadge";
import type { Genre } from "../types/movie";

const PROFILE_IMG = "https://image.tmdb.org/t/p/w185";
const FALLBACK_PROFILE = "/images/icon/no_profile.png";

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}
interface TitleSectionProps {
  title: string;
  rating?: string | null;
  firstAirDate?: string;
  selectedSeasonNumber?: number | null;
  overview?: string;
  onPlayDefault: () => void;
  contentId: number;
  posterPath?: string | null;
  backdropPath?: string | null;
  mediaType: "tv" | "movie";
  voteAverage?: number;
  onLike?: () => void;
  onDownload?: () => void;

  /** movie */
  directors?: Person[];
  runtime?: number;

  /** tv */
  creator?: {
    name: string;
    profile_path: string | null;
  };
  creators?: Person[];

  /** common */
  topCast?: {
    id: number;
    name: string;
    profile_path?: string | null;
    character?: string;
  }[];

  genres: Genre[];
  keywords?: {
    id: number;
    name: string;
  }[];
}

export const TitleSection = ({
  title,
  rating,
  firstAirDate,
  selectedSeasonNumber,
  overview,
  onPlayDefault,
  contentId,
  posterPath,
  mediaType,
  onLike,
  onDownload,
  creator,
  directors = [],
  runtime,
  topCast = [],
  genres = [],
  keywords = [],
}: TitleSectionProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [actions, setActions] = useState({
    liked: false,
    wishlisted: false,
    downloaded: false,
  });

  const toggleAction = (key: "liked" | "wishlisted" | "downloaded") => {
    setActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLike = () => {
    if (!onLike) return;
    onLike();
    toggleAction("liked");
  };

  const handleDownload = () => {
    if (!onDownload) return;
    onDownload();
    toggleAction("downloaded");
  };

  const wishlistContent: WishlistContent = {
    id: contentId,
    title,
    poster_path: posterPath ?? null,
    media_type: mediaType,
  };

  return (
    <>
      <div className="text-box">
        <div className="title-wrap">
          <h1>{title}</h1>
          <button type="button" onClick={onPlayDefault}>
            재생
          </button>
        </div>

        <div className="text-content">
          <RatingBadge rating={rating} />
          {firstAirDate && <p>{firstAirDate}</p>}
          {selectedSeasonNumber && <p>시즌 {selectedSeasonNumber}</p>}
          <p className="HD">
            <img src="/images/HD.png" alt="HD" />
          </p>
        </div>

        {overview && (
          <div className="text-fads">
            <p>{overview}</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="btn-wrap">
          <button
            className={actions.wishlisted ? "active" : ""}
            onClick={() => {
              toggleAction("wishlisted");
              setShowWishlistPopup(true);
            }}
          >
            <img
              src={
                actions.wishlisted
                  ? "/images/icon/icon-heart-act.png"
                  : "/images/icon/icon-heart.png"
              }
              alt="위시리스트"
            />
            <span>위시리스트</span>
          </button>

          <button
            className={actions.liked ? "active" : ""}
            onClick={handleLike}
          >
            <img
              src={
                actions.liked
                  ? "/images/icon/icon-like-act.png"
                  : "/images/icon/icon-like.png"
              }
              alt="좋아요"
            />
            <span>좋아요</span>
          </button>

          <button
            className={actions.downloaded ? "active" : ""}
            onClick={handleDownload}
          >
            <img src="/images/icon/icon-download.png" alt="다운로드" />
            <span>다운로드</span>
          </button>

          <button>
            <img src="/images/icon/icon-paper-plane.png" alt="공유" />
            <span>공유</span>
          </button>
        </div>

        {/* 더보기 버튼 */}
        <p
          className={`more-btn ${moreOpen ? "open" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setMoreOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMoreOpen((v) => !v);
          }}
        >
          정보 더보기 {moreOpen ? "-" : "+"}
        </p>

        {/* 더보기 패널 */}
        {moreOpen && (
          <div className="more-panel">
            {/* 감독 */}
            {directors.length > 0 && (
              <div className="row" style={{ flexDirection: "column" }}>
                <span className="label">감독</span>
                <ul className="cast-list">
                  {directors.map((person) => (
                    <li key={person.id} className="cast-item">
                      <div className="cast-img">
                        <img
                          src={
                            person.profile_path
                              ? `${PROFILE_IMG}${person.profile_path}`
                              : FALLBACK_PROFILE
                          }
                        />
                      </div>
                      <p className="cast-name">{person.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 제작자 (TV) */}
            {mediaType === "tv" && creator && (
              <div className="row" style={{ flexDirection: "column" }}>
                <span className="label">제작자</span>
                <ul className="cast-list">
                  <li className="cast-item">
                    <div className="cast-img">
                      <img
                        src={FALLBACK_PROFILE} // 항상 fallback 이미지
                        alt={creator.name}
                      />
                    </div>
                    <p className="cast-name">{creator.name}</p>
                  </li>
                </ul>
              </div>
            )}
            {/* 러닝타임 */}
            {runtime != null && (
              <div className="row">
                <span className="label">러닝타임</span>
                <span className="value">{runtime}분</span>
              </div>
            )}

            {/* 출연진 */}
            {topCast.length > 0 && (
              <div className="row" style={{ flexDirection: "column" }}>
                <span className="label">출연</span>
                <ul className="cast-list">
                  {topCast.map((cast) => (
                    <li key={cast.id} className="cast-item">
                      <div className="cast-img">
                        <img
                          src={
                            cast.profile_path
                              ? `${PROFILE_IMG}${cast.profile_path}`
                              : FALLBACK_PROFILE
                          }
                          alt={cast.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_PROFILE;
                          }}
                        />
                      </div>
                      <p className="cast-name">{cast.name}</p>
                      {cast.character && (
                        <p className="cast-role">{cast.character}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 장르 */}
            {genres.length > 0 && (
              <div className="row">
                <span className="label">장르</span>
                <span className="value">{genres.join(", ")}</span>
              </div>
            )}

            {/* 키워드 */}
            {keywords.length > 0 && (
              <div className="row">
                <span className="label">키워드</span>
                <span className="value">
                  {keywords
                    .slice(0, 5)
                    .map((k) => k.name)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {showWishlistPopup && (
        <WishlistPopup
          content={wishlistContent}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </>
  );
};

export default TitleSection;
