import { useDetailUIStore } from "../store/useDetailUIStore";

type ActiveTab = "에피소드" | "비슷한콘텐츠";

const TABS: ActiveTab[] = ["에피소드", "비슷한콘텐츠"];

const TAB_LABELS: Record<ActiveTab, string> = {
  에피소드: "에피소드",
  비슷한콘텐츠: "비슷한 콘텐츠",
};

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
