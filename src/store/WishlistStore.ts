import { create } from 'zustand';

// 콘텐츠 타입 (TMDB 기반)
export interface WishlistContent {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
}

// 폴더 데이터 타입
export interface WishlistFolder {
  id: number;
  name: string;
  contents: WishlistContent[];
}

interface WishlistState {
  folders: WishlistFolder[];
  isPopupOpen: boolean;
  currentContent: WishlistContent | null;
  
  // Actions
  loadFolders: () => void;
  saveFolders: (folders: WishlistFolder[]) => void;
  addContentToFolder: (folderId: number, content: WishlistContent) => void;
  removeContentFromFolder: (folderId: number, contentId: number) => void;
  moveContent: (fromFolderId: number, toFolderId: number, contentId: number) => void;
  openPopup: (content: WishlistContent) => void;
  closePopup: () => void;
}

const STORAGE_KEY = 'wishlist_folders';

// 초기 폴더 데이터
const getInitialFolders = (): WishlistFolder[] => [
  { id: 1, name: '이번 주말용', contents: [] },
  { id: 2, name: '정주행 미드', contents: [] },
  { id: 3, name: '심심할 때 보기', contents: [] },
  { id: 4, name: '코난 극장판', contents: [] },
  { id: 5, name: '그레이 아나토미', contents: [] },
];

export const useWishlistStore = create<WishlistState>((set, get) => ({
  folders: [],
  isPopupOpen: false,
  currentContent: null,

  // localStorage에서 폴더 불러오기
  loadFolders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ folders: parsed });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
    set({ folders: getInitialFolders() });
  },

  // localStorage에 폴더 저장
  saveFolders: (folders) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
      set({ folders });
    } catch (error) {
      console.error('Failed to save folders:', error);
    }
  },

  // 폴더에 콘텐츠 추가
  addContentToFolder: (folderId, content) => {
    const { folders, saveFolders } = get();
    const updated = folders.map(folder => {
      if (folder.id === folderId) {
        // 중복 체크
        const exists = folder.contents.some(c => c.id === content.id && c.media_type === content.media_type);
        if (exists) return folder;
        return { ...folder, contents: [...folder.contents, content] };
      }
      return folder;
    });
    saveFolders(updated);
  },

  // 폴더에서 콘텐츠 삭제
  removeContentFromFolder: (folderId, contentId) => {
    const { folders, saveFolders } = get();
    const updated = folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, contents: folder.contents.filter(c => c.id !== contentId) };
      }
      return folder;
    });
    saveFolders(updated);
  },

  // 콘텐츠 이동
  moveContent: (fromFolderId, toFolderId, contentId) => {
    const { folders, saveFolders } = get();
    let contentToMove: WishlistContent | null = null;

    const updated = folders.map(folder => {
      if (folder.id === fromFolderId) {
        contentToMove = folder.contents.find(c => c.id === contentId) || null;
        return { ...folder, contents: folder.contents.filter(c => c.id !== contentId) };
      }
      return folder;
    }).map(folder => {
      if (folder.id === toFolderId && contentToMove) {
        return { ...folder, contents: [...folder.contents, contentToMove] };
      }
      return folder;
    });

    saveFolders(updated);
  },

  // 팝업 열기
  openPopup: (content) => {
    set({ isPopupOpen: true, currentContent: content });
  },

  // 팝업 닫기
  closePopup: () => {
    set({ isPopupOpen: false, currentContent: null });
  },
}));
