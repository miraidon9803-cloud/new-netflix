import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import FullLogin from './pages/FullLogin';
import ProfileSelect from './pages/ProfileSelect';
import Landing from './pages/LandingPage';
import Main from './pages/Main';
import MypageMain from './pages/MypageMain';
import NetDetail from './pages/NetDetail';
import MovieDetail from './pages/MovieDetail';
import StorageBox from './pages/StorageBox';

import ProfileGate from './components/ProfileGate';
import AuthGate from './components/AuthGate';
import GuestOnly from './components/GuestOnly';
import Series from './pages/Series';

import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/Profile';
import { useEffect } from 'react';
import Wishlist from './components/Wishlist';
import WishlistDetail from './components/WishlistDetail';
import Shorts from './components/Shorts';

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);

  // ✅ 프로필 선택 여부
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  /**
   *  로그인 이후 목적지 결정 로직
   * 1) 로그인 X  -> /land
   * 2) 로그인 O + 온보딩(멤버십) X -> /auth (멤버십 단계로)
   * 3) 로그인 O + 온보딩 O + 프로필 선택 X -> /mypage/profile
   * 4) 로그인 O + 온보딩 O + 프로필 선택 O -> /main
   */
  const afterLoginPath = !onboardingDone ? '/auth' : activeProfileId ? '/main' : '/mypage/profile';

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*  첫 진입 */}
        <Route index element={<Navigate to={isLogin ? afterLoginPath : '/land'} replace />} />

        {/*  land/auth: 로그인하면 afterLoginPath로 */}
        <Route element={<GuestOnly redirectTo={afterLoginPath} />}>
          <Route path="land" element={<Landing />} />
          <Route path="auth" element={<FullLogin />} />
        </Route>

        {/*  프로필 선택 화면은 로그인만 필요 */}
        <Route element={<AuthGate />}>
          <Route path="profile" element={<ProfileSelect />} />
          <Route path="mypage/profile" element={<ProfileSelect />} />
        </Route>

        {/*  여기부터는 로그인 + 프로필 선택 완료 */}
        <Route element={<AuthGate />}>
          <Route element={<ProfileGate />}>
            <Route path="main" element={<Main />} />
            <Route path="mypage" element={<MypageMain />} />
            <Route path="tv/:id" element={<NetDetail />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="StorageBox" element={<StorageBox />} />
            <Route path="Series" element={<Series />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="/wishlist/:folderId" element={<WishlistDetail />} />
            <Route path="/shorts" element={<Shorts />} />
          </Route>
        </Route>

        {/*  없는 경로 */}
        <Route path="*" element={<Navigate to={isLogin ? afterLoginPath : '/land'} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
