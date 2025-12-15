
import "./scss/Acount.scss";

const Acount = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <div className="acount-inner">
      <div className="acount-wrap">
        <div className="acount-content">
          <div className="acount-header">
            <h1>계정</h1>
            <button className="close" onClick={handleClose}>
              ✕
            </button>
          </div>

          <form>
            <p>이메일 주소</p>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                placeholder="이메일 주소를 입력해주세요"

                required
              />
            </div>

            <p>비밀번호</p>
            <div className="input-wrap">
              <input
                type="password"
                name="password"
                placeholder="영어,숫자,특수문자 조합 8~16자리"


                required
              />
            </div>

            <p>비밀번호 확인</p>
            <div className="input-wrap">
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>

            <p>휴대폰번호를 입력해주세요</p>
            <div className="input-wrap">
              <input
                type="text"
                name="phone"
                placeholder="- 없이 숫자만 입력해주세요"
                required
              />
            </div>
            <div className="btn-wrap">
              <button type="submit" className="del btn">
                탈퇴하기
              </button>

              <button type="submit" className="submit btn">
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );


}

export default Acount
