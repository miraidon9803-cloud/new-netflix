import React, { useState } from "react";
import Login from "../components/User/Login";
import Join from "../components/User/Join";
import Membership from "../components/Membership";
import Payment from "../components/User/Payment";
import Complete from "../components/User/Complete";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const FullLogin: React.FC<StepProps> = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  return (
    <div>
      {step === 1 && <Login onNext={() => setStep(2)} />}

      {step === 2 && (
        <Join onNext={() => setStep(3)} onPrev={() => setStep(1)} />
      )}

      {step === 3 && (
        <Membership onPrev={() => setStep(2)} onNext={() => setStep(4)} />
      )}

      {step === 4 && (
        <Payment onPrev={() => setStep(3)} onNext={() => setStep(5)} />
      )}

      {step === 5 && <Complete onPrev={() => setStep(4)} />}
    </div>
  );
};

export default FullLogin;
