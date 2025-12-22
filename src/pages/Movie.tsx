import MovieTop10 from "../components/MovieTop10";
import MovieBanner from "../components/Movies/MovieBanner";
import KoreaMovies from "../components/Movies/KoreaMovies";
import NotkoreaMovies from "../components/Movies/NotkoreaMovies";
import MisteryMovies from "../components/Movies/MisteryMovies";
import FunMovies from "../components/Movies/FunMovies";
import AwardMovie from "../components/Movies/AwardMovie";
import PopularFocusMovies from "../components/Movies/PopularFocusMovies";
import FilterPopup from "../components/Movies/FilterPopup";
import "./scss/Movie.scss";

const Movie = () => {
  return (
    <div className="movie-inner">
      <MovieBanner />
      <FilterPopup />
      <MovieTop10 />
      <KoreaMovies />
      <NotkoreaMovies />
      <MisteryMovies />
      <FunMovies />
      <PopularFocusMovies />
      <AwardMovie />
    </div>
  );
};

export default Movie;
