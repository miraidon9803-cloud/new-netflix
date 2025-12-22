// src/components/ChoiceContentBG.tsx
import React, { useEffect, useMemo, useState } from 'react';
import './scss/ChoiceContentBG.scss';

type TvItem = {
  id: number;
  name?: string;
  poster_path: string | null;
};

const IMG = 'https://image.tmdb.org/t/p/w500';

const ChoiceContentBG: React.FC = () => {
  const [items, setItems] = useState<TvItem[]>([]);

  useEffect(() => {
    const fetchTv = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?language=ko-KR&page=1&api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await res.json();
        const filtered = (data.results || []).filter((v: TvItem) => v.poster_path);
        setItems(filtered);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTv();
  }, []);

  // ✅ 4컬럼에 라운드로빈 분배(균등하게 섞임)
  const columns = useMemo(() => {
    const cols: TvItem[][] = [[], [], [], []];
    items.forEach((it, i) => cols[i % 4].push(it));
    return cols;
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="choice-rolling" aria-label="rolling posters">
      {columns.map((col, colIdx) => {
        const loop = [...col, ...col]; // 무한루프용 2배
        return (
          <div className="v-column" key={colIdx}>
            <div className={`v-column-inner col-${colIdx}`}>
              {loop.map((item, i) => (
                <div className="v-card" key={`${item.id}-${i}`}>
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

export default ChoiceContentBG;
