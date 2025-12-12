import "./scss/join.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// 회원가입 데이터 타입 정의
interface JoinData {
  email: string;
  password: string;
  phone: string;
}

interface JoinProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const Join: React.FC<JoinProps> = ({ onNext, onPrev }) => {
  const { onMember } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인 체크
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!email || !password || !confirmPassword || !phone) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    const joinData: JoinData = {
      email,
      password,
      phone,
    };

    try {
      await onMember(joinData);

      // 입력값 초기화
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setError("");

      // ⭐ 두 가지 경우로 나눠서 처리
      if (onNext) {
        // FullLogin 같은 step 플로우 안에서 사용할 때
        onNext();
      } else {
        // 단독 페이지로 쓸 때 (기존 /join 라우트)
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
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
                dd
              </p>
            )}

            <h3>SIGN</h3>
          </div>
          <form onSubmit={handleJoin}>
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

            <p>휴대폰번호를 입력해주세요</p>
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

            {error && <p className="error-msg">{error}</p>}

            {/* ❗ 이제 onClick={onNext} 제거 */}
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
