import { useEffect } from "react";
import "./scss/Main.scss";
// import NetflixOriginal from '../components/NetflixOriginal';
import { useNetflixStore } from "../store/NetflixStore";
import MainBanner from "../components/MainBanner";
import InfiniSubmenu from "../components/InfiniSubmenu";
import Originals from "../components/Originals";
import NowPlay from "../components/NowPlay";
import ComingSoon from "../components/ComingSoon";
import WalkingDead from "../components/WalkingDead";
import SideNav from "../components/SideNav";
import StrangerNew from "../components/StrangerNew";
import TodayTop10 from "../components/TodayTop10";
import MovieTop10 from "../components/MovieTop10";
import SFNFantasy from "../components/SFNFantasy";
import TrandingSeries from "../components/TrandingSeries";
import ChoiceContentTxt from "../components/ChoiceContentTxt";
import MobileNav from "../components/MobileNav";
import ContinueWatchingRow from "../components/ContinueWatchingRow.tsx";

const Main = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const hasVisited = localStorage.getItem("hasVisitedLanding");
  //   if (!hasVisited) {
  //     navigate("/land", { replace: true });
  //   }
  // }, [navigate]);
  const { onFetchOriginal } = useNetflixStore();
  useEffect(() => {
    onFetchOriginal();
  }, [onFetchOriginal]);

  return (
    <div className="Main">
      <SideNav />
      {/* <NetflixOriginal title="넷플릭스 오리지날" original={original} /> */}
      <InfiniSubmenu />
      <MainBanner />
      <ContinueWatchingRow />
      <TodayTop10 />
      <Originals />
      <NowPlay />
      <MovieTop10 />
      <StrangerNew />
      <ComingSoon />
      <WalkingDead />
      <TrandingSeries />
      <SFNFantasy />
      <ChoiceContentTxt />
      <MobileNav />
    </div>
  );
};

export default Main;
