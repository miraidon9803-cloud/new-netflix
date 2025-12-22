import OriginalBanner from "../components/Original/OriginalBanner";
import NetflixOriginalTop10 from "../components/Original/NetflixOriginalTop10";
import Originals from "../components/Original/Originals";
import "./scss/Original.scss";
import FilterPopup from "../components/Original/FilterPopup";
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";

const Original = () => {
  return (
    <div className="original-wrap">
      <SideNav/>
      <OriginalBanner />
      <FilterPopup />
      <NetflixOriginalTop10 />
      <Originals />
      <MobileNav/>
    </div>
  );
};

export default Original;
