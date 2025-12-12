import { useAuthStore } from "../store/authStore";

const Mypage = () => {
  const user = useAuthStore((state) => state.user);

  console.log(" Mypage user:", user);

  if (!user) {
    return <div>로그인 정보가 없습니다.</div>;
  }

  return (
    <div>
      <h2>마이페이지</h2>
      asfdasfdasfdasfdafdafd
      <div>이메일: {user?.email}</div>
      <div>전화번호: {user?.phone}</div>
      <div>이름: {user?.name}</div>
    </div>
  );
};

export default Mypage;
