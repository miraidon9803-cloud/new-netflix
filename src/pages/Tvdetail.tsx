import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovieStore } from "../store/MovieStore";

const TvDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tvs, onFetchTvs, seasons, onFetchSeasons } = useMovieStore();
  const [activeSeason, setactiveSeason] = useState(0);

  useEffect(() => {
    if (tvs.length === 0) {
      onFetchTvs();
    }
    if (id) {
      onFetchSeasons(id);
    }
  }, [tvs, onFetchTvs]);

  const tv = tvs.find((t) => t.id === Number(id));
  if (!tv) {
    return <p>tv정보가 없습니다</p>;
  }

  return (
    <div>
      <h2>{tv.name}</h2>
      <div>
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.backdrop_path}`}
          alt=""
        />
      </div>
      <p>{tv.vote_average}</p>
      <p>{tv.overview}</p>
      <div>
        <h3>시즌</h3>
        <div className="season-btn-list">
          {seasons.map((s) => (
            <button
              className={`season-btn ${
                activeSeason === s.season_number ? "active" : ""
              }`}
              onClick={() => {
                setactiveSeason(s.season_number);
              }}
              key={s.id}
            >
              시즌 {s.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3>에피소드</h3>
      </div>
    </div>
  );
};

export default TvDetail;
