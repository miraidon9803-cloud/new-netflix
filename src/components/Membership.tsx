import "./scss/Membership.scss";

interface MembershipProps {
  onPrev?: () => void;
}
const Membership: React.FC<MembershipProps> = ({ onPrev }) => {
  return (
    <div className="inner-membership">
      <div className="membership-wrap">
        <div className="signtitle-wrap">
          <h2 className="title">원하는 멤버십을 선택하세요</h2>
          {onPrev && (
            <p className="prev-btn" onClick={onPrev}>
              dd
            </p>
          )}
        </div>

        <div className="membership-box">
          <ul className="option-list">
            <li>월 요금</li>
            <li>화질 / 음질</li>
            <li>해상도</li>
            <li>광고 포함</li>
            <li>지원 디바이스</li>
            <li>동시 시청수</li>
            <li>저장 디바이스</li>
            <li>광고</li>
          </ul>

          <div className="card-wrap">
            <div className="card active">
              <h3 className="card-title active">광고형 스탠다드</h3>
              <ul>
                <li>7,000원</li>
                <li>좋음</li>
                <li>1080p</li>
                <li>X</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>2</li>
                <li>2</li>
                <li>생각보다 적은 광고</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="card-title">스탠다드</h3>
              <ul>
                <li>13,500원</li>
                <li>좋음</li>
                <li>1080p</li>
                <li>광고 없음</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>2</li>
                <li>2</li>
                <li>광고 없음</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="card-title">프리미엄</h3>
              <ul>
                <li>17,000원</li>
                <li>가장 좋음</li>
                <li>4K UHD + HDR</li>
                <li>광고 없음</li>
                <li>TV, 컴퓨터, 스마트폰, 태블릿</li>
                <li>6</li>
                <li>6</li>
                <li>광고 없음</li>
              </ul>
            </div>
          </div>
        </div>

        <button className="next-btn">다음</button>
      </div>
    </div>
  );
};

export default Membership;
