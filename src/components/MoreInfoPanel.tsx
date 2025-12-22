import { useDetailUIStore } from "../store/useDetailUIStore";

interface Creator {
  name: string;
  profile_path?: string | null;
}

interface Cast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

interface Genre {
  id: number;
  name: string;
}

interface Keyword {
  id: number;
  name: string;
}

interface MoreInfoPanelProps {
  creator: Creator;
  topCast: Cast[];
  genres: Genre[];
  keywords: Keyword[];
}

export const MoreInfoPanel = ({
  creator,
  topCast,
  genres,
  keywords,
}: MoreInfoPanelProps) => {
  const { moreOpen } = useDetailUIStore();

  if (!moreOpen) return null;

  const creatorImg = creator.profile_path
    ? `https://image.tmdb.org/t/p/w185${creator.profile_path}`
    : "/images/icon/no_profile.png";

  return (
    <div className="more-panel">
      <div className="creator-box">
        <img src={creatorImg} alt={creator.name} />
        <p>감독 {creator.name}</p>
      </div>

      <div className="row">
        <span className="label">출연</span>

        <ul className="cast-list">
          {topCast.map((cast) => (
            <li key={cast.id} className="cast-item">
              <div className="cast-img">
                <img
                  src={
                    cast.profile_path
                      ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                      : "/images/icon/no_profile.png"
                  }
                  alt={cast.name}
                  loading="lazy"
                />
              </div>

              <p className="cast-name">{cast.name}</p>

              {/* {cast.character && <p className="cast-role">{cast.character}</p>} */}
            </li>
          ))}
        </ul>
      </div>

      <div className="genre-list">
        {genres.map((g) => (
          <span key={g.id} className="genre-tag">
            {g.name}
          </span>
        ))}
      </div>

      <div className="keyword-list">
        {keywords.slice(0, 6).map((k) => (
          <span key={k.id} className="keyword-tag">
            #{k.name}
          </span>
        ))}
      </div>
    </div>
  );
};
export default MoreInfoPanel;
