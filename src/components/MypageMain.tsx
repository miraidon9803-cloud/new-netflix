import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/MypageMain.scss";

const MypageMain = () => {
  const user = useAuthStore((s) => s.user);
  console.log(user);
  const { onLogout } = useAuthStore();
  const membership = user?.membership;
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // if (!membership) {
  //   return <div>멤버십 불러오는 중...</div>;
  // }

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
            <p className="nickname">nickname</p>
            <button className="profile-change">프로필변경</button>
          </div>

          <div className="content-right">
            <div className="title-wrap">
              <div className="content-title">
                <p>나의 멤버십</p>
                <p className="membership-grade">{membership?.name}</p>
              </div>
              <p className="content-out">변경 및 해지</p>
            </div>

            <ul>
              <li>현재 프로필 관리</li>
              <li>계정</li>
              <li>앱 설정</li>
              <li>고객센터</li>
            </ul>

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
