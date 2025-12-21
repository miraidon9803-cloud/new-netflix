import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
import { useLikeStore } from "../store/LikeStore";
import { useDownloadStore } from "../store/DownloadStore";
import { useProfileStore } from "../store/Profile";
import { useRef } from "react";
import { TitleSection } from "../components/TitleSection";
import "./scss/NetDetail.scss";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = useMemo(() => (id ? String(id) : ""), [id]);
  const mediaBoxRef = useRef<HTMLDivElement>(null);

  const {
    movieDetail,
    movieRating,
    videos,
    movieCredits,
    movieSimilar,
    movieSimilarId,
    fetchMovieDetail,
    fetchMovieRating,
    fetchVideos,
    fetchMovieCredits,
    fetchMovieSimilar,
  } = useMovieStore();

  const [play, setPlay] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "정보" | "비슷한콘텐츠" | "관련클립"
  >("정보");

  const { onAddWatching } = useWatchingStore();
  const { onAddLike } = useLikeStore();
  const { onAddDownload } = useDownloadStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const handlePlay = async () => {
    if (!movieDetail || !trailer) return;

    // 1) 보관함 저장 먼저
    try {
      await onAddWatching({
        profileId: activeProfileId,
        mediaType: "movie",
        id: movieDetail.id,
        name: movieDetail.title,
        poster_path: movieDetail.poster_path,
        backdrop_path: movieDetail.backdrop_path,
        release_date: movieDetail.release_date,
        runtime: movieDetail.runtime,
      } as any);
    } catch (e) {
      console.error("보관함 저장 실패:", e);
    }

    // 2) 재생
    setPlay(true);

    // 3) 풀스크린
    const el = mediaBoxRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen 실패:", e);
    }
  };

  // 좋아요 버튼 핸들러
  const handleLike = async () => {
    if (!movieDetail || !activeProfileId) return;

    try {
      await onAddLike({
        profileId: activeProfileId,
        id: movieDetail.id,
        mediaType: "movie",
        title: movieDetail.title,
        poster_path: movieDetail.poster_path,
        backdrop_path: movieDetail.backdrop_path,
        vote_average: movieDetail.vote_average,
      } as any);
    } catch (e) {
      console.error("좋아요 저장 실패:", e);
    }
  };

  // 다운로드 버튼 핸들러
  const handleDownload = async () => {
    if (!movieDetail || !activeProfileId) return;

    try {
      await onAddDownload({
        profileId: activeProfileId,
        mediaType: "movie",
        id: movieDetail.id,
        title: movieDetail.title,
        poster_path: movieDetail.poster_path,
        backdrop_path: movieDetail.backdrop_path,
        runtime: movieDetail.runtime,
      } as any);
    } catch (e) {
      console.error("다운로드 저장 실패:", e);
    }
  };

  useEffect(() => {
    if (!movieId) return;
    fetchMovieDetail(movieId);
    fetchMovieRating(movieId);
    fetchVideos(movieId, "movie");
    fetchMovieCredits(movieId);
  }, [
    movieId,
    fetchMovieDetail,
    fetchMovieRating,
    fetchVideos,
    fetchMovieCredits,
  ]);

  // 비슷한 콘텐츠 fetch
  useEffect(() => {
    if (!movieId) return;
    if (activeTab !== "비슷한콘텐츠") return;

    if (movieSimilarId !== movieId) {
      fetchMovieSimilar(movieId);
    }
  }, [movieId, activeTab, movieSimilarId, fetchMovieSimilar]);

  if (!movieId) return <p>잘못된 접근입니다.</p>;
  if (!movieDetail) return <p>작품 불러오는 중..</p>;

  const trailer =
    videos.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    videos.find((v: any) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v: any) => v.site === "YouTube");

  const directorNames =
    movieCredits?.crew
      ?.filter((c) => c.job === "Director")
      ?.map((d) => d.name)
      ?.slice(0, 3)
      ?.join(", ") ?? "정보 없음";

  const topCast = movieCredits?.cast?.slice(0, 10) ?? [];
  const genres = movieDetail?.genres ?? [];

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <div className="media-box" ref={mediaBoxRef}>
            {trailer ? (
              <iframe
                className="trailer-video"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${
                  play ? 1 : 0
                }&mute=1&playsinline=1`}
                title="YouTube trailer"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="no-video">예고편이 제공되지 않는 작품입니다.</div>
            )}
          </div>

          <TitleSection
            title={movieDetail.title}
            rating={movieRating}
            firstAirDate={movieDetail.release_date}
            overview={movieDetail.overview}
            onPlayDefault={handlePlay}
            contentId={movieDetail.id}
            posterPath={movieDetail.poster_path}
            backdropPath={movieDetail.backdrop_path}
            mediaType="movie"
            voteAverage={movieDetail.vote_average}
            onLike={handleLike}
            onDownload={handleDownload}
            director={directorNames}
            topCast={topCast}
            genres={genres}
            runtime={movieDetail.runtime}
          />
        </div>

        <div className="season-box">
          <div className="detail-tabs">
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "정보" ? "active" : ""}
              onClick={() => setActiveTab("정보")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveTab("정보");
              }}
            >
              정보
            </p>
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "비슷한콘텐츠" ? "active" : ""}
              onClick={() => setActiveTab("비슷한콘텐츠")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setActiveTab("비슷한콘텐츠");
              }}
            >
              비슷한 콘텐츠
            </p>
            <p
              role="button"
              tabIndex={0}
              className={activeTab === "관련클립" ? "active" : ""}
              onClick={() => setActiveTab("관련클립")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setActiveTab("관련클립");
              }}
            >
              관련클립
            </p>
          </div>

          {activeTab === "정보" ? (
            <div className="tab-panel">
              <p>기본 정보를 확인하세요.</p>
            </div>
          ) : activeTab === "비슷한콘텐츠" ? (
            <div className="tab-panel">
              {movieSimilar.length === 0 ? (
                <p>비슷한 콘텐츠가 없습니다.</p>
              ) : (
                <ul className="similar-list">
                  {movieSimilar.slice(0, 7).map((item: any) => {
                    const thumbnail = item.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                      : null;

                    return (
                      <li key={item.id} className="similar-item">
                        <Link to={`/movie/${item.id}`} className="similar-link">
                          <div className="thumb">
                            {thumbnail ? (
                              <img src={thumbnail} alt={item.title} />
                            ) : (
                              <div className="no-thumb">NO IMAGE</div>
                            )}
                          </div>

                          <div className="info">
                            <h4 className="title">{item.title}</h4>
                            <p className="overview">
                              {item.overview
                                ? item.overview
                                : "작품 설명이 제공되지 않습니다."}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="tab-panel">
              <p>관련 클립을 준비 중입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
