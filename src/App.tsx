import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import Layout from "./pages/Layout";
import FullLogin from "./pages/FullLogin";
import Landing from "./pages/LandingPage";
import ProfileGate from "./components/ProfileGate";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProfileSelect from "./pages/ProfileSelect";
import MypageMain from "./pages/MypageMain";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/profiles" element={<ProfileSelect />} />

      <Route
        path="/"
        element={
          <ProfileGate>
            <Layout />
          </ProfileGate>
        }
      >
        <Route path="land" element={<Landing />} />
        <Route index element={<Main />} />
        <Route path="mypage" element={<MypageMain />} />
        <Route path="mypage/profile" element={<ProfileSelect />} />
        <Route path="auth" element={<FullLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
