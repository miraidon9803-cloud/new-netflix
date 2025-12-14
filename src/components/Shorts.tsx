import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SideNav from './SideNav';
import Footer from './Footer';
import './scss/Shorts.scss';

// 영상 데이터 타입
interface ShortsData {
  id: number;
  videoSrc: string;
  title: string;
  series: string;
  views: number;
  label?: string;
  hasNetflixBadge?: boolean;
}

// 영상 데이터 (public/videos/shorts/ 폴더 기준)
const shortsData: ShortsData[] = [
  {
    id: 1,
    videoSrc: '/videos/shorts/이름은 언제나 빨간색으로 _ 웬즈데이 시즌2.mp4',
    title: '이름은 언제나 빨간색으로',
    series: '웬즈데이 시즌2',
    views: 779,
    label: '웬즈데이 시즌2',
    hasNetflixBadge: true,
  },
  {
    id: 2,
    videoSrc: '/videos/shorts/절대 숨을 쉬면 안 돼 기묘한 이야기 시즌5 넷플릭스.mp4',
    title: '절대 숨을 쉬면 안 돼',
    series: '기묘한 이야기 시즌5',
    views: 1243,
    label: '',
    hasNetflixBadge: false,
  },
  {
    id: 3,
    videoSrc: '/videos/shorts/착한사람 눈에만 보이는 현실판 다 이루어질지니.mp4',
    title: '착한사람 눈에만 보이는',
    series: '다 이루어질지니',
    views: 892,
    label: '다이루어질지니',
    hasNetflixBadge: true,
  },
  {
    id: 4,
    videoSrc: '/videos/shorts/넌 진짜 또라X야, 알아_ _ 사마귀.mp4',
    title: '넌 진짜 또라X야, 알아',
    series: '사마귀',
    views: 567,
    label: '사마귀',
    hasNetflixBadge: true,
  },
  {
    id: 5,
    videoSrc: '/videos/shorts/수상하게 연장이 잘 어울리는 이장님 _ 크라임씬 제로.mp4',
    title: '수상하게 연장이 잘 어울리는 이장님',
    series: '크라임씬 제로 1',
    views: 2105,
    label: '크라임씬',
    hasNetflixBadge: true,
  },
  {
    id: 6,
    videoSrc: '/videos/shorts/이준혁의 한 방에 무너지는 공명 _ 광장.mp4',
    title: '이준혁의 한 방에 무너지는 공명',
    series: '광장',
    views: 1876,
    label: '광장',
    hasNetflixBadge: false,
  },
  {
    id: 7,
    videoSrc: '/videos/shorts/영화 《굿뉴스》10월 17일 공개 _ 넷플릭스.mp4',
    title: '10월 17일 공개',
    series: '굿뉴스',
    views: 3421,
    label: '',
    hasNetflixBadge: false,
  },
  {
    id: 8,
    videoSrc: '/videos/shorts/오겜 새로운 중독송 등장 _ 오징어 게임 시즌3.mp4',
    title: '오겜 새로운 중독송 등장',
    series: '오징어 게임 시즌3',
    views: 5678,
    label: '오징어게임3',
    hasNetflixBadge: true,
  },
  {
    id: 9,
    videoSrc: '/videos/shorts/딸은 뺏기고, 방어는 안 잡히고 _ 폭싹 속았수다.mp4',
    title: '딸은 뺏기고, 방어는 안 잡히고',
    series: '폭싹 속았수다',
    views: 4532,
    label: '',
    hasNetflixBadge: false,
  },
];

