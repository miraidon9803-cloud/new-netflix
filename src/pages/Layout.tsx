import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // 경로 맞추기

const Layout = () => {
  const location = useLocation();
  const { user, loading } = useAuthStore();

  const path = location.pathname;
  const isLand = path === "/land";
  const isAuth = path === "/auth";

  // ✅ auth 확인 끝나기 전엔 아무것도 렌더링하지 않기 (Main 선렌더 방지)
  if (loading) return null; // 또는 로딩 컴포넌트

  // ✅ 로그인 전: /land, /auth만 허용 (그 외는 무조건 /land)
  if (!user && !(isLand || isAuth)) {
    return <Navigate to="/land" replace />;
  }

  // ✅ 로그인 후: /land, /auth는 금지 → 항상 메인
  if (user && (isLand || isAuth)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
