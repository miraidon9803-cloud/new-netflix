// src/components/VerticalRollingBanner.tsx
import "./scss/ChoiceContentTxt.scss";
import ChoiceContentBG from "./ChoiceContentBG";
import { Link } from "react-router-dom";

const ChoiceContentTxt = () => {
  return (
    <div className="rolling-banner-wrap">
      {/* 배경 */}
      <div className="rolling-bg">
        <ChoiceContentBG />
      </div>

      {/* 가운데 글 + 버튼 */}
      <div className="rolling-overlay">
        <p className="title">아직까지 원하시는 콘텐츠를 못 찾으셨나요?</p>
        <span className="subtitle">
          바로가기를 통해 지금 취향에 맞는 작품을 찾아보세요
        </span>
        <Link to="/exploration">
          <p className="cta">
            바로가기
            <img src="/images/icon/right.png" alt="right" />
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ChoiceContentTxt;
