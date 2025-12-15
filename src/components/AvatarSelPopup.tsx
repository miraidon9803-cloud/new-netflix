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

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const avatarGroups = chunkArray(profile, 4);

  return (
    <div className="avatar-dim" onClick={onClose}>
      <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-header">
          <h3>아바타 선택</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="avatar-content">
          {avatarGroups.map((group, index) => (
            <div key={index} className="avatar-section">
              <h4 className="avatar-section-title">{group[0].key}</h4>

              <ul className="avatar-grid">
                {group.map((a) => (
                  <li
                    key={a.id}
                    className={`avatar-item ${
                      a.key === selectedKey ? "active" : ""
                    }`}
                    onClick={() => {
                      onSelect(a.key);
                      onClose();
                    }}
                  >
                    <img src={a.poster} alt={a.key} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelPopup;
