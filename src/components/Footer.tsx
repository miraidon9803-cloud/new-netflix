import "./scss/Footer.scss";
const Footer = () => {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="inner">
          <div className="footer-left">
            <ul>
              <li>
                <a href="#">고객센터</a>
              </li>
              <li>
                <a href="#">법적고지</a>
              </li>
              <li>
                <a href="#">쿠키설정</a>
              </li>
              <li>
                <a href="#">이용약관</a>
              </li>
            </ul>
            <address>
              <span>
              넷플릭스서비시스코리아 유한회사 | 통신판매업신고번호:
              제2018-서울종로-0426호 | 사업자등록번호: 165-87-00119 |
              전화번호: 00-308-321-0161
              </span>
              <br/>
              <span>
              대표: 레지널드 숀 톰프슨 | 이메일 주소: korea@netflix.com |
              주소: 대한민국 서울특별시 종로구 우정국로 26, 센트로폴리스 A동
              20층 우편번호 03161
              </span>
            </address>
            <div className="sns-list">
              <a href="https://www.instagram.com/netflixkr/" target="_blank">
                <img src="/images/instagram.svg" alt="instagram" />
              </a>
              <a href="https://x.com/NetflixKR" target="_blank">
                <img src="/images/twitter.svg" alt="twitter" />
              </a>
              <a href="https://www.youtube.com/channel/UCiEEF51uRAeZeCo8CJFhGWw" target="_blank">
                <img src="/images/youtube.svg" alt="youtube" />
              </a>
              <a href="https://www.facebook.com/NetflixKR/about/" target="_blank">
                <img src="/images/facebook.svg" alt="facebook" />
              </a>
            </div>
          </div>
          <div className="footer-right">
            <img src="/images/logo-white.svg" alt="Netflix-footer-logo" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
