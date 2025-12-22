import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../store/WishlistStore";
import type { WishlistContent } from "../store/WishlistStore";
import "./scss/WishlistPopup.scss";

interface WishlistPopupProps {
  content: WishlistContent;
  onClose: () => void;
}

const WishlistPopup: React.FC<WishlistPopupProps> = ({ content, onClose }) => {
  const navigate = useNavigate();
  const { folders, isLoading, loadFolders, addContentToFolder } =
    useWishlistStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // 폴더 로드
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  //  대신 이렇게 계산된 값을 사용
  const effectiveSelectedFolderId =
    selectedFolderId ?? (folders.length > 0 ? folders[0].id : null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 저장
  const handleSave = async () => {
    if (effectiveSelectedFolderId) {
      await addContentToFolder(effectiveSelectedFolderId, content);
      onClose();
    }
  };

  // 위시리스트로 이동
  const handleGoToWishlist = () => {
    onClose();
    navigate("/wishlist");
  };

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="wishlist-popup-overlay" onClick={handleOverlayClick}>
        <div className="wishlist-popup-container">
          <p style={{ color: "#fff", textAlign: "center", padding: "40px 0" }}>
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-popup-overlay" onClick={handleOverlayClick}>
      <div className="wishlist-popup-container">
        <div className="wishlist-popup-header">
          <h2 className="wishlist-popup-title">보관</h2>
          <button className="wishlist-popup-close" onClick={onClose}>
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
          </button>
        </div>

        {/* 폴더가 없을 때 */}
        {folders.length === 0 ? (
          <>
            <p className="wishlist-popup-empty-text">폴더를 생성해야 합니다.</p>
            <button
              className="wishlist-popup-save-btn"
              onClick={handleGoToWishlist}
            >
              위시리스트 이동
            </button>
          </>
        ) : (
          <>
            {/* 폴더 목록 */}
            <div className="wishlist-popup-folder-list">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className={`wishlist-popup-folder-item ${
                    effectiveSelectedFolderId === folder.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
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
                  <span className="folder-name">{folder.name}</span>
                  {effectiveSelectedFolderId === folder.id && (
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
                  )}
                </button>
              ))}
            </div>

            <button className="wishlist-popup-save-btn" onClick={handleSave}>
              저장
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPopup;
