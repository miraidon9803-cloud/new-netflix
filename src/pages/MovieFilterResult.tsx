import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './scss/MovieFilterResult.scss';
import FilterPopup from '../components/Movies/FilterPopup';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type MovieItem = {
  id: number;
  title: string;
  poster_path: string | null;
};

type DiscoverMovieResponse = {
  results: MovieItem[];
};

const MovieFilterResult: React.FC = () => {
  const [sp] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState<MovieItem[]>([]);

  // URL 쿼리 → params 객체
  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }, [sp]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const qs = new URLSearchParams({
          api_key: API_KEY,
          language: 'ko-KR',
          include_adult: 'false',
          ...params,
        }).toString();

        const url = `${BASE}/discover/movie?${qs}`;
        console.log('[TMDB][MovieFilterResult] URL:', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

        const data = (await res.json()) as DiscoverMovieResponse;

        if (!mounted) return;

        // ✅ 포스터 없는건 제외
        setList((data.results ?? []).filter((m) => !!m.poster_path));
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '에러 발생');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params]);

  if (loading) return <div className="movie-filter loading">로딩중...</div>;
  if (error) return <div className="movie-filter error">에러: {error}</div>;

  return (
    <div className="MFilterResult-wrap">
      <div className="movie-filter">
        <div className="movie-filter-txt">
          <h2 className="title">필터를 적용해, 나에게 맞는 콘텐츠만 모아봤어요</h2>
          <p>영화 내 검색결과</p>
        </div>

        {/* ✅ 결과 페이지에서도 같은 필터 팝업 */}
        <div className="Mfilter">
          <FilterPopup />
        </div>

        {list.length === 0 ? (
          <p className="empty">조건에 맞는 결과가 없음</p>
        ) : (
          <ul className="movie-grid">
            {list.map((m) => (
              <li key={m.id} className="movie-card">
                {/* ✅ 클릭 시 상세로 이동 */}
                <Link to={`/movie/${m.id}`}>
                  <img
                    src={m.poster_path ? `${IMG}${m.poster_path}` : FALLBACK_POSTER}
                    alt={m.title}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MovieFilterResult;
