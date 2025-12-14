import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Footer from "./components/Footer";
import Membership from "./pages/Membership";
import Shorts from "./components/Shorts";

function App() {
  const location = useLocation();
  const isShorts = location.pathname === '/shorts';

  return (
    <>
      {/* Shorts 페이지가 아닐 때만 Header 표시, 또는 430px 이하에서 Shorts일 때 숨김 처리 */}
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="login" element={<Login />} />
        <Route path="join" element={<Join />} />
        <Route path="membership" element={<Membership />} />
      </Routes>
      {/* Shorts 페이지에서는 Footer 숨김 */}
      {!isShorts && <Footer />}
    </>
  );
}

export default App;
