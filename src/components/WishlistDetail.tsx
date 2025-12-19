import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import Footer from './Footer';
import type { Content, SortOrder } from '../types/search';
import './scss/WishlistDetail.scss';

// 데이터 import
import netflixDataRaw from '../data/netflix_data.json';
const netflixData = netflixDataRaw as Content[];

// 폴더 데이터 타입
interface FolderData {
  id: number;
  name: string;
  contents: Content[];
}

// localStorage 키
const FOLDERS_STORAGE_KEY = 'wishlist_folders';

// 초기 폴더 데이터 생성 (중복 없이, 폴더별 다른 개수)
const createInitialFolders = (): FolderData[] => {
  const posterContents = netflixData.filter((item: Content) => item.type === 'poster');
  
  // 중복 제거를 위해 title 기준으로 unique한 콘텐츠만 추출
  const uniqueContents: Content[] = [];
  const seenTitles = new Set<string>();
  
  for (const content of posterContents) {
    if (!seenTitles.has(content.title)) {
      seenTitles.add(content.title);
      uniqueContents.push(content);
    }
  }
  
  // 폴더별로 다른 개수의 콘텐츠 배치 (이동 테스트 용이하도록)
  return [
    { id: 1, name: '이번 주말용', contents: uniqueContents.slice(0, 8) },      // 8개
    { id: 2, name: '정주행 미드', contents: uniqueContents.slice(8, 20) },     // 12개
    { id: 3, name: '심심할 때 보기', contents: uniqueContents.slice(20, 35) }, // 15개
    { id: 4, name: '코난 극장판', contents: uniqueContents.slice(35, 41) },    // 6개
    { id: 5, name: '그레이 아나토미', contents: uniqueContents.slice(41, 51) }, // 10개
  ];
};

// localStorage에서 폴더 데이터 불러오기
const loadFoldersFromStorage = (): FolderData[] => {
  try {
    const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 데이터 유효성 검사
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load folders from localStorage:', error);
  }
  return createInitialFolders();
};

// localStorage에 폴더 데이터 저장
const saveFoldersToStorage = (folders: FolderData[]): void => {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error('Failed to save folders to localStorage:', error);
  }
};

// SVG 아이콘 컴포넌트들
const BackArrowIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const ChevronDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M17.2071 9.04289C16.8166 8.65237 16.1834 8.65237 15.7929 9.0429L12 12.8358L8.2071 9.04289C7.81658 8.65237 7.18341 8.65237 6.79289 9.0429C6.40237 9.43342 6.40237 10.0666 6.7929 10.4571L11.2929 14.9571C11.4805 15.1446 11.7348 15.25 12 15.25C12.2653 15.25 12.5196 15.1446 12.7071 14.9571L17.2071 10.4571C17.5976 10.0666 17.5976 9.43341 17.2071 9.04289Z" fill="white"/>
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="white"/>
  </svg>
);

const MoveIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19L12 22L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 9L22 12L19 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 9L2 12L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5L12 2L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const FolderIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M1 4V10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6193 20.3413 15.9089 20.7742 14.0064C21.2072 12.1038 21.0101 10.1135 20.2126 8.33111C19.4152 6.54871 18.0605 5.07374 16.3528 4.12803C14.6451 3.18233 12.6769 2.81925 10.7447 3.09712C8.81245 3.37499 7.02091 4.27756 5.64 5.66L1 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WishlistDetail: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [folders, setFolders] = useState<FolderData[]>(loadFoldersFromStorage);
  const [sortedContents, setSortedContents] = useState<Content[]>([]);
  
  // 팝업 상태
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showMovePopup, setShowMovePopup] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState<number>(0);
  
  // 길게 누르기 감지용
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // 키보드 네비게이션용 ref
  const folderListRef = useRef<HTMLDivElement>(null);

  // 현재 폴더 가져오기
  const currentFolderId = folderId ? parseInt(folderId) : 1;
  const currentFolder = folders.find(f => f.id === currentFolderId);
  const folderName = currentFolder?.name || '폴더';
  const contents = currentFolder?.contents || [];

  // folders 변경 시 localStorage에 저장
  useEffect(() => {
    saveFoldersToStorage(folders);
  }, [folders]);

  // 콘텐츠 정렬
  useEffect(() => {
    let sorted = [...contents];
    if (sortOrder === 'latest') {
      sorted = [...contents];
    } else if (sortOrder === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    } else {
      sorted = [...contents].reverse();
    }
    setSortedContents(sorted);
  }, [sortOrder, contents]);

  // ESC 키로 뒤로가기 / 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showMovePopup) {
          setShowMovePopup(false);
        } else if (showEditPopup) {
          setShowEditPopup(false);
          setSelectedContent(null);
        } else {
          navigate('/wishlist');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showEditPopup, showMovePopup]);

  // 이동 팝업 키보드 네비게이션
  useEffect(() => {
    if (!showMovePopup) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const otherFolders = folders.filter(f => f.id !== currentFolderId);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedFolderIndex(prev => 
          prev < otherFolders.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedFolderIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleMoveConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMovePopup, selectedFolderIndex, folders, currentFolderId]);

  // 정렬 토글
  const toggleSort = (): void => {
    setSortOrder(prev => {
      if (prev === 'latest') return 'title';
      if (prev === 'title') return 'popular';
      return 'latest';
    });
  };

  const getSortLabel = (): string => {
    if (sortOrder === 'latest') return '최신순';
    if (sortOrder === 'title') return '제목순';
    return '인기순';
  };

  const handleBack = (): void => {
    navigate('/wishlist');
  };

  // 데이터 초기화 (테스트용)
  const handleReset = (): void => {
    if (window.confirm('모든 폴더 데이터를 초기 상태로 되돌리시겠습니까?')) {
      const initialFolders = createInitialFolders();
      setFolders(initialFolders);
      saveFoldersToStorage(initialFolders);
    }
  };

  // 콘텐츠 길게 누르기 시작
  const handleContentMouseDown = (content: Content): void => {
    const timer = setTimeout(() => {
      setSelectedContent(content);
      setShowEditPopup(true);
    }, 500);
    setPressTimer(timer);
  };

  // 마우스 떼기
  const handleContentMouseUp = (): void => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // 드롭다운 클릭 (콘텐츠 수정 팝업)
  const handleDropdownClick = (e: React.MouseEvent, content: Content): void => {
    e.stopPropagation();
    setSelectedContent(content);
    setShowEditPopup(true);
  };

  // 이동 버튼 클릭
  const handleMoveClick = (): void => {
    setSelectedFolderIndex(0);
    setShowMovePopup(true);
  };

  // 휴지통 (삭제)
  const handleDelete = (): void => {
    if (!selectedContent) return;
    
    setFolders(prev => prev.map(folder => {
      if (folder.id === currentFolderId) {
        return {
          ...folder,
          contents: folder.contents.filter(c => c.title !== selectedContent.title)
        };
      }
      return folder;
    }));
    
    setShowEditPopup(false);
    setSelectedContent(null);
  };

  // 이동 확인
  const handleMoveConfirm = (): void => {
    if (!selectedContent) return;
    
    const otherFolders = folders.filter(f => f.id !== currentFolderId);
    const targetFolder = otherFolders[selectedFolderIndex];
    
    if (!targetFolder) return;
    
    // 중복 체크
    const isDuplicate = targetFolder.contents.some(c => c.title === selectedContent.title);
    if (isDuplicate) {
      alert('이미 해당 폴더에 있는 콘텐츠입니다.');
      return;
    }
    
    setFolders(prev => prev.map(folder => {
      // 현재 폴더에서 삭제
      if (folder.id === currentFolderId) {
        return {
          ...folder,
          contents: folder.contents.filter(c => c.title !== selectedContent.title)
        };
      }
      // 대상 폴더에 추가
      if (folder.id === targetFolder.id) {
        return {
          ...folder,
          contents: [...folder.contents, selectedContent]
        };
      }
      return folder;
    }));
    
    setShowMovePopup(false);
    setShowEditPopup(false);
    setSelectedContent(null);
  };

  // 저장 버튼 (팝업 닫기)
  const handleSave = (): void => {
    setShowEditPopup(false);
    setSelectedContent(null);
  };

  // 팝업 외부 클릭 시 닫기
  const handlePopupOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      if (showMovePopup) {
        setShowMovePopup(false);
      } else {
        setShowEditPopup(false);
        setSelectedContent(null);
      }
    }
  };

  // 현재 폴더 제외한 폴더 목록
  const otherFolders = folders.filter(f => f.id !== currentFolderId);

  return (
    <div className="wishlist-detail-page">
      <div className="wishlist-detail-sidenav">
        <SideNav />
      </div>

      <main className="wishlist-detail-content">
        <div className="wishlist-detail-header">
          <div className="header-left">
            <button className="wishlist-detail-back-btn" onClick={handleBack} aria-label="뒤로가기">
              <BackArrowIcon />
            </button>
            <h1 className="wishlist-detail-title">{folderName}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              className="sort-btn" 
              onClick={handleReset}
              title="데이터 초기화"
              style={{ opacity: 0.7 }}
            >
              <ResetIcon />
            </button>
            <button className="sort-btn" onClick={toggleSort}>
              {getSortLabel()}
              <SortIcon />
            </button>
          </div>
        </div>

        <div className="wishlist-detail-grid">
          {sortedContents.map((content, index) => (
            <div 
              className="wishlist-detail-card" 
              key={`${content.title}-${index}`}
              onMouseDown={() => handleContentMouseDown(content)}
              onMouseUp={handleContentMouseUp}
              onMouseLeave={handleContentMouseUp}
              onTouchStart={() => handleContentMouseDown(content)}
              onTouchEnd={handleContentMouseUp}
            >
              <div className="wishlist-detail-image-wrapper">
                <img src={content.url} alt={content.title} className="content-image" />
              </div>
              <div className="wishlist-detail-info">
                <p className="wishlist-detail-card-title">
                  {content.title}
                  <button 
                    className="content-dropdown" 
                    aria-label="옵션"
                    onClick={(e) => handleDropdownClick(e, content)}
                  >
                    <ChevronDownIcon />
                  </button>
                </p>
              </div>
            </div>
          ))}
          {/* 플레이스홀더: 마지막 행을 3의 배수로 맞추기 */}
          {sortedContents.length % 3 !== 0 && 
            Array.from({ length: 3 - (sortedContents.length % 3) }).map((_, index) => (
              <div className="wishlist-detail-card placeholder" key={`placeholder-${index}`} />
            ))
          }
        </div>

        {/* 콘텐츠가 없을 때 */}
        {sortedContents.length === 0 && (
          <div className="empty-folder">
            <p>폴더가 비어있습니다.</p>
          </div>
        )}
      </main>

      {/* 콘텐츠 수정 팝업 */}
      {showEditPopup && !showMovePopup && (
        <div className="popup-overlay" onClick={handlePopupOverlayClick}>
          <div className="popup-container popup-content-edit">
            <div className="popup-header">
              <h2 className="popup-title">콘텐츠 수정</h2>
              <button 
                className="popup-close" 
                onClick={() => {
                  setShowEditPopup(false);
                  setSelectedContent(null);
                }}
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="popup-content">
              <button className="popup-action-btn" onClick={handleMoveClick}>
                <MoveIcon />
                <span>이동</span>
              </button>
              
              <button className="popup-action-btn" onClick={handleDelete}>
                <TrashIcon />
                <span>휴지통</span>
              </button>
            </div>
            
            <button className="popup-save-btn" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      )}

      {/* 이동 팝업 */}
      {showMovePopup && (
        <div className="popup-overlay" onClick={handlePopupOverlayClick}>
          <div className="popup-container popup-move">
            <div className="popup-header">
              <h2 className="popup-title">이동</h2>
              <button 
                className="popup-close" 
                onClick={() => setShowMovePopup(false)}
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="popup-folder-list" ref={folderListRef}>
              {otherFolders.map((folder, index) => (
                <button
                  key={folder.id}
                  className={`popup-folder-item ${selectedFolderIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedFolderIndex(index)}
                >
                  <FolderIcon />
                  <span className="folder-name">{folder.name}</span>
                  {selectedFolderIndex === index && <CheckIcon />}
                </button>
              ))}
            </div>
            
            <button className="popup-save-btn" onClick={handleMoveConfirm}>
              저장
            </button>
          </div>
        </div>
      )}

      {/* Footer (1441px 이상에서 표시) */}
      <div className="wishlist-detail-footer">
        <Footer />
      </div>

      <nav className="wishlist-detail-bottom-nav">
        <a href="/" className="bottom-nav-item">
          <img src="/images/icon/바로가기.png" alt="" />
        </a>
        <a href="/shorts" className="bottom-nav-item">
          <img src="/images/icon/쇼츠.png" alt="" />
        </a>
        <a href="/" className="bottom-nav-item">
          <img src="/images/icon/홈.png" alt="" />
        </a>
        <a href="/wishlist" className="bottom-nav-item active">
          <img src="/images/icon/위시리스트.png" alt="" />
        </a>
        <a href="/" className="bottom-nav-item">
          <img src="/images/icon/보관함.png" alt="" />
        </a>
      </nav>
    </div>
  );
};

export default WishlistDetail;