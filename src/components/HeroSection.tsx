import React from "react";
import "./scss/HeroSection.scss";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero_bg">
        <div className="inner">
          <div className="hero_copy">
            <p className="hero_copy1">취향을 집어올리는 순간</p>
            <p className="hero_copy2">넷플릭스의 세계가 열린다!</p>
          </div>
          <div className="Nstar_btn"><Link to="/auth">넷플릭스 시작하기</Link></div>
        </div>
      </div>
        <div className="hero_banner">
          <div className="hero_banner-left">
            <div className="popcon"><img src="/images/popcorn_icon.png" alt="popcon" /></div>
            <div className="popcon_ex">
              <strong>7,000원이면 만날 수 있는 넷플릭스</strong>
              <p>가장 경제적인 광고형 멤버십을 이용해 보세요</p>
            </div>
          </div>
          {/* <div className="herobanner-arrow"><Link to="/membership"><img src="/images/Arrow Right.png" alt="" /></Link></div> */}
        </div>
    </section>
  );
};

export default HeroSection;