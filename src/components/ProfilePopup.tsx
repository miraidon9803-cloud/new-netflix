import { useState, useEffect, useMemo } from "react";
import { profile } from "../data/profile";
import { useProfileStore } from "../store/Profile";
import "./scss/ProfilePopup.scss";
import AvatarSelPopup from "./AvatarSelPopup";

type Language = "한국어" | "日本語" | "中文" | "English";

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;

  /** 기본 create */
  mode?: "create" | "edit";

  /** edit일 때 수정 대상 */
  profileId?: string;
}

const AGE_LEVELS = [
  { label: "키즈", value: 0 },
  { label: "전체관람가", value: 1 },
  { label: "7+", value: 2 },
  { label: "12+", value: 3 },
  { label: "15+", value: 4 },
  { label: "19+", value: 5 },
] as const;

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  open,
  onClose,
  mode = "create",
  profileId,
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

  const [name, setName] = useState("");
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(profile[0].key);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [adultOnly, setAdultOnly] = useState(false);
  const [ageLimit, setAgeLimit] = useState<number>(1);

  const [profileLock, setProfileLock] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  const [language, setLanguage] = useState<Language>("한국어");
  const [openlanguage, setOpenlanguage] = useState(false);

  const selectedAvatar = useMemo(() => {
    return profile.find((a) => a.key === selectedAvatarKey) ?? profile[0];
  }, [selectedAvatarKey]);

  // ✅ create / edit 값 초기화
  useEffect(() => {
    if (!open) return;

    setErrorMsg(null);
    setAvatarPopupOpen(false);
    setOpenlanguage(false);

    if (isEdit) {
      if (!editingProfile) return;

      setName(editingProfile.title ?? "");
      setSelectedAvatarKey(editingProfile.avatarKey ?? profile[0].key);

      setAdultOnly((editingProfile as any).adultOnly ?? false);
      setAgeLimit((editingProfile as any).ageLimit ?? 1);
      setProfileLock((editingProfile as any).profileLock ?? false);
      setLanguage(((editingProfile as any).language as Language) ?? "한국어");

      setPin("");
      setPinConfirm("");
    } else {
      setName("");
      setSelectedAvatarKey(profile[0].key);
      setAdultOnly(false);
      setAgeLimit(1);
      setProfileLock(false);
      setPin("");
      setPinConfirm("");
      setLanguage("한국어");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const handleDelete = async () => {
    if (!isEdit || !profileId) return;

    const ok = window.confirm("이 프로필을 삭제할까요?");
    if (!ok) return;

    try {
      setSubmitting(true);
      await deleteProfile(profileId);
      handleClose();
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message ?? "프로필 삭제에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const trimmed = name.trim();
    if (!trimmed) return "프로필 이름을 입력해주세요.";
    if (trimmed.length > 10) return "프로필 이름은 10자 이내로 입력해주세요.";

    // create일 때만 개수 제한/중복 체크 강하게
    // edit일 때는 같은 이름 유지 허용(본인 제외 중복만 막기)
    if (!isEdit && profiles.length >= 5)
      return "프로필은 최대 5개까지 만들 수 있어요.";

    const duplicate = profiles.some((p) => {
      if (isEdit && profileId && p.id === profileId) return false; // 자기 자신 제외
      return p.title === trimmed;
    });
    if (duplicate) return "이미 같은 이름의 프로필이 있어요.";

    if (profileLock) {
      if (!/^\d{4}$/.test(pin))
        return "잠금 비밀번호는 숫자 4자리로 입력해주세요.";
      if (pin !== pinConfirm) return "잠금 비밀번호가 일치하지 않습니다.";
    }

    // edit 모드인데 대상 없으면 방어
    if (isEdit && !editingProfile) return "수정할 프로필을 찾을 수 없습니다.";

    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    const error = validateForm();
    if (error) return setErrorMsg(error);

    try {
      setSubmitting(true);

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

      if (isEdit) {
        await updateProfile(profileId as string, payload);
      } else {
        await createProfile(payload as any);
      }

      handleClose();
    } catch (e: any) {
      setErrorMsg(
        e?.message ??
          (isEdit
            ? "프로필 수정에 실패했습니다."
            : "프로필 생성에 실패했습니다.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setAvatarPopupOpen(false);
    setOpenlanguage(false);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  if (isEdit && !editingProfile) return null; // 대상 없으면 안 보여주기

  return (
    <div className="modal-dim" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <h2>{isEdit ? "프로필 수정" : "프로필 생성"}</h2>
            <button className="modal-close" onClick={handleClose} type="button">
              ✕
            </button>
          </div>

          <div className="modal-wrap">
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <div className="avatar-preview">
              <img src={selectedAvatar.poster} alt={selectedAvatar.title} />

              <button
                type="button"
                className="change-btn"
                onClick={() => setAvatarPopupOpen(true)}
                disabled={submitting}
              >
                <img src="/images/change-btn.png" alt="" />
              </button>
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
                <div className="toggle-option">
                  <label>시청 제한</label>
                  <button
                    type="button"
                    className={`toggle-btn ${adultOnly ? "on" : "off"}`}
                    onClick={() => setAdultOnly((v) => !v)}
                    disabled={submitting}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                {adultOnly && (
                  <div className="age-wrap">
                    <div className="age-limit-wrap">
                      <input
                        type="range"
                        min={0}
                        max={AGE_LEVELS.length - 1}
                        step={1}
                        value={ageLimit}
                        onChange={(e) => setAgeLimit(Number(e.target.value))}
                        className="age-slider"
                        disabled={submitting}
                      />

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
                    </div>
                  </div>
                )}

                <div className="toggle-option">
                  <label>프로필 잠금</label>
                  <button
                    type="button"
                    className={`toggle-btn ${profileLock ? "on" : "off"}`}
                    onClick={() => setProfileLock((v) => !v)}
                    disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              <div className="language-method">
                <p>기본 음성 및 자막</p>

                <div className="language-select">
                  <button
                    type="button"
                    className={`language-btn ${openlanguage ? "open" : ""}`}
                    onClick={() => setOpenlanguage((v) => !v)}
                    disabled={submitting}
                  >
                    <div className="language-title">
                      <span>{language}</span>
                      <span>
                        <img src="/images/profile-arrow.png" alt="" />
                      </span>
                    </div>
                  </button>

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
                              <button
                                type="button"
                                className={language === p ? "active" : ""}
                                onClick={() => {
                                  setLanguage(p);
                                  setOpenlanguage(false);
                                }}
                              >
                                {p}
                              </button>
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
              {/*  create 모드: 취소만 */}
              {!isEdit && (
                <button
                  className="btn del"
                  onClick={handleClose}
                  disabled={submitting}
                  type="button"
                >
                  취소
                </button>
              )}

              {/*  edit 모드: 삭제 버튼만(원하시면 취소도 같이 가능) */}
              {isEdit && (
                <button
                  className="btn del"
                  onClick={handleDelete}
                  disabled={submitting}
                  type="button"
                >
                  삭제
                </button>
              )}

              {/* 저장/변경 버튼은 둘 다 공통 */}
              <button
                className="btn create"
                onClick={handleSubmit}
                disabled={submitting}
                type="button"
              >
                {submitting ? "저장 중..." : isEdit ? "변경 저장" : "저장"}
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
  );
};

export default ProfilePopup;
