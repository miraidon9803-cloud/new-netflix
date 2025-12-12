import { useMemo, useState } from "react";
import { profile } from "../data/profile";
import { useProfileStore } from "../store/Profile";
import "./scss/ModalPopup.scss";

interface ProfileCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfileCreateModalProps> = ({ open, onClose }) => {
  const { profiles, createProfile } = useProfileStore();

  const [name, setName] = useState("");
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(profile[0].key);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false); // ✅ 추가
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAdult, setIsAdult] = useState(true);
  const [isLock, setIsLock] = useState(true);

  const selectedAvatar = useMemo(
    () => profile.find((a) => a.key === selectedAvatarKey) ?? profile[0],
    [selectedAvatarKey]
  );

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    setShowAvatarPicker(false); // ✅ 닫을 때 같이 접기
    onClose();
  };

  const handleCreate = async () => {
    setErrorMsg(null);

    const trimmed = name.trim();
    if (!trimmed) return setErrorMsg("프로필 이름을 입력해주세요.");
    if (trimmed.length > 10)
      return setErrorMsg("프로필 이름은 10자 이내로 입력해주세요.");
    if (profiles.length >= 5)
      return setErrorMsg("프로필은 최대 5개까지 만들 수 있어요.");

    const duplicated = profiles.some((p) => p.title === trimmed);
    if (duplicated) return setErrorMsg("이미 같은 이름의 프로필이 있어요.");

    try {
      setSubmitting(true);

      await createProfile({
        title: trimmed,
        avatarKey: selectedAvatar.key,
        poster: selectedAvatar.poster,
      });

      handleClose();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "프로필 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-dim" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>현재프로필관리</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* ✅ 대표 프로필 사진 1장만 보여주기 */}
          <div className="avatar-preview">
            <img src={selectedAvatar.poster} alt={selectedAvatar.title} />
            <button
              type="button"
              className="change-btn"
              onClick={() => setShowAvatarPicker((v) => !v)}
              disabled={submitting}
            >
              사진 변경
            </button>
          </div>

          <label className="field">
            <span>프로필 이름</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="10자 이내"
              maxLength={10}
              disabled={submitting}
            />

            <div className="adult-toggle">
              <span className={!isAdult ? "active" : ""}>키즈</span>

              <button
                type="button"
                className={`toggle ${isAdult ? "on" : ""}`}
                onClick={() => setIsAdult((prev) => !prev)}
                disabled={submitting}
                aria-label="성인 여부 토글"
              >
                <span className="knob" />
              </button>

              <span className={isAdult ? "active" : ""}>성인</span>
            </div>

            <div className="lock-toggle">
              <span className={!isLock ? "active" : ""}></span>

              <button
                type="button"
                className={`toggle ${isAdult ? "on" : ""}`}
                onClick={() => setIsLock((prev) => !prev)}
                disabled={submitting}
                aria-label="프로필잠금"
              >
                <span className="knob" />
              </button>

              <span className={isAdult ? "active" : ""}></span>
            </div>
          </label>

          {/* ✅ 사진 변경 눌렀을 때만 목록 오픈 */}
          {showAvatarPicker && (
            <div className="avatar-section">
              <p className="avatar-title">아바타 선택</p>
              <div className="avatar-grid">
                {profile.map((a) => (
                  <button
                    key={a.id} // ✅ key는 id 추천
                    type="button"
                    className={
                      a.key === selectedAvatarKey ? "avatar active" : "avatar"
                    }
                    onClick={() => {
                      setSelectedAvatarKey(a.key);
                      setShowAvatarPicker(false); // ✅ 선택하면 자동 닫기 (원치 않으면 이 줄 제거)
                    }}
                    disabled={submitting}
                  >
                    <img src={a.poster} alt={a.title} />
                    <span>{a.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>

        <div className="modal-footer">
          <button
            className="btn ghost"
            onClick={handleClose}
            disabled={submitting}
          >
            취소
          </button>
          <button
            className="btn primary"
            onClick={handleCreate}
            disabled={submitting}
          >
            {submitting ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
