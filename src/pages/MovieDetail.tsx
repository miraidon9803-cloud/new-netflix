// import React from "react";

import { useParams } from "react-router-dom";
import { useMovieStore } from "../store/MovieStore";
import { useEffect, useState } from "react";
import VideoPopup from "../components/VideoPopup";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { movies, onFetchPopular, onFetchVideo } = useMovieStore();

  const [Openpopup, setOpenpopup] = useState(false);
  const [youtubeKey, setyoutubeKey] = useState("");

  useEffect(() => {
    if (movies.length === 0) {
      onFetchPopular();
    }
  }, [movies, onFetchPopular]);

  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <p>영화 정보 불러오는 중...</p>;
  }

  console.log(id, movie, movies);

  // 플레이클릭하면 비디오 실행하기
  const handleVideoOPen = async () => {
    console.log("비디오 실행");
    if (!id) return;
    const videoList = await onFetchVideo(id);
    const trailer = videoList.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (trailer) {
      setyoutubeKey(trailer.key);
      setOpenpopup(true);
      return;
    }
  };
  return (
    <div>
      <h2>{movie.title}</h2>
      <div>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <button onClick={handleVideoOPen}>play</button>
      </div>
      <p>{movie.vote_average}</p>
      <p>{movie.overview}</p>

      {/* popup */}
      {Openpopup && (
        <VideoPopup
          youtubeKey={youtubeKey}
          onClose={() => setOpenpopup(false)}
        />
      )}
    </div>
  );
};

export default MovieDetail;
