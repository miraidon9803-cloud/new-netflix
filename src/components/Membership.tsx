import { useState } from "react";
import type { MembershipType } from "../types/auth";
import { useAuthStore } from "../store/authStore";
import "./scss/Membership.scss";
import { useNavigate } from "react-router-dom";

interface MembershipProps {
  onPrev?: () => void;
}
const Membership: React.FC<MembershipProps> = ({ onPrev }) => {
  const MEMBERS = {
    adStandard: {
      type: "adStandard" as const,
      name: "광고형 스탠다드",
      price: 7000,
    },
    standard: { type: "standard" as const, name: "스탠다드", price: 13500 },
    premium: { type: "premium" as const, name: "프리미엄", price: 17000 },
  };
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MembershipType>("adStandard");
  const { saveMembership } = useAuthStore();
  const handleNext = async () => {
    try {
      await saveMembership(MEMBERS[selected]);
      navigate("/mypage");
    } catch (e) {
      alert("멤버십 저장 실패");
    }
  };
  return (
    <div className="inner-membership">
      <div className="membership-wrap">
        <div className="signtitle-wrap">
          <h2 className="title">원하는 멤버십을 선택하세요</h2>
          {onPrev && (
            <p className="prev-btn" onClick={onPrev}>
              dd
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
