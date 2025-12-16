// import { EffectCoverflow } from "swiper/modules";
import HeroSection from "../components/HeroSection";
import CoverflowCarousel from "../components/CoverflowCarousel";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const Landing = () => {
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     // 랜딩을 본 적이 있다면 메인으로 이동
  //     const hasVisited = localStorage.getItem("hasVisitedLanding");

  //     if (hasVisited) {
  //       navigate("/", { replace: true });
  //       return;
  //     }

  //     // 처음 방문이면 기록 남김
  //     localStorage.setItem("hasVisitedLanding", "true");
  //   }, [navigate]);

  return (
    <div>
      <div className="Landing-warp">
        <div className="inner">
          <HeroSection />
          <CoverflowCarousel />
          <FAQ />
          <Hero />
        </div>
      </div>
    </div>
  );
};

export default Landing;
