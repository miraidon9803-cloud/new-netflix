import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import "./scss/Join.scss";

interface JoinProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const Join: React.FC<JoinProps> = ({ onNext, onPrev }) => {
  const setTempJoin = useAuthStore((s) => s.setTempJoin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!email || !password || !confirmPassword || !phone) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    //  Join 단계에서는 Firebase 가입하지 말고 "임시 저장"만!
    setTempJoin({ email, password, phone });

    // 입력값 초기화(선택)
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setError("");

    // 다음(step=3: 멤버십)
    onNext?.();
  };

  return (
    <div className="inner-join">
      <div className="join-wrap">
        <div className="join-content">
          <h1>
            <img src="/images/Netflix_Logo.png" alt="" />
          </h1>

          <div className="signtitle-wrap">
            {onPrev && (
              <p className="prev-btn" onClick={onPrev}>
                <img src="/images/ArrowLeft.png" alt="Back" />
              </p>
            )}

            <h3>SIGN</h3>
            <img src="/images/space.png" alt="Back" />
          </div>

          <form onSubmit={handleJoin}>
            <div className="form-block">
              <p>이메일 주소</p>
              <div className="input-wrap">
                <input
                  type="email"
                  name="email"
                  placeholder="이메일 주소를 입력해주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <p>비밀번호</p>
              <div className="input-wrap">
                <input
                  type="password"
                  name="password"
                  placeholder="영어,숫자,특수문자 조합 8~16자리"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <p>비밀번호 확인</p>
              <div className="input-wrap">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <p>휴대폰번호</p>
              <div className="input-wrap">
                <input
                  type="text"
                  name="phone"
                  placeholder="- 없이 숫자만 입력해주세요"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="next-btn">
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
