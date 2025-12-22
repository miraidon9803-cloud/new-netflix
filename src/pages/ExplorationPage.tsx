import { useState } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Result from "../components/Result";
import SideNav from "../components/SideNav";

/* step 타입 */
type Step = 1 | 2 | 3 | 4;

const ExplorationPage = () => {
  /* 현재 단계 */
  const [step, setStep] = useState<Step>(1);

  /* Step에서 선택한 값들 */
  const [mood, setMood] = useState<string | null>(null);   // Step1
  const [flow, setFlow] = useState<string | null>(null);   // Step2
  const [tone, setTone] = useState<string | null>(null);   // Step3

  return (
    <main className="exploration-page">
      <SideNav />
      {/* STEP 1 */}
      {step === 1 && (
        <Step1
          onNext={(value) => {
            setMood(value);
            setStep(2);
          }}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Step2
          onNext={(value) => {
            setFlow(value);   // ⭐ 여기
            setStep(3);
          }}
          onPrev={() => setStep(1)}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Step3
          onNext={(value) => {
            setTone(value);   // ⭐ 여기
            setStep(4);
          }}
        />
      )}

      {/* RESULT */}
      {step === 4 && (
        <Result
          mood={mood}
          flow={flow}
          tone={tone}
        />
      )}
    </main>
  );
};

export default ExplorationPage;
