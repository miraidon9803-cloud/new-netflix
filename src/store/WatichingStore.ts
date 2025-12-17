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

export interface WatchingItem {
  id: number;
  mediaType: MediaType; // ✅ 필수

  title?: string; // movie
  name?: string; // tv
  poster_path?: string | null;

  updateAt?: number;

  [key: string]: any;
}

interface WatchingState {
  watching: WatchingItem[];

  onAddWatching: (item: WatchingItem) => Promise<void>;
  onRemoveWatching: (
    profileId: string,
    mediaType: MediaType,
    id: number
  ) => Promise<void>;
  onResetWatching: () => void;

  onFetchWatching: (profileId?: string) => Promise<void>;
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

const makeDocId = (mediaType: MediaType, id: number) => `${mediaType}-${id}`;

export const useWatchingStore = create<WatchingState>((set, get) => ({
  watching: [],

  onAddWatching: async (item) => {
    // ✅ 최소 조건
    if (!item?.poster_path) return;
    if (item.mediaType !== "tv" && item.mediaType !== "movie") return;

    const uid = getUidOrThrow();
    const profileId = getActiveProfileIdOrThrow();

    // ✅ 중복 체크: id + mediaType
    const exists = get().watching.some(
      (w) => w.id === item.id && w.mediaType === item.mediaType
    );
    if (exists) return;

    const docId = makeDocId(item.mediaType, item.id);

    const ref = doc(db, "users", uid, "profiles", profileId, "watching", docId);

    const payload: WatchingItem = {
      ...item,
      updateAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });

    // ✅ 최신이 위로 오게
    set({ watching: [payload, ...get().watching] });
  },

  onRemoveWatching: async (profileId, mediaType, id) => {
    const uid = getUidOrThrow();
    const docId = makeDocId(mediaType, id);

    await deleteDoc(
      doc(db, "users", uid, "profiles", profileId, "watching", docId)
    );

    set({
      watching: get().watching.filter(
        (w) => !(w.id === id && w.mediaType === mediaType)
      ),
    });
  },

  onResetWatching: () => set({ watching: [] }),

  onFetchWatching: async (profileIdParam) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const profileId =
      profileIdParam ?? useProfileStore.getState().activeProfileId;

    if (!profileId) {
      set({ watching: [] });
      return;
    }

    const snap = await getDocs(
      collection(db, "users", user.uid, "profiles", profileId, "watching")
    );

    const data = snap.docs.map((d) => d.data() as WatchingItem);

    // ✅ 최신순 정렬
    data.sort((a, b) => (b.updateAt ?? 0) - (a.updateAt ?? 0));

    set({ watching: data });
  },
}));
