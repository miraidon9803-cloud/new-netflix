import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import "./scss/NetDetail.scss";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = useMemo(() => (id ? String(id) : ""), [id]);

  const {
    movieDetail,
    movieRating,
    videos,
    fetchMovieDetail,
    fetchMovieRating,
    fetchVideos,
  } = useMovieStore();

  const [play, setPlay] = useState(false);

  /* ================== FETCH ================== */
  useEffect(() => {
    if (!movieId) return;
    fetchMovieDetail(movieId);
    fetchMovieRating(movieId);
    fetchVideos(movieId, "movie");
  }, [movieId, fetchMovieDetail, fetchMovieRating, fetchVideos]);

  if (!movieId) return <p>잘못된 접근입니다.</p>;
  if (!movieDetail) return <p>작품 불러오는 중..</p>;

  /* ================== TRAILER ================== */
  const trailer =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <div className="media-box">
            {trailer ? (
              <iframe
                className="trailer-video"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${
                  play ? 1 : 0
                }&mute=1`}
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
                <button
                  onClick={() => {
                    if (!play) setPlay(true);
                  }}
                >
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
              <p>위시리스트</p>
              <p>따봉</p>
              <p>다운로드</p>
              <p>공유</p>
            </div>

            <p>정보 더보기 +</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
