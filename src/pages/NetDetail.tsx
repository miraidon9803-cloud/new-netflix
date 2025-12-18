import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
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

  const { onAddWatching } = useWatchingStore();

  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [seasonOpen, setSeasonOpen] = useState(false);

  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);

  const [play, setPlay] = useState(false);
  const [playerNonce, setPlayerNonce] = useState(0);

  const [activeTab, setActiveTab] = useState<
    "회차" | "비슷한콘텐츠" | "관련클립"
  >("회차");

  const defaultSeasonNumber = useMemo(() => {
    const normal = seasons.find((s: any) => s.season_number > 0);
    return normal?.season_number ?? null;
  }, [seasons]);

  const selectedSeasonNumber = activeSeason ?? defaultSeasonNumber;

  const activeSeasonObj = useMemo(() => {
    if (!selectedSeasonNumber) return null;
    return (
      seasons.find((s: any) => s.season_number === selectedSeasonNumber) ?? null
    );
  }, [seasons, selectedSeasonNumber]);

  useEffect(() => {
    if (!tvId) return;
    fetchTvDetail(tvId);
    fetchTvRating(tvId);
    fetchSeasons(tvId);
    fetchVideos(tvId, "tv");
  }, [tvId, fetchTvDetail, fetchTvRating, fetchSeasons, fetchVideos]);

  useEffect(() => {
    if (!tvId || !selectedSeasonNumber) return;
    fetchEpisodes(tvId, selectedSeasonNumber);
  }, [tvId, selectedSeasonNumber, fetchEpisodes]);

  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  const defaultTrailer: Video | undefined =
    (videos as Video[]).find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ?? (videos as Video[]).find((v) => v.site === "YouTube");

  const iframeKey = selectedVideoKey ?? defaultTrailer?.key;

  const saveEpisodeToWatching = async (ep: any) => {
    if (!tvDetail) return;
    if (!selectedSeasonNumber) return;
    if (!ep?.episode_number) return;

    const hasThumb = !!(
      ep?.still_path ||
      tvDetail?.backdrop_path ||
      tvDetail?.poster_path
    );
    if (!hasThumb) return;

    try {
      await onAddWatching({
        mediaType: "tv",
        id: tvDetail.id,
        name: tvDetail.name,

        poster_path: tvDetail.poster_path,
        backdrop_path: tvDetail.backdrop_path,
        still_path: ep.still_path,

        season_number: selectedSeasonNumber,
        episode_number: ep.episode_number,
        episode_name: ep.name,

        first_air_date: tvDetail.first_air_date,
      } as any);
    } catch (e) {
      console.error("watching(episode) 저장 실패:", e);
    }
  };

  const onPlayDefault = async () => {
    const firstEp = episodes?.[0];
    if (firstEp) await saveEpisodeToWatching(firstEp);

    setSelectedVideoKey(null);
    setPlay(true);
    setPlayerNonce(Date.now());
  };

  const onPlayEpisode = async (ep: any) => {
    if (!tvId || !selectedSeasonNumber) return;

    await saveEpisodeToWatching(ep);

    try {
      const seasonVideos = await fetchVideos(tvId, "tv", selectedSeasonNumber);

      const picked =
        seasonVideos.find(
          (v: Video) => v.site === "YouTube" && v.type === "Trailer"
        ) ?? seasonVideos.find((v: Video) => v.site === "YouTube");

      setSelectedVideoKey(picked?.key ?? null);
      setPlay(true);
      setPlayerNonce(Date.now());
    } catch (e) {
      setSelectedVideoKey(null);
      setPlay(true);
      setPlayerNonce(Date.now());
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-inner">
        {/* ✅ 영상 없으면 이것만 보여주고 나머지 전부 렌더링 X */}
        {!iframeKey ? (
          <div className="no-video">
            <p>재생할 영상이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="left-side">
              <div className="media-box">
                <iframe
                  key={`${iframeKey}-${playerNonce}`}
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
                  <p>시즌 {selectedSeasonNumber ?? "-"}</p>
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
              {/* 탭 메뉴 */}
              <div className="detail-tabs">
                <p
                  className={activeTab === "회차" ? "active" : ""}
                  onClick={() => setActiveTab("회차")}
                >
                  회차
                </p>

                <p
                  className={activeTab === "비슷한콘텐츠" ? "active" : ""}
                  onClick={() => setActiveTab("비슷한콘텐츠")}
                >
                  비슷한 콘텐츠
                </p>

                <p
                  className={activeTab === "관련클립" ? "active" : ""}
                  onClick={() => setActiveTab("관련클립")}
                >
                  관련클립
                </p>
              </div>

              {/*  탭별 콘텐츠 */}
              {activeTab === "회차" ? (
                <>
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
                      .filter((s: any) => s.season_number > 0)
                      .map((s: any) => (
                        <li
                          key={s.id}
                          className={`season-item ${
                            selectedSeasonNumber === s.season_number
                              ? "active"
                              : ""
                          }`}
                          role="button"
                          tabIndex={seasonOpen ? 0 : -1}
                          style={{ display: seasonOpen ? "flex" : "none" }}
                          onClick={() => {
                            setActiveSeason(s.season_number);

                            setPlay(false);
                            setSelectedVideoKey(null);
                            setPlayerNonce(Date.now());

                            setSeasonOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setActiveSeason(s.season_number);

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

                  <ul className="episode-list">
                    {episodes.map((ep: any) => (
                      <li key={ep.id}>
                        <div className="episode-content">
                          {ep.still_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                              alt={ep.name}
                            />
                          ) : (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${
                                tvDetail.backdrop_path ||
                                tvDetail.poster_path ||
                                ""
                              }`}
                              alt={ep.name}
                            />
                          )}

                          <p
                            className="episode-btn"
                            onClick={() => onPlayEpisode(ep)}
                          >
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
                </>
              ) : activeTab === "비슷한콘텐츠" ? (
                <div className="tab-panel">
                  <p>비슷한 콘텐츠를 준비 중입니다.</p>
                </div>
              ) : (
                <div className="tab-panel">
                  <p>관련클립 준비 중입니다.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NetDetail;
