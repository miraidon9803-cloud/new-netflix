// src/components/GuestOnly.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Props = { redirectTo: string };

export default function GuestOnly({ redirectTo }: Props) {
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);
  const location = useLocation();

  if (isLogin && onboardingDone) {
    if (location.pathname !== redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return null;
  }

  return <Outlet />;
}
