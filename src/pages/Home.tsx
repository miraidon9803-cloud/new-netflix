import React, { useEffect } from "react";
import { useMovieStore } from "../store/MovieStore";
import MovieList from "../components/MovieList";
import TvList from "../components/TvList";

const Home = () => {
  const { onFetchPopular, movies, onFetchTvs, tvs } = useMovieStore();

  useEffect(() => {
    onFetchPopular();
    onFetchTvs();
  }, []);

  return (
    <div>
      <MovieList title="인기영화" movies={movies} />
      <TvList title="인기tv" tvs={tvs} />
    </div>
  );
};

export default Home;
