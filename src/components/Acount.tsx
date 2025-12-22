import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import "./scss/Acount.scss";

type AcountProps = {
  onClose: () => void;
};

const Acount = ({ onClose }: AcountProps) => {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [phone, setPhone] = useState<string>(() => user?.phone ?? "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 변경 로직은 아직 미연결 (검사만)
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      alert(
        "비밀번호 변경은 아직 연결되지 않았습니다. (원하시면 연결해드릴게요)"
      );
      // TODO: Firebase updatePassword 연결
    }

    await updateProfile({ phone });
    alert("저장되었습니다.");
    onClose();
  };

  return (
    <div className="acount-inner" onClick={onClose}>
      <div className="acount-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="acount-content">
          <div className="acount-header">
            <h1 className="account-title">계정</h1>
            <button
              type="button"
              className="account-close"
              onClick={onClose}
              aria-label="닫기"
            >
              <img src="/images/icon/Acount-close.png" alt="계정 닫기버튼" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="signup-form-wrap">
              <p>이메일 주소</p>
              <div className="input-wrap">
                <input
                  type="email"
                  name="email"
                  value={user?.email ?? ""}
                  readOnly
                />
              </div>
            </div>

            <div className="signup-form-wrap">
              <p>비밀번호</p>
              <div className="input-wrap">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="영어,숫자,특수문자 조합 8~16자리"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="signup-form-wrap">
              <p>비밀번호 확인</p>
              <div className="input-wrap">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="signup-form-wrap">
              <p>휴대폰 번호</p>
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
            </div>

            <div className="btn-wrap">
              <button type="button" className="del btn">
                탈퇴하기
              </button>

              <button type="submit" className="submit btn">
                저장
              </button>
            </div>
          </form>

          {/* ✅ 유저 정보가 늦게 들어오는 구조면 안내 */}
          {!user && (
            <p className="account-hint">사용자 정보를 불러오는 중입니다…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Acount;
