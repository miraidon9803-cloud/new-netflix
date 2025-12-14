import { useState } from 'react';
import './scss/MemberPopup.scss';

const MemberPopup = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('광고형 스탠다드');

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);  // 상태를 변경하여 선택된 항목을 업데이트
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    console.log('Selected Plan:', selectedPlan);
    // 실제 저장 로직을 여기서 처리

    // 저장 후 팝업을 닫음
    handleClose(); // 저장 버튼 클릭 시 팝업 닫기
  };

  return (
    <div className="member-inner">
      <div className="member-wrap">
        <div className="member-content">
          <div className="member-header">
            <h1>멤버십 설정</h1>
            <button onClick={handleClose} className="close">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="membership-options">
              <p>나의 멤버십</p>
              <div className="plan-selection">
                <label
                  className={selectedPlan === '광고형 스탠다드' ? 'active' : ''}
                  onClick={() => handleSelectPlan('광고형 스탠다드')}
                >
                  광고형 스탠다드
                </label>
                <label
                  className={selectedPlan === '스탠다드' ? 'active' : ''}
                  onClick={() => handleSelectPlan('스탠다드')}
                >
                  스탠다드
                </label>
                <label
                  className={selectedPlan === '프리미엄' ? 'active' : ''}
                  onClick={() => handleSelectPlan('프리미엄')}
                >
                  프리미엄
                </label>
              </div>
              <p className="details-btn">
                멤버십 자세히 보기
              </p>
            </div>

            <div className="payment-method">
              <p>결제 수단 변경</p>
              <p  className="change-payment-btn">
                삼성페이
              </p>
            </div>

            <div className="btn-wrap">
              <button type="button" className="cancel-btn" onClick={handleClose}>
                멤버십 해지
              </button>
              <button type="submit" className="save-btn">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberPopup;
