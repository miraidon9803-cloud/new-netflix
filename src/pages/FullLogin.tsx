import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Join from "../components/Join";
import Membership from "../components/Membership";
import { useAuthStore } from "../store/authStore";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const FullLogin: React.FC<StepProps> = () => {
  const isLogin = useAuthStore((s) => s.isLogin);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);

  // 🔹 step 상태
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (isLogin && !onboardingDone && step !== 3) {
      setStep(3);
    }
  }, [isLogin, onboardingDone, step]);

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
