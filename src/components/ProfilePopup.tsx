import { useMemo, useState, useRef, useEffect } from "react";
import { profile } from "../data/profile";
import { useProfileStore } from "../store/Profile";
import "./scss/ProfilePopup.scss";
import ToggleDropdown from "./ToggleDropdown";

interface ProfileCreateModalProps {
  open: boolean;
  onClose: () => void;
}

/* =======================
   Language Dropdown
======================= */


const languages = ["한국어", "English", "日本語", "中文"];

const LanguageDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("한국어");
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="language-wrap">
      <p>기본 음성 및 자막</p>

      <div className="language" ref={ref}>
        <button
          type="button"
          className="language-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {selected}
          <span className={`arrow ${open ? "open" : ""}`}>▾</span>
        </button>

        {open && (
          <ul className="language-list">
            {languages.map((lang) => (
              <li key={lang}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(lang);
                    setOpen(false);
                  }}
                >
                  {lang}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* =======================
   Age Restriction Dropdown
======================= */
const AgeRestrictionDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("키즈");

  const ageOptions = {
    "키즈": "키즈",
    "7+": "7+",
    "12+": "12+"
  };

  return (
    <div className="age-restriction-wrap">
      <span>시청 제한</span>
      <button
        type="button"
        className="dropdown-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {selected}
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <ul className="dropdown-list">
          {Object.entries(ageOptions).map(([key, label]) => (
            <li key={key}>
              <button type="button" onClick={() => setSelected(key)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* =======================
   Profile Popup
======================= */
const ProfilePopup: React.FC<ProfileCreateModalProps> = ({ open, onClose }) => {
  const { profiles, createProfile } = useProfileStore();

  const [name, setName] = useState("");
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(profile[0].key);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAdult, setIsAdult] = useState(false);
  const [isLock, setIsLock] = useState(false);

  const selectedAvatar = useMemo(
    () => profile.find((a) => a.key === selectedAvatarKey) ?? profile[0],
    [selectedAvatarKey]
  );

  const adultOptions = {
    true: "성인 콘텐츠 허용",
    false: "성인 콘텐츠 차단",
  };

  const lockOptions = {
    true: "프로필 잠금",
    false: "프로필 잠금 해제",
  };

  const validateForm = () => {
    const trimmed = name.trim();
    if (!trimmed) return "프로필 이름을 입력해주세요.";
    if (trimmed.length > 10) return "프로필 이름은 10자 이내로 입력해주세요.";
    if (profiles.length >= 5) return "프로필은 최대 5개까지 만들 수 있어요.";
    if (profiles.some((p) => p.title === trimmed)) return "이미 같은 이름의 프로필이 있어요.";
    return null;
  };

  const handleCreate = async () => {
    setErrorMsg(null);
    const error = validateForm();
    if (error) return setErrorMsg(error);

    try {
      setSubmitting(true);
      await createProfile({ title: name.trim(), avatarKey: selectedAvatarKey, poster: selectedAvatar.poster });
      handleClose();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "프로필 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setShowAvatarPicker(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

              <AgeRestrictionDropdown />
              {/* <ToggleDropdown
                label="시청 제한"
                value={isAdult}
                onClick={() => setIsAdult((prev) => !prev)}
                options={adultOptions}
              /> */}

              <ToggleDropdown
                label="프로필 잠금"
                value={isLock}
                onClick={() => setIsLock((prev) => !prev)}
                options={lockOptions}
              />

              <LanguageDropdown />
            </label>

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

        {/* avatar picker */}
        {showAvatarPicker && (
          <div className="avatar-section">
            <p className="avatar-title">아바타 선택</p>
            <div className="avatar-grid">
              {profile.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={
                    a.key === selectedAvatarKey ? "avatar active" : "avatar"
                  }
                  onClick={() => {
                    setSelectedAvatarKey(a.key);
                    setShowAvatarPicker(false);
                  }}
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
    </div>
  );
};

export default ProfilePopup;
