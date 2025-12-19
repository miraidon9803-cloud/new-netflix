import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import WishlistPopup from "../components/WishlistPopup";
import type { WishlistContent } from "../store/WishlistStore";
import "./scss/NetDetail.scss";

const PROFILE_IMG = "https://image.tmdb.org/t/p/w185";
const FALLBACK_PROFILE = "/images/icon/no_profile.png";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = useMemo(() => (id ? String(id) : ""), [id]);

  const {
    movieDetail,
    movieRating,
    videos,
    movieCredits,
    fetchMovieDetail,
    fetchMovieRating,
    fetchVideos,
    fetchMovieCredits,
  } = useMovieStore();

  const [play, setPlay] = useState(false);
  const [activeTab, setActiveTab] = useState<"정보" | "비슷한콘텐츠" | "관련클립">("정보");
  const [moreOpen, setMoreOpen] = useState(false);
  
  // 위시리스트 팝업 상태
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    fetchMovieDetail(movieId);
    fetchMovieRating(movieId);
    fetchVideos(movieId, "movie");
    fetchMovieCredits(movieId);
  }, [movieId, fetchMovieDetail, fetchMovieRating, fetchVideos, fetchMovieCredits]);

  if (!movieId) return <p>잘못된 접근입니다.</p>;
  if (!movieDetail) return <p>작품 불러오는 중..</p>;

  const trailer =
    videos.find((v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
    videos.find((v: any) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v: any) => v.site === "YouTube");

  const directorNames =
    movieCredits?.crew
      ?.filter((c) => c.job === "Director")
      ?.map((d) => d.name)
      ?.slice(0, 3)
      ?.join(", ") ?? "정보 없음";

  const topCast = movieCredits?.cast?.slice(0, 10) ?? [];

  // 위시리스트용 콘텐츠 정보
  const wishlistContent: WishlistContent = {
    id: movieDetail.id,
    title: movieDetail.title,
    poster_path: movieDetail.poster_path || null,
    media_type: 'movie',
  };

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <div className="media-box">
            {trailer ? (
              <iframe
                className="trailer-video"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${play ? 1 : 0}&mute=1&playsinline=1`}
                title="YouTube trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="no-video">예고편이 제공되지 않는 작품입니다.</div>
            )}
          </div>

          <div className="text-box">
            <div className="title-wrap">
              <h1>{movieDetail.title}</h1>
              {trailer && (
                <button type="button" onClick={() => { if (!play) setPlay(true); }}>
                  재생
                </button>
              )}
            </div>

            <div className="text-content">
              <p>{movieRating ?? "정보 없음"}</p>
              <p>{movieDetail.release_date}</p>
              <p>{movieDetail.runtime}분</p>
              <p>HD</p>
            </div>

            <div className="text-fads">
              <p>{movieDetail.overview}</p>
            </div>

            <div className="btn-wrap">
              <p onClick={() => setShowWishlistPopup(true)} style={{ cursor: 'pointer' }}>위시리스트</p>
              <p>따봉</p>
              <p>다운로드</p>
              <p>공유</p>
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
              정보 더보기 {moreOpen ? "−" : "+"}
            </p>

            {moreOpen && (
              <div className="more-panel">
                <div className="row">
                  <span className="label">감독</span>
                  <span className="value">{directorNames}</span>
                </div>
                <div className="row" style={{ flexDirection: "column" }}>
                  <span className="label">출연</span>
                  {topCast.length === 0 ? (
                    <span className="value">정보 없음</span>
                  ) : (
                    <ul className="cast-list">
                      {topCast.map((cast) => (
                        <li key={cast.id} className="cast-item">
                          <div className="cast-img">
                            <img
                              src={cast.profile_path ? `${PROFILE_IMG}${cast.profile_path}` : FALLBACK_PROFILE}
                              alt={cast.name}
                              loading="lazy"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_PROFILE; }}
                            />
                          </div>
                          <p className="cast-name">{cast.name}</p>
                          {cast.character && <p className="cast-role">{cast.character}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="season-box">
          <div className="detail-tabs">
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "정보" ? "active" : ""}
              onClick={() => setActiveTab("정보")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveTab("정보"); }}
            >
              정보
            </p>
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "비슷한콘텐츠" ? "active" : ""}
              onClick={() => setActiveTab("비슷한콘텐츠")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveTab("비슷한콘텐츠"); }}
            >
              비슷한 콘텐츠
            </p>
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "관련클립" ? "active" : ""}
              onClick={() => setActiveTab("관련클립")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveTab("관련클립"); }}
            >
              관련클립
            </p>
          </div>

          {activeTab === "정보" ? (
            <div className="tab-panel"><p>기본 정보를 확인하세요.</p></div>
          ) : activeTab === "비슷한콘텐츠" ? (
            <div className="tab-panel"><p>비슷한 콘텐츠를 준비 중입니다.</p></div>
          ) : (
            <div className="tab-panel"><p>관련 클립을 준비 중입니다.</p></div>
          )}
        </div>
      </div>

      {/* 위시리스트 팝업 */}
      {showWishlistPopup && (
        <WishlistPopup
          content={wishlistContent}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
    </div>
  );
};

export default MovieDetail;