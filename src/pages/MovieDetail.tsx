import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
import { useLikeStore } from "../store/LikeStore";
import { useDownloadStore } from "../store/DownloadStore";
import { useProfileStore } from "../store/Profile";
import { useDetailUIStore } from "../store/useDetailUIStore";
import type { Video } from "../types/movie";

import VideoPlayer, { type VideoPlayerHandle } from "../components/VideoPlayer";
import TitleSection from "../components/TitleSection";

import "./scss/NetDetail.scss";

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
    setSelectedVideoKey,
    setPlay,
    refreshPlayer,
    resetPlayer,
  } = useDetailUIStore();

  const playerRef = useRef<VideoPlayerHandle | null>(null);

  /* ---------------- 초기화 ---------------- */
  useEffect(() => {
    resetPlayer();
    setSelectedVideoKey(null);
  }, [movieId, resetPlayer, setSelectedVideoKey]);

  /* ---------------- fetch ---------------- */
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

  // ✅ 비슷한 콘텐츠는 항상 fetch
  useEffect(() => {
    if (!movieId) return;
    if (movieSimilarId !== movieId) {
      fetchMovieSimilar(movieId);
    }
  }, [movieId, movieSimilarId, fetchMovieSimilar]);

  if (!movieId) return <p>잘못된 접근입니다.</p>;
  if (!movieDetail) return <p>작품 불러오는 중..</p>;

  /* ---------------- trailer ---------------- */
  const defaultTrailer: Video | undefined =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");

  const iframeKey = selectedVideoKey ?? defaultTrailer?.key ?? null;

  /* ---------------- meta ---------------- */
  const directors =
    movieCredits?.crew
      ?.filter((c: any) => c.job === "Director")
      .slice(0, 3)
      .map((d: any) => ({
        id: d.id,
        name: d.name,
        profile_path: d.profile_path ?? null,
      })) ?? [];

  const topCast = movieCredits?.cast?.slice(0, 10) ?? [];
  const genres = movieDetail.genres ?? [];

  /* ---------------- actions ---------------- */
  const onPlayDefault = async () => {
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
    } catch {}

    setSelectedVideoKey(null);
    setPlay(true);
    refreshPlayer();
    playerRef.current?.enterFullscreen();
  };

  const handleLike = async () => {
    if (!activeProfileId) return;
    await onAddLike({
      profileId: activeProfileId,
      id: movieDetail.id,
      mediaType: "movie",
      title: movieDetail.title,
      poster_path: movieDetail.poster_path,
      backdrop_path: movieDetail.backdrop_path,
      vote_average: movieDetail.vote_average,
    } as any);
  };

  const handleDownload = async () => {
    if (!activeProfileId) return;

    const confirmed = window.confirm("정말 다운로드 하시겠습니까?");
    if (!confirmed) return;

    await onAddDownload({
      profileId: activeProfileId,
      mediaType: "movie",
      id: movieDetail.id,
      title: movieDetail.title,
      poster_path: movieDetail.poster_path,
      backdrop_path: movieDetail.backdrop_path,
      runtime: movieDetail.runtime,
    } as any);
  };
  /* ---------------- render ---------------- */
  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
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
            directors={directors}
            topCast={topCast}
            genres={genres}
            runtime={movieDetail.runtime}
          />
        </div>

        {/* ✅ 비슷한 콘텐츠만 */}
        <div className="season-box">
          <h3 className="section-movie-title">비슷한 콘텐츠</h3>

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
                          {item.overview || "작품 설명이 제공되지 않습니다."}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
