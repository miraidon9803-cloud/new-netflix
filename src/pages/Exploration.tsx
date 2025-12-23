import { useNavigate } from "react-router-dom";
import "./scss/Exploration.scss";
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";

const Exploration = () => {
  const navigate = useNavigate();
  return (
    <section className="Exploration-wrap">
      <SideNav />
      <div className="Exp-textbox">
        <h2>오늘의 기분은, 어떤 이야기로 채우고 싶으신가요?</h2>
        <p>세 가지 질문으로 당신에게 맞는 작품을 추천해드려요.</p>
      </div>
      <div className="imgbox">
        <img src={"images/Exp.gif"} alt="Exp" />
      </div>

      <button
        className="Exp-btn"
        onClick={() => navigate("/exploration/start")}
      >
        이야기 고르기
      </button>
      <MobileNav/>
    </section>
  );
};

export default Exploration;
