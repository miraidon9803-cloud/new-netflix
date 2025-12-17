// src/components/GuestOnly.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Props = { redirectTo: string };

export default function GuestOnly({ redirectTo }: Props) {
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);
  const location = useLocation();

  // ✅ "완전한 로그인(온보딩 완료)"인 경우에만 막기
  // (온보딩 중이면 /auth 접근 허용해야 멤버십 step 진행 가능)
  if (isLogin && onboardingDone) {
    if (location.pathname !== redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    // 같은 경로로 또 Navigate 걸지 않기(리마운트/루프 방지)
    return null;
  }

  return <Outlet />;
}
