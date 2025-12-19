import { useNavigate } from "react-router-dom";
import "./scss/Complete.scss";

const Complete = () => {
  const navigate = useNavigate();

  return (
    <div className="complete-wrapper">
      <div className="complete-page">
        {/* 배경 */}
        <div className="complete-bg" />

        {/* 중앙 콘텐츠 */}
        <section className="complete-container">
          {/* 상단 영역 */}
          <div className="complete-header">
            <div className="complete-title-wrap">
              <button
                type="button"
                className="complete-back-btn"
                onClick={() => navigate(-1)}
                aria-label="뒤로가기"
              >
                <img src="/images/payment/back-icon.png" alt="뒤로가기 버튼" />
              </button>

              <h1 className="complete-title">멤버십 가입 완료</h1>
            </div>

            {/* 설명 */}
            <p className="complete-desc">
              <span>가입이 완료되었습니다. </span>
              <span>무제한 콘텐츠를 자유롭게 이용하세요.</span>
            </p>
          </div>

          {/* 완료 로고 */}
          <div className="complete-logo">
            <img
              src="/images/payment/complete-logo.png"
              alt="넷플릭스 멤버십 가입 완료"
            />
          </div>

          {/* 버튼 */}
          <button
            type="button"
            className="complete-btn"
            onClick={() => navigate("/login")}
          >
            로그인하러 가기
          </button>
        </section>
      </div>
    </div>
  );
};

export default Complete;
