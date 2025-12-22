import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "./scss/Payment.scss";

// import "./scss/Payment.scss";

import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface PaymentProps {
  onPrev?: () => void;
  onNext?: () => void;
}

type PayMethod = "naver" | "kakao" | "samsung" | "toss" | "card";
type MembershipType = "ad-standard" | "standard" | "premium";

interface MembershipInfo {
  name: string;
  price: number;
}

const MEMBERSHIP_MAP: Record<MembershipType, MembershipInfo> = {
  "ad-standard": { name: "광고형 스탠다드", price: 7000 },
  standard: { name: "스탠다드", price: 13500 },
  premium: { name: "프리미엄", price: 17000 },
};

const Payment: React.FC<PaymentProps> = ({ onPrev, onNext }) => {
  const navigate = useNavigate();

  const tempMembership = useAuthStore((s) => s.tempMembership);

  // 결제 수단 (기존 유지)
  const [selected, setSelected] = useState<PayMethod>("naver");
  const handleSelect = (value: PayMethod) => {
    setSelected((prev) => (prev === value ? "naver" : value));
  };

  // 멤버십
  // const initialMembership: MembershipType =
  //   tempMembership?.type ?? "ad-standard";
  const mapStoreToUiMembership = (
    type?: "adStandard" | "standard" | "premium"
  ): MembershipType => {
    switch (type) {
      case "adStandard":
        return "ad-standard";
      case "standard":
        return "standard";
      case "premium":
        return "premium";
      default:
        return "ad-standard";
    }
  };

  const initialMembership: MembershipType = mapStoreToUiMembership(
    tempMembership?.type
  );

  const [selectedMembership, setSelectedMembership] =
    useState<MembershipType>(initialMembership);

  const [tempSelectedMembership, setTempSelectedMembership] =
    useState<MembershipType>(initialMembership);

  // 팝업
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 약관
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  const canSubmit = agree1 && agree2;

  const handlePrev = () => {
    if (onPrev) onPrev();
    else navigate(-1);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onNext?.();
  };

  const membership = MEMBERSHIP_MAP[selectedMembership];

  return (
    <div className="payment-wrapper">
      <div className="payment-page">
        {/* 배경 */}
        <div className="payment-bg" />

        {/* 중앙 카드 */}
        <section className="payment-container">
          {/* 헤더 */}
          <div className="payment-header">
            <button
              type="button"
              className="pay-back-btn"
              onClick={handlePrev}
              aria-label="뒤로가기"
            >
              <img src="/images/payment/back-icon.png" alt="뒤로가기" />
            </button>

            <h1 className="payment-title">결제 방법 선택</h1>
          </div>

          {/* 안내 문구 */}
          <p className="payment-info">
            결제 정보는 암호화되며, 결제 방법은 언제든지 변경할 수 있습니다.
          </p>

          <section className="payment-content">
            {/* 결제 수단 */}
            <div className="payment-methods">
              <h2 className="pay-section-title">결제 수단</h2>

              <Swiper
                slidesPerView="auto"
                spaceBetween={12}
                grabCursor
                freeMode
                mousewheel={{ releaseOnEdges: false }}
                speed={400}
                modules={[FreeMode]}
                className="payment-swiper"
              >
                <SwiperSlide className="payment-slide">
                  <button
                    type="button"
                    className={`payment-method ${
                      selected === "naver" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("naver")}
                  >
                    <img
                      src="/images/payment/logo_naverpay.png"
                      alt="네이버페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button
                    type="button"
                    className={`payment-method ${
                      selected === "kakao" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("kakao")}
                  >
                    <img
                      src="/images/payment/icon_kakaopay.png"
                      alt="카카오페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button
                    type="button"
                    className={`payment-method ${
                      selected === "samsung" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("samsung")}
                  >
                    <img
                      src="/images/payment/logo_samsungpay.png"
                      alt="삼성페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button
                    type="button"
                    className={`payment-method ${
                      selected === "toss" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("toss")}
                  >
                    <img
                      src="/images/payment/logo_tosspay.png"
                      alt="토스페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button
                    type="button"
                    className={`payment-method ${
                      selected === "card" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("card")}
                  >
                    <span className="payment-text">카드 결제</span>
                  </button>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* 멤버십  */}
            <div className="payment-membership">
              <h2 className="pay-section-title">선택된 멤버십</h2>

              <div className="membership-summary">
                <div className="membership-info">
                  <span className="membership-price">
                    매월 {membership.price.toLocaleString()}원
                  </span>
                  <span className="membership-name">{membership.name}</span>
                </div>

                <button
                  type="button"
                  className="membership-change-btn"
                  onClick={() => {
                    setTempSelectedMembership(selectedMembership);
                    setIsPopupOpen(true);
                  }}
                >
                  변경
                </button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="payment-agreement">
              <h2 className="pay-section-title">약관 동의</h2>

              <label className="agreement-item">
                <input
                  type="checkbox"
                  className="agreement-checkbox"
                  checked={agree1}
                  onChange={(e) => setAgree1(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span className="agreement-text">
                  [필수] Netflix 이용약관 및 개인정보 처리방침에 동의합니다.
                </span>
              </label>

              <label className="agreement-item">
                <input
                  type="checkbox"
                  className="agreement-checkbox" // ⭐ 이것도
                  checked={agree2}
                  onChange={(e) => setAgree2(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span className="agreement-text">
                  [필수] 본인의 개인 정보를 제3자에 제공하는 데에 동의합니다.
                </span>
              </label>
            </div>
          </section>

          <button
            className="payment-submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            멤버십 시작
          </button>
        </section>

        {/* 멤버십 변경 팝업 */}
        {isPopupOpen && (
          <div
            className="membership-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-popup-title"
          >
            <div className="membership-popup-content">
              <header className="popup-header">
                <h3 className="popup-title" id="membership-popup-title">
                  멤버십 변경
                </h3>
                <button
                  type="button"
                  className="popup-close-btn"
                  aria-label="닫기"
                  onClick={() => setIsPopupOpen(false)}
                >
                  ✕
                </button>
              </header>

              <div className="popup-section">
                <h4 className="popup-section-title">나의 멤버십</h4>

                <ul className="membership-list">
                  <li>
                    <label
                      className={`membership-item ${
                        tempSelectedMembership === "ad-standard" ? "active" : ""
                      }`}
                      onClick={() => setTempSelectedMembership("ad-standard")}
                    >
                      <span className="membership-name">광고형 스탠다드</span>
                    </label>
                  </li>

                  <li>
                    <label
                      className={`membership-item ${
                        tempSelectedMembership === "standard" ? "active" : ""
                      }`}
                      onClick={() => setTempSelectedMembership("standard")}
                    >
                      <span className="membership-name">스탠다드</span>
                    </label>
                  </li>

                  <li>
                    <label
                      className={`membership-item ${
                        tempSelectedMembership === "premium" ? "active" : ""
                      }`}
                      onClick={() => setTempSelectedMembership("premium")}
                    >
                      <span className="membership-name">프리미엄</span>
                    </label>
                  </li>
                </ul>

                <div className="popup-link-area">
                  <Link to="/member" className="membership-detail-link">
                    멤버십 자세히 보기
                  </Link>
                </div>
              </div>

              <button
                type="button"
                className="popup-confirm-btn"
                onClick={() => {
                  setSelectedMembership(tempSelectedMembership); // ⭐ 이 한 줄만 중요
                  setIsPopupOpen(false);
                }}
              >
                선택
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
