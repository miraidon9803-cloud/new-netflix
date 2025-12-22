import { create } from "zustand";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthStore } from "./authStore";
import { useProfileStore } from "./Profile";

export type MediaType = "tv" | "movie";

export interface LikeItem {
  id: number;
  mediaType: MediaType;
  title?: string; // movie
  name?: string; // tv
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string; // movie
  first_air_date?: string; // tv
  vote_average?: number;
  likedAt?: number;
}

interface LikeState {
  likes: LikeItem[];
  onAddLike: (item: LikeItem) => Promise<void>;
  onRemoveLike: (
    profileId: string,
    contentId: number,
    mediaType: MediaType
  ) => Promise<void>;
  onFetchLikes: (profileId?: string) => Promise<void>;
  onResetLikes: () => void;
  isLiked: (contentId: number, mediaType: MediaType) => boolean;
}

const getUidOrThrow = () => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("로그인이 필요합니다.");
  return user.uid;
};

const getActiveProfileIdOrThrow = () => {
  const pid = useProfileStore.getState().activeProfileId;
  if (!pid) throw new Error("프로필을 선택해주세요.");
  return pid;
};

const makeDocId = (mediaType: MediaType, id: number) => {
  return `${mediaType}-${id}`;
};

export const useLikeStore = create<LikeState>((set, get) => ({
  likes: [],

  onAddLike: async (item) => {
    if (!item || (item.mediaType !== "tv" && item.mediaType !== "movie"))
      return;

    const hasThumb = !!(item.backdrop_path || item.poster_path);
    if (!hasThumb) return;

    const uid = getUidOrThrow();
    const profileId = getActiveProfileIdOrThrow();

    // 중복 체크
    const exists = get().likes.some(
      (l) => l.id === item.id && l.mediaType === item.mediaType
    );
    if (exists) return;

    const docId = makeDocId(item.mediaType, item.id);
    const ref = doc(db, "users", uid, "profiles", profileId, "likes", docId);

    const payload: LikeItem = {
      ...item,
      likedAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });
    set({ likes: [payload, ...get().likes] });
  },

  onRemoveLike: async (profileId, contentId, mediaType) => {
    const uid = getUidOrThrow();
    const docId = makeDocId(mediaType, contentId);

    await deleteDoc(
      doc(db, "users", uid, "profiles", profileId, "likes", docId)
    );

    set({
      likes: get().likes.filter(
        (l) => !(l.id === contentId && l.mediaType === mediaType)
      ),
    });
  },

  onFetchLikes: async (profileIdParam) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const profileId =
      profileIdParam ?? useProfileStore.getState().activeProfileId;
    if (!profileId) {
      set({ likes: [] });
      return;
    }

    const snap = await getDocs(
      collection(db, "users", user.uid, "profiles", profileId, "likes")
    );

    const data = snap.docs.map((d) => d.data() as LikeItem);
    data.sort((a, b) => (b.likedAt ?? 0) - (a.likedAt ?? 0));

    set({ likes: data });
  },

  onResetLikes: () => set({ likes: [] }),

  isLiked: (contentId, mediaType) => {
    return get().likes.some(
      (l) => l.id === contentId && l.mediaType === mediaType
    );
  },
}));
