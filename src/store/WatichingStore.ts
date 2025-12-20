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
  id: number; // tvId or movieId
  mediaType: MediaType;
  vote_average: string;

  // display title
  title?: string; // movie
  name?: string; // tv

  // thumbnails (any one is enough)
  poster_path?: string | null;
  backdrop_path?: string | null;

  // ✅ TV 이어보기 핵심
  season_number?: number;
  episode_number?: number;
  episode_name?: string;
  still_path?: string | null; // episode thumbnail

  // optional progress
  progress?: number; // 0~1
  currentTime?: number; // seconds

  updateAt?: number;
}

interface WatchingState {
  watching: WatchingItem[];

  onAddWatching: (item: WatchingItem) => Promise<void>;

  // 삭제는 item 그대로 받는 방식이 TV(시즌/화)에서 안전
  onRemoveWatching: (profileId: string, item: WatchingItem) => Promise<void>;

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

//  TV는 시즌/화까지 포함해서 문서 ID를 만들어야 "보던 영상" 단위로 저장됨
const makeDocId = (item: WatchingItem) => {
  if (item.mediaType === "tv") {
    const s = item.season_number ?? 0;
    const e = item.episode_number ?? 0;
    return `tv-${item.id}-s${s}-e${e}`;
  }
  return `movie-${item.id}`;
};

export const useWatchingStore = create<WatchingState>((set, get) => ({
  watching: [],

  onAddWatching: async (item) => {
    if (!item) return;
    if (item.mediaType !== "tv" && item.mediaType !== "movie") return;

    // ✅ TV는 시즌/화가 있어야 "보던 영상" 의미가 있음
    if (item.mediaType === "tv") {
      if (!item.season_number || !item.episode_number) return;
    }

    // ✅ 썸네일은 still/backdrop/poster 중 하나만 있어도 OK
    const hasThumb = !!(
      item.still_path ||
      item.backdrop_path ||
      item.poster_path
    );
    if (!hasThumb) return;

    const uid = getUidOrThrow();
    const profileId = getActiveProfileIdOrThrow();

    // ✅ 중복 체크:
    // movie: (mediaType + id)
    // tv: (mediaType + id + season + episode)
    const exists = get().watching.some((w) => {
      if (item.mediaType === "movie") {
        return w.mediaType === "movie" && w.id === item.id;
      }
      return (
        w.mediaType === "tv" &&
        w.id === item.id &&
        w.season_number === item.season_number &&
        w.episode_number === item.episode_number
      );
    });

    // 같은 영상 다시 클릭하면 저장 시간만 갱신하고 싶으면:
    // if (exists) { ...updateAt만 setDoc merge...; return; }
    if (exists) return;

    const docId = makeDocId(item);
    const ref = doc(db, "users", uid, "profiles", profileId, "watching", docId);

    const payload: WatchingItem = {
      ...item,
      updateAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });

    // ✅ 최신이 위로 오게
    set({ watching: [payload, ...get().watching] });
  },

  onRemoveWatching: async (profileId, item) => {
    const uid = getUidOrThrow();
    const docId = makeDocId(item);

    await deleteDoc(
      doc(db, "users", uid, "profiles", profileId, "watching", docId)
    );

    set({
      watching: get().watching.filter((w) => makeDocId(w) !== docId),
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
