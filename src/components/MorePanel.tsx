// components/MorePanel.tsx
type Props = {
  creator: any;
  cast: any[];
  genres: any[];
  keywords: any[];
};

const MorePanel = ({ creator, cast, genres, keywords }: Props) => {
  return (
    <div className="more-panel">
      <div className="creator-box">
        <p>크리에이터 {creator?.name ?? "정보 없음"}</p>
        <img
          src={
            creator?.profile_path
              ? `https://image.tmdb.org/t/p/w185${creator.profile_path}`
              : "/images/icon/no_profile.png"
          }
        />
      </div>

      <ul className="cast-list">
        {cast.map((c) => (
          <li key={c.id}>
            <img
              src={
                c.profile_path
                  ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                  : "/images/icon/no_profile.png"
              }
            />
            <p>{c.name}</p>
          </li>
        ))}
      </ul>

      <div className="genre-list">
        {genres.map((g) => (
          <span key={g.id}>#{g.name}</span>
        ))}
      </div>

      <div className="keyword-list">
        {keywords.slice(0, 6).map((k) => (
          <span key={k.id}>#{k.name}</span>
        ))}
      </div>
    </div>
  );
};

export default MorePanel;
