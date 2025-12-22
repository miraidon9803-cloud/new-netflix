import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieFilterStore } from "../../store/useMovieFilterStore";
import "./scss/FilterPopup.scss";

type SortKey = "latest" | "title" | "popular";

type FilterState = {
  sort: SortKey;
  genres: number[];
  countries: string[];
};

// 영화용 sort_by
const SORT_MAP: Record<SortKey, string> = {
  latest: "primary_release_date.desc",
  title: "original_title.asc",
  popular: "popularity.desc",
};

// 영화 장르 ID
const GENRES: { label: string; id: number }[] = [
  { label: "액션", id: 28 },
  { label: "모험", id: 12 },
  { label: "애니메이션", id: 16 },
  { label: "코미디", id: 35 },
  { label: "범죄", id: 80 },
  { label: "다큐멘터리", id: 99 },
  { label: "드라마", id: 18 },
  { label: "가족", id: 10751 },
  { label: "판타지", id: 14 },
  { label: "역사", id: 36 },
  { label: "공포", id: 27 },
  { label: "음악", id: 10402 },
  { label: "미스터리", id: 9648 },
  { label: "로맨스", id: 10749 },
  { label: "SF", id: 878 },
  { label: "스릴러", id: 53 },
  { label: "전쟁", id: 10752 },
];

const COUNTRIES: { label: string; code: string }[] = [
  { label: "미국", code: "US" },
  { label: "영국", code: "GB" },
  { label: "프랑스", code: "FR" },
  { label: "독일", code: "DE" },
  { label: "일본", code: "JP" },
  { label: "한국", code: "KR" },
  { label: "인도", code: "IN" },
  { label: "캐나다", code: "CA" },
  { label: "호주", code: "AU" },
  { label: "스페인", code: "ES" },
  { label: "이탈리아", code: "IT" },
  { label: "브라질", code: "BR" },
  { label: "멕시코", code: "MX" },
  { label: "스웨덴", code: "SE" },
  { label: "네덜란드", code: "NL" },
  { label: "아르헨티나", code: "AR" },
  { label: "터키", code: "TR" },
];

const FilterPopup: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // ✅ 필터 상태는 store에서만 관리
  const { filters, setFilters, resetFilters } = useMovieFilterStore();

  // const initial: FilterState = useMemo(() => ({ sort: 'latest', genres: [], countries: [] }), []);

  const toggleNumber = (arr: number[], v: number) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const toggleString = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const buildParams = (f: FilterState) => {
    const params: Record<string, string> = {};
    params.sort_by = SORT_MAP[f.sort];
    if (f.genres.length) params.with_genres = f.genres.join(",");
    if (f.countries.length) params.with_origin_country = f.countries.join(",");
    params.page = "1";
    return params;
  };

  const onReset = () => {
    resetFilters(); // ✅ store 초기화
  };

  const onApply = () => {
    const params = buildParams(filters);
    const qs = new URLSearchParams(params).toString();

    console.log("[MovieFilter][apply]", filters);

    setOpen(false);
    navigate(`/movie/filter?${qs}`);
  };

  return (
    <>
      <div className="filter-wrap">
        <button type="button" onClick={() => setOpen(true)}>
          <img src="/images/icon/filter.png" alt="filter" />
          필터
        </button>
      </div>

      {open && (
        <div className="filter-dim" onClick={() => setOpen(false)}>
          <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
            <div className="filter-head">
              <div className="filter-title">카테고리</div>
              <button
                type="button"
                className="filter-close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {/* 정렬 */}
            <section className="filter-sec">
              <div className="filter-sec-title">정렬</div>
              <div className="radio-row">
                {(["latest", "title", "popular"] as SortKey[]).map((k) => (
                  <label key={k} className="radio-item">
                    <input
                      type="radio"
                      name="sort"
                      checked={filters.sort === k}
                      onChange={() => setFilters({ ...filters, sort: k })}
                    />
                    {k === "latest"
                      ? "최신순"
                      : k === "title"
                      ? "제목순"
                      : "인기순"}
                  </label>
                ))}
              </div>
            </section>

            {/* 장르 */}
            <section className="filter-sec">
              <div className="filter-sec-title">장르</div>
              <div className="chip-grid">
                {GENRES.map((g) => (
                  <button
                    key={`${g.label}-${g.id}`}
                    type="button"
                    className={`chip ${
                      filters.genres.includes(g.id) ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        genres: toggleNumber(filters.genres, g.id),
                      })
                    }
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 국가 */}
            <section className="filter-sec">
              <div className="filter-sec-title">국가</div>
              <div className="chip-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`chip ${
                      filters.countries.includes(c.code) ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        countries: toggleString(filters.countries, c.code),
                      })
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="filter-actions">
              <button type="button" className="btn ghost" onClick={onReset}>
                초기화
              </button>
              <button type="button" className="btn primary" onClick={onApply}>
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPopup;
