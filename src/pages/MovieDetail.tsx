import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
import { useLikeStore } from "../store/LikeStore";
import { useDownloadStore } from "../store/DownloadStore";
import { useProfileStore } from "../store/Profile";
import { useDetailUIStore } from "../store/useDetailUIStore";

import VideoPlayer, { type VideoPlayerHandle } from "../components/VideoPlayer";
import TitleSection from "../components/TitleSection";
import { TabNavigation } from "../components/TabNavigation";

import "./scss/NetDetail.scss";

type Video = {
  id: string;
  key: string;
  site: string;
  type: string;
  official?: boolean;
  name?: string;
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = useMemo(() => (id ? String(id) : ""), [id]);

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

  const { onAddWatching } = useWatchingStore();
  const { onAddLike } = useLikeStore();
  const { onAddDownload } = useDownloadStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const {
    selectedVideoKey,
    activeTab,
    setSelectedVideoKey,
    setPlay,
    refreshPlayer,
    resetPlayer,
    setActiveTab,
  } = useDetailUIStore();

  // ✅ VideoPlayer fullscreen 제어용 ref
  const playerRef = useRef<VideoPlayerHandle | null>(null);

  useEffect(() => {
    setActiveTab("정보");
    resetPlayer();
    setSelectedVideoKey(null);
  }, [movieId, setActiveTab, resetPlayer, setSelectedVideoKey]);

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

  useEffect(() => {
    if (!movieId) return;
    if (activeTab !== "비슷한콘텐츠") return;

    if (movieSimilarId !== movieId) {
      fetchMovieSimilar(movieId);
    }
  }, [movieId, activeTab, movieSimilarId, fetchMovieSimilar]);

  if (!movieId) return <p>잘못된 접근입니다.</p>;
  if (!movieDetail) return <p>작품 불러오는 중..</p>;

  const defaultTrailer: Video | undefined =
    (videos as Video[]).find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    (videos as Video[]).find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ??
    (videos as Video[]).find((v) => v.site === "YouTube");

  const iframeKey = selectedVideoKey ?? defaultTrailer?.key ?? null;

  const directorNames =
    movieCredits?.crew
      ?.filter((c: any) => c.job === "Director")
      ?.map((d: any) => d.name)
      ?.slice(0, 3)
      ?.join(", ") ?? "정보 없음";

  const topCast = movieCredits?.cast?.slice(0, 10) ?? [];
  const genres = movieDetail?.genres ?? [];

  const onPlayDefault = async () => {
    if (!movieDetail) return;

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

    // ✅ 기본 트레일러로 재생
    setSelectedVideoKey(null);
    setPlay(true);
    refreshPlayer();

    // ✅ 재생 누르면 유튜브 풀스크린
    playerRef.current?.enterFullscreen();
  };

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

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          {/* ✅ ref 달기 */}
          <VideoPlayer ref={playerRef} videoKey={iframeKey} />

          <TitleSection
            title={movieDetail.title}
            rating={movieRating}
            firstAirDate={movieDetail.release_date}
            overview={movieDetail.overview}
            onPlayDefault={onPlayDefault}
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
          <TabNavigation />

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
