interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
}

interface EpisodeListProps {
  episodes: Episode[];
  backdropPath: string | null;
  posterPath: string | null;
  onPlayEpisode: (episode: Episode) => void;
}

export const EpisodeList = ({
  episodes,
  backdropPath,
  posterPath,
  onPlayEpisode,
}: EpisodeListProps) => {
  return (
    <ul className="episode-list">
      {episodes.map((ep) => (
        <li key={ep.id}>
          <div className="episode-content">
            {ep.still_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                alt={ep.name}
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w500${
                  backdropPath || posterPath || ""
                }`}
                alt={ep.name}
              />
            )}

            <p className="episode-btn" onClick={() => onPlayEpisode(ep)}>
              <img src="/images/play.png" alt="" />
            </p>
          </div>

          <div className="episode-title">
            <h3>
              {ep.episode_number}. {ep.name}
            </h3>
            <p>{ep.overview}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EpisodeList;
