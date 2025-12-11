import React from 'react';
import { Link } from 'react-router-dom';
import './scss/SideNav.scss';

const SideNav = () => {
  return (
    <div className="sideNav">
      <img src="/images/icon/Netflix-Logo.png" alt="" />
      <div></div>
      <Link to={'/'}>
        <img src="../../../public/images/icon/바로가기.png" alt="" />
      </Link>
      <Link to={'/'}>
        <img src="../../../public/images/icon/쇼츠.png" alt="" />
      </Link>
      <Link to={'/'}>
        <img src="../../../public/images/icon/홈.png" alt="" />
      </Link>
      <Link to={'/'}>
        <img src="../../../public/images/icon/위시리스트.png" alt="" />
      </Link>
      <Link to={'/'}>
        <img src="../../../public/images/icon/보관함.png" alt="" />
      </Link>
    </div>
  );
};

export default SideNav;
