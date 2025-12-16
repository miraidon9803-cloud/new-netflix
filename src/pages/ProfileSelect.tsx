// src/pages/ProfileSelect.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../store/Profile";
import ProfileCreateModal from "../components/ProfilePopup";
import "./scss/ProfileSelect.scss";

const ProfileSelect = () => {
  const navigate = useNavigate();

  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const loadProfiles = useProfileStore((s) => s.loadProfiles);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);

  const [open, setOpen] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 상태라면 profiles/activeProfileId를 불러옴
    void loadProfiles();
  }, [loadProfiles]);

  const handleSelect = async (profileId: string) => {
    try {
      setSelectingId(profileId);
      await setActiveProfile(profileId);
      navigate("/", { replace: true }); // 또는 /browse
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "프로필 선택에 실패했습니다.";
      alert(msg);
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="inner-profile">
      <h1>넷플릭스를 시청할 프로필을 선택하세요</h1>

      <div className="profile-wrap">
        <div className="profile-content">
          {profiles.length === 0 ? (
            <div
              className="add"
              onClick={() => setOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="add-box">
                <img src="/images/Union.png" alt="프로필 추가" />
                <p>프로필 추가</p>
              </div>
            </div>
          ) : (
            <ul className="profile-list">
              {profiles.map((p) => (
                <li
                  key={p.id}
                  className={[
                    p.id === activeProfileId ? "active" : "",
                    selectingId === p.id ? "loading" : "",
                  ].join(" ")}
                  onClick={() => handleSelect(p.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.title} 프로필 선택`}
                >
                  <img src={p.poster} alt={p.title} />
                  <p className="profile-title">{p.title}</p>
                </li>
              ))}

              {profiles.length < 5 && (
                <li
                  className="add"
                  onClick={() => setOpen(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="프로필 추가"
                >
                  <div className="add-box">
                    <img src="/images/Union.png" alt="프로필 추가" />
                    <p>프로필 추가</p>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <ProfileCreateModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ProfileSelect;
