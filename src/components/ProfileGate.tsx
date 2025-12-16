import { Navigate, useLocation } from "react-router-dom";
import { useProfileStore } from "../store/Profile";

export default function ProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const { pathname } = useLocation();

  // 프로필 선택 페이지는 예외
  if (pathname === "/profiles") return <>{children}</>;

  // activeProfile 없으면 무조건 프로필 선택으로
  if (!activeProfileId) return <Navigate to="/profiles" replace />;

  return <>{children}</>;
}
