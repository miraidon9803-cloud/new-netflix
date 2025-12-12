import { Link, useNavigate } from "react-router-dom";
import "./scss/Login.scss";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  const {
    onLogin,
    onGoogleLogin,
    onKakaoLogin,
    user,
    loginForm,
    setLoginForm,
  } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/mypage", { replace: true });
    }
  }, [user, navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await onLogin(loginForm.email, loginForm.password);
      alert("로그인 성공!");
      navigate("/mypage");
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await onGoogleLogin();
      navigate("/mypage");
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };

  const handleKaKao = async () => {
    try {
      await onKakaoLogin();
      navigate("/mypage");
    } catch (err) {
      alert("로그인 실패: " + err.message);
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
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-wrap">
                <img src="/images/lyra-icon-lock.svg" alt="password" />
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
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
