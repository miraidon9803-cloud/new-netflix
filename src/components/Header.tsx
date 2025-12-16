import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./scss/Header.scss";
import SearchModal from "./SearchModal";

interface MenuItem {
  id: number;
  title: string;
  path: string;
}

const mainMenu: MenuItem[] = [
  { id: 1, title: "시리즈", path: "/series" },
  { id: 2, title: "영화", path: "/movies" },
  { id: 3, title: "오리지널", path: "/original" },
];

const Header = () => {
  const location = useLocation();
  const isLand = location.pathname === "/land";
  const isAuth = location.pathname === "/auth";

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);

  const hideHeaderUI = isLand || isAuth;

  return (
    <>
      <header>
        <div className="inner">
          <div className="header-left">
            <h1 className="logo">
              <Link to="/">
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </h1>

            {!hideHeaderUI && (
              <ul className="main-menu">
                {mainMenu.map((m) => (
                  <li className="main-text" key={m.id}>
                    <Link to={m.path}>{m.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!hideHeaderUI && (
            <div className="header-right">
              <ul>
                <li>
                  <Link to="/bell">
                    <img src="/images/bell-btn.png" alt="bell" />
                  </Link>
                </li>

                <li>
                  <button
                    className="search-btn"
                    onClick={handleSearchOpen}
                    aria-label="검색"
                    type="button"
                  >
                    <img src="/images/search-btn.png" alt="search" />
                  </button>
                </li>

                <li>
                  <Link to="/mypage">
                    <img src="/images/ham-btn.png" alt="ham" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {isSearchOpen && <SearchModal onClose={handleSearchClose} />}
    </>
  );
};

export default Header;
