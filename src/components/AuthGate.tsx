import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AuthGate() {
  const authReady = useAuthStore((s) => s.authReady);
  const isLogin = useAuthStore((s) => s.isLogin);

  if (!authReady) {
    return <div style={{ padding: 40, color: "#fff" }}>인증 확인 중...</div>;
  }

  if (!isLogin) return <Navigate to="/land" replace />;
  return <Outlet />;
}
