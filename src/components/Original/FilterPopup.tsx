import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/FilterPopup.scss';
import {
  useOriginalFilterStore,
  type OriginalSortKey,
} from '../../store/useOriginalStore';

type FilterState = {
  sort: OriginalSortKey;
  genres: number[];
  countries: string[];
};

const SORT_MAP: Record<OriginalSortKey, string> = {
  popular: 'popularity.desc',
  latest: 'primary_release_date.desc',
  title: 'original_title.asc',
};

const GENRES = [
  { label: '액션', id: 28 },
  { label: '모험', id: 12 },
  { label: '애니메이션', id: 16 },
  { label: '코미디', id: 35 },
  { label: '범죄', id: 80 },
  { label: '다큐멘터리', id: 99 },
  { label: '드라마', id: 18 },
  { label: '가족', id: 10751 },
  { label: '판타지', id: 14 },
  { label: '역사', id: 36 },
  { label: '공포', id: 27 },
  { label: '음악', id: 10402 },
  { label: '미스터리', id: 9648 },
  { label: '로맨스', id: 10749 },
  { label: 'SF', id: 878 },
  { label: '스릴러', id: 53 },
  { label: '전쟁', id: 10752 },
];

const COUNTRIES = [
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

const FilterPopup: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { filters, setFilters, resetFilters } =
    useOriginalFilterStore();

  const toggleNumber = (arr: number[], v: number) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const toggleString = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const buildParams = (f: FilterState) => {
    const params: Record<string, string> = {};
    params.sort_by = SORT_MAP[f.sort];
    if (f.genres.length) params.with_genres = f.genres.join(',');
    if (f.countries.length)
      params.with_origin_country = f.countries.join(',');
    params.page = '1';
    return params;
  };

  const onApply = () => {
    const qs = new URLSearchParams(buildParams(filters)).toString();
    setOpen(false);
    navigate(`/original/filter?${qs}`);
  };

  return (
    <>
      <div className="original-filter-wrap">
        <button type="button" onClick={() => setOpen(true)}>
          <img src="/images/icon/filter.png" alt="filter" />
          필터
        </button>
      </div>

      {open && (
        <div
          className="original-filter-dim"
          onClick={() => setOpen(false)}
        >
          <div
            className="original-filter-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="original-filter-head">
              <div className="original-filter-title">카테고리</div>
              <button
                type="button"
                className="original-filter-close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {/* 정렬 */}
            <section className="original-filter-sec">
              <div className="original-filter-sec-title">정렬</div>
              <div className="original-radio-row">
                {(['popular', 'latest', 'title'] as OriginalSortKey[]).map(
                  (k) => (
                    <label key={k} className="original-radio-item">
                      <input
                        type="radio"
                        name="sort"
                        checked={filters.sort === k}
                        onChange={() => setFilters({ sort: k })}
                      />
                      {k === 'popular'
                        ? '인기순'
                        : k === 'latest'
                        ? '최신순'
                        : '제목순'}
                    </label>
                  )
                )}
              </div>
            </section>

            {/* 장르 */}
            <section className="original-filter-sec">
              <div className="original-filter-sec-title">장르</div>
              <div className="original-chip-grid">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`original-chip ${
                      filters.genres.includes(g.id)
                        ? 'is-active'
                        : ''
                    }`}
                    onClick={() =>
                      setFilters({
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
            <section className="original-filter-sec">
              <div className="original-filter-sec-title">국가</div>
              <div className="original-chip-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`original-chip ${
                      filters.countries.includes(c.code)
                        ? 'is-active'
                        : ''
                    }`}
                    onClick={() =>
                      setFilters({
                        countries: toggleString(
                          filters.countries,
                          c.code
                        ),
                      })
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="original-filter-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={resetFilters}
              >
                초기화
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={onApply}
              >
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
