import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./scss/MobileNav.scss";

const MobileNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="mobilenav">
      <div className="nav">
        <Link to="/exploration" className={pathname === "/" ? "active" : ""}>
          <img
            src={
              pathname === "/exploration"
                ? "/images/icon/모바일바로가기-active.png"
                : "/images/icon/모바일바로가기.png"
            }
            alt="바로가기"
          />
          <p>바로가기</p>
        </Link>

        <Link to="/shorts" className={pathname === "/shorts" ? "active" : ""}>
          <img
            src={
              pathname === "/shorts"
                ? "/images/icon/모바일쇼츠-active.png"
                : "/images/icon/모바일쇼츠.png"
            }
            alt="쇼츠"
          />
          <p>쇼츠</p>
        </Link>

        <Link to="/main" className={pathname === "/main" ? "active" : ""}>
          <img
            src={
              pathname === "/main"
                ? "/images/icon/모바일홈-active.png"
                : "/images/icon/모바일홈.png"
            }
            alt="홈"
          />
          <p>홈</p>
        </Link>

        <Link
          to="/wishlist"
          className={pathname === "/wishlist" ? "active" : ""}
        >
          <img
            src={
              pathname === "/wishlist"
                ? "/images/icon/모바일좋아요-active.png"
                : "/images/icon/모바일좋아요.png"
            }
            alt="찜"
          />
          <p>좋아요</p>
        </Link>

        <Link
          to="/storagebox"
          className={pathname === "/storagebox" ? "active" : ""}
        >
          <img
            src={
              pathname === "/storagebox"
                ? "/images/icon/모바일보관함-active.png"
                : "/images/icon/모바일보관함.png"
            }
            alt="보관함"
          />
          <p>보관함</p>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
