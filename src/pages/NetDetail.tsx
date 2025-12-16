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
    onFetchTvDetail,
    onFetchSeason,
    onFetchEpisode,
    onFetchTvRating,
  } = useMovieStore();

  const pickRating = (results: any[]) => {
    const kr = results.find((r) => r.iso_3166_1 === "KR")?.rating;
    if (kr) return { country: "KR", rating: kr };

    const us = results.find((r) => r.iso_3166_1 === "US")?.rating;
    if (us) return { country: "US", rating: us };

    const first = results[0]?.rating;
    if (first) return { country: results[0]?.iso_3166_1 ?? "", rating: first };

    return { country: "", rating: null };
  };

  const [activeSeason, setActiveSeason] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    onFetchTvDetail(id);
    onFetchSeason(id);
    setActiveSeason(null);
    onFetchTvRating(id);
  }, [id, onFetchTvDetail, onFetchSeason]);

  // 시즌 목록이 들어오면 첫 시즌 자동 로드 (원하시면 제거 가능)
  useEffect(() => {
    if (!id) return;
    if (seasons.length === 0) return;

    const first = seasons[0].season_number;
    setActiveSeason(first);
    onFetchEpisode(String(id), first);
  }, [id, seasons, onFetchEpisode]);

  if (!id) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  const title = tvDetail.name;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <img
            src={
              tvDetail.poster_path
                ? `https://image.tmdb.org/t/p/w300${tvDetail.poster_path}`
                : ""
            }
            alt={title}
          />

          <div className="text-box">
            <div className="title-wrap">
              <h1>{title}</h1>
              <button>재생</button>
            </div>

            <div className="text-content">
              <p>{tvRating ? tvRating : "정보 없음"}</p>
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
                    onFetchEpisode(tvId, s.season_number);
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
                      {ep.episode_number}:{ep.name}
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
