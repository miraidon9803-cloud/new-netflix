import { Link } from "react-router-dom";
import "./scss/Header.scss";
interface MenuItem {
  id: number;
  title: string;
  path: string;
}
const mainMenu: MenuItem[] = [
  { id: 1, title: "시리즈", path: "/series" },
  { id: 2, title: "영화", path: "/movies" },
  { id: 3, title: "오리지날", path: "/original" },
];

const Header = () => {
  return (
    <header>
      <div className="inner">
        <div className="header-left">
          <h1 className="logo">
            <img src="/images/logo.png" alt="logo" />
          </h1>

          <ul className="main-menu">
            {mainMenu.map((m) => (
              <li className="main-text" key={m.id}>
                <Link to={m.path}>{m.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="header-right">
          <ul>
            <li>
              <Link to="/bell">
                <img src="/images/bell-btn.png" alt="bell" />
              </Link>
            </li>

            <li>
              <Link to="/search">
                <img src="/images/search-btn.png" alt="search" />
              </Link>
            </li>

            <li>
              <Link to="/ham">
                <img src="/images/ham-btn.png" alt="ham" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
