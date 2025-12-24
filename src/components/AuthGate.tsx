// src/components/AuthGate.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AuthGate() {
  const authReady = useAuthStore((s) => s.authReady);
  const isLogin = useAuthStore((s) => s.isLogin);
  const user = useAuthStore((s) => s.user);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);
  const location = useLocation();

  if (!authReady) {
    return <div style={{ padding: 40, color: "#fff" }}>인증 확인 중...</div>;
  }

  if (!isLogin) return <Navigate to="/land" replace />;

  if (!onboardingDone && user?.provider !== "kakao") {
    return <Navigate to="/auth" replace />;
  }

  const introSeen = user
    ? localStorage.getItem(`introSeen-${user.uid}`) === "1"
    : false;

  if (!introSeen && location.pathname !== "/intro") {
    return <Navigate to="/intro" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
