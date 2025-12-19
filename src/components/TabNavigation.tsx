import { genre } from "../data/genre";
import { useDetailUIStore } from "../store/useDetailUIStore";

type ActiveTab = "회차" | "비슷한콘텐츠" | "관련클립";

const TABS: ActiveTab[] = ["회차", "비슷한콘텐츠", "관련클립"];

const TAB_LABELS: Record<ActiveTab, string> = {
  회차: "회차",
  비슷한콘텐츠: "비슷한 콘텐츠",
  관련클립: "관련클립",
};
const GENRES = genre;

export const TabNavigation = () => {
  const { activeTab, setActiveTab } = useDetailUIStore();

  return (
    <div className="detail-tabs">
      {TABS.map((tab) => (
        <p
          key={tab}
          className={activeTab === tab ? "active" : ""}
          onClick={() => setActiveTab(tab)}
        >
          {TAB_LABELS[tab]}
        </p>
      ))}
    </div>
  );
};
export default TabNavigation;
