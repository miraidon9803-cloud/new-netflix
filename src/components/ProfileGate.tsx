import { useLocation, useNavigate } from "react-router-dom";
import { useProfileStore } from "../store/Profile";
import { useEffect } from "react";

const ProfileGate = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  useEffect(() => {
    const needProfile = location.pathname.startsWith("/mypage");
    if (!needProfile) return;

    if (!activeProfileId) {
      navigate("/profile", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [activeProfileId, location.pathname, navigate]);

  return <>{children}</>;
};

export default ProfileGate;
