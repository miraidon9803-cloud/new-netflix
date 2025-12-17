import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function GuestOnly({
  redirectTo = "/main",
}: {
  redirectTo?: string;
}) {
  const isLogin = useAuthStore((s) => s.isLogin);
  if (isLogin) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
