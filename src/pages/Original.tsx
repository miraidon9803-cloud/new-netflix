import OriginalBanner from "../components/Original/OriginalBanner";
import NetflixOriginalTop10 from "../components/Original/NetflixOriginalTop10";
import Originals from "../components/Original/Originals";
import "./scss/Original.scss";
import FilterPopup from "../components/Original/FilterPopup";

const Original = () => {
  return (
    <div className="original-wrap">
      <OriginalBanner />
      <FilterPopup />
      <NetflixOriginalTop10 />
      <Originals />
    </div>
  );
};

export default Original;
