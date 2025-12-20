import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchingStore } from "../store/WatichingStore";
import { useLikeStore } from "../store/LikeStore";
import { useDownloadStore } from "../store/DownloadStore";
import { useProfileStore } from "../store/Profile";
import type { WatchingItem } from "../store/WatichingStore";
import type { LikeItem } from "../store/LikeStore";
import type { DownloadItem } from "../store/DownloadStore";
import "./scss/StorageBox.scss";
import SideNav from "../components/SideNav";

const IMG = "https://image.tmdb.org/t/p/w500";

type TabType = "보관함" | "좋아요" | "다운로드";

const StorageBox = () => {
  const { watching, onFetchWatching, onRemoveWatching } = useWatchingStore();
  const { likes, onFetchLikes, onRemoveLike } = useLikeStore();
  const { downloads, onFetchDownloads, onRemoveDownload } = useDownloadStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const [activeTab, setActiveTab] = useState<TabType>("보관함");

  // 디버깅: 데이터 확인
  useEffect(() => {
    console.log("=== StorageBox 상태 ===");
    console.log("activeProfileId:", activeProfileId);
    console.log("watching 개수:", watching.length);
    console.log("likes 개수:", likes.length);
    console.log("downloads 개수:", downloads.length);
    console.log("activeTab:", activeTab);
  }, [activeProfileId, watching, likes, downloads, activeTab]);

  useEffect(() => {
    if (!activeProfileId) {
      console.warn("⚠️ 프로필이 선택되지 않았습니다.");
      return;
    }

    console.log("📥 데이터 불러오는 중...");

    const fetchData = async () => {
      try {
        await Promise.all([
          onFetchWatching(activeProfileId),
          onFetchLikes(activeProfileId),
          onFetchDownloads(activeProfileId),
        ]);
        console.log("✅ 데이터 불러오기 완료!");
      } catch (e) {
        console.error("❌ 데이터 불러오기 실패:", e);
      }
    };

    fetchData();
  }, [activeProfileId, onFetchWatching, onFetchLikes, onFetchDownloads]);

  const getThumb = (item: WatchingItem | LikeItem | DownloadItem) =>
    (item as WatchingItem).still_path ||
    item.backdrop_path ||
    item.poster_path ||
    null;

  const buildTo = (item: WatchingItem | LikeItem | DownloadItem) => {
    if (item.mediaType === "tv") {
      const season = (item as WatchingItem).season_number ?? "";
      const episode = (item as WatchingItem).episode_number ?? "";
      if (season && episode) {
        return `/tv/${item.id}?season=${season}&episode=${episode}`;
      }
      return `/tv/${item.id}`;
    }
    return `/movie/${item.id}`;
  };

  return (
    <div className="storage-inner">
      <div className="wishlist-sidenav">
        <SideNav />
      </div>

      <h2>내 리스트</h2>

      {/* 디버깅 정보 */}
      <div
        style={{
          background: "#333",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          color: "#fff",
        }}
      >
        <p>🔍 디버그 정보:</p>
        <p>프로필 ID: {activeProfileId || "없음"}</p>
        <p>보관함: {watching.length}개</p>
        <p>좋아요: {likes.length}개</p>
        <p>다운로드: {downloads.length}개</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="storage-tabs">
        <button
          className={activeTab === "보관함" ? "active" : ""}
          onClick={() => setActiveTab("보관함")}
        >
          보관함 ({watching.length})
        </button>
        <button
          className={activeTab === "좋아요" ? "active" : ""}
          onClick={() => setActiveTab("좋아요")}
        >
          좋아요 ({likes.length})
        </button>
        <button
          className={activeTab === "다운로드" ? "active" : ""}
          onClick={() => setActiveTab("다운로드")}
        >
          다운로드 ({downloads.length})
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      {!activeProfileId ? (
        <div className="empty-state">
          <p>프로필을 선택해주세요.</p>
        </div>
      ) : (
        <>
          {/* 보관함 탭 */}
          {activeTab === "보관함" && (
            <>
              {watching.length === 0 ? (
                <div className="empty-state">
                  <p>재생중인 컨텐츠가 없습니다</p>
                </div>
              ) : (
                <ul className="list">
                  {watching.map((item) => {
                    const thumb = getThumb(item);
                    const to = buildTo(item);
                    const title = item.title || item.name || "제목 없음";

                    return (
                      <li
                        key={`${item.mediaType}-${item.id}-${
                          item.season_number ?? 0
                        }-${item.episode_number ?? 0}`}
                      >
                        <Link to={to}>
                          {thumb ? (
                            <img src={`${IMG}${thumb}`} alt={title} />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

                        <div className="storage-content">
                          {item.mediaType === "tv" &&
                            item.season_number != null &&
                            item.episode_number != null && (
                              <p className="ep">
                                {title} 시즌{item.season_number} :{" "}
                                {item.episode_number}화
                              </p>
                            )}

                          {item.mediaType === "movie" && (
                            <p className="title">{title}</p>
                          )}

                          <p
                            className="del-btn"
                            onClick={() =>
                              onRemoveWatching(activeProfileId, item)
                            }
                          >
                            삭제
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* 좋아요 탭 */}
          {activeTab === "좋아요" && (
            <>
              {likes.length === 0 ? (
                <div className="empty-state">
                  <p>좋아요한 콘텐츠가 없습니다</p>
                  <p
                    style={{
                      fontSize: "14px",
                      marginTop: "10px",
                      color: "#808080",
                    }}
                  >
                    Detail 페이지에서 👍 따봉 버튼을 눌러보세요!
                  </p>
                </div>
              ) : (
                <ul className="list">
                  {likes.map((item) => {
                    const thumb = getThumb(item);
                    const to = buildTo(item);
                    const title = item.title || item.name || "제목 없음";

                    return (
                      <li key={`${item.mediaType}-${item.id}`}>
                        <Link to={to}>
                          {thumb ? (
                            <img src={`${IMG}${thumb}`} alt={title} />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

                        <div className="storage-content">
                          <p className="title">{title}</p>
                          {item.vote_average && (
                            <p className="rating">
                              ⭐ {item.vote_average.toFixed(1)}
                            </p>
                          )}

                          <p
                            className="del-btn"
                            onClick={() =>
                              onRemoveLike(
                                activeProfileId,
                                item.id,
                                item.mediaType
                              )
                            }
                          >
                            삭제
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* 다운로드 탭 */}
          {activeTab === "다운로드" && (
            <>
              {downloads.length === 0 ? (
                <div className="empty-state">
                  <p>다운로드한 콘텐츠가 없습니다</p>
                  <p
                    style={{
                      fontSize: "14px",
                      marginTop: "10px",
                      color: "#808080",
                    }}
                  >
                    Detail 페이지에서 📥 다운로드 버튼을 눌러보세요!
                  </p>
                </div>
              ) : (
                <ul className="list">
                  {downloads.map((item) => {
                    const thumb = getThumb(item);
                    const to = buildTo(item);
                    const title = item.title || item.name || "제목 없음";

                    return (
                      <li
                        key={`${item.mediaType}-${item.id}-${
                          item.season_number ?? 0
                        }-${item.episode_number ?? 0}`}
                      >
                        <Link to={to}>
                          {thumb ? (
                            <img src={`${IMG}${thumb}`} alt={title} />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

                        <div className="storage-content">
                          {item.mediaType === "tv" &&
                            item.season_number != null &&
                            item.episode_number != null && (
                              <p className="ep">
                                {title} 시즌{item.season_number} :{" "}
                                {item.episode_number}화
                              </p>
                            )}

                          {item.mediaType === "movie" && (
                            <p className="title">{title}</p>
                          )}

                          {item.runtime && (
                            <p className="runtime">{item.runtime}분</p>
                          )}

                          <p
                            className="del-btn"
                            onClick={() =>
                              onRemoveDownload(activeProfileId, item)
                            }
                          >
                            삭제
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StorageBox;
