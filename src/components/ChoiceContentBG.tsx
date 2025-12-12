// src/components/VerticalRolling.tsx
import React, { useEffect, useMemo, useState } from 'react';
import './scss/ChoiceContentBG.scss';

interface TvItem {
  id: number;
  name: string;
  poster_path: string | null;
}

const ChoiceContentBG = () => {
  const [shows, setShows] = useState<TvItem[]>([]);

  useEffect(() => {
    const fetchTv = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1&api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await res.json();
        setShows((data.results || []).filter((v: TvItem) => v.poster_path));
      } catch (e) {
        console.error(e);
      }
    };

    fetchTv();
  }, []);

  const IMG = 'https://image.tmdb.org/t/p/w500';

  // 👉 4줄로 나누기
  const columns = useMemo(() => {
    const perCol = 5;
    const result: TvItem[][] = [];
    for (let i = 0; i < shows.length; i += perCol) {
      result.push(shows.slice(i, i + perCol));
    }
    return result.slice(0, 4);
  }, [shows]);

  if (!columns.length) return null;

  return (
    <div className="vertical-rolling-wrap">
      {columns.map((col, colIdx) => {
        // 무한루프용 2배
        const loop = [...col, ...col];
        return (
          <div className="v-column" key={colIdx}>
            <div className={`v-column-inner col-${colIdx}`}>
              {loop.map((item, i) => (
                <div className="v-card" key={`${item.id}-${i}`}>
                  <img src={`${IMG}${item.poster_path}`} alt={item.name} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChoiceContentBG;
