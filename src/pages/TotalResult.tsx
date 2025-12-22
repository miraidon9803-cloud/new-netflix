import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterPopup from '../components/Total/TotalPopup';
import './scss/TotalResult.scss';
import SideNav from '../components/SideNav';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK = '/images/icon/no_poster.png';

type Item = {
  id: number;
  type: 'tv' | 'movie';
  title: string;
  poster_path: string | null;
  vote_average: number;
};

type DiscoverMovieItem = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

type DiscoverTvItem = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
};

type DiscoverRes<T> = {
  results: T[];
};

const TotalResult: React.FC = () => {
  const [sp, setSp] = useSearchParams();

  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** URLSearchParams → 객체 (MovieFilterResult 같은 방식) */
  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }, [sp]);

  const label = params.label ?? '';
  const genreMovie = params.genreMovie ?? '';
  const genreTv = params.genreTv ?? '';
  const sortBy = params.sort_by ?? 'popularity.desc'; // 기본 인기순

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        if (!genreMovie || !genreTv) {
          if (!mounted) return;
          setList([]);
          return;
        }

        // sort_by를 movie/tv 둘 다에 동일 적용 (원하면 분리도 가능)
        const movieUrl =
          `${BASE}/discover/movie?api_key=${API_KEY}` +
          `&language=ko-KR&include_adult=false&include_video=false` +
          `&sort_by=${encodeURIComponent(sortBy)}` +
          `&with_genres=${encodeURIComponent(genreMovie)}`;

        const tvUrl =
          `${BASE}/discover/tv?api_key=${API_KEY}` +
          `&language=ko-KR` +
          `&sort_by=${encodeURIComponent(sortBy)}` +
          `&with_genres=${encodeURIComponent(genreTv)}`;

        const [mRes, tRes] = await Promise.all([fetch(movieUrl), fetch(tvUrl)]);
        if (!mRes.ok) throw new Error(`TMDB movie error: ${mRes.status}`);
        if (!tRes.ok) throw new Error(`TMDB tv error: ${tRes.status}`);

        const mData = (await mRes.json()) as DiscoverRes<DiscoverMovieItem>;
        const tData = (await tRes.json()) as DiscoverRes<DiscoverTvItem>;

        const movies: Item[] = (mData.results ?? []).map((m) => ({
          id: m.id,
          type: 'movie',
          title: m.title,
          poster_path: m.poster_path,
          vote_average: m.vote_average ?? 0,
        }));

        const tvs: Item[] = (tData.results ?? []).map((t) => ({
          id: t.id,
          type: 'tv',
          title: t.name,
          poster_path: t.poster_path,
          vote_average: t.vote_average ?? 0,
        }));

        // “전체” 느낌: 영화/TV 섞어서 한 그리드에
        const mixed: Item[] = [];
        const max = Math.max(movies.length, tvs.length);
        for (let i = 0; i < max; i++) {
          if (movies[i]) mixed.push(movies[i]);
          if (tvs[i]) mixed.push(tvs[i]);
        }

        const finalList = mixed.slice(0, 60);

        if (!mounted) return;
        setList(finalList);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '전체 필터 결과 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [genreMovie, genreTv, sortBy]);

  // ✅ FilterPopup에서 적용 누르면 여기 setSearchParams로 갱신 -> useEffect가 다시 fetch
  const handleApply = (next: Record<string, string>) => {
    // 기존 params 유지하면서 덮어쓰기
    const merged = { ...params, ...next };
    setSp(merged);
  };

  if (loading) return <div className="TotalResult-wrap loading">로딩중...</div>;
  if (error) return <div className="TotalResult-wrap error">에러: {error}</div>;

  return (
    <div className="TotalResult-wrap">
      <div className="header">
        <h2 className="title">필터를 적용해, 나에게 맞는 콘텐츠만 모아봤어요</h2>
        <p>{label ? `${label} 전체 검색결과` : '전체 검색결과'}</p>

        {/* ✅ 결과 페이지 안에 필터창 컴포넌트 포함 (MovieFilterResult 스타일) */}
        <div className="filter-wrap">
          <FilterPopup initialParams={params} onApply={handleApply} />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty">조건에 맞는 결과가 없음</p>
      ) : (
        <ul className="grid">
          {list.map((item) => (
            <li key={`${item.type}-${item.id}`} className="card">
              <Link to={`/${item.type}/${item.id}`}>
                <img
                  src={item.poster_path ? `${IMG}${item.poster_path}` : FALLBACK}
                  alt={item.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK;
                  }}
                  draggable={false}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <SideNav/>
    </div>
  );
};

export default TotalResult;
