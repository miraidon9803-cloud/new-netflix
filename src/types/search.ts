// src/types/search.ts

export interface Content {
  title: string;
  url: string;
  type: 'poster' | 'backdrop';
  logo: string | null;
}

export interface SearchModalProps {
  onClose: () => void;
}

// ==========================================
// Wishlist 관련 타입
// ==========================================

// 폴더 데이터 타입
export interface FolderData {
  id: number;
  name: string;
  createdAt: Date;
  itemCount: number;
}

// 폴더 내 콘텐츠 (위시리스트 아이템)
export interface WishlistItem {
  id: number;
  folderId: number;
  content: Content;
  addedAt: Date;
}

// 정렬 옵션 타입
export type SortOrder = 'latest' | 'title' | 'popular';

// 팝업 타입
export type PopupType = 'create' | 'edit' | null;

// Wishlist 컴포넌트 Props (필요시 사용)
export interface WishlistProps {
  initialFolders?: FolderData[];
}

// 폴더 생성 팝업 Props
export interface CreateFolderPopupProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

// 폴더 수정 팝업 Props
export interface EditFolderPopupProps {
  folder: FolderData;
  onClose: () => void;
  onEdit: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}
// 상세페이지에서 위시리스트에 추가할 콘텐츠 타입
export interface WishlistContent {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
}

// WishlistDetail의 폴더 데이터 (현재와 동일)
export interface WishlistFolderData {
  id: number;
  name: string;
  contents: WishlistContent[];
}