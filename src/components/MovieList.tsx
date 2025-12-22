import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieListProps {
  title: string;
  movies: Movie[];
}
const MovieList = ({ title, movies }: MovieListProps) => {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {movies.map((data) => (
          <li className="movie-list" key={data.id}>
            <button>찜하기</button>
            <Link to={`/movie/${data.id}`}>
              <div>
                <img
                  src={`https://image.tmdb.org/t/p/w500${data.backdrop_path}`}
                  alt=""
                />
              </div>
            </Link>
            <div>
              <h3>{data.title}</h3>
            </div>

            <p></p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MovieList;
