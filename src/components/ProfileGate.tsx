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

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth", { replace: true, state: { from: location.pathname } });
      return;
    }

    if (!activeProfileId) {
      navigate("/profile", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [loading, user, activeProfileId, location.pathname, navigate]);

  return <Outlet />;
};

export default ProfileGate;
