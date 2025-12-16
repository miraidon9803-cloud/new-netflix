import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import "./scss/NetDetail.scss";

const NetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = useMemo(() => (id ? String(id) : ""), [id]);

  const {
    tvDetail,
    seasons,
    episodes,
    tvRating,
    videos,
    fetchTvDetail,
    fetchTvRating,
    fetchSeasons,
    fetchEpisodes,
    fetchVideos,
  } = useMovieStore();

  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!tvId) return;
    fetchTvDetail(tvId);
    fetchTvRating(tvId);
    fetchSeasons(tvId);
    fetchVideos(tvId, "tv");
  }, [tvId, fetchTvDetail, fetchTvRating, fetchSeasons, fetchVideos]);

  useEffect(() => {
    if (!tvId || seasons.length === 0) return;

    const normalSeason = seasons.find((s) => s.season_number > 0);
    if (!normalSeason) return;

    // ✅ 이미 같은 시즌이면 state 변경 X
    if (activeSeason === normalSeason.season_number) return;

    setActiveSeason(normalSeason.season_number);
    fetchEpisodes(tvId, normalSeason.season_number);
  }, [tvId, seasons, activeSeason, fetchEpisodes]);

  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");

  if (!trailer) return null;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <div className="media-box">
            <iframe
              className="trailer-video"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${
                play ? 1 : 0
              }&mute=1`}
              title="YouTube trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          <div className="text-box">
            <div className="title-wrap">
              <h1>{tvDetail.name}</h1>
              <button
                onClick={() => {
                  if (!play) setPlay(true);
                }}
              >
                재생
              </button>
            </div>

            <div className="text-content">
              <p>{tvRating ?? "정보 없음"}</p>
              <p>{tvDetail.first_air_date}</p>
              <p>시즌 {activeSeason ?? "-"}</p>
              <p>HD</p>
            </div>

            <div className="text-fads">
              <p>{tvDetail.overview}</p>
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

        <div className="season-box">
          <div>
            <h3>시즌</h3>
            <div className="season-btn-list">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  className={`season-btn ${
                    activeSeason === s.season_number ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveSeason(s.season_number);
                    fetchEpisodes(tvId, s.season_number);
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>에피소드</h3>
            <ul className="episode-list">
              {episodes.map((ep) => (
                <li key={ep.id}>
                  <div className="episode-content">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                      alt={ep.name}
                    />
                  </div>

                  <div className="episode-title">
                    <h3>
                      {ep.episode_number}. {ep.name}
                    </h3>
                    <p>{ep.overview}</p>
                    <button>Play</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetDetail;
