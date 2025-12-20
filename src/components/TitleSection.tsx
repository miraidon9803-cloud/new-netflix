import { useState } from "react";
import WishlistPopup from "./WishlistPopup";
import type { WishlistContent } from "../store/WishlistStore";
import RatingBadge from "./RatingBadge";

interface TitleSectionProps {
  title: string;
  rating?: string | null;
  firstAirDate?: string;
  selectedSeasonNumber: number | null;
  overview?: string;
  onPlayDefault: () => void;
  contentId: number;
  posterPath?: string | null;
  backdropPath?: string | null;
  mediaType: "tv" | "movie";
  voteAverage?: number;
  onLike?: () => void;
  onDownload?: () => void;
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
  backdropPath,
  mediaType,
  voteAverage,
  onLike,
  onDownload,
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
    if (onLike) {
      onLike();
      toggleAction("liked");
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      toggleAction("downloaded");
    }
  };

  const wishlistContent: WishlistContent = {
    id: contentId,
    title: title,
    poster_path: posterPath || null,
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
          <p>{firstAirDate}</p>
          {selectedSeasonNumber && <p>시즌 {selectedSeasonNumber}</p>}
          <p className="HD">
            <img src="/images/HD.png" alt="HD" />
          </p>
        </div>

        <div className="text-fads">
          <p>{overview}</p>
        </div>

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

        <p
          className={`more-btn ${moreOpen ? "open" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setMoreOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMoreOpen((v) => !v);
          }}
        >
          정보 더보기 {moreOpen ? "∧" : "+"}
        </p>
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
