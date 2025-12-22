import React, { useEffect, useMemo, useState } from 'react';
import './scss/ChoiceContentBGMobile.scss';

type TvItem = {
  id: number;
  name?: string;
  poster_path: string | null;
};

const IMG = 'https://image.tmdb.org/t/p/w500';

const ChoiceContentBGMobile: React.FC = () => {
  const [items, setItems] = useState<TvItem[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?language=ko-KR&page=1&api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await res.json();
        const filtered = (data.results || []).filter((v: TvItem) => v.poster_path);

        if (!mounted) return;
        setItems(filtered);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 모바일은 2컬럼만 구성
  const columns = useMemo(() => {
    const cols: TvItem[][] = [[], []];
    items.forEach((it, i) => cols[i % 2].push(it));
    return cols;
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="choice-rolling-m" aria-label="rolling posters mobile">
      {columns.map((col, colIdx) => {
        const loop = [...col, ...col]; // 무한루프용 2배
        return (
          <div className="m-col" key={colIdx}>
            <div className={`m-inner col-${colIdx}`}>
              {loop.map((item, i) => (
                <div className="m-card" key={`${item.id}-${i}`}>
                  <img src={`${IMG}${item.poster_path}`} alt={item.name ?? 'poster'} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ChoiceContentBGMobile;
