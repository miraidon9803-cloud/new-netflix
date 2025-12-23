import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/Alarm.scss";

type MediaType = "영화" | "시리즈";
type TabType = "all" | "영화" | "시리즈";

interface AlarmItem {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: MediaType;
  releaseDate: string | null; // movie: release_date, tv: first_air_date
  overview: string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const LS_KEY = "alarm_watchlist_v1";

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatKoreanReleaseText = (
  mediaType: MediaType,
  dateStr: string | null
) => {
  if (!dateStr) return mediaType === "영화" ? "개봉일 미정" : "공개일 미정";

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime()))
    return mediaType === "영화" ? "개봉일 미정" : "공개일 미정";

  const month = d.getMonth() + 1;
  const day = d.getDate();

  return mediaType === "영화"
    ? `${month}월 ${day}일 개봉예정`
    : `${month}월 ${day}일 공개예정`;
};

const readAlarmSet = (): Set<string> => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
};

const writeAlarmSet = (set: Set<string>) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
};

const keyOf = (mediaType: MediaType, id: number) => `${mediaType}-${id}`;

const Alarm = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<TabType>("all");

  const [alarmSet, setAlarmSet] = useState<Set<string>>(() => readAlarmSet());

  const { from, to } = useMemo(() => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 60);
    return { from: formatDate(today), to: formatDate(end) };
  }, []);

  useEffect(() => {
    if (!API_KEY) {
      console.error("TMDB API KEY가 없습니다. (.env 확인)");
      setLoading(false);
      return;
    }

    const fetchUpcomingMovies = async (): Promise<AlarmItem[]> => {
      const url =
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}` +
        `&language=ko-KR&region=KR&page=1`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("upcoming movies fetch failed");
      const data = await res.json();

      return (data.results ?? []).map((m: any) => ({
        id: m.id,
        title: m.title ?? "제목 없음",
        posterPath: m.poster_path ?? null,
        mediaType: "movie",
        releaseDate: m.release_date ?? null,
        overview: m.overview ?? "설명이 없습니다.",
      }));
    };

    const fetchUpcomingTv = async (): Promise<AlarmItem[]> => {
      // TV는 upcoming 엔드포인트가 없어서 discover + first_air_date 미래 범위로 구현
      const url =
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}` +
        `&language=ko-KR&sort_by=first_air_date.asc` +
        `&first_air_date.gte=${from}&first_air_date.lte=${to}&page=1`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("upcoming tv fetch failed");
      const data = await res.json();

      return (data.results ?? []).map((t: any) => ({
        id: t.id,
        title: t.name ?? "제목 없음",
        posterPath: t.poster_path ?? null,
        mediaType: "tv",
        releaseDate: t.first_air_date ?? null,
        overview: t.overview ?? "설명이 없습니다.",
      }));
    };

    const load = async () => {
      setLoading(true);
      try {
        const [movies, tv] = await Promise.all([
          fetchUpcomingMovies(),
          fetchUpcomingTv(),
        ]);

        const merged = [...movies, ...tv].sort((a, b) => {
          const ad = a.releaseDate
            ? new Date(a.releaseDate).getTime()
            : Number.MAX_SAFE_INTEGER;
          const bd = b.releaseDate
            ? new Date(b.releaseDate).getTime()
            : Number.MAX_SAFE_INTEGER;
          return ad - bd;
        });

        setItems(merged);
      } catch (e) {
        console.error("Alarm load error:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [from, to]);

  const filteredItems = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((i) => i.mediaType === tab);
  }, [items, tab]);

  const toggleAlarm = (mediaType: MediaType, id: number) => {
    const k = keyOf(mediaType, id);
    setAlarmSet((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      writeAlarmSet(next);
      return next;
    });
  };

  // const goDetail = (item: AlarmItem) => {
  //   navigate(`/${item.mediaType}/${item.id}`);
  // };

  const goPlay = (item: AlarmItem) => {
    // 상세에서 play=1 쿼리를 감지해서 트레일러 자동재생 같은 UX 만들 수 있어요
    navigate(`/${item.mediaType}/${item.id}?play=1`);
  };

  return (
    <div className="alram-inner">
      <div className="alram-wrap">
        {/* 탭 메뉴 */}
        <div className="alram-tabs">
          <p
            className={`alram-tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            전체
          </p>
          <p
            className={`alram-tab ${tab === "영화" ? "active" : ""}`}
            onClick={() => setTab("영화")}
          >
            MOVIE
          </p>
          <p
            className={`alram-tab ${tab === "시리즈" ? "active" : ""}`}
            onClick={() => setTab("시리즈")}
          >
            TV
          </p>
        </div>

        <div className="alram-content">
          {loading && (
            <p className="alram-loading">공개예정작을 불러오는 중입니다…</p>
          )}

          {!loading && filteredItems.length === 0 && (
            <p className="alram-empty">해당 탭의 공개예정작이 없습니다.</p>
          )}

          {!loading &&
            filteredItems.map((item) => {
              const alarmKey = keyOf(item.mediaType, item.id);
              const isAlarmOn = alarmSet.has(alarmKey);

              return (
                <p key={alarmKey} className="alram-card">
                  <div className="alram-poster">
                    {item.posterPath ? (
                      <img
                        src={`${IMAGE_BASE_URL}${item.posterPath}`}
                        alt={item.title}
                      />
                    ) : (
                      <div className="alram-no-image">이미지 없음</div>
                    )}
                  </div>

                  <div className="alram-info">
                    <p className="alram-subtitle">
                      {item.title}
                      <span className="alram-release">
                        {" : "}
                        {formatKoreanReleaseText(
                          item.mediaType,
                          item.releaseDate
                        )}
                      </span>
                    </p>

                    <p className="alram-overview">{item.overview}</p>

                    <div className="alram-actions">
                      <p
                        className={`alram-btn alram-btn--alarm ${
                          isAlarmOn ? "on" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAlarm(item.mediaType, item.id);
                        }}
                      >
                        {isAlarmOn ? "알람완료" : "알람받기"}
                      </p>
                      <p
                        className="alram-btn alram-btn--play"
                        onClick={(e) => {
                          e.stopPropagation();
                          goPlay(item);
                        }}
                      >
                        ▶ 예고편 보러가기
                      </p>
                    </div>
                  </div>
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Alarm;
