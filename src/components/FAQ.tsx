import { useState, useId } from "react";
import "./scss/FAQ.scss";

/* 타입 */
interface ReasonItem {
  title: string;
  desc: string;
  icon: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

/* 가입 이유 카드 데이터 */
const reasonList: ReasonItem[] = [
  {
    title: "당신의 취향을 잘 아는 추천 시스템",
    desc:
      "당신의 시청 기록과 선호 패턴을 분석해 꼭 맞는 콘텐츠를 자동으로 추천합니다. 고민 없이 취향에 맞는 작품을 바로 만나볼 수 있습니다.",
    icon: "/images/target_icon.png",
  },
  {
    title: "언제 어디서든 끊김 없는 시청",
    desc:
      "TV·모바일·PC 등 어떤 기기에서도 이어서 시청할 수 있고, 다운로드 기능으로 오프라인에서도 편하게 감상할 수 있습니다.",
    icon: "/images/play_icon.png",
  },
  {
    title: "여기서만 볼 수 있는 오리지널 작품",
    desc:
      "독점 시리즈와 영화가 꾸준히 업데이트되며, 전 세계에서 화제가 되는 작품들을 가장 빠르게 즐길 수 있습니다.",
    icon: "/images/gift_icon.png",
  },
  {
    title: "가족 모두가 안심하는 시청 환경",
    desc:
      "프로필마다 취향이 반영되어 개인화된 추천을 받을 수 있으며, 키즈 모드는 등급 제한을 통해 안전한 콘텐츠만 노출됩니다.",
    icon: "/images/sheild_icon.png",
  },
];

/* FAQ 데이터 */
const faqList: FaqItem[] = [
  {
    question: "넷플릭스에서 어떤 콘텐츠를 시청할 수 있나요?",
    answer:
      `넷플릭스는 장편 영화, 다큐멘터리, 시리즈, 애니메이션, 각종 상을 수상한 넷플릭스 오리지널 등 수많은 콘텐츠를 확보하고 있습니다. 마음에 드는 콘텐츠를 원하는 시간에 원하는 
      만큼 시청하실 수 있습니다.
`,
  },
  {
    question: "넷플릭스란 무엇인가요?",
    answer:
      `넷플릭스는 각종 수상 경력에 빛나는 시리즈, 영화, 애니메이션, 다큐멘터리 등 다양한 콘텐츠를 인터넷 연결이 가능한 수천 종의 디바이스에서 시청할 수 있는 스트리밍 서비스입니다.
저렴한 월 요금으로 원하는 시간에 원하는 만큼 즐길 수 있습니다. 무궁무진한 콘텐츠가 준비되어 있으며 매주 새로운 시리즈와 영화가 제공됩니다.`,
  },
  {
    question: "넷플릭스 요금은 얼마인가요?",
    answer:
      `스마트폰, 태블릿, 스마트 TV, 노트북, 스트리밍 디바이스 등 다양한 디바이스에서 월정액 요금 하나로 넷플릭스를 시청하세요. 월 요금은 7,000원부터 17,000원까지 다양합니다.`,
  },
  {
    question: "어디서 시청할 수 있나요?",
    answer:
      `언제 어디서나 시청할 수 있습니다. 넷플릭스 계정으로 로그인하면 PC에서 netflix.com을 통해 바로 시청할 수 있으며, 인터넷이 연결되어 있고 넷플릭스 앱을 지원하는 디바이스
      (스마트 TV, 스마트폰, 태블릿, 스트리밍 미디어 플레이어, 게임 콘솔 등)에서도 언제든지 시청할 수 있습니다.

iOS 또는 Android용 앱에서는 좋아하는 시리즈를 저장할 수도 있습니다. 저장 기능을 이용해 이동 중이나 인터넷에 연결할 수 없는 곳에서도 시청하세요. 
넷플릭스는 어디서든 함께니까요.`,
  },
  {
    question: "멤버십을 해지하려면 어떻게 하나요?",
    answer:
      `넷플릭스는 부담 없이 간편합니다. 멤버십 해지도 온라인에서 클릭 두 번이면 완료할 수 있습니다. 해지 수수료도 없으니 원할 때 언제든 계정을 시작하거나 종료하세요.`,
  },
  {
    question: "아이들이 넷플릭스를 봐도 좋을까요?",
    answer:
      `멤버십에 넷플릭스 키즈 환경이 포함되어 있어 자녀가 자기만의 공간에서 가족용 시리즈와 영화를 즐기는 동안 부모가 이를 관리할 수 있습니다.
키즈 프로필과 더불어 PIN 번호를 이용한 자녀 보호 기능도 있어, 자녀가 시청할 수 있는 콘텐츠의 관람등급을 제한하고 자녀의 시청을 원치 않는 특정 작품을 차단할 수도 있습니다.`,
  },
];

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const uid = useId();

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="faq">
      {/* 가입 이유 */}
      <div className="faq-wrap">
        <h2 className="faq_title">가입해야 하는 또 다른 이유</h2>

        <div className="faq_reasons">
          {reasonList.map((item, idx) => (
            <article className="faq_card" key={idx}>
              <div className="faq_cardContent">
                <h3 className="faq_cardTitle">{item.title}</h3>
                <p className="faq_cardDesc">{item.desc}</p>
              </div>

              <img
                src={item.icon}
                alt=""
                className="faq_cardIcon"
              />
            </article>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-wrap">
        <h2 className="faq_title">자주 묻는 질문</h2>

        <ul className="faq_list">
          {faqList.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            const panelId = `${uid}-faq-${idx}`;

            return (
              <li
                key={idx}
                className={`faq_item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  className="faq_question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFaq(idx)}
                >
                  <span>{item.question}</span>
                  <img
                    src={isOpen ? "/images/minus.png" : "/images/plus.png"}
                    alt=""
                    className="faq_icon"
                  />
                </button>

                <div id={panelId} className="faq_answer">
                  <p>{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
