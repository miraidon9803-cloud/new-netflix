import { useAuthStore } from "../store/authStore";
import "./scss/join.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 회원가입 데이터 타입 정의
interface JoinData {
  email: string;
  password: string;
  phone: string;
}

const Join: React.FC = () => {
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

    const joinData: JoinData = {
      email,
      password,
      phone,
    };

    try {
      await onMember(joinData); // onMember 함수는 JoinData 타입 받도록 수정 필요
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setError("");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };
  const goMembership = () => {
    navigate("/membership");
  };

  return (
    <div className="inner-join">
      <div className="join-wrap">
        <div className="join-content">
          <h1>
            <img src="/images/Netflix_Logo.png" alt="" />
          </h1>
          <h3>SIGN</h3>
          <form onSubmit={handleJoinSubmit}>
            <p>이메일 주소</p>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                value={joinForm.email}
                onChange={handleJoinChange}
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
                onChange={handleJoinChange}
                value={joinForm.password}
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
                name="passwordConfirm"
                value={joinForm.passwordConfirm}
                onChange={handleJoinChange}
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
                value={joinForm.phone}
                onChange={handleJoinChange}
                placeholder="- 없이 숫자만 입력해주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" onClick={goMembership} className="next-btn">
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
