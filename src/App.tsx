import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Main from "./pages/Main";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;
