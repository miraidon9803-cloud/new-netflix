import { Link } from "react-router-dom";
import "./scss/Hero.scss";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero_inner">
                <img
                    src="/images/Netflix_01.png"
                    alt="Netflix"
                    className="Netflix_logo"
                />

                <div className="hero_N_star">
                    <p className="hero_desc">
                        시청할 준비가 되셨나요? 멤버십을 등록하거나 로그인하세요.
                    </p>
                    <div className="N_star_btn"><Link to="/auth">넷플릭스 시작하기</Link></div>
                </div>

                <div className="Netflix_logo_Big">
                    <img src="/images/Netflix_02.png" alt="Netflix_log" />
                </div>
            </div>
        </section>
    );
}
