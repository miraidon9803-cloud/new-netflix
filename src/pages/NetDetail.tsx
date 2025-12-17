import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import "./scss/NetDetail.scss";

type Video = {
  id: string;
  key: string;
  site: string;
  type: string;
  name?: string;
};

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
  const [seasonOpen, setSeasonOpen] = useState(false);

  // ✅ 왼쪽 iframe에서 재생할 유튜브 key
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);

  // ✅ autoplay 토글 + iframe 강제 리마운트용 nonce
  const [play, setPlay] = useState(false);
  const [playerNonce, setPlayerNonce] = useState(0);

  const activeSeasonObj = useMemo(() => {
    return seasons.find((s) => s.season_number === activeSeason);
  }, [seasons, activeSeason]);

  // ✅ 진입 시 기본 데이터 로드 (기본 트레일러도 여기서 가져옴)
  useEffect(() => {
    if (!tvId) return;
    fetchTvDetail(tvId);
    fetchTvRating(tvId);
    fetchSeasons(tvId);
    fetchVideos(tvId, "tv"); // 기본(전체 tv) 영상
  }, [tvId, fetchTvDetail, fetchTvRating, fetchSeasons, fetchVideos]);

  // ✅ 첫 시즌 자동 선택 + 에피소드 로드
  useEffect(() => {
    if (!tvId || seasons.length === 0) return;
    if (activeSeason !== null) return;

    const normalSeason = seasons.find((s) => s.season_number > 0);
    if (!normalSeason) return;

    setActiveSeason(normalSeason.season_number);
    fetchEpisodes(tvId, normalSeason.season_number);
  }, [tvId, seasons, activeSeason, fetchEpisodes]);

  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  // ✅ 기본 트레일러 선택 (store의 videos 기준)
  const defaultTrailer: Video | undefined =
    (videos as Video[]).find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ?? (videos as Video[]).find((v) => v.site === "YouTube");

  // ✅ 최종적으로 왼쪽 iframe이 재생할 key
  const iframeKey = selectedVideoKey ?? defaultTrailer?.key;

  // 영상이 하나도 없으면 iframe을 못 띄웁니다
  if (!iframeKey) return <p>재생할 영상이 없습니다.</p>;

  // ✅ 왼쪽 상단 "재생" 버튼: 기본 트레일러 재생
  const onPlayDefault = () => {
    setSelectedVideoKey(null); // 기본 트레일러로 돌아가기
    setPlay(true);
    setPlayerNonce(Date.now()); // ✅ 강제 리마운트
  };

  // ✅ 오른쪽 Play 버튼: 시즌 영상으로 왼쪽 iframe 교체 + 재생
  const onPlaySeason = async () => {
    if (!tvId || !activeSeason) return;

    try {
      // ✅ 시즌 영상 가져오기 (store가 Video[] return 해야 함)
      const seasonVideos = (await fetchVideos(
        tvId,
        "tv",
        activeSeason
      )) as Video[];

      const picked =
        seasonVideos.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        ) ?? seasonVideos.find((v) => v.site === "YouTube");

      // 시즌 영상이 없으면 기본 트레일러로 fallback
      if (picked?.key) setSelectedVideoKey(picked.key);
      else setSelectedVideoKey(null);

      setPlay(true);
      setPlayerNonce(Date.now()); // ✅ 강제 리마운트 (핵심)
    } catch (e) {
      // 실패해도 기본 트레일러 재생으로 fallback
      setSelectedVideoKey(null);
      setPlay(true);
      setPlayerNonce(Date.now());
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <div className="media-box">
            <iframe
              key={`${iframeKey}-${playerNonce}`} // ✅ src 바뀔 때마다 완전 새로 로드
              className="trailer-video"
              src={`https://www.youtube.com/embed/${iframeKey}?autoplay=${
                play ? 1 : 0
              }&mute=1&playsinline=1&nonce=${playerNonce}`}
              title="YouTube trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          <div className="text-box">
            <div className="title-wrap">
              <h1>{tvDetail.name}</h1>
              <button type="button" onClick={onPlayDefault}>
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
          {/* 시즌 드롭다운 */}
          <ul className={`season-dropdown ${seasonOpen ? "open" : ""}`}>
            <li
              className="season-trigger"
              role="button"
              tabIndex={0}
              onClick={() => setSeasonOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setSeasonOpen((v) => !v);
              }}
            >
              <span>{activeSeasonObj?.name ?? "시즌 선택"}</span>
              <p className={`chev ${seasonOpen ? "open" : ""}`}>
                <img src="/images/profile-arrow.png" alt="" />
              </p>
            </li>

            {seasons
              .filter((s) => s.season_number > 0)
              .map((s) => (
                <li
                  key={s.id}
                  className={`season-item ${
                    activeSeason === s.season_number ? "active" : ""
                  }`}
                  role="button"
                  tabIndex={seasonOpen ? 0 : -1}
                  style={{ display: seasonOpen ? "flex" : "none" }}
                  onClick={() => {
                    setActiveSeason(s.season_number);
                    fetchEpisodes(tvId, s.season_number);

                    // 시즌 바꾸면 자동재생 유지/해제는 취향인데,
                    // 보통은 멈추고 사용자가 Play 눌러서 재생하게 하는 게 자연스럽습니다.
                    setPlay(false);
                    setSelectedVideoKey(null);
                    setPlayerNonce(Date.now());

                    setSeasonOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveSeason(s.season_number);
                      fetchEpisodes(tvId, s.season_number);
                      setPlay(false);
                      setSelectedVideoKey(null);
                      setPlayerNonce(Date.now());
                      setSeasonOpen(false);
                    }
                  }}
                >
                  {s.name}
                </li>
              ))}
          </ul>

          {/* 에피소드 리스트 */}
          <ul className="episode-list">
            {episodes.map((ep) => (
              <li key={ep.id}>
                <div className="episode-content">
                  {ep.still_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                      alt={ep.name}
                    />
                  )}
                  <p className="episode-btn" onClick={onPlaySeason}>
                    <img src="/images/play.png" alt="" />
                  </p>
                </div>

                <div className="episode-title">
                  <h3>
                    {ep.episode_number}. {ep.name}
                  </h3>
                  <p>{ep.overview}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetDetail;
