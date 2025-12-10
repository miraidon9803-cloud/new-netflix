import { useAuthStore } from "../store/authStore";
import "./scss/join.scss";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const { onMember, joinForm, setJoinForm, resetJoinForm } = useAuthStore();
  const navigate = useNavigate();

  const handleJoinChange = (e) => {
    const { name, value } = e.target;
    setJoinForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();

    if (joinForm.password !== joinForm.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      await onMember(joinForm); // 회원가입
      alert("회원가입 성공!"); // 🔹 alert 정상 표시
      resetJoinForm();
      navigate("/login"); // 로그인 페이지 이동
    } catch (err) {
      console.error("JOIN ERROR:", err);
      alert("회원가입 실패: " + err.message);
    }
  };
  return (
    <div className="inner-join">
      <div className="join-wrap">
        <div className="join-content">
          <h3>SIGN</h3>
          <form onSubmit={handleJoinSubmit}>
            <p>이메일 주소</p>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                value={joinForm.email}
                onChange={handleJoinChange}
                placeholder="이메일 주소를 입력해주세요"
                required
              />
            </div>

            <p>비밀번호</p>
            <div className="input-wrap">
              <input
                type="password"
                name="password"
                onChange={handleJoinChange}
                value={joinForm.password}
                placeholder="영어,숫자,특수문자 조합 8~16자리"
                required
              />
            </div>

            <p>비밀번호 확인</p>
            <div className="input-wrap">
              <input
                type="password"
                name="passwordConfirm"
                value={joinForm.passwordConfirm}
                onChange={handleJoinChange}
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>

            <p>휴대폰번호를 입력해주세요</p>
            <div className="input-wrap">
              <input
                type="text"
                name="phone"
                value={joinForm.phone}
                onChange={handleJoinChange}
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
