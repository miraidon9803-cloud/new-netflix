import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
import { useLikeStore } from "../store/LikeStore";
import { useDownloadStore } from "../store/DownloadStore";
import { useProfileStore } from "../store/Profile";
import { useDetailUIStore } from "../store/useDetailUIStore";
import { TitleSection } from "../components/TitleSection";
import { TabNavigation } from "../components/TabNavigation";
import { SeasonSelector } from "../components/SeasonSelector";
import { EpisodeList } from "./EpisodeList";
import { useRef } from "react";
import VideoPlayer, { type VideoPlayerHandle } from "../components/VideoPlayer";
import "./scss/NetDetail.scss";
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";

type Video = {
  id: string;
  key: string;
  site: string;
  type: string;
  name?: string;
};

const Tvdetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = useMemo(() => (id ? String(id) : ""), [id]);

  // Movie Store
  const {
    tvDetail,
    seasons,
    episodes,
    tvRating,
    videos,
    tvCredits,
    tvKeywords,
    tvSimilar,
    tvSimilarId,
    fetchTvDetail,
    fetchTvRating,
    fetchSeasons,
    fetchEpisodes,
    fetchVideos,
    fetchTvCredits,
    fetchTvKeywords,
    fetchTvSimilar,
  } = useMovieStore();

  const { onAddWatching } = useWatchingStore();
  const { onAddLike } = useLikeStore();
  const { onAddDownload } = useDownloadStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  // UI Store
  const {
    activeSeason,
    selectedVideoKey,
    activeTab,
    setActiveSeason,
    setSelectedVideoKey,
    setPlay,
    refreshPlayer,
    resetPlayer,
    setActiveTab,
  } = useDetailUIStore();

  useEffect(() => {
    setActiveTab("에피소드");
  }, [tvId, setActiveTab]);

  // Season logic
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

  // Creator info
  const creator = useMemo(() => {
    const creatorData = (tvDetail as any)?.created_by?.[0];
    return {
      name: creatorData?.name ?? "정보 없음",
      profile_path: creatorData?.profile_path ?? null,
    };
  }, [tvDetail]);

  const topCast = useMemo(
    () => tvCredits?.cast?.slice(0, 10) ?? [],
    [tvCredits]
  );

  const genres = useMemo(() => tvDetail?.genres ?? [], [tvDetail]);
  const keywords = useMemo(() => tvKeywords ?? [], [tvKeywords]);
  const playerRef = useRef<VideoPlayerHandle | null>(null);

  // Fetch data
  useEffect(() => {
    if (!tvId) return;
    fetchTvDetail(tvId);
    fetchTvRating(tvId);
    fetchSeasons(tvId);
    fetchVideos(tvId, "tv");
    fetchTvCredits(tvId);
    fetchTvKeywords(tvId);
  }, [
    tvId,
    fetchTvDetail,
    fetchTvRating,
    fetchSeasons,
    fetchVideos,
    fetchTvCredits,
    fetchTvKeywords,
  ]);

  useEffect(() => {
    if (!tvId || !selectedSeasonNumber) return;
    fetchEpisodes(tvId, selectedSeasonNumber);
  }, [tvId, selectedSeasonNumber, fetchEpisodes]);

  useEffect(() => {
    if (!tvId) return;
    if (activeTab !== "비슷한콘텐츠") return;

    if (tvSimilarId !== tvId) {
      fetchTvSimilar(tvId);
    }
  }, [tvId, activeTab, tvSimilarId, fetchTvSimilar]);

  // Video logic
  const defaultTrailer: Video | undefined = useMemo(() => {
    return (
      (videos as Video[]).find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      ) ?? (videos as Video[]).find((v) => v.site === "YouTube")
    );
  }, [videos]);

  const iframeKey = selectedVideoKey ?? defaultTrailer?.key ?? null;

  // Play handlers
  const saveEpisodeToWatching = async (ep: any) => {
    if (!tvDetail || !selectedSeasonNumber || !ep?.episode_number) return;

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
    refreshPlayer();
    playerRef.current?.enterFullscreen();
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
      refreshPlayer();

      //  회차 영상 누르면 풀스크린
      playerRef.current?.enterFullscreen();
    } catch (e) {
      setSelectedVideoKey(null);
      setPlay(true);
      refreshPlayer();

      //  실패해도 풀스크린 (원하시면 이 줄은 빼도 됨)
      playerRef.current?.enterFullscreen();
    }
  };

  const onSeasonChange = (seasonNumber: number) => {
    setActiveSeason(seasonNumber);
    resetPlayer();
  };

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!tvDetail || !activeProfileId) return;

    try {
      await onAddLike({
        profileId: activeProfileId,
        id: tvDetail.id,
        mediaType: "tv",
        name: tvDetail.name,
        poster_path: tvDetail.poster_path,
        backdrop_path: tvDetail.backdrop_path,
        vote_average: tvDetail.vote_average,
      } as any);
    } catch (e) {
      console.error("좋아요 저장 실패:", e);
    }
  };

  // 다운로드 핸들러
  const handleDownload = async () => {
    if (!tvDetail || !activeProfileId || !selectedSeasonNumber) return;

    const confirmed = window.confirm("정말 다운로드 하시겠습니까?");
    if (!confirmed) return;

    const firstEp = episodes?.[0];

    try {
      await onAddDownload({
        profileId: activeProfileId,
        mediaType: "tv",
        id: tvDetail.id,
        name: tvDetail.name,
        poster_path: tvDetail.poster_path,
        backdrop_path: tvDetail.backdrop_path,
        still_path: firstEp?.still_path,
        season_number: selectedSeasonNumber,
        episode_number: firstEp?.episode_number,
        episode_name: firstEp?.name,
        // runtime: firstEp?.runtime,
      } as any);
    } catch (e) {
      console.error("다운로드 저장 실패:", e);
    }
  };

  // Loading states
  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <VideoPlayer ref={playerRef} videoKey={iframeKey} />

          <TitleSection
            title={tvDetail.name}
            rating={tvRating}
            firstAirDate={tvDetail.first_air_date}
            selectedSeasonNumber={selectedSeasonNumber}
            overview={tvDetail.overview}
            onPlayDefault={onPlayDefault}
            contentId={tvDetail.id}
            posterPath={tvDetail.poster_path}
            backdropPath={tvDetail.backdrop_path}
            mediaType="tv"
            voteAverage={tvDetail.vote_average}
            onLike={handleLike}
            onDownload={handleDownload}
            creator={creator}
            topCast={topCast}
            genres={genres}
            keywords={keywords}
          />
        </div>

        <div className="season-box">
          <TabNavigation />

          {activeTab === "에피소드" ? (
            <>
              <SeasonSelector
                seasons={seasons}
                activeSeasonObj={activeSeasonObj}
                selectedSeasonNumber={selectedSeasonNumber}
                onSeasonChange={onSeasonChange}
              />

              <EpisodeList
                episodes={episodes}
                backdropPath={tvDetail.backdrop_path}
                posterPath={tvDetail.poster_path}
                onPlayEpisode={onPlayEpisode}
              />
            </>
          ) : activeTab === "비슷한콘텐츠" ? (
            <div className="tab-panel">
              {tvSimilar.length === 0 ? (
                <p>비슷한 콘텐츠가 없습니다.</p>
              ) : (
                <ul className="similar-list">
                  {tvSimilar.slice(0, 7).map((item: any) => {
                    const thumbnail = item.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                      : null;

                    return (
                      <li key={item.id} className="similar-item">
                        <Link to={`/tv/${item.id}`} className="similar-link">
                          <div className="thumb">
                            {thumbnail ? (
                              <img src={thumbnail} alt={item.name} />
                            ) : (
                              <div className="no-thumb">NO IMAGE</div>
                            )}
                          </div>

                          <div className="info">
                            <h4 className="title">{item.name}</h4>
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
              <p>관련클립 준비 중입니다.</p>
            </div>
          )}
        </div>
      </div>
      <MobileNav />
      <SideNav />
    </div>
  );
};

export default Tvdetail;
