import { create } from "zustand";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthStore } from "./authStore";

// 콘텐츠 타입 (TMDB 기반)
export interface WishlistContent {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

// 폴더 데이터 타입
export interface WishlistFolder {
  id: string;
  name: string;
  contents: WishlistContent[];
  createdAt?: any;
}

interface WishlistState {
  folders: WishlistFolder[];
  isLoading: boolean;
  isPopupOpen: boolean;
  currentContent: WishlistContent | null;

  loadFolders: () => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  addContentToFolder: (
    folderId: string,
    content: WishlistContent
  ) => Promise<void>;
  removeContentFromFolder: (
    folderId: string,
    contentId: number
  ) => Promise<void>;
  moveContent: (
    fromFolderId: string,
    toFolderId: string,
    content: WishlistContent
  ) => Promise<void>;
  openPopup: (content: WishlistContent) => void;
  closePopup: () => void;
}

const getUserId = (): string | null => {
  const user = useAuthStore.getState().user;
  return user?.uid || null;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  folders: [],
  isLoading: false,
  isPopupOpen: false,
  currentContent: null,

  loadFolders: async () => {
    const userId = getUserId();
    if (!userId) {
      set({ folders: [], isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const foldersRef = collection(db, "users", userId, "wishlist_folders");
      const snapshot = await getDocs(foldersRef);

      const folders: WishlistFolder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WishlistFolder[];

      folders.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      set({ folders, isLoading: false });
    } catch (error) {
      console.error("폴더 로드 실패:", error);
      set({ folders: [], isLoading: false });
    }
  },

  createFolder: async (name: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const folderId = `folder_${Date.now()}`;
      const folderRef = doc(db, "users", userId, "wishlist_folders", folderId);

      const newFolder = {
        name,
        contents: [],
        createdAt: serverTimestamp(),
      };

      await setDoc(folderRef, newFolder);

      set((state) => ({
        folders: [{ id: folderId, ...newFolder }, ...state.folders],
      }));
    } catch (error) {
      console.error("폴더 생성 실패:", error);
    }
  },

  deleteFolder: async (folderId: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const folderRef = doc(db, "users", userId, "wishlist_folders", folderId);
      await deleteDoc(folderRef);

      set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
      }));
    } catch (error) {
      console.error("폴더 삭제 실패:", error);
    }
  },

  renameFolder: async (folderId: string, newName: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const folderRef = doc(db, "users", userId, "wishlist_folders", folderId);
      await updateDoc(folderRef, { name: newName });

      set((state) => ({
        folders: state.folders.map((f) =>
          f.id === folderId ? { ...f, name: newName } : f
        ),
      }));
    } catch (error) {
      console.error("폴더 이름 변경 실패:", error);
    }
  },

  addContentToFolder: async (folderId: string, content: WishlistContent) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const folderRef = doc(db, "users", userId, "wishlist_folders", folderId);

      const folder = get().folders.find((f) => f.id === folderId);
      const exists = folder?.contents.some(
        (c) => c.id === content.id && c.media_type === content.media_type
      );

      if (exists) return;

      await updateDoc(folderRef, {
        contents: arrayUnion(content),
      });

      set((state) => ({
        folders: state.folders.map((f) =>
          f.id === folderId ? { ...f, contents: [...f.contents, content] } : f
        ),
      }));
    } catch (error) {
      console.error("콘텐츠 추가 실패:", error);
    }
  },

  removeContentFromFolder: async (folderId: string, contentId: number) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const folder = get().folders.find((f) => f.id === folderId);
      const contentToRemove = folder?.contents.find((c) => c.id === contentId);

      if (!contentToRemove) return;

      const folderRef = doc(db, "users", userId, "wishlist_folders", folderId);
      await updateDoc(folderRef, {
        contents: arrayRemove(contentToRemove),
      });

      set((state) => ({
        folders: state.folders.map((f) =>
          f.id === folderId
            ? { ...f, contents: f.contents.filter((c) => c.id !== contentId) }
            : f
        ),
      }));
    } catch (error) {
      console.error("콘텐츠 삭제 실패:", error);
    }
  },

  moveContent: async (
    fromFolderId: string,
    toFolderId: string,
    content: WishlistContent
  ) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const fromRef = doc(
        db,
        "users",
        userId,
        "wishlist_folders",
        fromFolderId
      );
      const toRef = doc(db, "users", userId, "wishlist_folders", toFolderId);

      await updateDoc(fromRef, { contents: arrayRemove(content) });
      await updateDoc(toRef, { contents: arrayUnion(content) });

      set((state) => ({
        folders: state.folders.map((f) => {
          if (f.id === fromFolderId) {
            return {
              ...f,
              contents: f.contents.filter((c) => c.id !== content.id),
            };
          }
          if (f.id === toFolderId) {
            return { ...f, contents: [...f.contents, content] };
          }
          return f;
        }),
      }));
    } catch (error) {
      console.error("콘텐츠 이동 실패:", error);
    }
  },

  openPopup: (content) => {
    set({ isPopupOpen: true, currentContent: content });
  },

  closePopup: () => {
    set({ isPopupOpen: false, currentContent: null });
  },
}));
