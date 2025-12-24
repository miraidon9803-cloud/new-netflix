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
import SeriesFilterResult from "./pages/SeriesFilterResult";
import Movie from "./pages/Movie";
import Original from "./pages/Original";
import MovieFilterResult from "./pages/MovieFilterResult";

import Payment from "./components/User/Payment";
import Wishlist from "./components/Wishlist";
import WishlistDetail from "./components/WishlistDetail";
import Shorts from "./components/Shorts";

import ProfileGate from "./components/ProfileGate";
import AuthGate from "./components/AuthGate";
import GuestOnly from "./components/GuestOnly";

import { useAuthStore } from "./store/authStore";
import { useProfileStore } from "./store/Profile";
import OriginalFilterResult from "./pages/OriginalFilterResult";
import TotalResult from "./pages/TotalResult";
import ExplorationPage from "./pages/ExplorationPage";
import Exploration from "./pages/Exploration";

import Alarm from "./pages/Alarm";
import IntroPage from "./pages/IntroPage";
import Tvdetail from "./pages/Tvdetail";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  // 로그인 후 기본 목적지
  // (인트로/프로필은 Gate가 자동으로 처리하므로 최종 목적지만 지정)
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
        <Route
          index
          element={<Navigate to={isLogin ? afterLoginPath : "/land"} replace />}
        />

        {/*  비로그인 전용 */}
        <Route element={<GuestOnly redirectTo={afterLoginPath} />}>
          <Route path="land" element={<Landing />} />
          <Route path="auth" element={<FullLogin />} />
        </Route>

        {/*  로그인 필수 (AuthGate가 인트로 강제) */}
        <Route element={<AuthGate />}>
          {/*  인트로 페이지 (프로필 불필요) */}
          <Route path="intro" element={<IntroPage />} />

          {/*  프로필 선택 페이지 (하나로 통일) */}
          <Route path="mypage/profile" element={<ProfileSelect />} />

          {/*  프로필 필수 페이지들 */}
          <Route element={<ProfileGate />}>
            <Route path="main" element={<Main />} />
            <Route path="mypage" element={<MypageMain />} />
            <Route path="tv/:id" element={<Tvdetail />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="total-filter" element={<TotalResult />} />
            <Route path="storagebox" element={<StorageBox />} />
            <Route path="series" element={<Series />} />
            <Route path="series/filter" element={<SeriesFilterResult />} />
            <Route path="Movie" element={<Movie />} />
            <Route path="movie/filter" element={<MovieFilterResult />} />
            <Route path="Original" element={<Original />} />
            <Route path="original/filter" element={<OriginalFilterResult />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="wishlist/:folderId" element={<WishlistDetail />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="payment" element={<Payment />} />
            <Route path="exploration" element={<Exploration />} />
            <Route path="exploration/start" element={<ExplorationPage />} />
            <Route path="bell" element={<Alarm />} />
          </Route>
        </Route>

        {/* 404 처리 */}
        <Route
          path="*"
          element={<Navigate to={isLogin ? afterLoginPath : "/land"} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