// SVG 아이콘 컴포넌트들
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ transform: 'rotate(180deg)' }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5644 25.4356C13.9786 24.8499 13.9786 23.9001 14.5644 23.3143L20.2537 17.625L14.5644 11.9356C13.9786 11.3499 13.9786 10.4001 14.5644 9.81433C15.1501 9.22855 16.0999 9.22855 16.6857 9.81435L23.4357 16.5643C23.717 16.8457 23.875 17.2272 23.875 17.625C23.875 18.0229 23.717 18.4044 23.4357 18.6856L16.6857 25.4356C16.0999 26.0214 15.1501 26.0214 14.5644 25.4356Z" fill="white"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5644 25.4356C13.9786 24.8499 13.9786 23.9001 14.5644 23.3143L20.2537 17.625L14.5644 11.9356C13.9786 11.3499 13.9786 10.4001 14.5644 9.81433C15.1501 9.22855 16.0999 9.22855 16.6857 9.81435L23.4357 16.5643C23.717 16.8457 23.875 17.2272 23.875 17.625C23.875 18.0229 23.717 18.4044 23.4357 18.6856L16.6857 25.4356C16.0999 26.0214 15.1501 26.0214 14.5644 25.4356Z" fill="white"/>
  </svg>
);

const LikeIcon = ({ size = 36 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 36 36" fill="none">
    <path d="M3.14052 16.6299C3.0643 15.7535 3.75517 15 4.63488 15H7.49878C8.32723 15 8.99878 15.6716 8.99878 16.5V30.75C8.99878 31.5784 8.32723 32.25 7.49878 32.25H5.874C5.09595 32.25 4.44705 31.6551 4.37964 30.8801L3.14052 16.6299Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 16.0309C13.5 15.4041 13.8895 14.8431 14.4565 14.5759C15.6928 13.9931 17.7998 12.8204 18.75 11.2354C19.9749 9.19268 20.2057 5.50197 20.2434 4.65659C20.2486 4.53825 20.2452 4.41977 20.2615 4.30242C20.4645 2.83835 23.2907 4.54869 24.375 6.35709C24.9635 7.33854 25.0389 8.628 24.9771 9.63473C24.9108 10.7119 24.5949 11.7524 24.2851 12.7862L23.625 14.9884H31.7676C32.7624 14.9884 33.4817 15.9388 33.2112 16.896L29.1835 31.1577C29.001 31.8037 28.4113 32.25 27.7399 32.25H15C14.1716 32.25 13.5 31.5784 13.5 30.75V16.0309Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DislikeIcon = ({ size = 36 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 36 36" fill="none">
    <path d="M32.8595 19.3701C32.9357 20.2465 32.2448 21 31.3651 21L28.5012 21C27.6728 21 27.0012 20.3284 27.0012 19.5L27.0012 5.25C27.0012 4.42155 27.6728 3.75 28.5012 3.75L30.126 3.75C30.9041 3.75 31.553 4.3449 31.6204 5.11995L32.8595 19.3701Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.5 19.9691C22.5 20.5959 22.1105 21.1569 21.5435 21.4241C20.3072 22.007 18.2003 23.1797 17.25 24.7646C16.0251 26.8073 15.7943 30.498 15.7566 31.3434C15.7514 31.4617 15.7548 31.5802 15.7385 31.6976C15.5355 33.1617 12.7094 31.4513 11.625 29.6429C11.0366 28.6615 10.9611 27.372 11.0229 26.3653C11.0892 25.2881 11.4051 24.2476 11.7149 23.2138L12.375 21.0116L4.2324 21.0116C3.2376 21.0116 2.51835 20.0612 2.7888 19.104L6.81645 4.8423C6.999 4.19625 7.58865 3.75 8.26005 3.75L21 3.75C21.8285 3.75 22.5 4.42155 22.5 5.25L22.5 19.9691Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = ({ size = 36 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 29 23" fill="none">
    <path d="M28.0003 10.5385L13.6003 1V6.4C1 9.09999 1 21.7 1 21.7C1 21.7 6.4 14.5 13.6003 15.4V20.98L28.0003 10.5385Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 5V19L19 12L8 5Z" fill="black"/>
  </svg>
);

const SortIcon = () => (
  <div className="sort-icon-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14" fill="none">
      <path d="M5 13L5 1L1 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14" fill="none">
      <path d="M0.999999 1L1 13L5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// 모바일 헤더 아이콘
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9.33333 20.0909C10.041 20.6562 10.9755 21 12 21C13.0245 21 13.959 20.6562 14.6667 20.0909M4.50763 17.1818C4.08602 17.1818 3.85054 16.5194 4.10557 16.1514C4.69736 15.2975 5.26855 14.0451 5.26855 12.537L5.29296 10.3517C5.29296 6.29145 8.29581 3 12 3C15.7588 3 18.8058 6.33993 18.8058 10.4599L18.7814 12.537C18.7814 14.0555 19.3329 15.3147 19.9006 16.169C20.1458 16.5379 19.9097 17.1818 19.4933 17.1818H4.50763Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="white"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z" fill="white"/>
    <path d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z" fill="white"/>
    <path d="M5 11C4.4477 11 4 11.4477 4 12C4 12.5523 4.4477 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z" fill="white"/>
  </svg>
);

const Shorts: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'alphabetical'>('latest');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [sortedData, setSortedData] = useState<ShortsData[]>(shortsData);
  
  // 플레이어 모드 상태
  const [viewMode, setViewMode] = useState<'grid' | 'player'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const playerVideoRef = useRef<HTMLVideoElement>(null);

  // 정렬 처리
  useEffect(() => {
    if (sortOrder === 'latest') {
      setSortedData([...shortsData]);
    } else {
      const sorted = [...shortsData].sort((a, b) => 
        a.title.localeCompare(b.title, 'ko')
      );
      setSortedData(sorted);
    }
  }, [sortOrder]);

  // ESC 키로 플레이어 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'player') {
        closePlayer();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // 플레이어 모드에서 영상 재생 및 진행률 업데이트
  useEffect(() => {
    if (viewMode === 'player' && playerVideoRef.current) {
      playerVideoRef.current.play();
      
      const updateProgress = () => {
        if (playerVideoRef.current) {
          const { currentTime, duration } = playerVideoRef.current;
          setProgress((currentTime / duration) * 100);
        }
      };
      
      const video = playerVideoRef.current;
      video.addEventListener('timeupdate', updateProgress);
      
      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [viewMode, currentIndex]);

  // 정렬 토글
  const toggleSort = () => {
    setSortOrder(prev => prev === 'latest' ? 'alphabetical' : 'latest');
  };

  // 카드 클릭 → 플레이어 모드
  const openPlayer = (index: number) => {
    setCurrentIndex(index);
    setViewMode('player');
    setProgress(0);
  };

  // 플레이어 닫기
  const closePlayer = () => {
    setViewMode('grid');
    setProgress(0);
    if (playerVideoRef.current) {
      playerVideoRef.current.pause();
    }
  };

  // 배경 클릭으로 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePlayer();
    }
  };

  // 이전 영상 (순환)
  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? sortedData.length - 1 : prev - 1));
    setProgress(0);
  }, [sortedData.length]);

  // 다음 영상 (순환)
  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev === sortedData.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [sortedData.length]);

  // 영상 종료 시 다음 영상 자동 재생
  const handleVideoEnded = () => {
    goNext();
  };

  // 이전/다음 인덱스 계산
  const prevIndex = currentIndex === 0 ? sortedData.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === sortedData.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="shorts-page">
      {/* 사이드 네비게이션 (1440px 초과에서만 표시) */}
      <div className="shorts-sidenav">
        <SideNav />
      </div>

      {/* 430px 이하 전용 헤더 */}
      <header className="shorts-mobile-header">
        <h1 className="shorts-mobile-title">쇼츠</h1>
        <div className="shorts-mobile-icons">
          <button className="icon-btn" aria-label="알림">
            <BellIcon />
          </button>
          <button className="icon-btn" aria-label="검색">
            <SearchIcon />
          </button>
          <button className="icon-btn" aria-label="메뉴">
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="shorts-content">
        {/* 헤더 영역 */}
        <div className="shorts-header">
          <h1 className="shorts-title">쇼츠</h1>
          <button className="sort-btn" onClick={toggleSort}>
            {sortOrder === 'latest' ? '최신순' : '가나다순'}
            <SortIcon />
          </button>
        </div>

        {/* 그리드 모드 */}
        {viewMode === 'grid' && (
          <div className="shorts-grid">
            {sortedData.map((item, index) => (
              <div 
                className={`shorts-card ${hoveredCard === item.id ? 'hovered' : ''}`}
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => openPlayer(index)}
              >
                <div className="card-video-wrapper">
                  {/* 비디오/썸네일 */}
                  <video
                    className="card-video"
                    src={item.videoSrc}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  />
                </div>

                {/* 카드 정보 */}
                <div className="card-info">
                  <p className="card-title-text">
                    {item.title} <span className="card-series">| {item.series}</span>
                  </p>
                  {/* 조회수 - 호버 시에만 표시 */}
                  <p className={`card-views ${hoveredCard === item.id ? 'visible' : ''}`}>
                    조회수 {item.views.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 플레이어 모드 */}
        {viewMode === 'player' && (
          <div className="player-overlay" onClick={handleOverlayClick}>
            <div className="player-container">
              {/* 좌측 화살표 (430px 이하에서 숨김) */}
              <button className="player-arrow player-arrow-left" onClick={goPrev}>
                <ArrowLeftIcon />
              </button>

              {/* 이전 카드 (430px 이하에서 숨김) */}
              <div className="player-card player-card-prev" onClick={goPrev}>
                <video
                  className="player-video-side"
                  src={sortedData[prevIndex].videoSrc}
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              {/* 현재 카드 (메인) */}
              <div className="player-card player-card-current">
                <video
                  ref={playerVideoRef}
                  className="player-video-main"
                  src={sortedData[currentIndex].videoSrc}
                  muted
                  playsInline
                  preload="metadata"
                  onEnded={handleVideoEnded}
                />

                {/* 액션 버튼들 */}
                <div className="player-actions">
                  <button className="action-btn">
                    <LikeIcon />
                    <span>1만</span>
                  </button>
                  <button className="action-btn">
                    <DislikeIcon />
                    <span>싫어요</span>
                  </button>
                  <button className="action-btn">
                    <ShareIcon />
                    <span>공유</span>
                  </button>
                </div>

                {/* 하단 정보 */}
                <div className="player-info">
                  <p className="player-title">
                    {sortedData[currentIndex].title} | {sortedData[currentIndex].series}
                  </p>
                  <button className="watch-btn">
                    <PlayIcon />
                    <span>보러가기</span>
                  </button>
                </div>

                {/* 진행바 */}
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* 다음 카드 (430px 이하에서 숨김) */}
              <div className="player-card player-card-next" onClick={goNext}>
                <video
                  className="player-video-side"
                  src={sortedData[nextIndex].videoSrc}
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              {/* 우측 화살표 (430px 이하에서 숨김) */}
              <button className="player-arrow player-arrow-right" onClick={goNext}>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer (1441px 이상에서 표시) */}
      <div className="shorts-footer">
        <Footer />
      </div>

      {/* 하단 네비게이션 (1440px 이하에서 표시) */}
      <nav className="shorts-bottom-nav">
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/바로가기.png" alt="" />
          <span>바로가기</span>
        </Link>
        <Link to="/shorts" className="bottom-nav-item active">
          <img src="/images/icon/쇼츠.png" alt="" />
          <span>쇼츠</span>
        </Link>
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/홈.png" alt="" />
          <span>홈</span>
        </Link>
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/위시리스트.png" alt="" />
          <span>좋아요</span>
        </Link>
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/보관함.png" alt="" />
          <span>보관함</span>
        </Link>
      </nav>
    </div>
  );
};

export default Shorts;