import { Route, Routes } from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";

import Mypage from "./pages/Mypage";
import Layout from "./pages/Layout";
import FullLogin from "./pages/FullLogin";
import Landing from "./pages/LandingPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="land" element={<Landing />} />
        <Route index element={<Main />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="auth" element={<FullLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
