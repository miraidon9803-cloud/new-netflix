import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideNav from './SideNav';
import Footer from './Footer';
import type { FolderData, SortOrder } from '../types/search';
import './scss/Wishlist.scss';

// 초기 폴더 데이터
const initialFolders: FolderData[] = [
  { id: 1, name: '이번 주말용', createdAt: new Date('2024-12-01'), itemCount: 5 },
  { id: 2, name: '정주행 미드', createdAt: new Date('2024-12-03'), itemCount: 12 },
  { id: 3, name: '심심할 때 보기', createdAt: new Date('2024-12-05'), itemCount: 8 },
  { id: 4, name: '코난 극장판', createdAt: new Date('2024-12-07'), itemCount: 23 },
  { id: 5, name: '그레이 아나토미', createdAt: new Date('2024-12-10'), itemCount: 3 },
];

// SVG 아이콘 컴포넌트들
const SortIcon: React.FC = () => (
  <div className="sort-icon-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14" fill="none">
      <path d="M5 13L5 1L1 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14" fill="none">
      <path d="M0.999999 1L1 13L5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const PlusIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M5.625 18H30.375" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 5.625V30.375" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M17.2071 9.04289C16.8166 8.65237 16.1834 8.65237 15.7929 9.0429L12 12.8358L8.2071 9.04289C7.81658 8.65237 7.18341 8.65237 6.79289 9.0429C6.40237 9.43342 6.40237 10.0666 6.7929 10.4571L11.2929 14.9571C11.4805 15.1446 11.7348 15.25 12 15.25C12.2653 15.25 12.5196 15.1446 12.7071 14.9571L17.2071 10.4571C17.5976 10.0666 17.5976 9.43341 17.2071 9.04289Z" fill="white"/>
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 폴더 SVG 컴포넌트
const FolderIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="173" viewBox="0 0 244 180" fill="none">
    <mask id="path-1-inside-1_folder" fill="white">
      <path d="M78 0C78.4566 3.39158e-06 78.9086 0.0201239 79.3555 0.0576172C84.0592 0.372337 86.8118 1.92678 88.5127 3.16602C91.9894 5.69907 100.453 11.9214 104.947 14.248C107.95 15.8025 111.95 16.3151 114.943 16.4639H216C224.837 16.4639 232 23.6273 232 32.4639V157.041C232 165.878 224.837 173.041 216 173.041H28.0273C19.1909 173.041 12.0273 165.877 12.0273 157.041V42.9287C12.0098 42.6214 12 42.3118 12 42V16C12 7.16345 19.1634 0 28 0H78Z"/>
    </mask>
    <path d="M78 0C78.4566 3.39158e-06 78.9086 0.0201239 79.3555 0.0576172C84.0592 0.372337 86.8118 1.92678 88.5127 3.16602C91.9894 5.69907 100.453 11.9214 104.947 14.248C107.95 15.8025 111.95 16.3151 114.943 16.4639H216C224.837 16.4639 232 23.6273 232 32.4639V157.041C232 165.878 224.837 173.041 216 173.041H28.0273C19.1909 173.041 12.0273 165.877 12.0273 157.041V42.9287C12.0098 42.6214 12 42.3118 12 42V16C12 7.16345 19.1634 0 28 0H78Z" fill="#D2D2D2"/>
    <path d="M78 0L78 -1H78V0ZM79.3555 0.0576172L79.2719 1.05412L79.2803 1.05482L79.2887 1.05539L79.3555 0.0576172ZM88.5127 3.16602L89.1016 2.35778L89.1016 2.35778L88.5127 3.16602ZM104.947 14.248L104.488 15.1361L104.488 15.1361L104.947 14.248ZM114.943 16.4639L114.894 17.4626L114.919 17.4639H114.943V16.4639ZM216 16.4639L216 15.4639H216V16.4639ZM28.0273 173.041L28.0273 174.041H28.0273V173.041ZM12.0273 42.9287H13.0273V42.9001L13.0257 42.8716L12.0273 42.9287ZM12 16L11 16V16H12ZM78 0L78 1C78.4272 1 78.8513 1.01883 79.2719 1.05412L79.3555 0.0576172L79.4391 -0.938882C78.9659 -0.978581 78.486 -0.999996 78 -1L78 0ZM79.3555 0.0576172L79.2887 1.05539C83.771 1.35529 86.3464 2.82497 87.9238 3.97425L88.5127 3.16602L89.1016 2.35778C87.2772 1.02859 84.3475 -0.610613 79.4222 -0.940152L79.3555 0.0576172ZM88.5127 3.16602L87.9238 3.97425C91.363 6.47997 99.9069 12.7649 104.488 15.1361L104.947 14.248L105.407 13.36C100.999 11.078 92.6158 4.91816 89.1016 2.35778L88.5127 3.16602ZM104.947 14.248L104.488 15.1361C107.69 16.7937 111.87 17.3124 114.894 17.4626L114.943 16.4639L114.993 15.4651C112.03 15.3179 108.211 14.8113 105.407 13.36L104.947 14.248ZM114.943 16.4639V17.4639H216V16.4639V15.4639H114.943V16.4639ZM216 16.4639L216 17.4639C224.284 17.4639 231 24.1796 231 32.4639H232H233C233 23.075 225.389 15.4639 216 15.4639L216 16.4639ZM232 32.4639H231V157.041H232H233V32.4639H232ZM232 157.041H231C231 165.325 224.284 172.041 216 172.041V173.041V174.041C225.389 174.041 233 166.43 233 157.041H232ZM216 173.041V172.041H28.0273V173.041V174.041H216V173.041ZM28.0273 173.041L28.0274 172.041C19.7432 172.041 13.0273 165.325 13.0273 157.041H12.0273H11.0273C11.0273 166.43 18.6387 174.041 28.0273 174.041L28.0273 173.041ZM12.0273 157.041H13.0273V42.9287H12.0273H11.0273V157.041H12.0273ZM12.0273 42.9287L13.0257 42.8716C13.0091 42.5814 13 42.2909 13 42H12H11C11 42.3326 11.0104 42.6613 11.029 42.9859L12.0273 42.9287ZM12 42H13V16H12H11V42H12ZM12 16L13 16C13 7.71573 19.7157 1 28 1V0V-1C18.6112 -1 11 6.61116 11 16L12 16ZM28 0V1H78V0V-1H28V0Z" fill="white" mask="url(#path-1-inside-1_folder)"/>
    <path d="M144.139 100.971L111.739 81.2629C111.466 81.0969 111.154 81.0063 110.834 81.0003C110.514 80.9944 110.199 81.0733 109.92 81.229C109.641 81.3847 109.408 81.6116 109.247 81.8863C109.085 82.161 109 82.4735 109 82.7919V122.208C109 122.527 109.085 122.839 109.247 123.114C109.408 123.388 109.641 123.615 109.92 123.771C110.199 123.927 110.514 124.006 110.834 124C111.154 123.994 111.466 123.903 111.739 123.737L144.139 104.029C144.402 103.869 144.619 103.644 144.77 103.376C144.921 103.109 145 102.807 145 102.5C145 102.193 144.921 101.891 144.77 101.623C144.619 101.356 144.402 101.131 144.139 100.971Z" fill="url(#paint0_radial_folder)"/>
    <foreignObject x="0" y="14" width="244" height="169">
      <div style={{backdropFilter: 'blur(5px)', clipPath: 'url(#bgblur_folder_clip_path)', height: '100%', width: '100%'}}></div>
    </foreignObject>
    <g filter="url(#filter0_d_folder)">
      <rect x="12" y="31" width="220" height="142" rx="16" fill="url(#paint1_linear_folder)" fillOpacity="0.6" shapeRendering="crispEdges"/>
      <rect x="12.5" y="31.5" width="219" height="141" rx="15.5" stroke="white" shapeRendering="crispEdges"/>
    </g>
    <defs>
      <filter id="filter0_d_folder" x="0" y="14" width="244" height="169" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="-5"/>
        <feGaussianBlur stdDeviation="6"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_folder"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_folder" result="shape"/>
      </filter>
      <clipPath id="bgblur_folder_clip_path" transform="translate(0 -14)">
        <rect x="12" y="31" width="220" height="142" rx="16"/>
      </clipPath>
      <radialGradient id="paint0_radial_folder" cx="0" cy="0" r="1" gradientTransform="matrix(12.566 19.436 -16.272 10.7933 116.642 96.48)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E50914"/>
        <stop offset="0.87431" stopColor="#B20710"/>
      </radialGradient>
      <linearGradient id="paint1_linear_folder" x1="12" y1="31" x2="232.435" y2="172.321" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E9E9E9"/>
        <stop offset="1" stopColor="#CDCDCD"/>
      </linearGradient>
    </defs>
  </svg>
);

