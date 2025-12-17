import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWatchingStore } from "../store/WatichingStore";
import { useProfileStore } from "../store/Profile";

const StorageBox = () => {
  const { watching, onFetchWatching, onRemoveWatching } = useWatchingStore();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  useEffect(() => {
    if (!activeProfileId) return;
    onFetchWatching(activeProfileId);
  }, [activeProfileId, onFetchWatching]);

  if (!activeProfileId) return <p>프로필을 선택해주세요.</p>;
  if (watching.length === 0) return <p>재생중인 컨텐츠가 없습니다</p>;

  return (
    <div>
      <h2>재생중인 컨텐츠</h2>
      <ul className="list">
        {watching.map((item) => (
          <li key={`${item.mediaType}-${item.id}`}>
            <Link to={`/${item.mediaType}/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt=""
              />
              <h3>{item.title || item.name}</h3>
            </Link>

            <p>
              <button
                onClick={() =>
                  onRemoveWatching(activeProfileId, item.mediaType, item.id)
                }
              >
                삭제
              </button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StorageBox;
