import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/MypageMain.scss";
import Acount from "./Acount"; // Acount 컴포넌트를 임포트
import { useState } from "react";
import AppPopup from "./AppPopup";
import MemberPopup from "./MemberPopup";
import { useProfileStore } from "../store/Profile";

const MypageMain = () => {
  const user = useAuthStore((s) => s.user);
  console.log(user);
  const { onLogout } = useAuthStore();
  const membership = user?.membership;
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useProfileStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  if (!activeProfile) return null;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const ProfilePage = () => {
    const [showAccount, setShowAccount] = useState(false);
    const [showApp, setShowApp] = useState(false);
    const [showMember, setShowMember] = useState(false);

    const handleAccountClick = () => {
      setShowAccount((prev) => !prev); // 계정 클릭 시 showAccount 토글
    };

    const handleAppClick = () => {
      setShowApp((prev) => !prev);
    };

    const handleMemberClick = () => {
      setShowMember((prev) => !prev);
    };
    return (
      <div className="inner-mypageMain">
        <div className="mypageMain-wrap">
          <div className="title">
            <h1>나의 넷플릭스</h1>
          </div>

          <div className="main-content">
            <div className="content-left">
              <div>
                <img src="/images/profile/케데헌3.png" alt="" />
              </div>
              <p className="nickname">{activeProfile.title}</p>
              <button className="profile-change">프로필변경</button>
            </div>

            <div className="content-right">
              <div className="title-wrap">
                <div className="content-title">
                  <p>나의 멤버십</p>
                  <p className="membership-grade">
                    {membership?.name ?? "멤버십 없음"}
                  </p>
                </div>
                <p onClick={handleMemberClick} className="content-out">
                  변경 및 해지
                </p>
              </div>

              <ul className="profile-section">
                <li>현재 프로필 관리</li>
                <li onClick={handleAccountClick}>계정</li>
                <li onClick={handleAppClick}>앱 설정</li>
                <li>고객센터</li>
              </ul>
              {/* showAccount 상태에 따라 Acount 모달을 렌더링 */}
              {showAccount && <Acount onClose={() => setShowAccount(false)} />}
              {showApp && <AppPopup onClose={() => setShowApp(false)} />}
              {showMember && (
                <MemberPopup onClose={() => setShowMember(false)} />
              )}

              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <ProfilePage />;
};

export default MypageMain;
