import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./pages/Layout";
import FullLogin from "./pages/FullLogin";
import ProfileSelect from "./pages/ProfileSelect";
import Landing from "./pages/LandingPage";
import Main from "./pages/Main";
import MypageMain from "./pages/MypageMain";

import MovieDetail from "./pages/MovieDetail";
import StorageBox from "./pages/StorageBox";
import Series from "./pages/Series";

import Payment from "./components/Payment";
import Wishlist from "./components/Wishlist";
import WishlistDetail from "./components/WishlistDetail";
import Shorts from "./components/Shorts";

import ProfileGate from "./components/ProfileGate";
import AuthGate from "./components/AuthGate";
import GuestOnly from "./components/GuestOnly";

import { useAuthStore } from "./store/authStore";
import { useProfileStore } from "./store/Profile";
import ExplorationPage from "./pages/ExplorationPage";
import Exploration from "./pages/Exploration";
import Tvdetail from "./pages/Tvdetail";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const afterLoginPath = !onboardingDone
    ? "/auth"
    : activeProfileId
    ? "/main"
    : "/mypage/profile";

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 첫 진입 */}
        <Route
          index
          element={<Navigate to={isLogin ? afterLoginPath : "/land"} replace />}
        />

        {/* land / auth */}
        <Route element={<GuestOnly redirectTo={afterLoginPath} />}>
          <Route path="land" element={<Landing />} />
          <Route path="auth" element={<FullLogin />} />
        </Route>

        {/* 로그인만 필요 */}
        <Route element={<AuthGate />}>
          <Route path="profile" element={<ProfileSelect />} />
          <Route path="mypage/profile" element={<ProfileSelect />} />
        </Route>

        {/* 로그인 + 프로필 선택 완료 */}
        <Route element={<AuthGate />}>
          <Route element={<ProfileGate />}>
            <Route path="main" element={<Main />} />
            <Route path="mypage" element={<MypageMain />} />
            <Route path="tv/:id" element={<Tvdetail />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="StorageBox" element={<StorageBox />} />
            <Route path="Series" element={<Series />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="wishlist/:folderId" element={<WishlistDetail />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="payment" element={<Payment />} />
            <Route path="exploration" element={<Exploration />} />
            <Route path="exploration/start" element={<ExplorationPage />} />
          </Route>
        </Route>

        {/* 없는 경로 */}
        <Route
          path="*"
          element={<Navigate to={isLogin ? afterLoginPath : "/land"} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
