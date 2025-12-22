import { useState, useEffect, useMemo } from "react";
import { profile } from "../data/profile";
import { useProfileStore } from "../store/Profile";
import "./scss/ProfilePopup.scss";
import AvatarSelPopup from "./AvatarSelPopup";

/* ================= 타입 ================= */

type Language =
  | "Dansk"
  | "Deutsch"
  | "English"
  | "Español"
  | "Filipino"
  | "Français"
  | "Hrvatski"
  | "Indonesia"
  | "Italiano"
  | "Magyar"
  | "Nederlands"
  | "Norsk bokmal"
  | "Polski"
  | "中文"
  | "日本語"
  | "한국어";

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  profileId?: string;
  disableBodyScroll?: boolean;
}

/* ================= 상수 ================= */

const AGE_LEVELS = [
  { label: "키즈", value: 0 },
  { label: "전체관람가", value: 1 },
  { label: "7+", value: 2 },
  { label: "12+", value: 3 },
  { label: "15+", value: 4 },
  { label: "19+", value: 5 },
] as const;

/* ================= 컴포넌트 ================= */

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  open,
  onClose,
  mode = "create",
  profileId,
  disableBodyScroll = false,
}) => {
  const profiles = useProfileStore((s) => s.profiles);
  const createProfile = useProfileStore((s) => s.createProfile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const deleteProfile = useProfileStore((s) => s.deleteProfile);

  const isEdit = mode === "edit";

  const editingProfile = useMemo(() => {
    if (!isEdit || !profileId) return null;
    return profiles.find((p) => p.id === profileId) ?? null;
  }, [isEdit, profileId, profiles]);

  /* ================= state ================= */

  const [name, setName] = useState("");
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(profile[0].key);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [adultOnly, setAdultOnly] = useState(false);
  const [ageLimit, setAgeLimit] = useState(1);

  const [profileLock, setProfileLock] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  const [language, setLanguage] = useState<Language>("한국어");
  const [openlanguage, setOpenlanguage] = useState(false);

  const selectedAvatar = useMemo(() => {
    return profile.find((a) => a.key === selectedAvatarKey) ?? profile[0];
  }, [selectedAvatarKey]);

  /* ================= effect ================= */

  useEffect(() => {
    if (!open) return;

    // setErrorMsg(null);
    setAvatarPopupOpen(false);
    setOpenlanguage(false);

    if (isEdit && editingProfile) {
      setName(editingProfile.title ?? "");
      setSelectedAvatarKey(editingProfile.avatarKey ?? profile[0].key);
      setAdultOnly(editingProfile.adultOnly ?? false);
      setAgeLimit(editingProfile.ageLimit ?? 1);
      setProfileLock(editingProfile.profileLock ?? false);
      setLanguage((editingProfile.language as Language) ?? "한국어");
      setPin("");
      setPinConfirm("");
    }

    if (!isEdit) {
      setName("");
      setSelectedAvatarKey(profile[0].key);
      setAdultOnly(false);
      setAgeLimit(1);
      setProfileLock(false);
      setPin("");
      setPinConfirm("");
      setLanguage("한국어");
    }
  }, [open, isEdit, editingProfile]);

  useEffect(() => {
    if (!disableBodyScroll) return;

    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, disableBodyScroll]);

  if (!open) return null;
  if (isEdit && !editingProfile) return null;

  /* ================= handlers ================= */

  const handleDelete = async () => {
    if (!isEdit || !profileId) return;
    if (!window.confirm("이 프로필을 삭제할까요?")) return;

    try {
      setSubmitting(true);
      await deleteProfile(profileId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      title: name.trim(),
      avatarKey: selectedAvatarKey,
      poster: selectedAvatar.poster,
      adultOnly,
      ageLimit,
      profileLock,
      language,
      pin: profileLock ? pin : "",
    };

    try {
      setSubmitting(true);

      if (isEdit && profileId) {
        await updateProfile(profileId, payload);
      } else {
        await createProfile(payload as any);
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const maxIndex = AGE_LEVELS.length - 1;
  const visualIndex = maxIndex - ageLimit; // ← 슬라이더 전용
  const percent = `${(visualIndex / maxIndex) * 100}%`;

  /* ================= RETURN ================= */

  return (
    <div className="inner-mypageMain">
      <div className="modal-dim" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body">
            {/* ===== 헤더 ===== */}
            <div className="modal-header">
              <h2>{isEdit ? "현재 프로필 관리" : "프로필 생성"}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="닫기"
              >
                <img src="/images/icon/ProfilePopup-close.png" alt="닫기" />
              </button>
            </div>

            <div className="modal-wrap">
              {/* ===== 아바타 ===== */}
              <div className="avatar-preview">
                <img src={selectedAvatar.poster} alt={selectedAvatar.title} />

                <button
                  type="button"
                  className="change-btn"
                  onClick={() => setAvatarPopupOpen(true)}
                  disabled={submitting}
                  aria-label="아바타 변경"
                >
                  <img
                    src="/images/icon/ProfilePopup-Exchange.png"
                    alt=""
                    aria-hidden="true"
                  />
                  <span className="change-name">변경</span>
                </button>
              </div>

              {/* ===== 이름 ===== */}
              <div className="field">
                <div className="profile-name">
                  <span>프로필 이름</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={16}
                    placeholder="한글 8글자 혹은 영어 16글자를 입력하세요"
                    disabled={submitting}
                  />
                </div>

                {/* ===== 시청 제한 ===== */}
                <div className="toggle-group">
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
                  <div className={`rating-mark ${adultOnly ? "open" : ""}`}>
                    <p>선택된 등급의 콘텐츠만 이 프로필에 표시됩니다</p>
                  </div>

                  <div className={`age-wrap ${adultOnly ? "open" : ""}`}>
                    <div className="age-inner">
                      <input
                        type="range"
                        min={0}
                        max={AGE_LEVELS.length - 1}
                        step={1}
                        value={ageLimit}
                        onChange={(e) => setAgeLimit(Number(e.target.value))}
                        className="age-slider"
                        style={{ "--percent": percent } as any}
                        disabled={submitting}
                      />

                      <div className="age-labels">
                        {AGE_LEVELS.map((a, idx) => (
                          <span
                            key={a.value}
                            className={idx === ageLimit ? "active" : ""}
                          >
                            {a.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ===== 잠금 ===== */}
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
                      />

                      <p>잠금 비밀번호 재확인</p>
                      <input
                        type="password"
                        placeholder="4자리 비밀번호를 입력해주세요"
                        value={pinConfirm}
                        onChange={(e) =>
                          setPinConfirm(
                            e.target.value.replace(/\D/g, "").slice(0, 4)
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                {/* ===== 언어 ===== */}
                <div className="language-wrap">
                  <div className="language-method">
                    <p className="Voice-subtitles">기본 음성 및 자막</p>

                    <div className="language-select">
                      <button
                        type="button"
                        className={`language-btn ${openlanguage ? "open" : ""}`}
                        onClick={() => setOpenlanguage((v) => !v)}
                      >
                        <span className="language-text">{language}</span>
                      </button>
                      {openlanguage && (
                        <ul
                          className="language-list"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          {(
                            [
                              "Dansk",
                              "Deutsch",
                              "English",
                              "Español",
                              "Filipino",
                              "Français",
                              "Hrvatski",
                              "Indonesia",
                              "Italiano",
                              "Magyar",
                              "Nederlands",
                              "Norsk bokmal",
                              "Polski",
                              "中文",
                              "日本語",
                              "한국어",
                            ] as const
                          ).map((lang) => (
                            <li key={lang}>
                              <button
                                type="button"
                                className={language === lang ? "active" : ""}
                                onClick={() => {
                                  setLanguage(lang);
                                  setOpenlanguage(false);
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
                  <div className="language-img">
                    <img
                      src="/images/icon/ProfilePopup-Arrow.png"
                      alt=""
                      className={`language-arrow ${openlanguage ? "open" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* ===== 버튼 ===== */}
              <div className="btn-wrap">
                {isEdit && (
                  <button
                    className="btn del"
                    onClick={handleDelete}
                    disabled={submitting}
                    type="button"
                  >
                    프로필 삭제
                  </button>
                )}

                <button
                  className="btn create"
                  onClick={handleSubmit}
                  disabled={submitting}
                  type="button"
                >
                  {submitting ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>

          <AvatarSelPopup
            open={avatarPopupOpen}
            selectedKey={selectedAvatarKey}
            onSelect={setSelectedAvatarKey}
            onClose={() => setAvatarPopupOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
