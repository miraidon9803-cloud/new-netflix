import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Footer from "./components/Footer";
import Mypage from "./pages/Mypage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="login" element={<Login />} />
        <Route path="join" element={<Join />} />
        <Route path="mypage" element={<Mypage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
