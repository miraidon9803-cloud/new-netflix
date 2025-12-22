// src/pages/IntroPage.tsx
import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./scss/Intro.scss";

const IntroPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const finishIntro = useCallback(() => {
    if (!user) return;

    localStorage.setItem(`introSeen-${user.uid}`, "1");
    navigate("/mypage/profile", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true, state: { from: location.pathname } });
      return;
    }

    if (!loading && user) {
      const seen = localStorage.getItem(`introSeen-${user.uid}`) === "1";
      if (seen) {
        navigate("/mypage/profile", { replace: true });
      }
    }
  }, [loading, user, navigate, location.pathname]);
  // src/pages/IntroPage.tsx

  return (
    <div className="intro-overlay">
      <div className="video-wrap">
        <video
          className="intro-video"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finishIntro}
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>
    </div>
  );
};

export default IntroPage;
