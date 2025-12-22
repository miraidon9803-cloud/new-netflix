import { useDetailUIStore } from "../store/useDetailUIStore";

interface Season {
  id: number;
  name: string;
  season_number: number;
}

interface SeasonSelectorProps {
  seasons: Season[];
  activeSeasonObj: Season | null;
  selectedSeasonNumber: number | null;
  onSeasonChange: (seasonNumber: number) => void;
}

export const SeasonSelector = ({
  seasons,
  activeSeasonObj,
  selectedSeasonNumber,
  onSeasonChange,
}: SeasonSelectorProps) => {
  const { seasonOpen, toggleSeasonOpen, setSeasonOpen } = useDetailUIStore();

  const normalSeasons = seasons.filter((s) => s.season_number > 0);

  return (
    <ul className={`season-dropdown ${seasonOpen ? "open" : ""}`}>
      <li
        className="season-trigger"
        role="button"
        tabIndex={0}
        onClick={toggleSeasonOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleSeasonOpen();
        }}
      >
        <span>
          {activeSeasonObj
            ? `시즌 ${activeSeasonObj.season_number}`
            : "시즌 선택"}
        </span>
        <p className={`chev ${seasonOpen ? "open" : ""}`}>
          <img src="/images/profile-arrow.png" alt="" />
        </p>
      </li>

      {normalSeasons.map((s) => (
        <li
          key={s.id}
          className={`season-item ${
            selectedSeasonNumber === s.season_number ? "active" : ""
          }`}
          role="button"
          tabIndex={seasonOpen ? 0 : -1}
          style={{ display: seasonOpen ? "flex" : "none" }}
          onClick={() => {
            onSeasonChange(s.season_number);
            setSeasonOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSeasonChange(s.season_number);
              setSeasonOpen(false);
            }
          }}
        >
          시즌 {s.season_number}
        </li>
      ))}
    </ul>
  );
};

export default SeasonSelector;
