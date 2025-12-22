import React, { useMemo, useState } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';

type TVItem = {
  id: number;
  name: string;
  original_name?: string;
  poster_path: string | null;
  overview?: string;
  first_air_date?: string;
  vote_average?: number;
};

type TVSearchResponse = { results: TVItem[] };

const IdSearch: React.FC = () => {
  const [query, setQuery] = useState('이쿠사가미: 전쟁의 신');
  const [lang, setLang] = useState<'ko-KR' | 'en-US' | 'ja-JP'>('ko-KR');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [results, setResults] = useState<TVItem[]>([]);
  const [usedQuery, setUsedQuery] = useState<string>('');

  // ✅ 자동 후보(기본 + 사용자가 입력한 값)
  const candidates = useMemo(() => {
    const base = query.trim();
    const defaults = [
      '이쿠사가미: 전쟁의 신',
      '이쿠사가미 전쟁의 신',
      'イクサガミ',
      'Last Samurai Standing',
    ];
    const set = new Set<string>([base, ...defaults].filter(Boolean));
    return Array.from(set);
  }, [query]);

  async function searchOnce(q: string): Promise<TVItem[]> {
    if (!API_KEY) throw new Error('VITE_TMDB_API_KEY가 없습니다 (.env 확인)');

    console.log('🔍 TMDB 검색 시도:', q, '| language:', lang);

    const qs = new URLSearchParams({
      api_key: API_KEY,
      language: lang,
      include_adult: 'false',
      query: q,
    });

    const url = `${BASE}/search/tv?${qs.toString()}`;
    console.log('➡️ 요청 URL:', url);

    const res = await fetch(url);
    console.log('⬅️ 응답 status:', res.status);

    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

    const data = (await res.json()) as TVSearchResponse;

    console.log('📦 응답 raw data:', data);
    console.log('📺 results:', data.results);
    console.log('✅ results length:', data.results?.length ?? 0);

    return data.results ?? [];
  }

  // ✅ 후보들을 순서대로 검색해서, 첫 번째로 결과 나오는 키워드 채택
  async function onSearch() {
    console.clear();
    console.log('🚀 검색 시작');
    console.log('🧠 후보 키워드:', candidates);

    setLoading(true);
    setError('');
    setResults([]);
    setUsedQuery('');

    try {
      let found: TVItem[] = [];
      let picked = '';

      for (const q of candidates) {
        const r = await searchOnce(q);
        console.log(`🔎 "${q}" 결과 개수:`, r.length);

        if (r.length > 0) {
          found = r;
          picked = q;
          break;
        }
      }

      console.log('🎯 최종 채택 키워드:', picked || '(없음)');
      console.log('🎬 최종 결과 목록:', found);
      console.log('🆔 첫 번째 결과 id:', found?.[0]?.id);
      console.log('📝 첫 번째 결과 title:', found?.[0]?.name);

      setUsedQuery(picked || candidates[0] || '');
      setResults(found);

      if (!found.length) {
        console.warn('❌ 결과 없음');
        setError('검색 결과가 없습니다. 다른 키워드를 시도해보세요.');
      }
    } catch (e: any) {
      console.error('🔥 검색 중 에러:', e);
      setError(e?.message ?? '검색 중 오류 발생');
    } finally {
      setLoading(false);
      console.log('🏁 검색 종료');
    }
  }

  return (
    <section style={{ padding: '1.2rem 0' }}>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>TMDB TV 한방 검색</h2>

      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 이쿠사가미, イクサガミ, Last Samurai Standing"
          style={{
            width: 'min(42rem, 100%)',
            padding: '0.7rem 0.8rem',
            borderRadius: '0.6rem',
            border: '1px solid #333',
            background: '#111',
            color: '#fff',
          }}
        />

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          style={{
            padding: '0.7rem 0.8rem',
            borderRadius: '0.6rem',
            border: '1px solid #333',
            background: '#111',
            color: '#fff',
          }}>
          <option value="ko-KR">ko-KR</option>
          <option value="en-US">en-US</option>
          <option value="ja-JP">ja-JP</option>
        </select>

        <button
          onClick={onSearch}
          disabled={loading}
          style={{
            padding: '0.7rem 1rem',
            borderRadius: '0.6rem',
            border: '1px solid #333',
            background: loading ? '#222' : '#fff',
            color: loading ? '#aaa' : '#000',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
          {loading ? '검색중…' : '검색'}
        </button>
      </div>

      <div style={{ marginTop: '0.6rem', color: '#aaa', fontSize: '1.2rem' }}>
        <div>자동 후보: {candidates.join(' / ')}</div>
        {usedQuery && <div>채택된 검색어: {usedQuery}</div>}
      </div>

      {error && <p style={{ marginTop: '0.8rem', color: '#ff6b6b' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', marginTop: '1rem' }}>
        {results.map((tv) => (
          <div key={tv.id} style={{ width: '12rem', flex: '0 0 auto' }}>
            <div style={{ borderRadius: '0.8rem', overflow: 'hidden', background: '#222' }}>
              {tv.poster_path ? (
                <img
                  src={`${IMG}${tv.poster_path}`}
                  alt={tv.name}
                  style={{ width: '100%', display: 'block' }}
                  loading="lazy"
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '2/3' }} />
              )}
            </div>

            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#fff' }}>{tv.name}</p>

            <p style={{ fontSize: '1.05rem', marginTop: '0.2rem', color: '#aaa' }}>
              {tv.first_air_date || '날짜 정보 없음'} · ⭐ {tv.vote_average?.toFixed(1) ?? '-'}
            </p>

            {/* 필요하면 id도 화면에 표시 (디버깅용) */}
            <p style={{ fontSize: '1.05rem', marginTop: '0.2rem', color: '#777' }}>id: {tv.id}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IdSearch;
