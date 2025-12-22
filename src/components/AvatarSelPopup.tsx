import { profile } from "../data/profile";
import "./scss/AvatarSelPopup.scss";

interface AvatarPickerPopupProps {
  open: boolean;
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}

const AvatarSelPopup: React.FC<AvatarPickerPopupProps> = ({
  open,
  selectedKey,
  onSelect,
  onClose,
}) => {
  if (!open) return null;

  const groupedProfiles = profile.reduce<Record<string, typeof profile>>(
    (acc, item) => {
      if (!acc[item.name]) acc[item.name] = [];
      acc[item.name].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="avatar-dim" onClick={onClose}>
      <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-wrap">
          {/* HEADER */}
          <div className="avatar-header">
            <p className="avatar-create">프로필 생성</p>
            <button className="close" onClick={onClose} aria-label="닫기">
              <img src="/images/icon/AvatarSelPopup-close.png" alt="닫기버튼" />
            </button>
          </div>

          {/* BODY */}
          <div className="avatar-content">
            {Object.entries(groupedProfiles).map(([groupName, items]) => (
              <div key={groupName} className="avatar-section">
                {/* 🔹 섹션 타이틀 */}
                <p className="avatar-section-title">{groupName}</p>

                <ul className="avatar-grid">
                  {items.map((item) => {
                    const isSelected = item.key === selectedKey;

                    return (
                      <li
                        key={item.key}
                        className={`avatar-item ${isSelected ? "active" : ""}`}
                        onClick={() => {
                          onSelect(item.key);
                          onClose();
                        }}
                      >
                        <img src={item.poster} alt={item.title} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelPopup;
