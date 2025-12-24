import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "./scss/Complete.scss";

interface CompleteProps {
  onPrev?: () => void;
}

const Complete: React.FC<CompleteProps> = ({ onPrev }) => {
  const navigate = useNavigate();

  const tempMembership = useAuthStore((s) => s.tempMembership);

  const finalizeJoinWithComplete = useAuthStore(
    (s) => s.finalizeJoinWithComplete
  );

  const loading = useAuthStore((s) => s.loading);

  const handleGoLogin = async () => {
    try {
      if (!tempMembership) return alert("멤버십을 선택해주세요.");

      //  여기서 회원가입 + 멤버십 저장 후 즉시 signOut(스토어에서 처리)
      await finalizeJoinWithComplete(tempMembership);

      navigate("/auth", { replace: true });
    } catch (e) {
      console.error(e);
      alert("가입 완료 처리 중 오류가 발생했습니다.");
    }
  };

  const handlePrev = () => {
    if (onPrev) onPrev();
    else navigate(-1);
  };

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
                onClick={handlePrev}
                aria-label="뒤로가기"
                disabled={loading}
              >
                <img src="/images/payment/back-icon.png" alt="뒤로가기 버튼" />
              </button>

              <h1 className="complete-title">멤버십 가입 완료</h1>
            </div>

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
            onClick={handleGoLogin}
            disabled={loading}
          >
            {loading ? "처리 중..." : "로그인하러 가기"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Complete;
