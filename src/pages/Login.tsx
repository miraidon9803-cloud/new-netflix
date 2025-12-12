import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/Login.scss";

const Login: React.FC = () => {
  const { onLogin, onGoogleLogin, onKakaoLogin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await onLogin(email, password);
      setEmail("");
      setPassword("");
      setError("");
      navigate("/mypage");
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await onGoogleLogin();
      navigate("/mypage");
    } catch (err) {
      alert("로그인 실패: " + (err as Error).message);
    }
  };

  const handleKaKao = async (e) => {
    e.preventDefault();
    try {
      await onKakaoLogin();
      navigate("/mypage");
    } catch (err) {
      alert("로그인 실패: " + (err as Error).message);
    }
  };

  return (
    <div className="inner-login">
      <div className="login-wrap">
        <div className="login-left">
          <img src="/images/login-img.png" alt="Login Image" />
        </div>

        <div className="login-right">
          <h1>
            <img src="/images/Netflix_Logo.png" alt="" />
          </h1>
          <div className="login-right2">
            <h2>LOGIN</h2>

            <form onSubmit={handleLogin}>
              <div className="input-wrap">
                <img src="/images/email.svg" alt="email" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrap">
                <img src="/images/lyra-icon-lock.svg" alt="password" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="login-btn">
                로그인
              </button>
            </form>

            <p className="signup-text">
              계정이 없으신가요?{" "}
              <Link to="/join">
                <span>회원가입</span>
              </Link>
            </p>

            <div className="social-login">
              <button
                onClick={handleGoogle}
                type="button"
                className="google-btn"
              >
                <img src="/images/google.png" alt="google" />
                <p>구글 로그인</p>
              </button>

              <button onClick={handleKaKao} type="button" className="kakao-btn">
                <img src="/images/kakao.png" alt="kakao" />
                <p>카카오 로그인</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
