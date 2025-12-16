import { useState, useEffect, useMemo } from "react";
import { profile } from "../data/profile";
import { useProfileStore } from "../store/Profile";
import "./scss/ProfilePopup.scss";
import AvatarSelPopup from "./AvatarSelPopup";

interface ProfileCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const AGE_LEVELS = [
  { label: "키즈", value: 0 },
  { label: "전체관람가", value: 1 },
  { label: "7+", value: 2 },
  { label: "12+", value: 3 },
  { label: "15+", value: 4 },
  { label: "19+", value: 5 },
] as const;

/* =======================
   Profile Popup
======================= */
const ProfilePopup: React.FC<ProfileCreateModalProps> = ({ open, onClose }) => {
  const { profiles, createProfile } = useProfileStore();

  const [name, setName] = useState("");
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(profile[0].key);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [adultOnly, setAdultOnly] = useState(false);
  const [ageLimit, setAgeLimit] = useState<number>(1); // 기본: 전체관람가

  const [profileLock, setProfileLock] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  const [language, setLanguage] = useState<
    "한국어" | "日本語" | "中文" | "English"
  >("한국어");
  const [openlanguage, setOpenlanguage] = useState(false);

  /* 선택된 아바타 */
  const selectedAvatar = useMemo(() => {
    return profile.find((a) => a.key === selectedAvatarKey);
  }, [selectedAvatarKey]);

  const validateForm = () => {
    const trimmed = name.trim();
    if (!trimmed) return "프로필 이름을 입력해주세요.";
    if (trimmed.length > 10) return "프로필 이름은 10자 이내로 입력해주세요.";
    if (profiles.length >= 5) return "프로필은 최대 5개까지 만들 수 있어요.";
    if (profiles.some((p) => p.title === trimmed))
      return "이미 같은 이름의 프로필이 있어요.";

    if (profileLock) {
      if (!/^\d{4}$/.test(pin))
        return "잠금 비밀번호는 숫자 4자리로 입력해주세요.";
      if (pin !== pinConfirm) return "잠금 비밀번호가 일치하지 않습니다.";
    }

    return null;
  };

  const handleCreate = async () => {
    setErrorMsg(null);
    const error = validateForm();
    if (error) return setErrorMsg(error);

    try {
      setSubmitting(true);

      await createProfile({
        title: name.trim(),
        avatarKey: selectedAvatarKey,
        poster: selectedAvatar.poster,

        adultOnly,
        ageLimit,
        profileLock,
        language,
        pin: profileLock ? pin : "",
      });

      handleClose();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "프로필 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setAvatarPopupOpen(false);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-dim" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <h2>현재 프로필 관리</h2>
            <button className="modal-close" onClick={handleClose}>
              ✕
            </button>
          </div>

          <div className="modal-wrap">
            <div className="avatar-preview">
              <img src={selectedAvatar.poster} alt={selectedAvatar.title} />
              <p
                className="change-btn"
                onClick={() => setAvatarPopupOpen(true)}
                disabled={submitting}
              >
                <img src="/images/change-btn.png" alt="" />
              </p>
            </div>

            <div className="field">
              <div className="profile-name">
                <span>프로필 이름</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="10자 이내"
                  maxLength={10}
                  disabled={submitting}
                />
              </div>

              <div className="toggle-group">
                {/* 시청 제한 */}
                <div className="toggle-option">
                  <label>시청 제한</label>
                  <button
                    type="button"
                    className={`toggle-btn ${adultOnly ? "on" : "off"}`}
                    onClick={() => setAdultOnly((v) => !v)}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                {adultOnly && (
                  <div className="age-limit-wrap">
                    <div className="age-labels">
                      {AGE_LEVELS.map((item) => (
                        <span
                          key={item.value}
                          className={ageLimit === item.value ? "active" : ""}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={AGE_LEVELS.length - 1}
                      step={1}
                      value={ageLimit}
                      onChange={(e) => setAgeLimit(Number(e.target.value))}
                      className="age-slider"
                    />
                  </div>
                )}

                {/* 프로필 잠금 */}
                <div className="toggle-option">
                  <label>프로필 잠금</label>
                  <button
                    type="button"
                    className={`toggle-btn ${profileLock ? "on" : "off"}`}
                    onClick={() => setProfileLock((v) => !v)}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                {profileLock && (
                  <div className="pin">
                    <p>잠금 비밀번호 설정</p>
                    <input
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="숫자 4자리"
                      inputMode="numeric"
                    />

                    <p>잠금 비밀번호 재확인</p>
                    <input
                      value={pinConfirm}
                      onChange={(e) =>
                        setPinConfirm(
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="숫자 4자리"
                      inputMode="numeric"
                    />
                  </div>
                )}
              </div>

              <div className="language-method">
                <p>기본 음성 및 자막</p>

                <div className="language-select">
                  <p
                    className={`language-btn ${openlanguage ? "open" : ""}`}
                    onClick={() => setOpenlanguage((v) => !v)}
                  >
                    <div className="language-title">
                      <span>{language}</span>
                      <p>
                        <img src="/images/profile-arrow.png" alt="" />
                      </p>
                    </div>
                  </p>

                  {openlanguage && (
                    <>
                      <div
                        className="dropdown-overlay"
                        onClick={() => setOpenlanguage(false)}
                      />
                      <ul className="language-list">
                        {(["한국어", "日本語", "中文", "English"] as const).map(
                          (p) => (
                            <li key={p}>
                              <p
                                className={language === p ? "active" : ""}
                                onClick={() => {
                                  setLanguage(p);
                                  setOpenlanguage(false);
                                }}
                              >
                                {p}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="btn-wrap">
              <button
                className="btn del"
                onClick={handleClose}
                disabled={submitting}
              >
                취소
              </button>
              <button
                className="btn create"
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>

        {/* Avatar 선택 팝업 */}
        <AvatarSelPopup
          open={avatarPopupOpen}
          selectedKey={selectedAvatarKey}
          onSelect={setSelectedAvatarKey}
          onClose={() => setAvatarPopupOpen(false)}
        />

        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default ProfilePopup;
