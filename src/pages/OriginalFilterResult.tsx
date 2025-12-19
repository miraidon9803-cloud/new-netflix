// OriginalsFilterResult.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchNetflixOriginalAll } from '../api/TmdbOriginal';
import FilterPopup from '../components/Original/FilterPopup';
import './scss/OriginalFilterResult.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';
const FALLBACK = '/images/icon/no_poster.png';

type Item = {
  id: number;
  type: 'tv' | 'movie';
  title: string;
  poster_path: string;
  vote_average: number;
};

const OriginalsFilterResult: React.FC = () => {
  const [sp] = useSearchParams();

  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** URLSearchParams → 객체 */
  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }, [sp]);

  /** sort_by → store sort 키로 변환 */
  const sort = useMemo<'popular' | 'latest' | 'title'>(() => {
    const s = params.sort_by;
    if (s === 'primary_release_date.desc' || s === 'first_air_date.desc') return 'latest';
    if (s === 'original_title.asc' || s === 'name.asc') return 'title';
    return 'popular';
  }, [params.sort_by]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const results = await fetchNetflixOriginalAll(1, 60, {
          sort,
          with_genres: params.with_genres,
          with_origin_country: params.with_origin_country,
        });

        if (!mounted) return;
        setList(results);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '오리지널 필터 결과 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sort, params.with_genres, params.with_origin_country]);

  if (loading) {
    return <div className="OriginalsFilterResult-wrap loading">로딩중...</div>;
  }

  if (error) {
    return <div className="OriginalsFilterResult-wrap error">에러: {error}</div>;
  }

  return (
    <div className="OriginalsFilterResult-wrap">
      <div className="header">
        <h2 className="title">필터를 적용해, 나에게 맞는 콘텐츠만 모아봤어요</h2>
        <p>넷플릭스 오리지널 검색결과</p>

        {/* ✅ 결과 페이지에서도 필터 재적용 */}
        <FilterPopup />
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
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OriginalsFilterResult;
