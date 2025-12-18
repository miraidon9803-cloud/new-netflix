import { useDetailUIStore } from "../store/useDetailUIStore";

interface TitleSectionProps {
  title: string;
  rating: string | null;
  firstAirDate: string;
  selectedSeasonNumber: number | null;
  overview: string;
  onPlayDefault: () => void;
}

export const TitleSection = ({
  title,
  rating,
  firstAirDate,
  selectedSeasonNumber,
  overview,
  onPlayDefault,
}: TitleSectionProps) => {
  const { moreOpen, toggleMoreOpen } = useDetailUIStore();

  return (
    <div className="text-box">
      <div className="title-wrap">
        <h1>{title}</h1>
        <button type="button" onClick={onPlayDefault}>
          재생
        </button>
      </div>

      <div className="text-content">
        <p>{rating ?? "정보 없음"}</p>
        <p>{firstAirDate}</p>
        <p>시즌 {selectedSeasonNumber ?? "-"}</p>
        <p>HD</p>
      </div>

      <div className="text-fads">
        <p>{overview}</p>
      </div>

      <div className="btn-wrap">
        <p>위시리스트</p>
        <p>따봉</p>
        <p>다운로드</p>
        <p>공유</p>
      </div>

      <p
        className={`more-btn ${moreOpen ? "open" : ""}`}
        tabIndex={0}
        onClick={toggleMoreOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleMoreOpen();
        }}
      >
        정보 더보기 {moreOpen ? "∧" : "+"}
      </p>
    </div>
  );
};

export default TitleSection;
