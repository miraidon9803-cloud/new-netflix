import React, { useState } from "react";
import Login from "../components/Login";
import Join from "../components/Join";
import Membership from "../components/Membership";

// Login, Join, Membership 컴포넌트에서 받을 props 타입 정의
interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const FullLogin: React.FC<StepProps> = () => {
  // 1 = 로그인, 2 = 회원가입, 3 = 멤버십
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div>
      {step === 1 && <Login onNext={() => setStep(2)} />}

      {step === 2 && (
        <Join onNext={() => setStep(3)} onPrev={() => setStep(1)} />
      )}

      {step === 3 && <Membership onPrev={() => setStep(2)} />}
    </div>
  );
};

export default FullLogin;
