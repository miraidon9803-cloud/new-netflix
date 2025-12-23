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
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";

const Movie = () => {
  return (
    <div className="movie-inner">\
      <SideNav/>
      <MovieBanner />
      <FilterPopup />
      <MovieTop10 />
      <KoreaMovies />
      <NotkoreaMovies />
      <MisteryMovies />
      <FunMovies />
      <PopularFocusMovies />
      <AwardMovie />
      <MobileNav/>
    </div>
  );
};

export default Movie;
