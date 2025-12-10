import { Link } from "react-router-dom";
import "./scss/Login.scss";

const Login = () => {
  return (
    <div className="inner-login">
      <div className="login-wrap">
        {/* 로그인 */}

        <div className="login-left">
          <img src="/images/login-img.png" alt="" />
        </div>
        <div className="login-right">
          <div className="login-right2">
            <h2>LOGIN</h2>

            <form>
              <div className="input-wrap">
                <img src="/images/email.svg" alt="email" />
                <input type="email" name="email" placeholder="Email" required />
              </div>

              <div className="input-wrap">
                <img src="/images/lyra-icon-lock.svg" alt="password" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

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
              <button type="button" className="google-btn">
                <img src="/images/google.png" alt="google" />
                <p>구글 로그인</p>
              </button>

              <button type="button" className="kakao-btn">
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
