import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
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

// 초기 폴더 데이터 생성
const createInitialFolders = (): FolderData[] => {
  const posterContents = netflixData.filter((item: Content) => item.type === 'poster');
  
  return [
    { id: 1, name: '이번 주말용', contents: posterContents.slice(0, 12) },
    { id: 2, name: '정주행 미드', contents: posterContents.slice(12, 24) },
    { id: 3, name: '코난 극장판', contents: posterContents.slice(24, 36) },
    { id: 4, name: '심심할 때 보기', contents: posterContents.slice(36, 48) },
    { id: 5, name: '그레이 아나토미', contents: posterContents.slice(48, 60) },
  ];
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
    <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const WishlistDetail: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [folders, setFolders] = useState<FolderData[]>(createInitialFolders);
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
          <button className="sort-btn" onClick={toggleSort}>
            {getSortLabel()}
            <SortIcon />
          </button>
        </div>

        <div className="wishlist-detail-grid">
          {sortedContents.map((content, index) => (
            <div 
              className="wishlist-detail-card" 
              key={index}
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