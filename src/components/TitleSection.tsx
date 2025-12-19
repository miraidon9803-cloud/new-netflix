import { useState } from 'react';
import { useDetailUIStore } from '../store/useDetailUIStore';
import WishlistPopup from './WishlistPopup';
import type { WishlistContent } from '../store/WishlistStore';

interface TitleSectionProps {
  title: string;
  rating: string | null;
  firstAirDate: string;
  selectedSeasonNumber: number | null;
  overview: string;
  onPlayDefault: () => void;
  // 위시리스트용 추가 props
  contentId?: number;
  posterPath?: string | null;
  mediaType?: 'movie' | 'tv';
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
  mediaType = 'tv',
}: TitleSectionProps) => {
  const { moreOpen, toggleMoreOpen } = useDetailUIStore();
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  // 위시리스트 클릭 핸들러
  const handleWishlistClick = () => {
    if (contentId) {
      setShowWishlistPopup(true);
    }
  };

  // 팝업에 전달할 콘텐츠 정보
  const wishlistContent: WishlistContent | null = contentId ? {
    id: contentId,
    title,
    poster_path: posterPath || null,
    media_type: mediaType,
  } : null;

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
          <p>{rating ?? '정보 없음'}</p>
          <p>{firstAirDate}</p>
          <p>시즌 {selectedSeasonNumber ?? '-'}</p>
          <p>HD</p>
        </div>

        <div className="text-fads">
          <p>{overview}</p>
        </div>

        <div className="btn-wrap">
          <p onClick={handleWishlistClick} style={{ cursor: 'pointer' }}>위시리스트</p>
          <p>따봉</p>
          <p>다운로드</p>
          <p>공유</p>
        </div>

        <p
          className={`more-btn ${moreOpen ? 'open' : ''}`}
          tabIndex={0}
          onClick={toggleMoreOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleMoreOpen();
          }}
        >
          정보 더보기 {moreOpen ? '-' : '+'}
        </p>
      </div>

      {/* 위시리스트 팝업 */}
      {showWishlistPopup && wishlistContent && (
        <WishlistPopup
          content={wishlistContent}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </>
  );
};

export default TitleSection;