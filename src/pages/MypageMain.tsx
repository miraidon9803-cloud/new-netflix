import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/MypageMain.scss";
import Acount from "../components/Acount";
import { useEffect, useState } from "react";
import AppPopup from "../components/AppPopup";
import MemberPopup from "../components/MemberPopup";
import { useProfileStore } from "../store/Profile";
import ProfilePopup from "../components/ProfilePopup";

import AvatarSelPopup from "../components/AvatarSelPopup";
import { profile } from "../data/profile";
import CSpopup from "../components/CSpopup";

const MypageMain = () => {
  const user = useAuthStore((s) => s.user);
  const { onLogout } = useAuthStore();
  const membership = user?.membership;
  const navigate = useNavigate();

  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [showAccount, setShowAccount] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showCs, setShowCs] = useState(false);

  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);

  const [selectedAvatarKey, setSelectedAvatarKey] = useState(
    activeProfile?.avatarKey ?? profile?.[0]?.key ?? ""
  );

  // ✅ (선택) activeProfile 바뀌면 selectedAvatarKey도 맞춰주기
  useEffect(() => {
    setSelectedAvatarKey(activeProfile?.avatarKey ?? profile?.[0]?.key ?? "");
  }, [activeProfile?.avatarKey]);

  if (!activeProfile) return null;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="inner-mypageMain">
      <div className="mypageMain-title">
        <h1>나의 넷플릭스</h1>
      </div>

      <div className="mypageMain-wrap">
        <div className="main-content">
          <div className="content-left">
            <div>
              <img src={activeProfile.poster} alt="" />
            </div>
            <p className="nickname">{activeProfile.title}</p>

            <Link to="profile">
              <p className="profile-change">
                <img
                  src="/images/icon/MypageMain-Exchange.png"
                  alt="프로필변경"
                />
                <span>프로필변경</span>
              </p>
            </Link>
          </div>

          <div className="content-right">
            <div className="title-wrap">
              <div className="content-title">
                <p>나의 멤버십</p>
                <p className="membership-grade">
                  {membership?.name ?? "멤버십 없음"}
                </p>
              </div>
              <p
                onClick={() => setShowMember((v) => !v)}
                className="content-out"
              >
                변경 및 해지
              </p>
            </div>

            <ul className="profile-section">
              <li onClick={() => setOpenProfilePopup(true)}>
                <span className="item-left">
                  <img
                    src="/images/icon/MypageMain-profile.png"
                    alt="현재 프로필 관리"
                  />
                  <span>현재 프로필 관리</span>
                </span>

                <img
                  className="item-arrow"
                  src="/images/icon/MypageMain-Arrow.png"
                  alt=""
                />
              </li>

              <li onClick={() => setShowAccount((v) => !v)}>
                <span className="item-left">
                  <img src="/images/icon/MypageMain-user.png" alt="계정" />
                  <span>계정</span>
                </span>

                <img
                  className="item-arrow"
                  src="/images/icon/MypageMain-Arrow.png"
                  alt=""
                />
              </li>

              <li onClick={() => setShowApp((v) => !v)}>
                <span className="item-left">
                  <img
                    src="/images/icon/MypageMain-settings.png"
                    alt="앱 설정"
                  />
                  <span>앱 설정</span>
                </span>

                <img
                  className="item-arrow"
                  src="/images/icon/MypageMain-Arrow.png"
                  alt=""
                />
              </li>

              <li onClick={() => setShowCs((v) => !v)}>
                <span className="item-left">
                  <img
                    src="/images/icon/MypageMain-service.png"
                    alt="고객센터"
                  />
                  <span>고객센터</span>
                </span>

                <img
                  className="item-arrow"
                  src="/images/icon/MypageMain-Arrow.png"
                  alt=""
                />
              </li>
            </ul>

            <AvatarSelPopup
              open={avatarPopupOpen}
              selectedKey={selectedAvatarKey}
              onSelect={async (key) => {
                setSelectedAvatarKey(key);

                const picked = profile.find((a) => a.key === key);
                if (!picked) return;

                await updateProfile(activeProfile.id, {
                  title: activeProfile.title,
                  avatarKey: picked.key,
                  poster: picked.poster,
                });

                setAvatarPopupOpen(false);
              }}
              onClose={() => setAvatarPopupOpen(false)}
            />

            <ProfilePopup
              open={openProfilePopup}
              onClose={() => setOpenProfilePopup(false)}
              mode="edit"
              profileId={activeProfileId ?? undefined}
            />

            {showAccount && <Acount onClose={() => setShowAccount(false)} />}
            {showApp && <AppPopup onClose={() => setShowApp(false)} />}
            {showMember && <MemberPopup onClose={() => setShowMember(false)} />}
            {showCs && <CSpopup onClose={() => setShowCs(false)} />}

            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageMain;
