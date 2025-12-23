// src/components/ProfileGate.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/Profile";

const ProfileGate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const profilesLoading = useProfileStore((s) => s.profilesLoading);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (profilesLoading) return;

    if (
      location.pathname === "/profile" ||
      location.pathname === "/mypage/profile"
    ) {
      return;
    }

    if (!activeProfileId) {
      navigate("/mypage/profile", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [
    loading,
    user,
    profilesLoading,
    activeProfileId,
    location.pathname,
    navigate,
  ]);

  return <Outlet />;
};

export default ProfileGate;
