import type { Original } from "../types/netflix";
import "./scss/NetflixOriginal.scss";

interface NetflixOriginalProps {
  title: string;
  original: Original[];
}
const NetflixOriginal = ({ title, original }: NetflixOriginalProps) => {
  return (
    <div>
      <div className="inner">
        <section>
          <h2>{title}</h2>
          <ul className="list">
            {original.map((data) => (
              <li className="origianl-list" key={data.id}>
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                    alt=""
                  />
                </div>
                <p>{data.name}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default NetflixOriginal;
