import { useState } from "react";
import type { MembershipType } from "../types/auth";
import { useAuthStore } from "../store/authStore";
import "./scss/Membership.scss";
// import { useNavigate } from "react-router-dom";

interface MembershipProps {
  onPrev?: () => void;

  /**  FullLogin(step) 방식이면 이걸 넘겨서 setStep(4)로 이동시키는 게 제일 깔끔 */
  onNext?: () => void;
}

const Membership: React.FC<MembershipProps> = ({ onPrev, onNext }) => {
  const MEMBERS = {
    adStandard: {
      type: "adStandard" as const,
      name: "광고형 스탠다드",
      price: 7000,
    },
    standard: { type: "standard" as const, name: "스탠다드", price: 13500 },
    premium: { type: "premium" as const, name: "프리미엄", price: 17000 },
  };

  // const navigate = useNavigate();
  const [selected, setSelected] = useState<MembershipType>("adStandard");

  /**  신규 가입 여부: Join에서 tempJoin 저장해둔 경우 */
  const tempJoin = useAuthStore((s) => s.tempJoin);

  /**  신규 가입 플로우에서는 멤버십 선택값만 임시 저장해두고,
   *  실제 회원가입(createUser...) + Firestore 저장은 Complete에서 실행
   */
  const setTempMembership = useAuthStore((s) => s.setTempMembership);

  /**  기존 로그인 유저는 멤버십만 저장/변경 */
  const saveMembership = useAuthStore((s) => s.saveMembership);

  const handleNext = async () => {
    try {
      const plan = MEMBERS[selected];

      if (tempJoin) {
        setTempMembership({
          ...plan,

          type: selected === "adStandard" ? "adStandard" : selected,
        });

        // ✅ 라우팅은 부모가 함
        onNext?.();
        return;
      }

      await saveMembership(plan);
    } catch (e) {
      console.error(e);
      alert("멤버십 저장 실패");
    }
  };

  return (
    <div className="inner-membership">
      <div className="membership-wrap">
        <div className="signtitle-wrap">
          <h2 className="title">원하는 멤버십을 선택하세요</h2>

          {onPrev && (
            <p className="prev-btn" onClick={onPrev} role="button" tabIndex={0}>
              <img src="/images/ArrowLeft.png" alt="Back" />
            </p>
          )}
        </div>

        <div className="membership-box">
          <ul className="option-list">
            <li>월 요금</li>
            <li>화질 / 음질</li>
            <li>해상도</li>
            <li>광고 포함</li>
            <li>지원 디바이스</li>
            <li>동시 시청수</li>
            <li>저장 디바이스</li>
            <li>광고</li>
          </ul>

          <div className="card-wrap">
            <div
              className={`card ${selected === "adStandard" ? "active" : ""}`}
              onClick={() => setSelected("adStandard")}
              role="button"
              tabIndex={0}
            >
              <h3
                className={`card-title ${
                  selected === "adStandard" ? "active" : ""
                }`}
              >
                광고형 스탠다드
              </h3>
              <ul>
                <li>7,000원</li>
                <li>좋음</li>
                <li>1080p</li>
                <li>X</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>2</li>
                <li>2</li>
                <li>생각보다 적은 광고</li>
              </ul>
            </div>

            <div
              className={`card ${selected === "standard" ? "active" : ""}`}
              onClick={() => setSelected("standard")}
              role="button"
              tabIndex={0}
            >
              <h3
                className={`card-title ${
                  selected === "standard" ? "active" : ""
                }`}
              >
                스탠다드
              </h3>
              <ul>
                <li>13,500원</li>
                <li>좋음</li>
                <li>1080p</li>
                <li>광고 없음</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>2</li>
                <li>2</li>
                <li>광고 없음</li>
              </ul>
            </div>

            <div
              className={`card ${selected === "premium" ? "active" : ""}`}
              onClick={() => setSelected("premium")}
              role="button"
              tabIndex={0}
            >
              <h3
                className={`card-title ${
                  selected === "premium" ? "active" : ""
                }`}
              >
                프리미엄
              </h3>
              <ul>
                <li>17,000원</li>
                <li>가장 좋음</li>
                <li>4K UHD + HDR</li>
                <li>광고 없음</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>6</li>
                <li>6</li>
                <li>광고 없음</li>
              </ul>
            </div>
          </div>
        </div>

        <button onClick={handleNext} className="next-btn">
          다음
        </button>
      </div>
    </div>
  );
};

export default Membership;
