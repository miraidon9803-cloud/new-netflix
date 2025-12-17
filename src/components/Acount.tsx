import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import "./scss/Acount.scss";

const Acount = ({ onClose }) => {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setPhone(user?.phone ?? "");
  }, [user?.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 변경 로직은 여기서 따로 처리해야 함(아직 미구현이면 검사만)
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      alert(
        "비밀번호 변경은 아직 연결되지 않았습니다. (원하시면 연결해드릴게요)"
      );
      // 여기서 updatePassword 등으로 처리해야 함
    }

    await updateProfile({ phone });
    alert("저장되었습니다.");
    onClose();
  };

  return (
    <div className="acount-inner">
      <div className="acount-wrap">
        <div className="acount-content">
          <div className="acount-header">
            <h1>계정</h1>
            <button className="close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <p>이메일 주소</p>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                value={user?.email ?? ""}
                readOnly
              />
            </div>

            <p>비밀번호</p>
            <div className="input-wrap">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="영어,숫자,특수문자 조합 8~16자리"
              />
            </div>

            <p>비밀번호 확인</p>
            <div className="input-wrap">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </div>

            <p>휴대폰번호를 입력해주세요</p>
            <div className="input-wrap">
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="- 없이 숫자만 입력해주세요"
                required
              />
            </div>

            <div className="btn-wrap">
              <button type="button" className="del btn">
                탈퇴하기
              </button>

              <button type="submit" className="submit btn">
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Acount;
