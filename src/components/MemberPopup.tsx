import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import "./scss/MemberPopup.scss";

type AcountProps = {
  onClose: () => void;
};

const MemberPopup = ({ onClose }: AcountProps) => {
  const membership = useAuthStore((s) => s.user?.membership);
  const saveMembership = useAuthStore((s) => s.saveMembership);
  const cancelMembership = useAuthStore((s) => s.cancelMembership);

  const PLANS = {
    "광고형 스탠다드": {
      type: "adStandard",
      name: "광고형 스탠다드",
      price: 7000,
    },
    스탠다드: { type: "standard", name: "스탠다드", price: 13500 },
    프리미엄: { type: "premium", name: "프리미엄", price: 17000 },
  } as const;

  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>(
    (membership?.name as keyof typeof PLANS) ?? "광고형 스탠다드"
  );

  const [payment, setPayment] = useState<
    "삼성페이" | "네이버페이" | "카카오페이" | "토스페이"
  >("삼성페이");
  const [openPayment, setOpenPayment] = useState(false);

  const handleClose = () => onClose();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMembership(PLANS[selectedPlan]);
    handleClose();
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
                {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map(
                  (name) => (
                    <label
                      key={name}
                      className={selectedPlan === name ? "active" : ""}
                      onClick={() => setSelectedPlan(name)}
                    >
                      {name}
                    </label>
                  )
                )}
              </div>

              <p className="details-btn">멤버십 자세히 보기</p>
            </div>

            <div className="payment-method">
              <p>결제 수단 변경</p>

              <div className="payment-select">
                <p
                  className={`payment-btn ${openPayment ? "open" : ""}`}
                  onClick={() => setOpenPayment((v) => !v)}
                >
                  <div className="payment-title">
                    <span>{payment}</span>
                    <p>
                      <img src="/images/profile-arrow.png" alt="" />
                    </p>
                  </div>
                </p>

                {openPayment && (
                  <>
                    <div
                      className="dropdown-overlay"
                      onClick={() => setOpenPayment(false)}
                    />

                    <ul className="payment-list">
                      {(
                        [
                          "삼성페이",
                          "네이버페이",
                          "카카오페이",
                          "토스페이",
                        ] as const
                      ).map((p) => (
                        <li key={p}>
                          <p
                            className={payment === p ? "active" : ""}
                            onClick={() => {
                              setPayment(p);
                              setOpenPayment(false);
                            }}
                          >
                            {p}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="btn-wrap">
              <button
                type="button"
                className="cancel-btn"
                onClick={async () => {
                  const ok = window.confirm("정말 멤버십을 해지하시겠습니까?");
                  if (!ok) return;
                  await cancelMembership();
                  onClose();
                }}
              >
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
