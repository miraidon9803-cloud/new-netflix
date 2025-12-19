import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./scss/SideNav.scss";

const SideNav = () => {
  const { pathname } = useLocation();

  return (
    <div className="sideNav">
      <img className="logo" src="/images/icon/Netflix-Logo.png" alt="" />

      {/* ⬇️ 기존에 있던 div 그대로 유지 */}
      <div></div>

      <Link to="/">
        <img
          src={
            pathname === "/"
              ? "/images/icon/바로가기-active.png"
              : "/images/icon/바로가기.png"
          }
          alt=""
        />
      </Link>

      <Link to="/shorts">
        <img
          src={
            pathname === "/shorts"
              ? "/images/icon/쇼츠-active.png"
              : "/images/icon/쇼츠.png"
          }
          alt=""
        />
      </Link>

      <Link to="/">
        <img
          src={
            pathname === "/"
              ? "/images/icon/홈-active.png"
              : "/images/icon/홈.png"
          }
          alt=""
        />
      </Link>

      <Link to="/wishlist">
        <img
          src={
            pathname === "/wishlist"
              ? "/images/icon/위시리스트-active.png"
              : "/images/icon/위시리스트.png"
          }
          alt=""
        />
      </Link>

      <Link to="/storagebox">
        <img
          src={
            pathname === "/library"
              ? "/images/icon/보관함-active.png"
              : "/images/icon/보관함.png"
          }
          alt=""
        />
      </Link>
    </div>
  );
};

export default SideNav;
