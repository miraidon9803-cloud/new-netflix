import "./scss/Cspopup.scss";
type CsProps = {
  onClose: () => void;
};

const CSpopup = ({ onClose }: CsProps) => {
  const handleClose = () => onClose();
  return (
    <div className="cs-wrap">
      <div className="cs-popup">
        <div className="inner">
          <div className="first-wrap">
            <div className="top-wrap">
              <h1 className="cs-title">고객센터</h1>
              <button onClick={handleClose} className="close-btn">
                <img src="/images/icon/AppPopup-close.png" alt="앱 설정 닫기" />
              </button>
            </div>
            <div className="middle-wrap">
              <div className="icon-box">
                <img src="/images/icon/netflix-csicon.png" alt="net-icon" />
              </div>
              <div className="right-wrap">
                <h2>Netflix</h2>
                <p className="text-box">
                  안녕하세요. 고객센터입니다. <br />
                  채팅 상담은 월~금 10:00~17:00(한국 시간) 운영됩니다. <br />
                  상담 시간이 아닐 경우 답변이 지연될 수 있습니다. <br />
                  전화 상담 : 00-308-321-0161
                </p>
                <p className="text-box">어떻게 도와드릴까요?</p>
                <div className="fast-btn">
                  <p>비밀번호 재설정</p>
                  <p>로그인 문제</p>
                  <p>멤버십 변경</p>
                  <p>결제 수단 변경</p>
                  <p>넷플릭스의 자녀 보호 기능</p>
                </div>
                <div className="time">
                  <p> 오후 4:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-wrap">
            <input type="text" placeholder="메세지를 입력해주세요" />
            <button>전송</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSpopup;
