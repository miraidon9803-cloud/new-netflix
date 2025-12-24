import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import { useWishlistStore } from "../store/WishlistStore";
import type { WishlistContent } from "../store/WishlistStore";
import type { SortOrder } from "../types/search";
import "./scss/WishlistDetail.scss";
import MobileNav from "./MobileNav";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "/images/icon/no_poster.png";

// SVG 아이콘 컴포넌트들
const BackArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortIcon: React.FC = () => (
  <div className="sort-icon-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="14"
      viewBox="0 0 6 14"
      fill="none"
    >
      <path
        d="M5 13L5 1L1 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="14"
      viewBox="0 0 6 14"
      fill="none"
    >
      <path
        d="M0.999999 1L1 13L5 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ChevronDownIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.2071 9.04289C16.8166 8.65237 16.1834 8.65237 15.7929 9.0429L12 12.8358L8.2071 9.04289C7.81658 8.65237 7.18341 8.65237 6.79289 9.0429C6.40237 9.43342 6.40237 10.0666 6.7929 10.4571L11.2929 14.9571C11.4805 15.1446 11.7348 15.25 12 15.25C12.2653 15.25 12.5196 15.1446 12.7071 14.9571L17.2071 10.4571C17.5976 10.0666 17.5976 9.43341 17.2071 9.04289Z"
      fill="white"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
      fill="white"
    />
  </svg>
);

const MoveIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M15 19L12 22L9 19"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 9L22 12L19 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 9L2 12L5 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12H22"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5L12 2L15 5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V22"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FolderIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WishlistDetail: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const {
    folders,
    isLoading,
    loadFolders,
    removeContentFromFolder,
    moveContent,
  } = useWishlistStore();

  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [sortedContents, setSortedContents] = useState<WishlistContent[]>([]);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showMovePopup, setShowMovePopup] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] =
    useState<WishlistContent | null>(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState<number>(0);
  const [pressTimer, setPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const folderListRef = useRef<HTMLDivElement>(null);

  const currentFolder = folders.find((f) => f.id === folderId);
  const folderName = currentFolder?.name || "폴더";
  const contents = currentFolder?.contents || [];

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    let sorted = [...contents];
    if (sortOrder === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    } else if (sortOrder === "popular") {
      sorted = [...contents].reverse();
    }
    setSortedContents(sorted);
  }, [sortOrder, contents]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showMovePopup) setShowMovePopup(false);
        else if (showEditPopup) {
          setShowEditPopup(false);
          setSelectedContent(null);
        } else navigate("/wishlist");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, showEditPopup, showMovePopup]);

  useEffect(() => {
    if (!showMovePopup) return;
    const otherFolders = folders.filter((f) => f.id !== folderId);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedFolderIndex((prev) =>
          prev < otherFolders.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedFolderIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleMoveConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMovePopup, selectedFolderIndex, folders, folderId]);

  const toggleSort = () =>
    setSortOrder((p) =>
      p === "latest" ? "title" : p === "title" ? "popular" : "latest"
    );
  const getSortLabel = () =>
    sortOrder === "latest"
      ? "최신순"
      : sortOrder === "title"
      ? "제목순"
      : "인기순";
  const handleBack = () => navigate("/wishlist");

  const handleContentMouseDown = (content: WishlistContent) => {
    const timer = setTimeout(() => {
      setSelectedContent(content);
      setShowEditPopup(true);
    }, 500);
    setPressTimer(timer);
  };
  const handleContentMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleDropdownClick = (
    e: React.MouseEvent,
    content: WishlistContent
  ) => {
    e.stopPropagation();
    setSelectedContent(content);
    setShowEditPopup(true);
  };

  const handleMoveClick = () => {
    setSelectedFolderIndex(0);
    setShowMovePopup(true);
  };

  const handleDelete = async () => {
    if (!selectedContent || !folderId) return;
    await removeContentFromFolder(folderId, selectedContent.id);
    setShowEditPopup(false);
    setSelectedContent(null);
  };

  const handleMoveConfirm = async () => {
    if (!selectedContent || !folderId) return;
    const otherFolders = folders.filter((f) => f.id !== folderId);
    const targetFolder = otherFolders[selectedFolderIndex];
    if (!targetFolder) return;

    const isDuplicate = targetFolder.contents.some(
      (c) => c.id === selectedContent.id
    );
    if (isDuplicate) {
      alert("이미 해당 폴더에 있는 콘텐츠입니다.");
      return;
    }

    await moveContent(folderId, targetFolder.id, selectedContent);
    setShowMovePopup(false);
    setShowEditPopup(false);
    setSelectedContent(null);
  };

  const handleSave = () => {
    setShowEditPopup(false);
    setSelectedContent(null);
  };
  const handlePopupOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (showMovePopup) setShowMovePopup(false);
      else {
        setShowEditPopup(false);
        setSelectedContent(null);
      }
    }
  };

  // 이미지 URL 생성 함수
  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return FALLBACK_IMAGE;

    // 이미 전체 URL인 경우 (MainBanner 등에서 로컬 이미지 경로)
    if (posterPath.startsWith("http") || posterPath.startsWith("/images")) {
      return posterPath;
    }

    // TMDB 경로인 경우
    return `${IMAGE_BASE_URL}${posterPath}`;
  };

  const otherFolders = folders.filter((f) => f.id !== folderId);

  if (isLoading)
    return (
      <div className="wishlist-detail-page">
        <div className="wishlist-detail-sidenav">
          <SideNav />
        </div>
        <main className="wishlist-detail-content">
          <p
            style={{ color: "#fff", textAlign: "center", paddingTop: "100px" }}
          >
            로딩 중...
          </p>
        </main>
      </div>
    );

  return (
    <div className="wishlist-detail-page">
      <div className="wishlist-detail-sidenav">
        <SideNav />
      </div>

      <main className="wishlist-detail-content">
        <div className="wishlist-detail-header">
          <div className="header-left">
            <button className="wishlist-detail-back-btn" onClick={handleBack}>
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
              key={`${content.id}-${index}`}
              onMouseDown={() => handleContentMouseDown(content)}
              onMouseUp={handleContentMouseUp}
              onMouseLeave={handleContentMouseUp}
              onTouchStart={() => handleContentMouseDown(content)}
              onTouchEnd={handleContentMouseUp}
            >
              <div className="wishlist-detail-image-wrapper">
                <img
                  src={getImageUrl(content.poster_path)}
                  alt={content.title}
                  className="content-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="wishlist-detail-info">
                <p className="wishlist-detail-card-title">
                  {content.title}
                  <button
                    className="content-dropdown"
                    onClick={(e) => handleDropdownClick(e, content)}
                  >
                    <ChevronDownIcon />
                  </button>
                </p>
              </div>
            </div>
          ))}
        </div>

        {sortedContents.length === 0 && (
          <div className="empty-folder">
            <p>폴더가 비어있습니다.</p>
          </div>
        )}
      </main>

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
                  className={`popup-folder-item ${
                    selectedFolderIndex === index ? "selected" : ""
                  }`}
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

      <MobileNav />
    </div>
  );
};

export default WishlistDetail;
