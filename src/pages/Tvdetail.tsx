import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useMovieStore } from "../store/useMoiveStore";
import { useWatchingStore } from "../store/WatichingStore";
import { useDetailUIStore } from "../store/useDetailUIStore";
import { VideoPlayer } from "../components/VideoPlayer";
import { TitleSection } from "../components/TitleSection";
import { MoreInfoPanel } from "../components/MoreInfoPanel";
import { TabNavigation } from "../components/TabNavigation";
import { SeasonSelector } from "../components/SeasonSelector";
import { EpisodeList } from "./EpisodeList";
import "./scss/NetDetail.scss";
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
    fetchTvDetail,
    fetchTvRating,
    fetchSeasons,
    fetchEpisodes,
    fetchVideos,
    fetchTvCredits,
    fetchTvKeywords,
  } = useMovieStore();

  const { onAddWatching } = useWatchingStore();

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
  } = useDetailUIStore();

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
    () => tvCredits?.cast?.slice(0, 8) ?? [],
    [tvCredits]
  );
  const genres = useMemo(() => tvDetail?.genres ?? [], [tvDetail]);
  const keywords = useMemo(() => tvKeywords ?? [], [tvKeywords]);

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
    } catch (e) {
      setSelectedVideoKey(null);
      setPlay(true);
      refreshPlayer();
    }
  };

  const onSeasonChange = (seasonNumber: number) => {
    setActiveSeason(seasonNumber);
    resetPlayer();
  };

  // Loading states
  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="left-side">
          <VideoPlayer videoKey={iframeKey} />

          <TitleSection
            title={tvDetail.name}
            rating={tvRating}
            firstAirDate={tvDetail.first_air_date}
            selectedSeasonNumber={selectedSeasonNumber}
            overview={tvDetail.overview}
            onPlayDefault={onPlayDefault}
            contentId={tvDetail.id}
            posterPath={tvDetail.poster_path}
            mediaType="tv"
          />

          <MoreInfoPanel
            creator={creator}
            topCast={topCast}
            genres={genres}
            keywords={keywords}
          />
        </div>

        <div className="season-box">
          <TabNavigation />

          {activeTab === "회차" ? (
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
              <p>비슷한 콘텐츠를 준비 중입니다.</p>
            </div>
          ) : (
            <div className="tab-panel">
              <p>관련클립 준비 중입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tvdetail;
