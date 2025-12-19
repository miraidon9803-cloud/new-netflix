import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/FilterPopup.scss';

type SortKey = 'latest' | 'title' | 'popular';
type RuntimeKey = 'under30' | '30to60' | 'over60';

type FilterState = {
  sort: SortKey;
  genres: number[]; // TMDB genre id
  runtimes: RuntimeKey[];
  countries: string[]; // ISO 코드 (KR, US...)
};

const SORT_MAP: Record<SortKey, string> = {
  latest: 'first_air_date.desc',
  title: 'name.asc',
  popular: 'popularity.desc',
};

const GENRES: { label: string; id: number }[] = [
  { label: '액션', id: 10759 },
  { label: '모험', id: 10759 },
  { label: '애니메이션', id: 16 },
  { label: '코미디', id: 35 },
  { label: '범죄', id: 80 },
  { label: '다큐멘터리', id: 99 },
  { label: '드라마', id: 18 },
  { label: '가족', id: 10751 },
  { label: '판타지', id: 10765 },
  { label: '역사', id: 36 },
  { label: '공포', id: 27 },
  { label: '음악', id: 10402 },
  { label: '미스터리', id: 9648 },
  { label: '로맨스', id: 10749 },
  { label: 'SF', id: 10765 },
  { label: '스릴러', id: 53 },
  { label: '전쟁', id: 10752 },
];

const COUNTRIES: { label: string; code: string }[] = [
  { label: '미국', code: 'US' },
  { label: '영국', code: 'GB' },
  { label: '프랑스', code: 'FR' },
  { label: '독일', code: 'DE' },
  { label: '일본', code: 'JP' },
  { label: '한국', code: 'KR' },
  { label: '인도', code: 'IN' },
  { label: '캐나다', code: 'CA' },
  { label: '호주', code: 'AU' },
  { label: '스페인', code: 'ES' },
  { label: '이탈리아', code: 'IT' },
  { label: '브라질', code: 'BR' },
  { label: '멕시코', code: 'MX' },
  { label: '스웨덴', code: 'SE' },
  { label: '네덜란드', code: 'NL' },
  { label: '아르헨티나', code: 'AR' },
  { label: '터키', code: 'TR' },
];

const RUNTIMES: { key: RuntimeKey; label: string; gte?: number; lte?: number }[] = [
  { key: 'under30', label: '30분 이하', lte: 30 },
  { key: '30to60', label: '30분 ~ 1시간', gte: 30, lte: 60 },
  { key: 'over60', label: '1시간 이상', gte: 60 },
];

const FilterPopup: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initial: FilterState = useMemo(
    () => ({ sort: 'latest', genres: [], runtimes: [], countries: [] }),
    []
  );
  const [filters, setFilters] = useState<FilterState>(initial);

  const toggleNumber = (arr: number[], v: number) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const toggleString = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const toggleRuntime = (key: RuntimeKey) =>
    setFilters((p) => ({
      ...p,
      runtimes: p.runtimes.includes(key)
        ? p.runtimes.filter((x) => x !== key)
        : [...p.runtimes, key],
    }));

  const buildParams = (f: FilterState) => {
    const params: Record<string, string> = {};

    params.sort_by = SORT_MAP[f.sort];

    if (f.genres.length) params.with_genres = f.genres.join(',');
    if (f.countries.length) params.with_origin_country = f.countries.join(',');

    // 러닝타임 gte/lte
    let gte: number | undefined;
    let lte: number | undefined;

    f.runtimes.forEach((key) => {
      const rule = RUNTIMES.find((r) => r.key === key);
      if (!rule) return;
      if (rule.gte !== undefined) gte = gte === undefined ? rule.gte : Math.max(gte, rule.gte);
      if (rule.lte !== undefined) lte = lte === undefined ? rule.lte : Math.min(lte, rule.lte);
    });

    if (gte !== undefined) params['with_runtime.gte'] = String(gte);
    if (lte !== undefined) params['with_runtime.lte'] = String(lte);

    // 페이지도 같이 넘기고 싶으면:
    params.page = '1';

    return params;
  };

  const onReset = () => setFilters(initial);

  const onApply = () => {
    const params = buildParams(filters);
    const qs = new URLSearchParams(params).toString();

    setOpen(false);
    navigate(`/series/filter?${qs}`); // ✅ 결과창으로 이동
  };

  return (
    <>
      {/* 버튼은 기존 유지 */}
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
              <button type="button" className="filter-close" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <section className="filter-sec">
              <div className="filter-sec-title">정렬</div>
              <div className="radio-row">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === 'latest'}
                    onChange={() => setFilters((p) => ({ ...p, sort: 'latest' }))}
                  />
                  최신순
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === 'title'}
                    onChange={() => setFilters((p) => ({ ...p, sort: 'title' }))}
                  />
                  제목순
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === 'popular'}
                    onChange={() => setFilters((p) => ({ ...p, sort: 'popular' }))}
                  />
                  인기순
                </label>
              </div>
            </section>

            <section className="filter-sec">
              <div className="filter-sec-title">장르</div>
              <div className="chip-grid">
                {GENRES.map((g) => (
                  <button
                    key={`${g.label}-${g.id}`}
                    type="button"
                    className={`chip ${filters.genres.includes(g.id) ? 'is-active' : ''}`}
                    onClick={() =>
                      setFilters((p) => ({ ...p, genres: toggleNumber(p.genres, g.id) }))
                    }>
                    {g.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="filter-sec">
              <div className="filter-sec-title">러닝타임</div>
              <div className="chip-row">
                {RUNTIMES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    className={`chip ${filters.runtimes.includes(r.key) ? 'is-active' : ''}`}
                    onClick={() => toggleRuntime(r.key)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="filter-sec">
              <div className="filter-sec-title">국가</div>
              <div className="chip-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`chip ${filters.countries.includes(c.code) ? 'is-active' : ''}`}
                    onClick={() =>
                      setFilters((p) => ({ ...p, countries: toggleString(p.countries, c.code) }))
                    }>
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
