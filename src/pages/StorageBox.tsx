import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWatchingStore } from "../store/WatichingStore";
import { useProfileStore } from "../store/Profile";
import type { WatchingItem } from "../store/WatichingStore";
import "./scss/StorageBox.scss";

const IMG = "https://image.tmdb.org/t/p/w500";

const StorageBox = () => {
  const { watching, onFetchWatching, onRemoveWatching } = useWatchingStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  useEffect(() => {
    if (!activeProfileId) return;
    onFetchWatching(activeProfileId);
  }, [activeProfileId, onFetchWatching]);

  if (!activeProfileId) return <p>프로필을 선택해주세요.</p>;
  if (watching.length === 0) return <p>재생중인 컨텐츠가 없습니다</p>;

  const getThumb = (item: WatchingItem) =>
    item.still_path || item.backdrop_path || item.poster_path || null;

  const buildTo = (item: WatchingItem) => {
    if (item.mediaType === "tv") {
      const season = item.season_number ?? "";
      const episode = item.episode_number ?? "";
      return `/tv/${item.id}?season=${season}&episode=${episode}`;
    }
    return `/movie/${item.id}`;
  };

  return (
    <div className="storage-inner">
      <h2>보관함</h2>

      <ul className="list">
        {watching.map((item) => {
          const thumb = getThumb(item);
          const to = buildTo(item);
          const title = item.title || item.name || "제목 없음";

          return (
            <li
              key={`${item.mediaType}-${item.id}-${item.season_number ?? 0}-${
                item.episode_number ?? 0
              }`}
            >
              <Link to={to}>
                {thumb ? (
                  <img src={`${IMG}${thumb}`} alt={title} />
                ) : (
                  <div className="no-thumb">No Image</div>
                )}
              </Link>

              <div className="storage-title">
                <h3>{title}</h3>

                {item.mediaType === "tv" &&
                  item.season_number != null &&
                  item.episode_number != null && (
                    <p className="ep">
                      시즌 {item.season_number} · {item.episode_number}화
                      {item.episode_name ? ` · ${item.episode_name}` : ""}
                    </p>
                  )}

                <p>
                  <button
                    onClick={() => onRemoveWatching(activeProfileId, item)}
                  >
                    삭제
                  </button>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StorageBox;
