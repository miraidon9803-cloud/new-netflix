import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/Login.scss";

interface LoginProps {
  onNext?: () => void;
}

const Login: React.FC<LoginProps> = ({ onNext }) => {
  const { onLogin, onGoogleLogin, onKakaoLogin } = useAuthStore();
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const goIntro = () => {
    // ✅ 로그인 성공 후 인트로 페이지로 이동
    navigate("/intro", { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setError("");
      await onLogin(email, password);
      goIntro();
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSocialLogin = async (loginFn: () => Promise<void>) => {
    try {
      setError("");
      await loginFn();
      goIntro();
    } catch (err) {
      setError("소셜 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="inner-login">
      <div className="login-wrap">
        {/* LEFT */}
        <div className="login-left">
          <img src="/images/login-img.png" alt="Netflix visual" />
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <section className="login-right2">
            <h2>LOGIN</h2>

            <form onSubmit={handleLogin}>
              <div className="input-wrap">
                <img src="/images/email.svg" alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-wrap">
                <img src="/images/lyra-icon-lock.svg" alt="" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <p className="signup-text" onClick={onNext}>
              계정이 없으신가요? <span>회원가입</span>
            </p>

            <div className="social-login">
              <button
                type="button"
                className="google-btn"
                onClick={() => handleSocialLogin(onGoogleLogin)}
                disabled={loading}
              >
                <span className="social-inner">
                  <img src="/images/google.png" alt="" />
                  <p>구글 로그인</p>
                </span>
              </button>

              <button
                type="button"
                className="kakao-btn"
                onClick={() => handleSocialLogin(onKakaoLogin)}
                disabled={loading}
              >
                <span className="social-inner">
                  <img src="/images/kakao.png" alt="" />
                  <p>카카오 로그인</p>
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
