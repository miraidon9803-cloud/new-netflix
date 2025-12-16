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
  onSelect,
  onClose,
}) => {
  if (!open) return null;

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
          <p className="avatar-section-title">프로필을 선택하세요</p>

          <ul className="avatar-grid">
            {profile.map((item) => (
              <li
                key={item.key}
                className="avatar-item"
                onClick={() => onSelect(item.key)}
              >
                {/* (선택) 키/타이틀 표시하고 싶으면 */}
                {/* <p className="avatar-key">{item.title}</p> */}

                <img src={item.poster} alt={item.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelPopup;
