import React, { useMemo, useState } from 'react';
import './TotalPopup.scss';

const GENRES = [
  { label: '액션', movie: '28', tv: '10759' },
  { label: '모험', movie: '12', tv: '10759' },
  { label: '애니메이션', movie: '16', tv: '16' },
  { label: '코미디', movie: '35', tv: '35' },
  { label: '범죄', movie: '80', tv: '80' },
  { label: '다큐멘터리', movie: '99', tv: '99' },
  { label: '드라마', movie: '18', tv: '18' },
  { label: '가족', movie: '10751', tv: '10751' },
  { label: '판타지', movie: '14', tv: '10765' },
  { label: '역사', movie: '36', tv: '36' },
  { label: '공포', movie: '27', tv: '9648' },
  { label: '음악', movie: '10402', tv: '10402' },
  { label: '미스터리', movie: '9648', tv: '9648' },
  { label: '로맨스', movie: '10749', tv: '10749' },
  { label: 'SF', movie: '878', tv: '10765' },
  { label: '스릴러', movie: '53', tv: '9648' },
  { label: '전쟁', movie: '10752', tv: '10768' },
  { label: '서부극', movie: '37', tv: '37' },
  { label: 'TV 영화', movie: '10770', tv: '10770' },
] as const;

const SORTS = [
  { label: '최신순', value: 'primary_release_date.desc' },
  { label: '제목순', value: 'original_title.asc' },
  { label: '인기순', value: 'popularity.desc' },
] as const;

const TYPES = [
  { label: '시리즈', value: 'tv' },
  { label: '영화', value: 'movie' },
  { label: '오리지널', value: 'original' },
] as const;

const RUNTIMES = [
  { label: '30분 이하', value: 'lte_30', gte: '', lte: '30' },
  { label: '30분 ~ 1시간', value: '30_60', gte: '30', lte: '60' },
  { label: '1시간 이상', value: 'gte_60', gte: '60', lte: '' },
] as const;

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
] as const;

type Props = {
  initialParams: Record<string, string>;
  onApply: (nextParams: Record<string, string>) => void;
};

const TotalPopup: React.FC<Props> = ({ initialParams, onApply }) => {
  const [open, setOpen] = useState(false);

  const [sortBy, setSortBy] = useState(initialParams.sort_by || 'primary_release_date.desc');
  const [contentType, setContentType] = useState(initialParams.type || 'tv');

  const [genreLabel, setGenreLabel] = useState(initialParams.label || '액션');

  const [runtime, setRuntime] = useState(initialParams.runtime || '');
  const [countryCodes, setCountryCodes] = useState<Set<string>>(
    new Set((initialParams.country_codes || '').split(',').filter(Boolean))
  );

  const genre = useMemo(
    () => GENRES.find((g) => g.label === genreLabel) ?? GENRES[0],
    [genreLabel]
  );

  const toggleCountry = (code: string) => {
    setCountryCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const close = () => setOpen(false);

  const reset = () => {
    setSortBy('primary_release_date.desc');
    setContentType('tv');
    setGenreLabel('액션');
    setRuntime('');
    setCountryCodes(new Set());
  };

  const apply = () => {
    const rt = RUNTIMES.find((r) => r.value === runtime);
    const codes = Array.from(countryCodes).join(',');

    onApply({
      sort_by: sortBy,
      type: contentType,

      label: genre.label,
      genreMovie: genre.movie,
      genreTv: genre.tv,

      runtime,
      runtime_gte: rt?.gte ?? '',
      runtime_lte: rt?.lte ?? '',

      country_codes: codes,
    });

    close();
  };

  return (
    <>
      {/* 필터 버튼 */}
      <div className="total-wrap">
        <button type="button" onClick={() => setOpen(true)}>
          <img src="/images/icon/filter.png" alt="" />
          필터
        </button>
      </div>

      {open && (
        <div
          className="total-dim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}>
          <div className="total-popup" role="dialog" aria-label="total filter popup">
            {/* ✅ 헤더: 타이틀 가운데 + X 우측 */}
            <div className="popup-top">
              <h3 className="popup-title">카테고리</h3>
              <button type="button" className="popup-close" onClick={close} aria-label="close">
                ×
              </button>
            </div>

            {/* ✅ 정렬 */}
            <section className="total-sec">
              <p className="total-sec-title">정렬</p>
              <div className="radio-row">
                {SORTS.map((s) => (
                  <label key={s.value} className="radio-item">
                    <input
                      type="radio"
                      name="sort_by"
                      checked={sortBy === s.value}
                      onChange={() => setSortBy(s.value)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </section>

            {/* ✅ 콘텐츠 타입 */}
            <section className="total-sec">
              <p className="total-sec-title">콘텐츠 타입</p>
              <div className="chip-row">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`chip ${contentType === t.value ? 'is-active' : ''}`}
                    onClick={() => setContentType(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ✅ 장르 */}
            <section className="total-sec">
              <p className="total-sec-title">장르</p>
              <div className="chip-grid">
                {GENRES.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    className={`chip ${genreLabel === g.label ? 'is-active' : ''}`}
                    onClick={() => setGenreLabel(g.label)}>
                    {g.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ✅ 러닝타임 */}
            <section className="total-sec">
              <p className="total-sec-title">러닝타임</p>
              <div className="chip-row">
                {RUNTIMES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`chip ${runtime === r.value ? 'is-active' : ''}`}
                    onClick={() => setRuntime(runtime === r.value ? '' : r.value)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ✅ 국가 */}
            <section className="total-sec">
              <p className="total-sec-title">국가</p>
              <div className="chip-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`chip ${countryCodes.has(c.code) ? 'is-active' : ''}`}
                    onClick={() => toggleCountry(c.code)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ✅ 하단 버튼: 좌 초기화 / 우 적용하기 */}
            <div className="total-actions">
              <button type="button" className="btn ghost" onClick={reset}>
                초기화
              </button>
              <button type="button" className="btn primary" onClick={apply}>
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalPopup;
