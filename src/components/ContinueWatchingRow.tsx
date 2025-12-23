// src/components/ContinueWatchingRow.tsx
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./scss/ContinueWatchingRow.scss";

import { useWatchingStore } from "../store/WatichingStore";
import { useProfileStore } from "../store/Profile";
import type { WatchingItem } from "../store/WatichingStore";

const IMG_W780 = "https://image.tmdb.org/t/p/w780";
const IMG_W500 = "https://image.tmdb.org/t/p/w500";
const FALLBACK = "/images/icon/no_poster.png";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const getTitle = (item: WatchingItem) => item.title ?? item.name ?? "제목 없음";

const getThumbSrc = (item: WatchingItem) => {
  const path = item.still_path || item.backdrop_path || item.poster_path;
  if (!path) return FALLBACK;

  // still/backdrop는 크게, poster는 w500도 괜찮음(그래도 통일감 위해 w780 우선)
  const base = item.still_path || item.backdrop_path ? IMG_W780 : IMG_W500;
  return `${base}${path}`;
};

const buildTo = (item: WatchingItem) => {
  if (item.mediaType === "tv") {
    const s = item.season_number;
    const e = item.episode_number;

    // tv는 시즌/화 있으면 이어보기 쿼리로
    if (s && e) return `/tv/${item.id}?season=${s}&episode=${e}`;
    return `/tv/${item.id}`;
  }
  return `/movie/${item.id}`;
};

const getProgress = (item: WatchingItem) => {
  // progress(0~1) 있으면 그대로 사용
  if (typeof item.progress === "number") return clamp01(item.progress);
  return 0;
};

const ContinueWatchingRow: React.FC = () => {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const { watching, onFetchWatching } = useWatchingStore() as {
    watching: WatchingItem[];
    onFetchWatching: (profileId?: string) => Promise<void>;
  };

  useEffect(() => {
    if (!activeProfileId) return;
    onFetchWatching(activeProfileId);
  }, [activeProfileId, onFetchWatching]);

  const sorted = useMemo(() => {
    const list = Array.isArray(watching) ? watching : [];
    return [...list].sort((a, b) => (b.updateAt ?? 0) - (a.updateAt ?? 0));
  }, [watching]);

  if (!activeProfileId) return null;
  if (sorted.length === 0) return null;

  return (
    <section className="cwWrap">
      <h2 className="cwTitle">시청 중인 콘텐츠</h2>

      <ul className="cwList">
        {sorted.map((item) => {
          const title = getTitle(item);
          const thumb = getThumbSrc(item);
          const percent = `${getProgress(item) * 100}%`;

          return (
            <li className="cwItem" key={`${item.mediaType}-${item.id}-${item.season_number ?? "x"}-${item.episode_number ?? "x"}`}>
              <Link to={buildTo(item)} className="cwCard" aria-label={title}>
                <img className="cwThumb" src={thumb} alt={title} draggable={false} />

                {/* 가운데 플레이 아이콘 */}
                <span className="cwPlay" aria-hidden="true">▶</span>

                {/* 우상단 메뉴 아이콘(디자인용) */}
                <button
                  type="button"
                  className="cwMenu"
                  aria-label="메뉴"
                  onClick={(e) => {
                    e.preventDefault(); // 링크 이동 막기(메뉴 눌렀을 때)
                    e.stopPropagation();
                    // TODO: 여기에 삭제/보관함 이동 같은 액션 넣으면 됨
                  }}
                >
                  ☰
                </button>

                {/* 하단 타이틀 */}
                <div className="cwMeta">
                  <p className="cwName">{title}</p>
                  {item.mediaType === "tv" && item.season_number && item.episode_number && (
                    <p className="cwEp">
                      시즌 {item.season_number} · {item.episode_number}화
                    </p>
                  )}
                </div>

                {/* 진행 바(아래 빨간 라인) */}
                <div className="cwProgress" aria-hidden="true">
                  <span style={{ width: percent }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ContinueWatchingRow;
