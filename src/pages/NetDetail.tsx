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

  // 사용자가 직접 선택한 시즌만 state로 관리
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [seasonOpen, setSeasonOpen] = useState(false);

  // 왼쪽 iframe에서 재생할 유튜브 key
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);

  // autoplay 토글 + iframe 강제 리마운트용 nonce
  const [play, setPlay] = useState(false);
  const [playerNonce, setPlayerNonce] = useState(0);

  // seasons가 들어오면 "첫 정상 시즌"을 계산값으로 잡음
  const defaultSeasonNumber = useMemo(() => {
    const normal = seasons.find((s) => s.season_number > 0);
    return normal?.season_number ?? null;
  }, [seasons]);

  // 실제로 화면/로직에서 사용할 시즌 번호
  const selectedSeasonNumber = activeSeason ?? defaultSeasonNumber;

  const activeSeasonObj = useMemo(() => {
    if (!selectedSeasonNumber) return null;
    return (
      seasons.find((s) => s.season_number === selectedSeasonNumber) ?? null
    );
  }, [seasons, selectedSeasonNumber]);

  // 진입 시 기본 데이터 로드
  useEffect(() => {
    if (!tvId) return;
    fetchTvDetail(tvId);
    fetchTvRating(tvId);
    fetchSeasons(tvId);
    fetchVideos(tvId, "tv"); // 기본(전체 tv) 영상
  }, [tvId, fetchTvDetail, fetchTvRating, fetchSeasons, fetchVideos]);

  // 선택된 시즌 번호가 바뀌면 에피소드 로드
  useEffect(() => {
    if (!tvId || !selectedSeasonNumber) return;
    fetchEpisodes(tvId, selectedSeasonNumber);
  }, [tvId, selectedSeasonNumber, fetchEpisodes]);

  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  // 기본 트레일러 선택 (store의 videos 기준)
  const defaultTrailer: Video | undefined =
    (videos as Video[]).find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ?? (videos as Video[]).find((v) => v.site === "YouTube");

  // 최종 iframe key
  const iframeKey = selectedVideoKey ?? defaultTrailer?.key;

  if (!iframeKey) return <p>재생할 영상이 없습니다.</p>;

  // ✅ 에피소드 재생/클릭 시 보관함(watching)에 저장 (시즌/몇화 + still_path)
  const saveEpisodeToWatching = async (ep: any) => {
    if (!tvDetail) return;
    if (!selectedSeasonNumber) return;
    if (!ep?.episode_number) return;

    // 썸네일은 still/backdrop/poster 중 하나만 있어도 OK
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

        // 작품 썸네일 fallback
        poster_path: tvDetail.poster_path,
        backdrop_path: tvDetail.backdrop_path,

        // 에피소드 썸네일 우선
        still_path: ep.still_path,

        // ✅ 보던 위치
        season_number: selectedSeasonNumber,
        episode_number: ep.episode_number,
        episode_name: ep.name,

        first_air_date: tvDetail.first_air_date,
      } as any);
    } catch (e) {
      console.error("watching(episode) 저장 실패:", e);
    }
  };

  // 왼쪽 상단 "재생" 버튼: 기본 트레일러 재생
  // (보관함은 "현재 선택된 시즌의 1화"로 저장해두면 자연스럽게 이어보기 가능)
  const onPlayDefault = async () => {
    // ✅ 선택된 시즌의 첫 에피소드가 있으면 그걸 보관함에 저장
    const firstEp = episodes?.[0];
    if (firstEp) await saveEpisodeToWatching(firstEp);

    setSelectedVideoKey(null); // 기본 트레일러로
    setPlay(true);
    setPlayerNonce(Date.now());
  };

  // ✅ 에피소드 클릭 재생: 보관함 저장 + (현재는 시즌 트레일러를 재생하는 구조 유지)
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
                    selectedSeasonNumber === s.season_number ? "active" : ""
                  }`}
                  role="button"
                  tabIndex={seasonOpen ? 0 : -1}
                  style={{ display: seasonOpen ? "flex" : "none" }}
                  onClick={() => {
                    // 클릭에서만 state 변경
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

          {/* 에피소드 리스트 */}
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
                    // still이 없으면 대체 이미지(작품 포스터/백드롭)
                    <img
                      src={`https://image.tmdb.org/t/p/w500${
                        tvDetail.backdrop_path || tvDetail.poster_path || ""
                      }`}
                      alt={ep.name}
                    />
                  )}

                  <p className="episode-btn" onClick={() => onPlayEpisode(ep)}>
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
