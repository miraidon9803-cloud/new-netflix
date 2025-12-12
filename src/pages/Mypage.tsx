import MypageMain from "../components/MypageMain";
import ProfileSelect from "../components/ProfileSelect";

const Mypage = () => {
  // if (!user) {
  //   return <div>로그인 정보가 없습니다.</div>;
  // }

  return (
    <div className="inner-mypage">
      <ProfileSelect />
      <MypageMain />
    </div>
  );
};

export default Mypage;
