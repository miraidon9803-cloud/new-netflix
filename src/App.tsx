import { Route, Routes } from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";
import Membership from "./components/Membership";
import Mypage from "./pages/Mypage";
import Layout from "./pages/Layout";
import FullLogin from "./pages/FullLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="membership" element={<Membership />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="auth" element={<FullLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