// 모바일 헤더 아이콘
const BellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9.33333 20.0909C10.041 20.6562 10.9755 21 12 21C13.0245 21 13.959 20.6562 14.6667 20.0909M4.50763 17.1818C4.08602 17.1818 3.85054 16.5194 4.10557 16.1514C4.69736 15.2975 5.26855 14.0451 5.26855 12.537L5.29296 10.3517C5.29296 6.29145 8.29581 3 12 3C15.7588 3 18.8058 6.33993 18.8058 10.4599L18.7814 12.537C18.7814 14.0555 19.3329 15.3147 19.9006 16.169C20.1458 16.5379 19.9097 17.1818 19.4933 17.1818H4.50763Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="white"/>
  </svg>
);

const HamburgerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z" fill="white"/>
    <path d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z" fill="white"/>
    <path d="M5 11C4.4477 11 4 11.4477 4 12C4 12.5523 4.4477 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z" fill="white"/>
  </svg>
);

const Wishlist: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [folders, setFolders] = useState<FolderData[]>(initialFolders);
  const [sortedFolders, setSortedFolders] = useState<FolderData[]>(initialFolders);
  
  // 팝업 상태
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [editFolderName, setEditFolderName] = useState<string>('');

  // 길게 누르기 감지용
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // 정렬 처리
  useEffect(() => {
    let sorted = [...folders];
    if (sortOrder === 'latest') {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortOrder === 'title') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    } else {
      // popular: 아이템 개수 순
      sorted.sort((a, b) => b.itemCount - a.itemCount);
    }
    setSortedFolders(sorted);
  }, [sortOrder, folders]);

  // 정렬 토글
  const toggleSort = (): void => {
    setSortOrder(prev => {
      if (prev === 'latest') return 'title';
      if (prev === 'title') return 'popular';
      return 'latest';
    });
  };

  // 정렬 버튼 텍스트
  const getSortLabel = (): string => {
    if (sortOrder === 'latest') return '최신순';
    if (sortOrder === 'title') return '제목순';
    return '인기순';
  };

  // 새 폴더 만들기
  const handleCreateFolder = (): void => {
    if (newFolderName.trim()) {
      const newFolder: FolderData = {
        id: Date.now(),
        name: newFolderName.trim(),
        createdAt: new Date(),
        itemCount: 0,
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowCreatePopup(false);
    }
  };

  // 폴더 수정
  const handleEditFolder = (): void => {
    if (selectedFolder && editFolderName.trim()) {
      setFolders(prev => 
        prev.map(folder => 
          folder.id === selectedFolder.id 
            ? { ...folder, name: editFolderName.trim() }
            : folder
        )
      );
      setShowEditPopup(false);
      setSelectedFolder(null);
      setEditFolderName('');
    }
  };

  // 폴더 삭제
  const handleDeleteFolder = (): void => {
    if (selectedFolder) {
      setFolders(prev => prev.filter(folder => folder.id !== selectedFolder.id));
      setShowEditPopup(false);
      setSelectedFolder(null);
    }
  };

  // 폴더 클릭 (길게 누르기 시작)
  const handleFolderMouseDown = (folder: FolderData): void => {
    const timer = setTimeout(() => {
      setSelectedFolder(folder);
      setEditFolderName(folder.name);
      setShowEditPopup(true);
    }, 500); // 500ms 길게 누르기
    setPressTimer(timer);
  };

  // 마우스 떼기
  const handleFolderMouseUp = (): void => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // 폴더 클릭 (짧게) - 상세 페이지 이동
  const handleFolderClick = (folder: FolderData): void => {
    // 길게 누르기가 아닌 경우에만 동작
    // 실제로는 라우터 이동 처리
    console.log('폴더 클릭:', folder.name);
  };

  // 드롭다운 클릭 (수정 팝업 열기)
  const handleDropdownClick = (e: React.MouseEvent, folder: FolderData): void => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setEditFolderName(folder.name);
    setShowEditPopup(true);
  };

  // 팝업 외부 클릭 시 닫기
  const handlePopupOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      setShowCreatePopup(false);
      setShowEditPopup(false);
      setSelectedFolder(null);
    }
  };

  return (
    <div className="wishlist-page">
      {/* 사이드 네비게이션 (1440px 초과에서만 표시) */}
      <div className="wishlist-sidenav">
        <SideNav />
      </div>

      {/* 430px 이하 전용 헤더 */}
      <header className="wishlist-mobile-header">
        <h1 className="wishlist-mobile-title">위시리스트</h1>
        <div className="wishlist-mobile-icons">
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
      <main className="wishlist-content">
        {/* 헤더 영역 */}
        <div className="wishlist-header">
          <h1 className="wishlist-title">위시리스트</h1>
          <button className="sort-btn" onClick={toggleSort}>
            {getSortLabel()}
            <SortIcon />
          </button>
        </div>

        {/* 폴더 그리드 */}
        <div className="wishlist-grid">
          {/* 신규 폴더 만들기 */}
          <div 
            className="folder-card folder-card-new"
            onClick={() => setShowCreatePopup(true)}
          >
            <div className="folder-new-box">
              <PlusIcon />
            </div>
            <p className="folder-new-text">신규 폴더 만들기</p>
          </div>

          {/* 폴더 목록 */}
          {sortedFolders.map((folder) => (
            <div 
              className="folder-card"
              key={folder.id}
              onMouseDown={() => handleFolderMouseDown(folder)}
              onMouseUp={handleFolderMouseUp}
              onMouseLeave={handleFolderMouseUp}
              onTouchStart={() => handleFolderMouseDown(folder)}
              onTouchEnd={handleFolderMouseUp}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="folder-icon-wrapper">
                <FolderIcon />
              </div>
              <div className="folder-info">
                <span className="folder-name">{folder.name}</span>
                <button 
                  className="folder-dropdown"
                  onClick={(e) => handleDropdownClick(e, folder)}
                  aria-label="폴더 옵션"
                >
                  <ChevronDownIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer (1441px 이상에서 표시) */}
      <div className="wishlist-footer">
        <Footer />
      </div>

      {/* 하단 네비게이션 (1440px 이하에서 표시) */}
      <nav className="wishlist-bottom-nav">
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/바로가기.png" alt="" />
        </Link>
        <Link to="/shorts" className="bottom-nav-item">
          <img src="/images/icon/쇼츠.png" alt="" />
        </Link>
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/홈.png" alt="" />
        </Link>
        <Link to="/wishlist" className="bottom-nav-item">
          <img src="/images/icon/위시리스트.png" alt="" />
        </Link>
        <Link to="/" className="bottom-nav-item">
          <img src="/images/icon/보관함.png" alt="" />
        </Link>
      </nav>

      {/* 새 폴더 만들기 팝업 */}
      {showCreatePopup && (
        <div className="popup-overlay" onClick={handlePopupOverlayClick}>
          <div className="popup-container">
            <div className="popup-header">
              <h2 className="popup-title">새로운 폴더</h2>
              <button 
                className="popup-close"
                onClick={() => setShowCreatePopup(false)}
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="popup-content">
              <div className="popup-folder-preview">
                <FolderIcon />
              </div>
              <div className="popup-input-group">
                <label className="popup-label">폴더명</label>
                <input
                  type="text"
                  className="popup-input"
                  placeholder="제목 없음"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>
            <button 
              className="popup-save-btn"
              onClick={handleCreateFolder}
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 폴더 수정 팝업 */}
      {showEditPopup && selectedFolder && (
        <div className="popup-overlay" onClick={handlePopupOverlayClick}>
          <div className="popup-container popup-edit">
            <div className="popup-header">
              <h2 className="popup-title">폴더 수정</h2>
              <button 
                className="popup-close"
                onClick={() => {
                  setShowEditPopup(false);
                  setSelectedFolder(null);
                }}
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="popup-content">
              <div className="popup-input-group">
                <label className="popup-label">폴더명 변경</label>
                <input
                  type="text"
                  className="popup-input"
                  placeholder="폴더 현재 이름"
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditFolder()}
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <button 
                className="popup-delete-btn"
                onClick={handleDeleteFolder}
              >
                <TrashIcon />
                <span>휴지통</span>
              </button>
            </div>
            <button 
              className="popup-save-btn"
              onClick={handleEditFolder}
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;