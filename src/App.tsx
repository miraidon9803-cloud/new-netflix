import { Route, Routes } from 'react-router-dom';
import './App.css';

import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import Membership from './pages/Membership';
import Mypage from './pages/Mypage';
import Layout from './pages/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="login" element={<Login />} />
        <Route path="join" element={<Join />} />
        <Route path="membership" element={<Membership />} />
        <Route path="mypage" element={<Mypage />} />
      </Route>
    </Routes>
  );
}

export default App;
