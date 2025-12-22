import type { Tv } from "../types/movie";
import { Link } from "react-router-dom";

interface TvListProps {
  title: string;
  tvs: Tv[];
}
const TvList = ({ title, tvs }: TvListProps) => {
  return (
    <section>
      <h2>{title}</h2>
      <ul className="list">
        {tvs.map((tv) => (
          <li key={tv.id}>
            <button>찜하기</button>
            <Link to={`/tv/${tv.id}`}>
              <div>
                <img
                  src={`https://image.tmdb.org/t/p/w500${tv.backdrop_path}`}
                  alt=""
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TvList;
