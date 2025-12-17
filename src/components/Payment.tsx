import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

import "./scss/Payment.scss";

import { useNavigate, Link } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
              onClick={() => navigate(-1)}
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
              <h2 className="section-title">결제 수단</h2>

              <Swiper
                slidesPerView="auto"
                spaceBetween={12}
                grabCursor
                modules={[FreeMode]}
                freeMode={{
                  enabled: true,
                  momentum: true,
                  momentumRatio: 0.35,
                  momentumBounce: false,
                  minimumVelocity: 0.05,
                  sticky: true,
                }}
                resistanceRatio={0.85}
                touchRatio={0.9}
                speed={400}
                watchOverflow
                className="payment-swiper"
              >
                <SwiperSlide className="payment-slide">
                  <button type="button" className="payment-method active">
                    <img
                      src="/images/payment/logo_naverpay.png"
                      alt="네이버페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button type="button" className="payment-method">
                    <img
                      src="/images/payment/icon_kakaopay.png"
                      alt="카카오페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button type="button" className="payment-method">
                    <img
                      src="/images/payment/logo_samsungpay.png"
                      alt="삼성페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button type="button" className="payment-method">
                    <img
                      src="/images/payment/logo_tosspay.png"
                      alt="토스페이"
                    />
                  </button>
                </SwiperSlide>

                <SwiperSlide className="payment-slide">
                  <button type="button" className="payment-method payment-card">
                    <span className="payment-text">카드 결제</span>
                  </button>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* 선택된 멤버십 */}
            <div className="payment-membership">
              <h2 className="section-title">선택된 멤버십</h2>

              <div className="membership-summary">
                <div className="membership-info">
                  <span className="membership-price">매월 7,000원</span>
                  <span className="membership-name">광고형 스탠다드</span>
                </div>

                <button
                  type="button"
                  className="membership-change-btn"
                  onClick={() => setIsPopupOpen(true)}
                >
                  변경
                </button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="payment-agreement">
              <h2 className="section-title">약관 동의</h2>

              {/* 약관 1 */}
              <label className="agreement-item">
                <input type="checkbox" className="agreement-checkbox" />
                <span className="agreement-text">
                  [필수] Netflix 이용약관 및 개인정보 처리방침에 동의합니다.
                </span>
              </label>

              {/* 약관 2 */}
              <label className="agreement-item">
                <input type="checkbox" className="agreement-checkbox" />
                <span className="agreement-text">
                  [필수] 본인의 개인 정보를 제3자에 제공하는 데에 동의합니다.
                </span>
              </label>
            </div>
          </section>

          {/* 버튼 */}
          <button className="payment-submit">멤버십 시작</button>
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
              {/* 헤더 */}
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

              {/* 나의 멤버십 */}
              <section className="popup-section">
                <h4 className="popup-section-title">나의 멤버십</h4>

                <ul className="membership-list">
                  <li>
                    <label className="membership-item">
                      <input
                        type="radio"
                        name="membership"
                        value="ad-standard"
                        defaultChecked
                        className="membership-radio"
                      />
                      <span className="membership-name">광고형 스탠다드</span>
                    </label>
                  </li>

                  <li>
                    <label className="membership-item">
                      <input
                        type="radio"
                        name="membership"
                        value="standard"
                        className="membership-radio"
                      />
                      <span className="membership-name">스탠다드</span>
                    </label>
                  </li>

                  <li>
                    <label className="membership-item">
                      <input
                        type="radio"
                        name="membership"
                        value="premium"
                        className="membership-radio"
                      />
                      <span className="membership-name">프리미엄</span>
                    </label>
                  </li>
                </ul>
              </section>

              {/* 멤버십 자세히 보기 */}
              <div className="popup-link-area">
                <Link to="/member" className="membership-detail-link">
                  멤버십 자세히 보기
                </Link>
              </div>

              {/* 하단 버튼 */}
              <button type="button" className="popup-confirm-btn">
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
