import "./scss/join.scss";

const Join = () => {
  return (
    <div className="inner-join">
      <div className="join-wrap">
        <div className="join-content">
          <h3>SIGN</h3>
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
                name="password"
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

            <button type="submit" className="next-btn">
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
