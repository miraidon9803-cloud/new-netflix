import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRecentTVSeries2025, type TVItem } from '../api/tmdbSeries';
import './scss/SeriesFilterResult.scss';

const IMG = 'https://image.tmdb.org/t/p/w342';

const SeriesFilterResult: React.FC = () => {
  const [sp] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState<TVItem[]>([]);

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
        const data = await fetchRecentTVSeries2025(params);
        if (!mounted) return;
        setList(data.results ?? []);
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

  if (loading) {
    return <div className="series-filter loading">로딩중...</div>;
  }

  if (error) {
    return <div className="series-filter error">에러: {error}</div>;
  }

  return (
    <div className="FilterResult-wrap">
      <div className="series-filter">
        <div className="series-filter-txt">
          <h2 className="title">필터를 적용해, 나에게 맞는 콘텐츠만 모아봤어요</h2>
          <p>시리즈 내 검색결과</p>
        </div>

        {list.length === 0 ? (
          <p className="empty">조건에 맞는 결과가 없음</p>
        ) : (
          <ul className="series-grid">
            {list.map((tv) => (
              <li key={tv.id} className="series-card">
                <img src={tv.poster_path ? `${IMG}${tv.poster_path}` : ''} alt={tv.name} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeriesFilterResult;
