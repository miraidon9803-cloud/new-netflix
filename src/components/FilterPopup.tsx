import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/FilterPopup.scss";
import { genre } from "../data/genre";

type SortKey = "latest" | "title" | "popular";
type RuntimeKey = "under30" | "30to60" | "over60";

type FilterState = {
  sort: SortKey;
  genres: number[]; // TMDB genre id
  runtimes: RuntimeKey[];
  countries: string[]; // ISO 코드 (KR, US...)
};

const SORT_MAP: Record<SortKey, string> = {
  latest: "first_air_date.desc",
  title: "name.asc",
  popular: "popularity.desc",
};

const GENRES = genre;

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

const RUNTIMES: {
  key: RuntimeKey;
  label: string;
  gte?: number;
  lte?: number;
}[] = [
  { key: "under30", label: "30분 이하", lte: 30 },
  { key: "30to60", label: "30분 ~ 1시간", gte: 30, lte: 60 },
  { key: "over60", label: "1시간 이상", gte: 60 },
];

const INITIAL_FILTERS: FilterState = {
  sort: "latest",
  genres: [],
  runtimes: [],
  countries: [],
};

const toggleNumber = (arr: number[], v: number) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

const toggleString = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

const FilterPopup: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const toggleRuntime = (key: RuntimeKey) => {
    setFilters((p) => ({
      ...p,
      runtimes: p.runtimes.includes(key)
        ? p.runtimes.filter((x) => x !== key)
        : [...p.runtimes, key],
    }));
  };

  const buildParams = useMemo(() => {
    return (f: FilterState) => {
      const params: Record<string, string> = {};

      params.sort_by = SORT_MAP[f.sort];

      if (f.genres.length) params.with_genres = f.genres.join(",");
      if (f.countries.length)
        params.with_origin_country = f.countries.join(",");

      let gte: number | undefined;
      let lte: number | undefined;

      f.runtimes.forEach((key) => {
        const rule = RUNTIMES.find((r) => r.key === key);
        if (!rule) return;

        if (rule.gte !== undefined) {
          gte = gte === undefined ? rule.gte : Math.max(gte, rule.gte);
        }
        if (rule.lte !== undefined) {
          lte = lte === undefined ? rule.lte : Math.min(lte, rule.lte);
        }
      });

      if (gte !== undefined) params["with_runtime.gte"] = String(gte);
      if (lte !== undefined) params["with_runtime.lte"] = String(lte);

      params.page = "1";
      return params;
    };
  }, []);

  const onReset = () => setFilters(INITIAL_FILTERS);

  const onApply = () => {
    const qs = new URLSearchParams(buildParams(filters)).toString();
    setOpen(false);
    navigate(`/series/filter?${qs}`);
  };

  return (
    <>
      <div className="main-filter-wrap">
        <button type="button" onClick={() => setOpen(true)}>
          <img src="/images/icon/filter.png" alt="filter" />
          필터
        </button>
      </div>

      {open && (
        <div
          className="main-filter-dim"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="main-filter-popup"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="필터 팝업"
          >
            <div className="main-filter-head">
              <div className="main-filter-title">카테고리</div>
              <button
                type="button"
                className="main-filter-close"
                onClick={() => setOpen(false)}
                aria-label="필터 닫기"
              >
                ×
              </button>
            </div>

            {/* 정렬 */}
            <section className="main-filter-sec">
              <div className="main-filter-sec-title">정렬</div>
              <div className="main-radio-row">
                <label className="main-radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === "latest"}
                    onChange={() => setFilters((p) => ({ ...p, sort: "latest" }))}
                  />
                  최신순
                </label>

                <label className="main-radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === "title"}
                    onChange={() => setFilters((p) => ({ ...p, sort: "title" }))}
                  />
                  제목순
                </label>

                <label className="main-radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === "popular"}
                    onChange={() => setFilters((p) => ({ ...p, sort: "popular" }))}
                  />
                  인기순
                </label>
              </div>
            </section>

            {/* 장르 */}
            <section className="main-filter-sec">
              <div className="main-filter-sec-title">장르</div>
              <div className="main-chip-grid">
                {GENRES.map((g) => (
                  <button
                    key={`${g.label}-${g.id}`}
                    type="button"
                    className={`main-chip ${filters.genres.includes(g.id) ? "is-active" : ""}`}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        genres: toggleNumber(p.genres, g.id),
                      }))
                    }
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 러닝타임 */}
            <section className="main-filter-sec">
              <div className="main-filter-sec-title">러닝타임</div>
              <div className="main-chip-row">
                {RUNTIMES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    className={`main-chip ${filters.runtimes.includes(r.key) ? "is-active" : ""}`}
                    onClick={() => toggleRuntime(r.key)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 국가 */}
            <section className="main-filter-sec">
              <div className="main-filter-sec-title">국가</div>
              <div className="main-chip-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`main-chip ${filters.countries.includes(c.code) ? "is-active" : ""}`}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        countries: toggleString(p.countries, c.code),
                      }))
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="main-filter-actions">
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
