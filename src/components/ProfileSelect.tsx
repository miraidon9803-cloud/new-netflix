import { useEffect, useState } from "react";
import { useProfileStore } from "../store/Profile";
import ProfileCreateModal from "../components/ProfilePopup";
import "./scss/ProfileSelect.scss";

const ProfileSelect = () => {
  const { profiles, activeProfileId, loadProfiles, setActiveProfile } =
    useProfileStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="inner-profile">
      <h1>넷플릭스를 시청할 프로필을 선택하세요</h1>
      <div className="profile-wrap">
        <div className="profile-content">
          {profiles.length === 0 ? (
            <div className="empty">
              <p>프로필이 없습니다. 새로 생성해주세요.</p>
              <button onClick={() => setOpen(true)}>+ 프로필 만들기</button>
            </div>
          ) : (
            <ul>
              {profiles.map((p) => (
                <li
                  key={p.id}
                  className={p.id === activeProfileId ? "active" : ""}
                  onClick={() => setActiveProfile(p.id)}
                >
                  <img src={p.poster} alt={p.title} />
                  <p className="profile-title">{p.title}</p>
                </li>
              ))}

              {profiles.length < 5 && (
                <li className="add" onClick={() => setOpen(true)}>
                  <div className="add-box">
                    <img src="/images/Union.png" alt="" />
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
