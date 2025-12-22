import HeroSection from "../components/HeroSection";
import CoverflowCarousel from "../components/CoverflowCarousel";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
import "./scss/Landing.scss";

const Landing = () => {
  return (
    <div>
      <div className="Landing-warp">
        <HeroSection />
        <div className="landing-inner">
          <div className="inner">
            <CoverflowCarousel />
            <FAQ />
          </div>
          <Hero />
        </div>
      </div>
    </div>
  );
};

export default Landing;
