import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNetflixOriginalAll } from '../../api/TmdbOriginal';
import './scss/Originals.scss';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';
const FALLBACK_POSTER = '/images/icon/no_poster.png';

type OriginalItem = {
  id: number;
  type: 'tv' | 'movie';
  title: string;
  poster_path: string; // API에서 poster 없는건 걸러오면 string 가능
  vote_average: number;
};

const Originals: React.FC = () => {
  const [list, setList] = useState<OriginalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        // ✅ 60개 원샷 버전이면 (startPage=1, targetCount=60) 사용
        const results = await fetchNetflixOriginalAll(1, 60);
        if (!mounted) return;

        // ✅ 가나다순 정렬 (ko 기준)
        const sorted = [...results].sort((a, b) =>
          String(a.title ?? '').localeCompare(String(b.title ?? ''), 'ko-KR')
        );

        console.log(
          '[Originals][가나다순]',
          sorted.map((o) => o.title)
        );

        setList(sorted as OriginalItem[]);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Netflix Originals 로딩 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="originals">
      <h2>넷플릭스 오리지널</h2>

      {loading && <p className="state">로딩중...</p>}
      {error && <p className="state error">{error}</p>}

      {!loading && !error && (
        <ul className="originals-list">
          {list.map((item) => {
            const posterSrc = item.poster_path ? `${IMG_BASE}${item.poster_path}` : FALLBACK_POSTER;
            const to = item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

            return (
              <li key={`${item.type}-${item.id}`} className="originals-item">
                {/* ✅ 클릭 시 상세로 이동 */}
                <Link to={to}>
                  <img
                    className="original-poster"
                    src={posterSrc}
                    alt={item.title}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Originals;
