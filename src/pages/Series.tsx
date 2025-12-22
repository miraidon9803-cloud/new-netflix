import SeriesBanner from "../components/Series/SeriesBanner";
import TodayTop10 from "../components/TodayTop10";
import NetflixNewSeries from "../components/Series/NetflixNewSeries";
import KoreanSeries from "../components/Series/KoreaSeries";
import NotKoreaSeries from "../components/Series/NotkoreaSeries";
import MisterySeries from "../components/Series/MisterySeries";
import FunSeries from "../components/Series/FunSeries";
import BestSeries from "../components/Series/BestSeries";
import LightSeries from "../components/Series/LightSeries";
import FilterPopup from "../components/FilterPopup";
import "./scss/Series.scss";
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";

const Series = () => {
  return (
    <div className="inner">
      <SideNav/>
      <SeriesBanner />
      <FilterPopup />
      <TodayTop10 />
      <NetflixNewSeries />
      <KoreanSeries />
      <NotKoreaSeries />
      <MisterySeries />
      <FunSeries />
      <BestSeries />
      <LightSeries />
      <MobileNav/>
    </div>
  );
};

export default Series;
