import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
import MobileNav from "../components/MobileNav";

const IMG = "https://image.tmdb.org/t/p/w500";

type TabType = "보관함" | "좋아요" | "다운로드";
type SortType = "최신순" | "제목순" | "평점순";
type ItemType = WatchingItem | LikeItem | DownloadItem;

const StorageBox = () => {
  const { watching, onFetchWatching, onRemoveWatching } = useWatchingStore();
  const { likes, onFetchLikes, onRemoveLike } = useLikeStore();
  const { downloads, onFetchDownloads, onRemoveDownload } = useDownloadStore();

  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const [activeTab, setActiveTab] = useState<TabType>("보관함");
  const [sortType, setSortType] = useState<SortType>("최신순");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const SORT_OPTIONS: SortType[] = ["최신순", "제목순", "평점순"];

  /* ---------------- 외부 클릭 감지 ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  /* ---------------- 데이터 로드 ---------------- */
  useEffect(() => {
    if (!activeProfileId) return;

    Promise.all([
      onFetchWatching(activeProfileId),
      onFetchLikes(activeProfileId),
      onFetchDownloads(activeProfileId),
    ]);
  }, [activeProfileId, onFetchWatching, onFetchLikes, onFetchDownloads]);

  /* ---------------- 유틸 ---------------- */
  const getThumb = (item: ItemType) =>
    (item as WatchingItem).still_path ||
    item.backdrop_path ||
    item.poster_path ||
    null;

  const buildTo = (item: ItemType) => {
    if (item.mediaType === "tv") {
      const season = (item as WatchingItem).season_number ?? "";
      const episode = (item as WatchingItem).episode_number ?? "";
      if (season !== "" && episode !== "") {
        return `/tv/${item.id}?season=${season}&episode=${episode}`;
      }
      return `/tv/${item.id}`;
    }
    return `/movie/${item.id}`;
  };

  const makeKey = (item: ItemType) => {
    if (item.mediaType === "tv") {
      const season = (item as WatchingItem).season_number ?? "x";
      const episode = (item as WatchingItem).episode_number ?? "x";
      return `tv-${item.id}-s${season}-e${episode}`;
    }
    return `movie-${item.id}`;
  };

  /* ---------------- 정렬 ---------------- */
  const sortItems = useCallback(
    <T extends ItemType>(items: T[]) => {
      switch (sortType) {
        case "제목순":
          return [...items].sort((a, b) => {
            const at = a.title || a.name || "";
            const bt = b.title || b.name || "";
            return at.localeCompare(bt, "ko");
          });

        case "평점순":
          return [...items].sort(
            (a: any, b: any) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
          );

        default:
          return [...items].sort(
            (a: any, b: any) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
          );
      }
    },
    [sortType]
  );

  const sortedWatching = useMemo(
    () => sortItems(watching),
    [watching, sortItems]
  );
  const sortedLikes = useMemo(() => sortItems(likes), [likes, sortItems]);
  const sortedDownloads = useMemo(
    () => sortItems(downloads),
    [downloads, sortItems]
  );

  /* ---------------- 필터 핸들러 ---------------- */
  const handleFilterToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilterOpen((prev) => !prev);
  };

  const handleSortChange = (type: SortType) => {
    setSortType(type);
    setFilterOpen(false);
  };

  /* ---------------- 필터 렌더 ---------------- */
  const renderFilter = () => (
    <div className="storage-filter-wrap" ref={filterRef}>
      <p
        className={`filter-btn ${filterOpen ? "active" : ""}`}
        onClick={handleFilterToggle}
      >
        <span className="label">{sortType}</span>
        <span className="icon">⇅</span>
      </p>

      {filterOpen && (
        <ul className="storage-filter">
          {SORT_OPTIONS.filter((type) => type !== sortType).map((type) => (
            <li key={type} onClick={() => handleSortChange(type)}>
              {type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  /* ---------------- 렌더 ---------------- */
  return (
    <div className="storage-inner">
      <div className="wishlist-sidenav">
        <SideNav />
      </div>

      <h2>보관함</h2>

      {/* 탭 */}
      <div className="storage-tabs">
        {(["보관함", "좋아요", "다운로드"] as TabType[]).map((tab) => (
          <p
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab} (
            {tab === "보관함"
              ? watching.length
              : tab === "좋아요"
              ? likes.length
              : downloads.length}
            )
          </p>
        ))}
      </div>

      {!activeProfileId ? (
        <div className="empty-state">
          <p>프로필을 선택해주세요.</p>
        </div>
      ) : (
        <>
          {/* ================= 보관함 ================= */}
          {activeTab === "보관함" && (
            <>
              <div className="storage-toolbar">
                <p className="count">총:{watching.length}개</p>
                {renderFilter()}
              </div>

              {sortedWatching.length === 0 ? (
                <div className="empty-state">
                  <p>재생중인 컨텐츠가 없습니다</p>
                </div>
              ) : (
                <ul className="list">
                  {sortedWatching.map((item) => {
                    const title = item.title || item.name || "제목 없음";
                    const isTv = item.mediaType === "tv";
                    const season = (item as WatchingItem).season_number;
                    const episode = (item as WatchingItem).episode_number;

                    return (
                      <li key={makeKey(item)}>
                        <Link to={buildTo(item)}>
                          {getThumb(item) ? (
                            <img src={`${IMG}${getThumb(item)}`} alt={title} />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

                        <div className="storage-content">
                          <div className="info-wrap">
                            {isTv && season != null && episode != null && (
                              <p className="ep">
                                {title} 시즌 {season} · {episode}화
                              </p>
                            )}

                            {item.vote_average != null && (
                              <p className="rating">
                                ⭐ {Number(item.vote_average).toFixed(1)}
                              </p>
                            )}
                          </div>

                          <div className="del-wrap">
                            <p
                              className="del-btn"
                              onClick={() =>
                                onRemoveWatching(activeProfileId, item)
                              }
                            >
                              삭제
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* ================= 좋아요 ================= */}
          {activeTab === "좋아요" && (
            <>
              <div className="storage-toolbar">
                <p className="count">총:{likes.length}개</p>
                {renderFilter()}
              </div>

              {sortedLikes.length === 0 ? (
                <div className="empty-state">
                  <p>좋아요한 컨텐츠가 없습니다</p>
                </div>
              ) : (
                <ul className="list-good">
                  {sortedLikes.map((item) => {
                    const title = item.title || item.name || "제목 없음";
                    return (
                      <li key={makeKey(item)}>
                        <Link to={buildTo(item)}>
                          {item.poster_path ? (
                            <img
                              src={`${IMG}${item.poster_path}`}
                              alt={title}
                            />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

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
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* ================= 다운로드 ================= */}
          {activeTab === "다운로드" && (
            <>
              <div className="storage-toolbar">
                <p className="count">총:{downloads.length}개</p>
                {renderFilter()}
              </div>

              {sortedDownloads.length === 0 ? (
                <div className="empty-state">
                  <p>다운로드한 컨텐츠가 없습니다</p>
                </div>
              ) : (
                <ul className="list-good">
                  {sortedDownloads.map((item) => {
                    const title = item.title || item.name || "제목 없음";
                    return (
                      <li key={makeKey(item)}>
                        <Link to={buildTo(item)}>
                          {item.poster_path ? (
                            <img
                              src={`${IMG}${item.poster_path}`}
                              alt={title}
                            />
                          ) : (
                            <div className="no-thumb">No Image</div>
                          )}
                        </Link>

                        <p
                          className="del-btn"
                          onClick={() =>
                            onRemoveDownload(activeProfileId, item)
                          }
                        >
                          삭제
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </>
      )}
      <MobileNav/>
    </div>
  );
};

export default StorageBox;
